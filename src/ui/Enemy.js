import Phaser from "phaser";
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.speed = config.speed;
    this.spawnX = config.spawnX;
  }
  spawn(positionX) {
    this.setPosition(positionX, 700);

    this.setActive(true);

    this.setVisible(true);
    this.setScale(2.5);
    this.setFlipX(true);
  }
  die() {
    this.destroy();
  }
  update() {
    this.setVelocityX(this.speed * -1);

    if (this.x < -10) {
      this.die();
    }
  }
}
