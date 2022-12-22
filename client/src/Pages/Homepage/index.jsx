import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { socket } from "../../socket"

import "./homepage.css"

const logo = require("../../assets/ChessRacerZ_logo.png")

function Homepage() {
 
    const navigate = useNavigate()
    const [lobbyId, setLobbyId] = useState("")

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
  
    }, [])

    socket.on("console-message", function(msg){
        console.log(msg)
    })

    socket.on("send-to-game", () => {
        navigate("/game", {state: { lobbyId }})
    })

    function updateLobbyId(e) {
        setLobbyId(e.target.value)
    }

    return<>
            <main>
                <img src={logo} alt="Logo" />
                <h1>ChessRacerZ</h1>
                <input type="text" placeholder="Enter LobbyId" onChange={updateLobbyId} value={lobbyId} required/>
                <button onClick={createLobby}>Create Lobby</button>
                <button onClick={joinLobby}>Join Lobby</button>
                
            </main>
        </>
}

export default Homepage;