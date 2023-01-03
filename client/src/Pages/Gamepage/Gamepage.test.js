import { screen, render, fireEvent } from '@testing-library/react';
import Gamepage from '.'
import {BrowserRouter as Router} from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import '@testing-library/jest-dom'

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn()
  }));

describe('Gamepage', () =>{

    beforeEach(() =>{
        useLocation.mockReturnValue( {state: {
            lobbyId: "TestLobby",
            color: "w"
        }})

        render(<Gamepage />)
    })

    test('Header is displayed on page', () =>{
        const header = screen.getByRole('banner')

        expect(header).toBeInTheDocument()
    })

    test('Timer displayed on page', () =>{
        const timer = screen.getByText('0 : 0')

        expect(timer).toBeInTheDocument()
    })

    test('Lobby name correctly displayed on page', () =>{
        const lobbyIdText = screen.getByText("Lobby: TestLobby") 

        expect(lobbyIdText).toBeInTheDocument()
    })
    
    test('Displays waiting on opponent message', () =>{
        const waiting = screen.getByText("Waiting on opponent...") 

        expect(waiting).toBeInTheDocument()
    })

})