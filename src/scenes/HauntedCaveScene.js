import Phaser, { DOWN } from "phaser";
import Enemy from "../ui/Enemy";
export default class HauntedCaveScene extends Phaser.Scene {
  constructor() {
    super("Haunted-Cave-Scene");
  }
  init() {
    this.player = undefined;
    this.backsound = undefined;
    this.enemies = undefined;
    this.enemySpeed = 50;
    this.score = 0;
    this.scoreText = undefined;
    this.player_jumps = 2;
    this.player_jumping = false;
    this.attack = undefined;
    this.player_attacking = false;
    this.keys = {};
  }
  preload() {
    this.load.image("bg1", "images/background1.png");
    this.load.image("bg2", "images/background2.png");
    this.load.image("bg3", "images/background3.png");
    this.load.image("bg4", "images/background4a.png");
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 18,
      frameHeight: 18,
    });
    this.load.image("ground", "images/ground.jpg");
    this.load.image("platform", "images/platform.png");
    this.load.spritesheet("playerjump", "images/player_jump.png", {
      frameWidth: 18,
      frameHeight: 18,
    });
    this.load.spritesheet("playerfall", "images/player_fall.png", {
      frameWidth: 18,
      frameHeight: 18,
    });
    this.load.spritesheet("playerrun", "images/player_run.png", {
      frameWidth: 18,
      frameHeight: 18,
    });
    this.load.audio("jump", "sfx/Mario-jump-sound.mp3");
    this.load.audio("fall", "sfx/wind-blowing-sfx.mp3");
    this.load.audio("bg-sfx", "sfx/bg-sfx.mp3");
    this.load.spritesheet("orc", "images/Orc-Idle.png", {
      frameWidth: 22,
      frameHeight: 16,
    });
    this.load.spritesheet("orc-walk", "images/Orc-Walk.png", {
      frameWidth: 22,
      frameHeight: 15,
    });
    this.load.spritesheet("claw", "images/claw_attack.png", {
      frameWidth: 45,
      frameHeight: 33,
    });
  }
  create() {
    const gameHalfWidth = this.scale.width / 2;
    const gameHalfHeight = this.scale.height / 2;
    this.add.image(gameHalfWidth, gameHalfHeight, "bg1").setScale(2);
    this.add.image(gameHalfWidth, gameHalfHeight, "bg2").setScale(2);
    this.add.image(gameHalfWidth, gameHalfHeight, "bg3").setScale(2);
    this.add.image(gameHalfWidth, gameHalfHeight, "bg4").setScale(2);
    // this.add.rectangle(
    //    gameHalfWidth,
    //  gameHalfHeight + 370,
    //this.scale.width,
    //200,
    //0xff0000
    //);
    this.ground = this.physics.add
      .staticImage(gameHalfWidth, gameHalfHeight + 400, "ground")
      .setScale(1.5)
      .refreshBody();
    this.player = this.physics.add
      .sprite(gameHalfWidth - 100, 200, "player")
      .setScale(2);
    this.physics.add.collider(this.player, this.ground);
    // this.platform = this.physics.add
    //  .sprite(gameHalfWidth, gameHalfHeight + 50, "platform")

    //   .refreshBody()
    //   // .setGravityY(-200)
    //   .setVelocityX(-20);
    this.platform = this.physics.add
      .image(gameHalfWidth, gameHalfHeight, "platform")
      .setScale(0.5);
    this.platform.setImmovable(true);
    this.platform.body.allowGravity = false;
    this.platform.setVelocityX(50);

    this.physics.add.collider(this.player, this.platform);
    this.player.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: "player-jump",
      frames: this.anims.generateFrameNumbers("playerjump", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: "player-fall",
      frames: this.anims.generateFrameNumbers("playerfall", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: "player-run",
      frames: this.anims.generateFrameNumbers("playerrun", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });
    //  this.player.anims.play("player-idle");
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.backsound = this.sound.add("bg-sfx");
    var soundconfig = {
      loop: true,
      volume: 0.09,
    };
    this.backsound.play(soundconfig);
    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.collider(this.enemies, this.ground);
    this.physics.add.collider(this.enemies, this.platform);

    this.anims.create({
      key: "orc-walk",
      frames: this.anims.generateFrameNumbers("orc-walk", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.attackEnemy,
      null,
      this
    );
    this.scoreText = this.add.text(gameHalfWidth, 20, "score : 0", {
      fontSize: "18px",
      fontStyle: "bold",
    });
    this.attack = this.physics.add.sprite(this.player.x, this.player.y, "claw");
    this.attack.setImmovable(true);
    this.attack.body.allowGravity = false;
    this.attack.setActive(false).setVisible(false);

    this.keys = this.input.keyboard.addKeys({
      left: "A",
      right: "D",
      SPACE: "SPACE",
      attack: "J",
    });
    this.attack.anims.create({
      key: "attack_claw",
      frames: this.anims.generateFrameNumbers("claw", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
    });
    this.keys.attack.on("down", () => {
      this.playerAttack();
    });
  }
  update() {
    if (this.platform.x >= 1500) {
      this.platform.setVelocityX(-50);
    } else if (this.platform.x <= 200) {
      this.platform.setVelocityX(50);
    }

    if (this.cursors.left.isDown || this.keys.left.isDown) {
      this.player.setVelocityX(-120).setFlipX(true);
      if (this.player.body.touching.down) {
        this.player.anims.play("player-run", true);
      }
    } else if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.player.setVelocityX(120).setFlipX(false);
      if (this.player.body.touching.down) {
        this.player.anims.play("player-run", true);
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.touching.down) {
        this.player.anims.play("player-idle", true);
      }
    }
    if (this.player.body.touching.down) {
      this.player_jumps = 2;
      this.player_jumping = false;
    }

    if (
      this.player_jumps > 0 &&
      (Phaser.Input.Keyboard.DownDuration(this.cursors.up, 150) ||
        Phaser.Input.Keyboard.DownDuration(this.keys.SPACE, 150))
    ) {
      this.player.setVelocityY(-300);
      //this.player.anims.play("player-jump", true);
      this.sound.play("jump", { volume: 0.01 });
      this.player_jumping = true;
    }
    if (
      this.player_jumping &&
      (Phaser.Input.Keyboard.JustUp(this.cursors.up) ||
        Phaser.Input.Keyboard.JustUp(this.keys.SPACE))
    ) {
      this.player_jumps--;
      this.player_jumping = false;
    }

    this.physics.world.on("worldstep", () => {
      if (this.player.body.velocity.y < 0) {
        this.player.anims.play("player-jump", true);
      } else if (this.player.body.velocity.y > 0) {
        this.player.anims.play("player-fall", true);
        // this.sound.play("fall");
      }
    });

    if (this.attack) {
      this.attack.setPosition(this.player.x + 20, this.player.y);
    }
  }
  spawnEnemy() {
    const config = {
      speed: 50,
    };
    //@ts-ignore
    const enemy = this.enemies.get(0, 0, "orc", config);

    if (enemy) {
      enemy.spawn(this.game.scale.width);
      enemy.anims.play("orc-walk", true);
    }
  }
  attackEnemy(player, enemy) {
    if (player.body.velocity.y !== 0 && player.body.touching.down) {
      enemy.die();
      this.score += 10;
      this.scoreText.setText("score : " + this.score);
    }
  }
  playerAttack() {
    this.attack.setActive(true).setVisible(true);
    this.attack.anims.play({
      key: "attack_claw",
      hideOnComplete: true,
    });
  }
}
