import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { socket } from '../../socket'

import "./board.css"

const Board = ({ lobbyId, color }) =>{
    const [game, setGame] = useState(new Chess());

    if (!color) color ='b'

    //console.log(game.board())
    // console.log(game.ascii())
    console.log('color')
    console.log(game.turn())
  
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

    console.log(color)    
    function onDrop(source,target, arg=null, updateOpponent=null){

        console.log(color)
        if(game.turn() !== color) return;

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
      boardOrientation={color == 'w' ? 'white' : 'black'}

      />
    </div>
  );
}

export default Board
