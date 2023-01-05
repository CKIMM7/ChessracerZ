import React from "react"
import { useNavigate } from "react-router-dom"


import { Timer } from "../../components"
import "./header.css"


const logo = require("../../assets/ChessRacerZ_logo.png")


function Header() {

  const navigate = useNavigate()

  function goHome() {
    navigate("/")
  }

  return <header>
            <img src={logo} alt="Logo" className="left"/>
            <h1 onClick={goHome} className="center"><span className="white">Chess</span><span className="red">Racer</span></h1>
            <Timer />
        </header>

}

export default Header;
