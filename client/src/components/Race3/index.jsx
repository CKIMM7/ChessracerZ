import React from "react";
import Phaser from 'phaser';
import SceneMain from './scenes/SceneMain';



export default class Game4 extends React.Component {
    componentDidMount() {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: 1000,
            height: 1000,
            backgroundColor:0x000000,
            scene: SceneMain,
            physics:{
                default:"arcade",
                arcade:{
                    debug:true
                }
            }
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



