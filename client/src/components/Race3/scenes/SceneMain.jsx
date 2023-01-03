import Phaser from 'phaser'
import Align from "../util/align"
import { socket } from '../../../socket';

export default class SceneMain extends Phaser.Scene {

    constructor(props) {  

        super("SceneMain");
        this.lobbyId = props.lobbyId
        this.socket = socket
        this.props = props

        console.log(this)
    }

    preload() {
      this.load.image("tiles","./assets3/tiles.png");
      this.load.image("face","./assets3/face.png");
      this.load.image("opponent","./assets3/opponent.png");
      this.load.tilemapTiledJSON('map', "./assets3/map1.json");
    }

    create() {    
      
        let self = this; 

        const map = this.make.tilemap({ key: "map", tileWidth: 64, tileHeight: 64});
        const tileset = map.addTilesetImage('tiles1','tiles');
        const layer = map.createLayer('ground', tileset, 0, 0);
        const cactusLayer = map.createLayer('cactus', tileset, 0, 0);
        const hillssLayer = map.createLayer('hills', tileset, 0, 0);

        if(this.props.color) {
          this.player=this.physics.add.sprite(100,100,"face");
          this.opponent=this.physics.add.sprite(100,100,"opponent");}

        if(!this.props.color) {
          this.player=this.physics.add.sprite(100,100,"opponent");
          this.opponent=this.physics.add.sprite(100,100,"face");}
        
        Align.scaleToGameW(this.player,0.04,this);
        Align.scaleToGameW(this.opponent,0.04,this);

        this.cursors=this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, cactusLayer);
        this.physics.add.collider(this.player, hillssLayer);

        this.physics.add.collider(this.opponent, cactusLayer);
        this.physics.add.collider(this.opponent, hillssLayer);

        this.physics.add.collider(this.player, this.opponent);

        cactusLayer.setCollisionBetween(38, 39)   
        hillssLayer.setCollisionBetween(5, 50)

        //horizontal & vertical walls
        //hillssLayer.setCollisionBetween(138, 157)   
        
        //corner walls
        hillssLayer.setCollisionBetween(137, 158)
        
        this.socket.on("get-moves-race", function(moves) {
          console.log(moves.x)
          console.log(moves.y)
          console.log(this.player)

          self.opponent.x = moves.x
          self.opponent.y = moves.y


        })

    }

    update() {

      //this.player.setVelocityY(20);
      //this.player.setVelocityX(20);

      //send my moves to the opponent and move the opp

      //socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y)

      //   socket.on("get-moves-race", function(moves){
      //     console.log(moves.x)
      //     console.log(moves.y)
      //     console.log(x)
      //     x = 500
      // })

      // this.opponent.x += 5;

      // if (this.opponent.x > 950)
      // {
      //   this.opponent.x = 150;
      // }

      //console.log('fast')

       if (this.cursors.up.isDown==true)
       {
        this.player.setVelocityY(-200);
        //socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y)
       }
       if (this.cursors.down.isDown==true)
       {
         this.player.setVelocityY(200);
         //socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y)

       }
        if (this.cursors.right.isDown==true)
       {
         this.player.setVelocityX(200);
         //socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y)

       }
       if (this.cursors.left.isDown==true)
       {
         this.player.setVelocityX(-200);
         //socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y)
       }

      // emit player movement
      let x = this.player.x;
      let y = this.player.y;
      let r = this.player.rotation;

      if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || r !== this.player.oldPosition.rotation)) {
        console.log('playerMovement in if statement')
        console.log('send socket to server')  
        socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y)
      }

       this.player.oldPosition = {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation
      };
   }
}   
