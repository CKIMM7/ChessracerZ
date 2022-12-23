import React, { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import  {Chess} from 'chess.js'


const Board = () =>{
    const [game, setGame] = useState(new Chess());
        
    function safeGameMutate(modify){
            setGame((g)=>{
                const update = {...g}
                modify(update)
                return update;
        })
    }

    function onDrop(source,target){
        let move = null;
        safeGameMutate((game)=>{
            move = game.move({
            from:source,
            to: target,
            promotion:'q'
         })
    })
 //illegal move 
    if(move== null) return false

    return true;
    }
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
