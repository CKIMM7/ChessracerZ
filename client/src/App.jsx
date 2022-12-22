import React from "react"
import { Routes, Route } from "react-router-dom"

import { Gamepage, Homepage } from "./Pages"

function App() {

  return <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/game" element={<Gamepage />}></Route>
        </Routes>
}

export default App;