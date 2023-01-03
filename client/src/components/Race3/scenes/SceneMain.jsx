import Phaser from 'phaser'
import Align from "../util/align"
import { socket } from '../../../socket';

export default class SceneMain extends Phaser.Scene {

    constructor(props) {  

        super("SceneMain");
        this.lobbyId = props.lobbyId
        this.socket = socket
        this.props = props

        this.lineStart = false
        this.lineFinish = false
        this.lap = false
        this.velocity = 500

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
        this.tileset = tileset;

        if(this.props.color) {
          this.player=this.physics.add.sprite(500,150,"face");
          this.opponent=this.physics.add.sprite(500,150,"opponent");}

        if(!this.props.color) {
          this.player=this.physics.add.sprite(500,150,"opponent");
          this.opponent=this.physics.add.sprite(500,150,"face");}
        
        Align.scaleToGameW(this.player,0.02,this);
        Align.scaleToGameW(this.opponent,0.02,this);

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

        this.player.lap = 0
        this.opponent.lap = 0

        //globals
        console.log(tileset)
        console.log(this)


        this.socket.on("get-moves-race", function(moves) {
          console.log(moves.x)
          console.log(moves.y)
          console.log(moves)

          self.opponent.x = moves.x
          self.opponent.y = moves.y
          if(moves.player_lap) self.opponent.lap = moves.player_lap

          if(moves.player_lap == 2) document.querySelector("canvas").remove()

        //   if(moves.player_lap == 2) {
        //   console.log('lap2')
        //   document.querySelector("canvas").style.display = "none"
        // }
          
        //remove()
        //   if(this.opponent.lap == 1) {
        //     console.log('game ends do something')
        //     this.socket.emit("end-game", this.lobbyId)
    
        //     document.querySelector("canvas").style.display = "none"
        // }

          console.log(self.opponent.lap)
        })

    }

    update() {


       if (this.cursors.up.isDown==true)
       {
        this.player.setVelocityY(-this.velocity);

       }
       if (this.cursors.down.isDown==true)
       {
         this.player.setVelocityY(this.velocity);


       }
        if (this.cursors.right.isDown==true)
       {
         this.player.setVelocityX(this.velocity);


       }
       if (this.cursors.left.isDown==true)
       {
         this.player.setVelocityX(-this.velocity);

       }

      // emit player movement
      let x = this.player.x;
      let y = this.player.y;
      let r = this.player.rotation;

      if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || r !== this.player.oldPosition.rotation)) {

        // if (this.player.x > 150 && this.player.x < 250 && this.player.y > 150 && this.player.y < 215) {
        //   //will execute many times
        //   console.log('player has crossed lap1')
        //   this.lap1 = true;
          

        //   if(this.lap1 == true && this.lapCount == 0) {
        //     this.lapCount += 1
        //     this.lap1 = false
        //   }}

        // this.lapCount = 0
        // this.lineStart = false
        // this.lineFinish = false
        // this.lap = false

        console.log(`x: ${this.player.x} y: ${this.player.y} lap: ${this.player.lap}`)

        if(this.player.y < 180 && this.player.y > 140 && this.player.x > 370 && 380 > this.player.x) {
          this.lineStart = true
          console.log('this.lineStart')
          console.log(this.lineStart)
        }

        if(this.player.y < 180 && this.player.y > 140 && this.player.x > 270 && 280 > this.player.x) {
          this.lineFinish = true
          console.log('this.lineFinish')
          console.log(this.lineFinish)
        }

        if(this.lineStart && this.lineFinish) {
          this.player.lap += 1
          this.lineStart= false
          this.lineFinish= false
          console.log(this.player.lap)

          socket.emit("pass-game-race", this.lobbyId, null, null, this.player.lap)

        }


        socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y, null)
      }

       this.player.oldPosition = {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation
      };
   }
}   
