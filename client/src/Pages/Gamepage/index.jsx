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
    })

    return<>
                <Header />
                <main>
                    <p>Lobby: {lobbyId}</p>
                    <div id="chess-game">
                        <p>Chess Game</p>
                        <Board/>
                    </div>
                </main>
            </>
}

export default Gamepage;
