class GameScreenConnection {
  constructor() {
    this.stateToken = "IN_GAME";
  }

  sendPair(index) {
    return this.stateToken + " SEND_PAIR" + " " + index;
  }

  receivePlayerDisk(args) {
    if (args[0] == this.stateToken && args[1] == "RECEIVE_PLAYER_DISK") {
      return args.splice(2).map((i) => parseInt(i));
    } else {
      return null;
    }
  }

  receiveCenterDisk(args) {
    if (args[0] == this.stateToken && args[1] == "RECEIVE_CENTER_DISK") {
      return args.splice(2).map((i) => parseInt(i));
    } else {
      return null;
    }
  }

  receivePlayerPercentage(args) {
    if (args[0] == this.stateToken && args[1] == "RECEIVE_PLAYER_PERCENTAGE") {
      const player = args[2];
      const percentage = parseFloat(args[3]);
      return [player, percentage];
    } else {
      return null;
    }
  }

  receiveVictory(args) {
    if (args[0] == this.stateToken && args[1] == "RECEIVE_VICTORY") {
      const player = args[2];
      return player;
    } else {
      return null;
    }
  }
}

export default GameScreenConnection;
