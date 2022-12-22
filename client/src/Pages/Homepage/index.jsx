import React from "react"
import { useNavigate } from 'react-router-dom'

const logo = require("../../assets/ChessRacerZ_logo.png")

function Homepage() {
 
    const navigate = useNavigate()

    function sendToGame() {
        navigate('/game')
    }

    return<>
            <main>
                <img src={logo} alt="Logo" />
                <h1>ChessRacerZ</h1>
                <button onClick={sendToGame}>Start Game</button>
            </main>
        </>
}

export default Homepage;
