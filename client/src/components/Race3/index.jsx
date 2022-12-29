import React from "react";
import Phaser from 'phaser'
import SceneMain from "./scenes/SceneMain";

let sceneMainInstance

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {lobbyId: props.lobbyId};
  }
  

  static getDerivedStateFromProps(props, state) {
    sceneMainInstance = new SceneMain(state.lobbyId)
    return;
  }

    componentDidMount() {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: 1300,
            height: 1000,
            backgroundColor:0x000000,
            scene: sceneMainInstance,
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
      return <div id="phaser-game" lobbyid={this.state.lobbyId}/>;
    }
  }
