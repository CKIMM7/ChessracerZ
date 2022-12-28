import React, { useState, useEffect, useRef } from "react"
import { socket } from '../../socket'

import "./timer.css"

function Timer() {

    const [timer, setTimer] = useState(0)
    const timerRef = useRef(timer) 

    useEffect(() => {
        socket.on("start-timer", function(time){
            try {
                clearInterval(timerInterval)
            } catch {}
            console.log("starting timer")
            setTimer(time - 1)
            timerRef.current = time - 1
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