import React, { useState, useEffect, useRef } from "react"
import { socket } from '../../socket'

import "./timer.css"

function Timer() {

    const [timer, setTimer] = useState(20)
    const timerRef = useRef(timer) 

    useEffect(() => {
        socket.on("start-timer", () => {
            console.log("starting timer")
            setTimer(20)
            timerRef.current = timer
            const timerInterval = setInterval(() => {
                timerRef.current -= 1
                setTimer(timerRef.current)
                if (timerRef.current === 0){
                    clearInterval(timerInterval)
                }
            }, 1000)
        })

    }, [])

    return <div id="timer">
            <p>{Math.floor(timer / 60)} : {(timer % 60)}</p>
        </div>
    
}

export default Timer;