"use strict";

class GameState {
  constructor() {
    this.playingField = ["", "", "", "", "", "", "", "", ""];
    this.activePlayer = "X";
    this.gameActive = true;
    this.messages = {
      "firstConnection": "Bitte warten Sie auf Ihren Gegner!",
      "secondConnection": "Zwei Spieler verbunden. Das Spiel kann beginnen!",
      "maximumConnectionsReached": "Maximale Spielerzahl erreicht",
      "invalidField": "Feld bereits belegt",
      "invalidTurn": "Anderer Spieler am Zug",
      "gameOver": "Das Spiel ist beendet",
      "draw": "Unentschieden",
      "clearInfoArea": "",
  };
  };
  move(player, field) {
    this.playingField[field] = player;
  };
  changeActivePlayer() {
    if (this.activePlayer == "X") {
         this.activePlayer = "O";
       } else if (this.activePlayer == "O") {
         this.activePlayer = "X";
  };
  };
  changeGameActiveState() {
    this.gameActive = false;
  }
  checkForWinner() {
    //checks if fields in row, column or diagonal are filled with same symbol
    if (((this.playingField[0] == this.playingField[1]) && (this.playingField[1] == this.playingField[2]) && this.playingField[1] != "") ||
    ((this.playingField[3] == this.playingField[4]) && (this.playingField[4] == this.playingField[5]) && this.playingField[3] != "") ||
    ((this.playingField[6] == this.playingField[7]) && (this.playingField[7] == this.playingField[8]) && this.playingField[6] != "") ||
    ((this.playingField[0] == this.playingField[3]) && (this.playingField[3] == this.playingField[6]) && this.playingField[0] != "") ||
    ((this.playingField[1] == this.playingField[4]) && (this.playingField[4] == this.playingField[7]) && this.playingField[1] != "") ||
    ((this.playingField[2] == this.playingField[5]) && (this.playingField[5] == this.playingField[8]) && this.playingField[2] != "") ||
    ((this.playingField[0] == this.playingField[4]) && (this.playingField[4] == this.playingField[8]) && this.playingField[0] != "") ||
    ((this.playingField[6] == this.playingField[4]) && (this.playingField[4] == this.playingField[2]) && this.playingField[2] != "")) {
    return true
    };
  };
};

module.exports = GameState;