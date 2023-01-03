import React from "react";
import Phaser from 'phaser'

import MainScene from "./MainScene";
import PauseScene from "./PauseScene";


const SCREEN_W = 1920;
const SCREEN_H = 1080;

export default class RaceTest extends React.Component {
    componentDidMount() {
      const config = {
        type: Phaser.AUTO,
        width: SCREEN_W,
        height: SCREEN_H,
        
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        
        scene: [MainScene, PauseScene]
    };
      new Phaser.Game(config);
    }
    shouldComponentUpdate() {
      return false;
    }
    render() {
      return <div id="phaser-game" />;
    }
  }
