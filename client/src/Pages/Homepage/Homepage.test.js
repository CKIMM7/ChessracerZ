import { screen, render, queryByAttribute, fireEvent } from '@testing-library/react';
import Homepage from '.'
import {BrowserRouter as Router} from 'react-router-dom';
import React from 'react'
import '@testing-library/jest-dom'

describe('Homepage', () =>{
    beforeEach(() =>{
        render(<Homepage />, { wrapper: Router } )
    })

    test('It has button to join lobby', () =>{
        const joinLobby = screen.getByRole('button', { name: "Join Lobby"})
        expect(joinLobby).toBeInTheDocument()
        expect(joinLobby.textContent).toBe("Join Lobby")
    })

    test('Title can be seen', () =>{
        const title = screen.getByRole('heading', { level: '1'})
        expect(username).toBeInTheDocument()
    })

    test('Logo is displayed', () =>{
        const title = screen.getByRole('img', { name: 'ChessRacerZLogo'})
        expect(username).toBeInTheDocument()
    })


})