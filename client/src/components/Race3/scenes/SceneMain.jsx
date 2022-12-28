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
      this.player.setVelocityY(0);
      this.player.setVelocityX(0);

       if (this.cursors.up.isDown==true)
       {
        this.player.setVelocityY(-500);
       }
       if (this.cursors.down.isDown==true)
       {
         this.player.setVelocityY(100);
       }
        if (this.cursors.right.isDown==true)
       {
         this.player.setVelocityX(100);
       }
       if (this.cursors.left.isDown==true)
       {
         this.player.setVelocityX(-100);
       }
   }
}   
