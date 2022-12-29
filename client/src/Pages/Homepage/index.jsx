import React, { useEffect, useState } from "react"

import { useNavigate } from 'react-router-dom'
import { socket } from "../../socket"

import { useDispatch } from "react-redux"
import { userActions } from "../../store/store"

import "./homepage.css"

const logo = require("../../assets/ChessRacerZ_logo.png")

function Homepage() {
 
    const navigate = useNavigate()
    const [lobbyId, setLobbyId] = useState("")
    const dispatch = useDispatch()

    function createLobby(e) {
        e.preventDefault()
        socket.emit("create-lobby", lobbyId)
    }

    function joinLobby(e) {
        e.preventDefault()
        socket.emit("join-lobby", lobbyId)
    }

    useEffect(() => {
        socket.on('connect', function() {
            console.log(`${socket.id} connected`)
        });
  
        socket.on("console-message", function(msg){
            console.log(msg)
        })
    }, [])

    socket.on("send-to-game", (color) => {
        console.log(color)
        navigate("/game", {state: { lobbyId, color }})
    })

    function updateLobbyId(e) {
        setLobbyId(e.target.value)
        dispatch(userActions.setLobbyId(e.target.value))
    }

    return<>
            <main>
                <img src={logo} alt="Logo" />
                <h1>ChessRacerZ</h1>
                <div id="lobbyOptions">
                    <input type="text" placeholder="Enter LobbyId" onChange={updateLobbyId} value={lobbyId} required/>
                    <button onClick={createLobby}>Create Lobby</button>
                    <button onClick={joinLobby}>Join Lobby</button>
                    <p>{process.env.REACT_APP_URL}</p>
                </div>
            </main>
        </>
}

export default Homepage;
