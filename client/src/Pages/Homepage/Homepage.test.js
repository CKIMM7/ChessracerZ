import { screen, render, fireEvent } from '@testing-library/react';
import Homepage from '.'
import {BrowserRouter as Router} from 'react-router-dom';
import React from 'react'
import '@testing-library/jest-dom'
import { afterAll, beforeAll } from '@jest/globals';
import { socket } from "../../socket"

const io = require('socket.io')(2333, {
    cors: {
        origin: ["*"]
    }
})

describe('Homepage', () =>{

    beforeAll(() => {
        jest.mock("../../socket", () => {
            const socketMock = {
              emit: jest.fn(),
              on: jest.fn()
            }
            return { socket: socketMock }
          })
    })

    beforeEach(() =>{
        render(<Homepage />, { wrapper: Router } )
    })

    afterAll(() => {
        io.close()
    })

    test('Create lobby button exists', () =>{
        const createLobbyBtn = screen.getByRole('button', { name: "Create Lobby"})

        expect(createLobbyBtn).toBeInTheDocument()
        expect(createLobbyBtn.textContent).toBe("Create Lobby")
    })

    test('Create lobby button is functional', () =>{
        const createLobbyBtn = screen.getByRole('button', { name: "Create Lobby"})

        const emitMock = jest.fn()
        socket.emit = emitMock

        fireEvent.click(createLobbyBtn)
        expect(socket.emit).toHaveBeenCalledWith("create-lobby", "")
    })


    test('Join lobby button exists', () =>{
        const joinLobbyBtn = screen.getByRole('button', { name: "Join Lobby"})

        expect(joinLobbyBtn).toBeInTheDocument()
        expect(joinLobbyBtn.textContent).toBe("Join Lobby")
    })

    test('Join lobby button is functional', () =>{
        const joinLobbyBtn = screen.getByRole('button', { name: "Join Lobby"})

        const emitMock = jest.fn()
        socket.emit = emitMock

        fireEvent.click(joinLobbyBtn)
        expect(socket.emit).toHaveBeenCalledWith("join-lobby", "")
    })

    test('Title is displayed', () =>{
        const title = screen.getByRole('heading', { name: 'ChessRacerZ'})
        expect(title).toBeInTheDocument()
    })

    test('Logo is displayed', () =>{
        const logo = screen.getByRole('img', { name: 'Logo'})
        expect(logo).toBeInTheDocument()
    })

    test('Navigates to gamepage when send-to-game event is received', () =>{
        const navigateMock = jest.fn()
        const navigate = navigateMock

        io.on("connection", socket => {
            socket.emit("send-to-game")
        })

        expect(navigate).toHaveBeenCalledWith("/game", {
            state: { lobbyId: "", color: "w" },
        })
    })

    test("Update lobbyId state with input", () => {

        const lobbyBox = screen.getByRole("textbox")
        fireEvent.change(lobbyBox, {target : {value: "test"}})

        expect(lobbyBox).toHaveValue("test")
    })
})