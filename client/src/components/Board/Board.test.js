import {screen, render, fireEvent } from '@testing-library/react'
import Board from '.'
import React from 'react'
import '@testing-library/jest-dom'
import { Chessboard } from 'react-chessboard'

describe('Board', () =>{
    beforeEach(() =>{
        render(<Board/>)
    })

    test('Chess board is wrapped in a div', () =>{
        const {container} = render(<Board/>)
        const div = container.getElementsByClassName('app')
        
        expect(div.length).toBe(1)
    })
    test('Chessboard from react chessboard', () =>{
        const { Chessboard } = render(<Chessboard/>)

        expect(Chessboard).toBe()
    })
})
