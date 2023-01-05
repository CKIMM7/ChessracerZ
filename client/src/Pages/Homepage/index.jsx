import React, { useEffect, useState } from "react"

import { useNavigate } from 'react-router-dom'
import { socket } from "../../socket"

import "./homepage.css"

const logo = require("../../assets/ChessRacerZ_logo.png")

function Homepage() {
 
    const navigate = useNavigate()
    const [lobbyId, setLobbyId] = useState("")
    const [displayMessage, setDisplayMessage] = useState("")

    function createLobby(e) {
        e.preventDefault()
        lobbyId ? socket.emit("create-lobby", lobbyId) : setDisplayMessage("Enter a lobby Id")
    }

    function joinLobby(e) {
        e.preventDefault()
        lobbyId ? socket.emit("join-lobby", lobbyId) : setDisplayMessage("Enter a lobby Id")
    }

    useEffect(() => {
        socket.on('connect', function() {
            console.log(`${socket.id} connected`)
        });
  
        
        socket.on("display-message", function(msg){
            setDisplayMessage(msg)
        })

    }, [])

    socket.on("send-to-game", (color) => {
        navigate("/game", {state: { lobbyId, color }})
    })

    function updateLobbyId(e) {
        setLobbyId(e.target.value)
    }

    return<>
            <main>
                <img src={logo} alt="Logo" />
                <h1><span className="white">Chess</span><span className="red">Racer</span></h1>
                <div id="lobbyOptions">
                    <input type="text" placeholder="Enter LobbyId" onChange={updateLobbyId} value={lobbyId} required/>
                    {displayMessage ? <p id="displayMessage">{displayMessage}</p> : null}
                    <button onClick={createLobby}>Create Lobby</button>
                    <button onClick={joinLobby}>Join Lobby</button>
                    {/* <p>{process.env.REACT_APP_URL}</p> */}
                </div>
            </main>
        </>
}

export default Homepage;
