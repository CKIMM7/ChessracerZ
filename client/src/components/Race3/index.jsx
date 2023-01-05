import React from "react";
import Phaser from 'phaser'
import SceneMain from "./scenes/SceneMain";

let sceneMainInstance

export default class Game extends React.Component {
  constructor(props) {
  
    super(props);
    this.state = { lobbyId: props.lobbyId, color: props.color, round: props.round };

    console.log('reconstructed')
    console.log(this.state.updatePhaser)

  }


  static getDerivedStateFromProps(props, state) {

    sceneMainInstance = new SceneMain(state)
    return sceneMainInstance;
  }

    componentDidMount() {

        const config = {
            type: Phaser.AUTO,
            parent: 'race-game',
            width: 800,
            height: 600,
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
    

    render() {
      return <>
      <div id="phaser-game" lobbyid={this.state.lobbyId}/>
      </>;
    }
  }
