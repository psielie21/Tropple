import "./App.css";
import NoGame from "./pages/NoGame.js";
import GameLobby from "./pages/GameLobby.js";
import GameScreen from "./pages/GameScreen.js";
import GameScreenConnection from "./connection/GameScreenConnection.js";
import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import GameLobbyConnection from "./connection/GameLobbyConnection";
import Cookies from "universal-cookie";
import BaseConnection from "./connection/BaseConnection";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      wsConnected: false,
      gameState: "GAME_LOBBY",
      gameLobby: {
        players: [],
        connected: false,
        active: true,
        firstPlayer: false,
      },
      gameScreen: {
        players: [],
        active: false,
        playerDiskIds: [0, 1, 2, 3, 4, 5],
        centerDiskIds: [0, 2, 1, 3, 4, 5],
        playerPercentages: {},
        victor: null,
      },
    };
    this.cookies = new Cookies();
    this.gameScreenConnection = new GameScreenConnection();
    this.gameScreenSendPairHandler = (index) => {
      if (this.state.gameScreen.centerDiskIds.includes(index)) {
        this.client.send(this.gameScreenConnection.sendPair(index));
        //TODO: handleSuccess()
      }
      //TODO: handleMistake()
    };
    this.gameLobbyConnection = new GameLobbyConnection();
    this.gameLobbyConnectHandler = (name) => {
      if (!this.state.gameLobby.connected) {
        this.client.send(this.gameLobbyConnection.sendConnect(name));
      }
    };
    this.baseConnection = new BaseConnection();
    this.gameLobbyStartHandler = () => {
      if (this.state.gameLobby.connected && this.state.gameLobby.active) {
        this.client.send(this.gameLobbyConnection.sendStart());
      }
    };
    this.gameScreenReducers = [
      {
        connectionHandler: (args) =>
          this.gameScreenConnection.receivePlayerDisk(args),
        stateUpdater: (gameScreen, playerDiskIds) => {
          gameScreen.playerDiskIds = playerDiskIds;
          console.log("PlayerDisks: " + playerDiskIds);
          return gameScreen;
        },
      },
      {
        connectionHandler: (args) =>
          this.gameScreenConnection.receiveCenterDisk(args),
        stateUpdater: (gameScreen, centerDiskIds) => {
          gameScreen.centerDiskIds = centerDiskIds;
          console.log("CenterDisks: " + centerDiskIds);
          return gameScreen;
        },
      },
      {
        connectionHandler: (args) =>
          this.gameScreenConnection.receivePlayerPercentage(args),
        stateUpdater: (gameScreen, playerPercentage) => {
          gameScreen.playerPercentages[playerPercentage[0]] =
            playerPercentage[1];
          return gameScreen;
        },
      },
      {
        connectionHandler: (args) =>
          this.gameScreenConnection.receiveVictory(args),
        stateUpdater: (gameScreen, victor) => {
          gameScreen.victor = victor;
          this.cookies.remove("id");
          return gameScreen;
        },
      },
    ];
    this.gameLobbyReducers = [
      {
        connectionHandler: (args) =>
          this.gameLobbyConnection.receivePlayers(args),
        stateUpdater: (gameLobby, players) => {
          // players[0] is id of first player
          const firstPlayerFlag = players[0];
          const newPlayers = players.slice(1);
          gameLobby.players = newPlayers;
          gameLobby.firstPlayer = firstPlayerFlag == "HOST";
          gameLobby.connected = true;
          return gameLobby;
        },
      },
      {
        connectionHandler: (args) =>
          this.gameLobbyConnection.receiveStart(args),
        stateUpdater: (gameLobby, start) => {
          gameLobby = this.handleTransitionFromLobbyToGame(gameLobby);
          return gameLobby;
        },
      },
    ];
    this.baseConnectionReducers = [
      {
        connectionHandler: (args) => this.baseConnection.receiveId(args),
        stateUpdater: (state, id) => {
          // store id in cookie
          this.cookies.set("id", id);
          return state;
        },
      },
    ];
    this.gameScreenReduce = (reducer, args) => {
      const newObj = reducer.connectionHandler(args);
      console.log(newObj);
      if (newObj) {
        const newGameScreen = reducer.stateUpdater(
          this.state.gameScreen,
          newObj
        );
        this.setState({ gameScreen: newGameScreen });
      }
    };
    this.gameLobbyReduce = (reducer, args) => {
      const newObj = reducer.connectionHandler(args);
      console.log(newObj);
      if (newObj) {
        const newGameLobby = reducer.stateUpdater(this.state.gameLobby, newObj);
        this.setState({ gameLobby: newGameLobby });
      }
    };
    this.baseConnectionReduce = (reducer, args) => {
      const newObj = reducer.connectionHandler(args);
      console.log(newObj);
      if (newObj) {
        const state = reducer.stateUpdater(this.state.gameLobby, newObj);
        // DO NOT MODIFY STATE HERE
      }
    };
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  setupWebsocket() {
    if (!this.client) {
      let url;
      if (this.cookies.get("id")) {
        // url = `ws://192.168.101.153:8080/?id=${this.cookies.get("id")}`;
        url = "ws://192.168.101.153:8080/";
      } else {
        url = "ws://192.168.101.153:8080/";
      }
      this.client = new W3CWebSocket(url, "echo-protocol");

      this.client.onerror = () => {
        console.log("Connection Error");
      };

      this.client.onopen = () => {
        console.log("WebSocket Client Connected");
        this.setState({ wsConnected: true });
      };

      this.client.onclose = () => {
        console.log("echo-protocol Client Closed");
      };

      this.client.onmessage = (e) => {
        const args = e.data.split(" ");
        this.baseConnectionReducers.forEach((reducer) =>
          this.baseConnectionReduce(reducer, args)
        );
        this.gameScreenReducers.forEach((reducer) =>
          this.gameScreenReduce(reducer, args)
        );
        this.gameLobbyReducers.forEach((reducer) =>
          this.gameLobbyReduce(reducer, args)
        );
      };
    }
  }

  handleTransitionFromLobbyToGame = (gameLobby) => {
    // setup states
    gameLobby.active = false;
    const gameScreen = this.state.gameScreen;
    gameScreen.active = true;

    // set players and percentages
    gameScreen.players = gameLobby.players;
    const percentages = {};
    gameLobby.players.forEach((player) => {
      percentages[player] = 0;
    });
    gameScreen.percentages = percentages;
    this.setState({ gameScreen });
    return gameLobby;
  };

  render() {
    return (
      <div className="App">
        {this.state.gameLobby.active && (
          <GameLobby
            players={this.state.gameLobby.players}
            firstPlayer={this.state.gameLobby.firstPlayer}
            connectHandler={this.gameLobbyConnectHandler}
            startHandler={this.gameLobbyStartHandler}
          />
        )}
        {this.state.gameScreen.active && (
          <GameScreen
            players={this.state.gameScreen.players}
            victor={this.state.gameScreen.victor}
            playerPercentages={this.state.gameScreen.playerPercentages}
            centerDiskIds={this.state.gameScreen.centerDiskIds}
            playerDiskIds={this.state.gameScreen.playerDiskIds}
            symbolClickHandler={this.gameScreenSendPairHandler}
          />
        )}
      </div>
    );
  }
}

/*
      const playerDiskIds = this.gameScreenConnection.receivePlayerDisk(
        e.data.split(" ")
      );
      if (playerDiskIds) {
        this.setState({ gameScreen: { playerDiskIds } });
      }

      const centerDiskIds = this.gameScreenConnection.receiveCenterDisk(
        e.data.split(" ")
      );
      if (centerDiskIds) {
        this.setState({ gameScreen: { centerDiskIds } });
      }

      const playerPercentage =
        this.gameScreenConnection.receivePlayerPercentage(e.data.split(" "));
      if (playerPercentage) {
        const playerPercentages = this.state.playerPercentages;
        playerPercentages[playerPercentage[0]] = playerPercentage[1];
        this.setState({ gameScreen: { playerPercentages } });
      }
    };
    */

export default App;
