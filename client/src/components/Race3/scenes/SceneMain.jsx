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

          self.opponent.x = moves.x
          self.opponent.y = moves.y
          if(moves.player_lap) self.opponent.lap = moves.player_lap

          if(self.opponent.lap == 2 || self.player.lap ==2)  {
            console.log('game end')
            socket.emit("end-game", self.lobbyId)

            document.querySelector("canvas").remove()
          }
        })

        this.socket.on("timer-end", function() {
          self.opponent.x = 500;
          self.opponent.y = 150;

          self.player.x = 500;
          self.player.y = 150;

          self.opponent.lap = 0;
          self.player.lap = 0;
        })}

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
