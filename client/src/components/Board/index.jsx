import React, { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { socket } from '../../socket'
import { useNavigate } from 'react-router-dom'

import "./board.css"

const Board = ({ lobbyId, color, draggable }) =>{
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

        if(game.turn() !== color) return;

        if(updateOpponent === null) socket.emit("pass-game", lobbyId, source, target)
        let move = null;

        safeGameMutate(
          
          (game)=>{
            move = game.move({
            from:source,
            to: target,
            promotion:'q'
         })}
    )}

    function onOpponentDrop(source,target, arg=null, updateOpponent=null){

      if(game.turn() === color) return;

      let move = null;

      safeGameMutate(
        
        (game)=>{
          move = game.move({
          from:source,
          to: target,
          promotion:'q'
       })
       if(game.in_checkmate()){
            socket.emit("end-game", lobbyId)
       }
    }
  )
 //illegal move 
    if(move== null) return false

    
    return true;
    }

  
  useEffect(() => {
    socket.on("get-moves", function(moves){
      console.log(moves)
      onOpponentDrop(moves.src, moves.tar, null, 'ud')
  })
  }, [])

//   function checkmate(){
//         // game.on('checkmate', (attack)=>{
//         //     console.log('You won with ' + attack)
//         // })
//         safeGameMutate((game) =>{
//             if(game.checkmate()){
//                 socket.emit("pass-game", lobbyId, source, target)
//             }
//         })
//   }

    socket.on("send-to-home", () => {
        navigate("/")
    })
  return (
    <div className="app">
      <Chessboard 
      position={game.fen()}
      onPieceDrop ={onDrop}
      boardOrientation={color == 'w' ? 'white' : 'black'}
      arePiecesDraggable = {draggable}
      />
    </div>
  );
}

export default Board
