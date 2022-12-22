import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { socket } from "../../socket"

import "./homepage.css"

const logo = require("../../assets/ChessRacerZ_logo.png")

function Homepage() {
 
    const navigate = useNavigate()
    const [lobbyId, setLobbyId] = useState("")

    function sendToGame() {
        navigate('/game')
    }

    function sendMsg() {
        console.log('message sent')
        socket.emit("message", { name: "John" });
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

    }, [socket])


    function updateLobbyId(e) {
        setLobbyId(e.target.value)
    }

    return<>
            <main>
                <img src={logo} alt="Logo" />
                <h1>ChessRacerZ</h1>
                <button onClick={sendToGame}>Start Game</button>
                <button onClick={sendMsg}>send message</button>
                <form onSubmit={joinLobby}>
                    <input type="text" placeholder="Enter LobbyId" onChange={updateLobbyId} value={lobbyId} required/>
                    <input type="submit"/>
                </form>
                
            </main>
        </>
}

export default Homepage;
