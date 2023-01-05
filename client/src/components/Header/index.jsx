import React from "react"
import { useNavigate } from "react-router-dom"


// import { GoogleLogin } from "./components"
import "./header.css"


const logo = require("../../assets/ChessRacerZ_logo.png")


function Header() {

  const navigate = useNavigate()

  function goHome() {
    navigate("/")
  }

  return <header>
            <img src={logo} alt="Logo" />
            <h1 onClick={goHome}>ChessRacerZ</h1>
            {/* <GoogleLogin /> */}
        </header>

}

export default Header;
