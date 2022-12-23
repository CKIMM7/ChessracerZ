import React, { useState } from "react"
import { useLocation } from 'react-router-dom'
import { socket } from "../../socket"

import { Header, Board } from "../../components"

import "./gamepage.css"
import { useEffect } from "react"

function Gamepage() {
 
    const [waitMessage, setWaitMessage] = useState("Waiting on opponent...")

    const { state } = useLocation()
    const { lobbyId, color } = state

    useEffect(() => {
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
    
        socket.on("start-game", function() {
            let countdown = 4
    
            const countdownInterval = setInterval(function() {
                countdown--;
                setWaitMessage(`Game starting in ${countdown} seconds...`)
                if (countdown === 0) {
                  clearInterval(countdownInterval)
                  document.getElementById("waiting").style.display = "none"
                }
            }, 1000);
    
          });
    }, [])

    return<>
                <Header />
                <main>
                    <p>Lobby: {lobbyId}</p>
                    <div id="waiting">{waitMessage}</div>
                    <div id="chess-game">
                        <p>Chess Game</p>
                        <Board lobbyId={lobbyId} color={color}/>
                    </div>
                </main>
            </>
}

export default Gamepage;
