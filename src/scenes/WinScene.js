import Phaser from "phaser";

export default class WinScene extends Phaser.Scene {
  constructor() {
    super("win-scene");
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    const gameHalfWidth = this.scale.width / 2;
    const gameHalfHeight = this.scale.height / 2;
    const text = this.add.text(gameHalfWidth, gameHalfHeight, "You Win!", {
      fontFamily: "Thaleah",
      fontSize: "200px",
      color: "yellow",
    });
    text.setPosition(
      gameHalfWidth - text.width / 2,
      gameHalfHeight - text.height
    );

    const score = this.add.text(
      gameHalfWidth,
      text.y + text.displayHeight,
      `Score: ${this.score}`,
      {
        fontFamily: "Thaleah",
        fontSize: "68px",
        color: "#bada55",
      }
    );
    score.setX(gameHalfWidth - score.width / 2);

    const instruction = this.add.text(
      gameHalfWidth,
      score.y + score.displayHeight + 50,
      "press anywhere to play again...",
      {
        fontFamily: "Thaleah",
        fontSize: "50px",
        color: "#ffffff",
      }
    );
    instruction.setX(gameHalfWidth - instruction.width / 2);

    this.input.once("pointerdown", () => {
      this.scene.start("Haunted-Cave-Scene");
    });
  }
}
