import Phaser from 'phaser'
import Align from "../util/align"

export default class SceneMain extends Phaser.Scene {
    constructor() {
        super("SceneMain");
    }
    preload() {
      this.load.image("tiles","./assets3/tiles.png");
      this.load.image("face","./assets3/face.png");
      this.load.tilemapTiledJSON('map', "./assets3/map1.json");

    }
    create() {         
        const map = this.make.tilemap({ key: "map", tileWidth: 64, tileHeight: 64});
        const tileset = map.addTilesetImage('tiles1','tiles');
        const layer = map.createLayer('ground', tileset, 0, 0);
        const cactusLayer = map.createLayer('cactus', tileset, 0, 0);
        const hillssLayer = map.createLayer('hills', tileset, 0, 0);

        this.player=this.physics.add.sprite(100,100,"face");
        //this.player=this.physics.add.sprite(100,100,"player2");
        
        Align.scaleToGameW(this.player,0.04,this);


        this.cursors=this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, cactusLayer);
        this.physics.add.collider(this.player, hillssLayer);

        cactusLayer.setCollisionBetween(38, 39)   
        hillssLayer.setCollisionBetween(5, 50)

        //horizontal & vertical walls
        //hillssLayer.setCollisionBetween(138, 157)   
        
        //corner walls
        hillssLayer.setCollisionBetween(137, 158)  

    }
    update() {
      this.player.setVelocityY(20);
      this.player.setVelocityX(20);

       if (this.cursors.up.isDown==true)
       {
        this.player.setVelocityY(-500);
        console.log(this.player.x)
        console.log(this.player.y)
       }
       if (this.cursors.down.isDown==true)
       {
         this.player.setVelocityY(500);
         console.log(this.player.x)
         console.log(this.player.y)
       }
        if (this.cursors.right.isDown==true)
       {
         this.player.setVelocityX(500);
         console.log(this.player.x)
         console.log(this.player.y)
       }
       if (this.cursors.left.isDown==true)
       {
         this.player.setVelocityX(-500);
         console.log(this.player.x)
         console.log(this.player.y)
       }
   }
}   
