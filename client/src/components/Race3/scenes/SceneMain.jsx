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
        this.checkPoint = false
        this.lap = false
        this.velocity = 500

        this.playerScore = ''
        this.opponentScore = ''
        this.goingBackWarn = ''
        this.getWarning = () => { 
        
          
        return this.goingBackWarn = this.add
        .text(500, 500, `You are going back`, {
          fill: '#A52A2A',
          fontSize: '50px',
          fontStyle: 'bold',
          color: '#A52A2A',
          align: 'center',
        })
        .setOrigin(0.5)};



    }

    preload() {
      this.load.image("tiles","./assets3/tiles.png");
      this.load.image("face","./assets3/greenCar.png");
      this.load.image("opponent","./assets3/redCar.png");
      this.load.tilemapTiledJSON('map', "./assets3/map1.json");

      this.load.audio("car","./assets3/carSound.wav");
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
          this.player=this.physics.add.sprite(500,200,"face");
          this.opponent=this.physics.add.sprite(500,180,"opponent");}

        if(!this.props.color) {
          this.player=this.physics.add.sprite(500,180,"opponent");
          this.opponent=this.physics.add.sprite(500,200,"face");}
      

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

        //sound
        this.carSound = this.sound.add('car');
        this.carSound.volume = 0.5; 

        this.socket.on("get-moves-race", function(moves) {

          self.opponent.x = moves.x
          self.opponent.y = moves.y
          if(moves.player_lap) {

            self.opponent.lap = moves.player_lap
            console.log('self.opponent.lap')
            console.log(self.opponent.lap)

            self.opponentScore.destroy()
            self.opponentScore = self.add
            .text(100, 120, `Opponent: ${self.opponent.lap}`, {
              fill: '#CED4D6',
              fontSize: '20px',
              fontStyle: 'bold',
              align: 'center',
            })
            .setOrigin(0.5);

          }

          if(self.opponent.lap == 3 || self.player.lap == 3)  {
            console.log('game end')
            socket.emit("end-game", self.lobbyId)

            window.location.replace(process.env.REACT_APP_HOME_URL);
          }
        })

        this.socket.on("start-timer", function(time) {

        })

        this.socket.on("timer-end", function() {

          console.log('timer-end')
          let time = 3

          try {
            clearInterval(timerInterval)
        } catch {}

          let timerInterval =  setInterval(() => {  
            time -= 1
            console.log(time)

            if(time > 1) {
              console.log('pause SceneMain')
              self.scene.pause('SceneMain');
  
            } else if(time === 0) {
              console.log('equal to zero')
              self.scene.resume('SceneMain');
  
            }

            if(time == 0) {
              clearInterval(timerInterval)
            }

          }, 1000)          

          self.opponent.x = 500;
          self.opponent.y = 180;

          self.player.x = 500;
          self.player.y = 200;

          self.opponent.lap = 0;
          self.player.lap = 0;

          self.opponentScore.destroy()
          self.opponentScore = self.add
            .text(100, 120, `Opponent: ${self.opponent.lap}`, {
              fill: '#CED4D6',
              fontSize: '20px',
              fontStyle: 'bold',
              align: 'center',
            })
            .setOrigin(0.5);

          self.playerScore.destroy()
          self.playerScore = self.add
          .text(100, 60, `player: ${self.player.lap}`, {
            fill: '#CED4D6',
            fontSize: '20px',
            fontStyle: 'bold',
            align: 'center',
          })
          .setOrigin(0.5);

        })
    
        this.playerScore = this.add
        .text(100, 60, `player: ${self.player.lap}`, {
          fill: '#CED4D6',
          fontSize: '20px',
          fontStyle: 'bold',
          align: 'center',
        })
        .setOrigin(0.5);

        this.opponentScore = this.add
        .text(100, 120, `Opponent: ${self.opponent.lap}`, {
          fill: '#CED4D6',
          fontSize: '20px',
          fontStyle: 'bold',
          align: 'center',
        })
        .setOrigin(0.5);

        this.popup = this.add.graphics();
        this.popup.lineStyle(1, 0x2a275c);
        this.popup.fillStyle(0x7c8d99, 0.5);
        this.popup.strokeRect(25, 25, 200, 150);
        this.popup.fillRect(25, 25, 200, 150);

      }

    update() {


       if (this.cursors.up.isDown==true)
       {
        this.player.setVelocityY(-this.velocity);
        this.carSound.play()

       }
       if (this.cursors.down.isDown==true)
       {
         this.player.setVelocityY(this.velocity);
         this.carSound.play()

       }
        if (this.cursors.right.isDown==true)
       {
         this.player.setVelocityX(this.velocity);
         this.carSound.play()

       }
       if (this.cursors.left.isDown==true)
       {
         this.player.setVelocityX(-this.velocity);
         this.carSound.play()
       }

      // emit player movement
      let x = this.player.x;
      let y = this.player.y;
      let r = this.player.rotation;

      if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || r !== this.player.oldPosition.rotation)) {

      //console.log(this.player.oldPosition)

        if(this.goingBackWarn) this.goingBackWarn.destroy()

        if(this.player.oldPosition.x < this.player.x && this.player.y < 260 && this.player.y > 120) {
          // console.log('user is going backwards1')
          // console.log('old position')
          // console.log(this.player.oldPosition.x)
          // console.log(this.player.x)

          this.player.setVelocityX(-100);
          //this.player.setVelocityY(100);

          if(!this.goingkBacWarn) this.getWarning()

  
          } else if (this.player.oldPosition.x > this.player.x && this.player.y < 827 && this.player.y > 708) {
            //
            this.player.setVelocityX(-200);
            if(!this.goingkBacWarn) this.getWarning()
            console.log('user is going backwards2')

          } else if (this.player.oldPosition.y > this.player.y && this.player.x < 185 && this.player.x > 138) {
            this.player.setVelocityY(-200);
            if(!this.goingkBacWarn) this.getWarning()
            console.log('user is going backwards')

          } else if(this.player.oldPosition.y < this.player.y && this.player.x < 1013 && this.player.x > 906) {
            this.player.setVelocityY(-200);
            if(!this.goingkBacWarn) this.getWarning()
            console.log('user is going backwards')
          }


        if(this.player.y < 573 && this.player.y > 565 && this.player.x > 900 && 1015 > this.player.x) {
          this.checkpoint = true
          console.log('this.checkpoint')
        }
        

        if(this.player.y < 190 && this.player.y > 120 && this.player.x > 370 && 380 > this.player.x && this.player.oldPosition.x > this.player.x) {


          this.lineStart = true
          console.log('this.lineStart')
          console.log(this.lineStart)


        }

        if(this.player.y < 190 && this.player.y > 120 && this.player.x > 270 && 280 > this.player.x && this.player.oldPosition.x > this.player.x) {
          this.lineFinish = true
          console.log('this.lineFinish')
          console.log(this.lineFinish)
        }

        if(this.lineStart && this.lineFinish && this.checkpoint) {
          this.player.lap += 1
          this.lineStart= false
          this.lineFinish= false
          this.checkpoint = false
          console.log('player complete lap')
          console.log(this.player.lap)

          socket.emit("pass-game-race", this.lobbyId, null, null, this.player.lap, this.opponent.lap)

          this.playerScore.destroy()
          this.playerScore = this.add
          .text(100, 60, `player: ${this.player.lap}`, {
            fill: '#CED4D6',
            fontSize: '20px',
            fontStyle: 'bold',
            align: 'center',
          })
          .setOrigin(0.5);
          
          if(this.opponent.lap == 3 || this.player.lap == 3)  {
            console.log('game end')
            socket.emit("end-game", this.lobbyId)
  
            window.location.replace(process.env.REACT_APP_HOME_URL);
          }

        }



        socket.emit("pass-game-race", this.lobbyId, this.player.x, this.player.y, null, null)
      }

       this.player.oldPosition = {
        x: this.player.x,
        y: this.player.y,
        rotation: this.player.rotation
      };
   }
}  
