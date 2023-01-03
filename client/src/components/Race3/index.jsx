import React from "react";
import Phaser from 'phaser'
import SceneMain from "./scenes/SceneMain";

let sceneMainInstance

export default class Game extends React.Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.state = {lobbyId: props.lobbyId, color: props.color, round: props.round};
  }
  

  static getDerivedStateFromProps(props, state) {
    sceneMainInstance = new SceneMain(state)
    return sceneMainInstance;
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

    // changeRound = (props) => {
    //   this.setState({round: props.round});
    // }


    // shouldComponentUpdate() {
    //   return false;
    // }

    render() {
      return <div id="phaser-game" lobbyid={this.state.lobbyId}/>;
    }
  }
