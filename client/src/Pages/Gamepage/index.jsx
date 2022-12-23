import React from "react"
import { useLocation } from 'react-router-dom'
import { socket } from "../../socket"

import { Header, Board } from "../../components"

import "./gamepage.css"

function Gamepage() {
 
    const { state } = useLocation()
    const { lobbyId } = state

    console.log(lobbyId)

    socket.on("console-message", function(msg){
        console.log(msg)
        if (msg.includes(`joined ${lobbyId} succesfully`)){
            console.log("Both players connected")
            socket.emit("start-game", lobbyId)
        }
    })

    socket.on("timer-end", () => {
        console.log("end")
    })

    return<>
                <Header />
                <main>
                    <p>Lobby: {lobbyId}</p>
                    <div id="chess-game">
                        <p>Chess Game</p>
                        <Board lobbyId={lobbyId}/>
                    </div>
                </main>
            </>
}

export default Gamepage;
