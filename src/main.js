import Phaser from "phaser";

import HauntedCaveScene from "./scenes/HauntedCaveScene";
import GameOverScene from "./scenes/GameOverScene";

function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont
    .load()
    .then(function (loaded) {
      document.fonts.add(loaded);
    })
    .catch(function (error) {
      return error;
    });
}

loadFont("Thaleah", "/fonts/ThaleahFat.ttf");

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
  scene: [HauntedCaveScene, GameOverScene],
};

export default new Phaser.Game(config);
