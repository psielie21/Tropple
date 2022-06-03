import React from "react";

class NoGame extends React.Component {
  render() {
    return (
      <div>
        <h1>Spiel erstellen</h1>
        <input type="text" placeholder="Anzahl der Spieler" />
        <button> Los geht's </button>
      </div>
    );
  }
}

export default NoGame;
