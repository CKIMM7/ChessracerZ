import React from "react"

import { Header, Board } from "../../components"

import "./gamepage.css"

function Gamepage() {
 
  return<>
            <Header />
            <main>
                <div id="chess-game">
                    <p>Chess Game</p>
                    <Board/>
                </div>
            </main>
        </>
}

export default Gamepage;
