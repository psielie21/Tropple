class GameLobbyConnection {
  constructor(playerPrefix) {
    this.playerPrefix = playerPrefix;
    this.stateToken = "GAME_LOBBY";
  }

  sendConnect(name) {
    return this.stateToken + " " + "CONNECT " + name;
  }

  sendStart() {
    return this.stateToken + " " + "START";
  }

  receivePlayers(args) {
    if (args[0] == this.stateToken && args[1] == "RECEIVE_PLAYERS_SUCCESS") {
      return args.splice(2);
    } else {
      return null;
    }
  }

  receiveStart(args) {
    if (args[0] == this.stateToken && args[1] == "RECEIVE_START") {
      return "START";
    } else {
      return null;
    }
  }
}

export default GameLobbyConnection;
