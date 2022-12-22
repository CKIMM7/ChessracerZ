import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { socket } from "../../socket"

const logo = require("../../assets/ChessRacerZ_logo.png")

function Homepage() {
 
    const navigate = useNavigate()

    function sendToGame() {
        navigate('/game')
    }

    function sendMsg() {
        console.log('message sent')
        socket.emit("message", { name: "John" });
    }

    useEffect(() => {
    socket.on('connect', function() {
        console.log(`${socket.id} connected`)
    });

    socket.on('recieve', function(d) {
        console.log(d)
    });

    }, [socket])



    return<>
            <main>
                <img src={logo} alt="Logo" />
                <h1>ChessRacerZ</h1>
                <button onClick={sendToGame}>Start Game</button>
                <button onClick={sendMsg}>send message</button>
            </main>
        </>
}

export default Homepage;
