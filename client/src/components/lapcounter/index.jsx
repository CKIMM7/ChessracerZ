import React, { useState, useEffect, useRef } from "react"
import { socket } from "../../socket"

import "./lapcounter.css"

function LapCounter() {


    const [pLap, setPLap] = useState(0)
    const [OLap, setOLap] = useState(0)

    useEffect(() => {

        socket.on("get-moves-race", function(moves) {

          if(moves.player_lap) {
            //opponent.lap = moves.player_lap
            console.log('moves.player_lap')
            console.log(moves.player_lap)
            setPLap(pLap+ 1)
          }

          if(moves.opponent_lap) {
            //opponent.lap = moves.player_lap
            console.log('moves.player_lap')
            console.log(moves.opponent_lapp)
            setOLap(pLap+ 1)
          }

        })

    }, [])

    return <div id="lapcounter">
            <p>LapCounter</p>
            <p>player lap: {pLap}</p>
            <p>opponent lap: {OLap}</p>
        </div>
    
}

export default LapCounter
