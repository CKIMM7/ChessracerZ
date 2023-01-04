import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { Gamepage, Homepage } from "./Pages"

import Game4 from "./components/Race3"
import RaceTest from "./components/Race2"


function App() {

  return <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/game" element={<Gamepage />}></Route>
          <Route path="/game3" element={<RaceTest />}></Route>
          <Route path="/game4" element={<Game4 />}></Route>
        </Routes>
}

export default App;
