import { connection, request } from "websocket";
import { getDiskArray, Disk } from "./disks";

const WebSocketServer = require("websocket").server;
const http = require("http");

const server = http.createServer(function (
  request: { url: string },
  response: { writeHead: (arg0: number) => void; end: () => void }
) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

let players: string[] = [];
// assign to each device an id stored in a cookie
// to identify devices even on connection loss
const idPlayerLookup: { [id: number]: string } = {};
const playersConnLookup: { [player: string]: connection } = {};
const getId = () => {
  let id = 100;
  const stepUp = () => {
    id++;
    return id;
  };
  return stepUp;
};
const id = getId();

// game variables
let disksPerPlayer: number;
let playerDiskLookup: { [player: string]: Disk[] } = {};
let centerDisk: Disk;

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

const shuffleAndDistributeDisks = () => {
  const disks = getDiskArray();
  centerDisk = disks.pop();
  disksPerPlayer = disks.length / players.length;

  players.forEach((player) => {
    const playerDisks = disks.splice(0, disksPerPlayer);
    playerDiskLookup[player] = playerDisks;
    console.log("Player: " + player + ", disks: " + playerDisks);
  });
};

wsServer.on("request", function (request: request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection: connection = request.accept(
    "echo-protocol",
    request.origin
  );

  let currId: number;
  if (
    request.resourceURL.query &&
    typeof request.resourceURL.query == "object" &&
    typeof request.resourceURL.query.id == "string"
  ) {
    // connection already known
    currId = parseInt(request.resourceURL.query.id);
    handleKnownPlayer(connection, currId);
  } else {
    // new connection
    currId = id();
    handleNewPlayer(connection, currId);
  }
  console.log("PLAYERS: " + players);

  console.log(new Date() + " Connection accepted from id: " + currId);
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);
      const args = message.utf8Data.split(" ");

      gameLobbyConnect(args, connection, currId);

      gameLobbyStart(args, connection, currId);

      gameScreenFoundPair(args, connection, currId);
    }
  });
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
    removePlayer(connection);
  });
});

// Base Connection

const handleKnownPlayer = (conn: connection, currId: number) => {
  const player = idPlayerLookup[currId];
  if (player) {
    if (!players.includes(player)) {
      players.push(player);
    }
    playersConnLookup[player] = conn;
    updatePlayers();
  }
};

const handleNewPlayer = (conn: connection, currId: number) => {
  sendId(conn, currId);
};

const removePlayer = (conn: connection) => {
  const player: string | undefined = players.find(
    (player) => playersConnLookup[player] == conn
  );
  if (player) {
    const index = players.indexOf(player);
    if (index > -1) {
      players.splice(index, 1);
    }
    delete playersConnLookup[player];
  }
  console.log("PLAYERS: " + players);
  updatePlayers();
};

const sendId = (conn: connection, id: number) => {
  conn.send("CONNECTION ID " + id);
};

// Game Lobby

const gameLobbyConnect = (args: string[], conn: connection, currId: number) => {
  if (args[0] == "GAME_LOBBY" && args[1] == "CONNECT") {
    const player = args[2];
    console.log("Received lobby connection from: " + player);
    if (!players.includes(player)) {
      players.push(player);
      playersConnLookup[player] = conn;
      idPlayerLookup[currId] = player;
      updatePlayers();
    }
  }
};

const gameLobbyStart = (args: string[], conn: connection, currId: number) => {
  if (args[0] == "GAME_LOBBY" && args[1] == "START") {
    console.log("Received start from");
    startGame();
  }
};

const updatePlayers = () => {
  const playersString = players.join(" ");
  players.forEach((player) => {
    const conn = playersConnLookup[player];
    if (players.length > 0 && player == players[0]) {
      conn.sendUTF("GAME_LOBBY RECEIVE_PLAYERS_SUCCESS HOST " + playersString);
    } else {
      conn.sendUTF(
        "GAME_LOBBY RECEIVE_PLAYERS_SUCCESS NON-HOST " + playersString
      );
    }
  });
};

const startGame = () => {
  players.forEach((player) => {
    const conn = playersConnLookup[player];
    conn.sendUTF("GAME_LOBBY RECEIVE_START");
  });
  shuffleAndDistributeDisks();

  // send out disks
  sendCenterDisk(centerDisk);
  players.forEach((player) => {
    const len = playerDiskLookup[player].length;
    const disk = playerDiskLookup[player][len - 1];
    console.log("Sending " + disk?.toString() + " to player " + player);
    if (disk) {
      sendPlayerDisk(player, disk);
    }
  });
};

// Game Screen

const gameScreenFoundPair = (
  args: string[],
  conn: connection,
  currId: number
) => {
  if (args[0] == "IN_GAME" && args[1] == "SEND_PAIR") {
    const index = parseInt(args[2]);
    const player = idPlayerLookup[currId];

    // check if really a pair
    const len = playerDiskLookup[player].length;

    console.log("Player: " + player + " with: " + index);
    console.log("CenterDisk: " + centerDisk.getSymbolIds());
    console.log(
      "PlayerDisk: " + playerDiskLookup[player][len - 1].getSymbolIds()
    );
    if (
      playerDiskLookup[player][len - 1].includes(index) &&
      centerDisk.includes(index)
    ) {
      // remove topmost disk of player
      const newCenterdisk = playerDiskLookup[player].pop();
      // send disk to center
      if (newCenterdisk) {
        centerDisk = newCenterdisk;
        sendCenterDisk(centerDisk);
      } else {
        throw Error("Disk is undefined");
      }

      if (len - 1 > 0) {
        const newPlayerDisk = playerDiskLookup[player][len - 2];
        sendPlayerDisk(player, newPlayerDisk);
      } else {
        sendVictory(player);
      }

      // update percentages
      const percentage = 1 - (len - 1) / disksPerPlayer;
      sendPlayerPercentage(player, percentage);
    }
  }
};

const sendPlayerDisk = (player: string, disk: Disk) => {
  const conn = playersConnLookup[player];
  conn.sendUTF("IN_GAME RECEIVE_PLAYER_DISK " + disk.toString());
};

const sendCenterDisk = (disk: Disk) => {
  players.forEach((player) => {
    const conn = playersConnLookup[player];
    conn.sendUTF("IN_GAME RECEIVE_CENTER_DISK " + disk.toString());
  });
};

const sendPlayerPercentage = (updatedPlayer: string, percentage: number) => {
  players.forEach((player) => {
    const conn = playersConnLookup[player];
    conn.sendUTF(
      "IN_GAME RECEIVE_PLAYER_PERCENTAGE " +
        updatedPlayer +
        " " +
        percentage.toFixed(2)
    );
  });
};

const sendVictory = (player: string) => {
  const victoryString = "IN_GAME RECEIVE_VICTORY " + player;
  players.forEach((player) => {
    const conn = playersConnLookup[player];
    conn.sendUTF(victoryString);
  });
};
