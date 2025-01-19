import Phaser from "phaser";

import HauntedCaveScene from "./scenes/HauntedCaveScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1600,
  height: 900,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [HauntedCaveScene],
};

export default new Phaser.Game(config);
