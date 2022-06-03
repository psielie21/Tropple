import React from "react";

class GameLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      enteredName: false,
    };
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  renderNameInput() {
    return (
      <div>
        <input
          type="text"
          placeholder="Name eingeben"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button
          onClick={() => {
            this.setState({ enteredName: true });
            this.props.connectHandler(this.state.name);
          }}
        >
          {" "}
          Das bin ich{" "}
        </button>
      </div>
    );
  }

  renderPlayers() {
    return this.props.players.map((player) => <li key={player}> {player} </li>);
  }

  render() {
    return (
      <div>
        <h1>Lobby</h1>
        {this.props.players.length > 0
          ? this.renderPlayers()
          : this.renderNameInput()}
        {this.props.firstPlayer && (
          <button
            onClick={() => {
              this.props.startHandler();
            }}
          >
            {" "}
            Starten{" "}
          </button>
        )}
      </div>
    );
  }
}

export default GameLobby;
