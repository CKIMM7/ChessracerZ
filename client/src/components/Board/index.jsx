import React, { useState } from 'react'
import Chessboard from 'chessboardjsx'


const Board = () =>{
    return (
        <Chessboard 
            position='start'
            sparePieces={true}
            />
    )
}

export default Board
