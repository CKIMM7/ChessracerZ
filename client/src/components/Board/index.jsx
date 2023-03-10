import React, { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { socket } from '../../socket'
import { useNavigate } from 'react-router-dom'
import inCheckMP3 from "../../assets/inCheck.mp3"
import pieceMoveMP3 from "../../assets/pieceMove.mp3"
import "./board.css"

const Board = ({ lobbyId, color, draggable }) =>{
    const [game, setGame] = useState(new Chess());
    const [gameState, setGameState] = useState('Player 1')
    const [checkMessage, setCheckMessage] = useState("")
    const pieceMoveNoise = new Audio(pieceMoveMP3)
    
    if (!color) color ='b'

    function safeGameMutate(modify){

            setGame((g)=>{
                const update = {...g}

               modify(update)
               pieceMoveNoise.play()
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
       
      // document.getElementById('winner').style.display = 'none'
       
       if(game.in_checkmate()){
            socket.emit("end-game", lobbyId)
            if(game.turn() == 'b'){
            setGameState('White has won the game via checkmate')
            } else {
            setGameState('Black has won the game via checkmate')
            }
            document.getElementById('gameEnding').style.display = 'flex'
       }

       if(game.in_draw()){
        socket.emit('end-game', lobbyId)
        setGameState('This game has ended in a draw')
        document.getElementById('gameEnding').style.display = 'flex'
       }

       if(game.in_stalemate()){
        socket.emit('end-game', lobbyId)
        setGameState('This game has ended in a stalemate')
        document.getElementById('gameEnding').style.display = 'flex'
       }
       
       if(game.insufficient_material()){
        socket.emit('end-game', lobbyId)
        setGameState('This game has ended due to a lack of material')
        document.getElementById('gameEnding').style.display = 'flex'
       }

       if(game.in_threefold_repetition()){
        socket.emit('end-game', lobbyId)
        setGameState('This game has ended due to repetition of moves')
        document.getElementById('gameEnding').style.display = 'flex'
       }

       if(game.in_check() && game.turn() == color){     
        setCheckMessage("You're in check!")
        const checkNoise = new Audio(inCheckMP3)
        checkNoise.play()
       }

       if(!game.in_check()){       
          setCheckMessage("")
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

    const navigate = useNavigate()

    socket.on("send-to-home", () => {
        navigate("/")
    })

  return (
    <div className="app">
      <p>{checkMessage}</p>
      <Chessboard 
      boardWidth={window.innerWidth * 0.35}
      position={game.fen()}
      onPieceDrop ={onDrop}
      boardOrientation={color == 'w' ? 'white' : 'black'}
      arePiecesDraggable = {draggable}
      />
      <div id="gameEnding">{gameState}</div>
    </div>
  );
}

export default Board
