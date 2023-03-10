import Phaser from 'phaser';

export default class Opponent extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.playedSound = false;
  }

  update(twinkle) {
    if (!this.playedSound) {
      this.playedSound = true;
      twinkle.play();
    }
  }
}
