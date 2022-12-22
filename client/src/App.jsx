import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"

import { Gamepage, Homepage } from "./Pages"
import { socket } from "./socket"

function App() {


  useEffect(() => {
    socket.off().on('connect', function() {
      console.log(`${socket.id} connected`)
    });
    
  }, [socket])


  return <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/game" element={<Gamepage />}></Route>
        </Routes>
}

export default App;
