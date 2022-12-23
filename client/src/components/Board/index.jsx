import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { socket } from '../../socket'

const Board = ({ lobbyId }) =>{
    const [game, setGame] = useState(new Chess());
    const gameStore = useSelector(state => state.user.game) 
  
    function safeGameMutate(modify){

            setGame((g)=>{
                const update = {...g}

               modify(update)

              //  console.log('update')
              //  console.log(update.fen())
              //  console.log(update)
               

                return update;
        })
    } 

    function onDrop(source,target, arg=null, updateOpponent=null){

        //console.log(source,target)
        console.log(arg)
        console.log(updateOpponent)

        if(updateOpponent == null) socket.emit("pass-game", lobbyId, source, target)

        let move = null;
        safeGameMutate(
          
          (game)=>{
            move = game.move({
            from:source,
            to: target,
            promotion:'q'
         })}
    )
 //illegal move 
    if(move== null) return false

    
    return true;
    }

  
  useEffect(() => {
    socket.on("get-moves", function(moves){
      console.log(moves)
      onDrop(moves.src, moves.tar, null, 'ud')
  })
  }, [])

  return (
    <div className="app">
      <Chessboard 
      position={game.fen()}
      onPieceDrop ={onDrop}
      />
    </div>
  );
}

export default Board
