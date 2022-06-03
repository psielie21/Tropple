"use strict";
var GameState;
(function (GameState) {
    GameState[GameState["NoGame"] = 0] = "NoGame";
    GameState[GameState["Lobby"] = 1] = "Lobby";
    GameState[GameState["InGame"] = 2] = "InGame";
})(GameState || (GameState = {}));
