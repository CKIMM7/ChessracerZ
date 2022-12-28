import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { Gamepage, Homepage } from "./Pages"
import Game from "./components/Race"

import RaceTest from "./components/Race2"

function App() {

  return <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/game" element={<Gamepage />}></Route>
          <Route path="/game2" element={<Game />}></Route>
          <Route path="/game3" element={<RaceTest />}></Route>
        </Routes>
}

export default App;
