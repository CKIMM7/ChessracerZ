import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import { socket } from "../../socket"

import { Header, Board, Race, Timer } from "../../components"

import Game4 from "../../components/Race3"

import "./gamepage.css"


function Gamepage() {
 
    const [waitMessage, setWaitMessage] = useState("Waiting on opponent...")
    const [draggable, setDraggable] = useState(false)
    const [round, setRound] = useState(1)

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
                  setDraggable(true)
                }
            }, 1000);
    
            
          });

        
        socket.on("timer-end", function() {
            console.log("Timer ended for round ", round)
            setRound(round + 1)
            console.log("Starting round ", round)
        })

        if (round === 0 || round % 2 === 0) {
            document.getElementById("chess-game").style.display = "flex"
            document.getElementById("race-game").style.display = "none"
        } else {
            document.getElementById("chess-game").style.display = "none"
            document.getElementById("race-game").style.display = "flex"
        }

    }, [round, lobbyId])


    return<>
                <Header />
                <main>
                    <p>Lobby: {lobbyId}</p>
                    <div id="waiting">{waitMessage}</div>
                    <div id="chess-game">
                        <Board lobbyId={lobbyId} color={color} draggable={draggable}/>
                    </div> 
                    <div id="race-game">
                        <Game4 lobbyId={lobbyId} color={color}/>
                    </div>
                </main>
            </>
}

export default Gamepage;
