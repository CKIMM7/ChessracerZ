import React from "react"


import { GoogleLogin } from "./components"
import "./header.css"


const logo = require("../../assets/ChessRacerZ_logo.png")

function Header() {
 
  return <header>
            <img src={logo} alt="Logo" />
            <h1>ChessRacerZ</h1>
            <GoogleLogin />
        </header>

}

export default Header;
