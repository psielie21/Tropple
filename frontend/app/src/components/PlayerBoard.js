import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ReactComponent as Crown } from "../assets/1F451.svg";

class PlayerBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPlayers(players, percentages) {
    return players.map((player, index) => (
      <li key={index} style={{ display: "inline-block" }}>
        <h4>
          {player} {this.props.victor == player && <Crown height="3rem" />}{" "}
        </h4>

        <ProgressBar
          animated
          variant={`${this.computeVariant(percentages[player])}`}
          now={percentages[player] * 100}
          style={{ margin: "5px" }}
        />
      </li>
    ));
  }

  computeVariant(percentage) {
    if (percentage <= 0.5) {
      return "success";
    } else if (percentage <= 0.8) {
      return "warning";
    } else {
      return "danger";
    }
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        {this.props.players.length <= 3 ? (
          <ul
            style={{
              listStyle: "none",
              display: "grid",
              "grid-template-columns": "0.3fr 0.3fr 0.3fr",
            }}
          >
            {this.renderPlayers(
              this.props.players,
              this.props.playerPercentages
            )}
          </ul>
        ) : (
          <ul
            style={{
              listStyle: "none",
              display: "grid",
              "grid-template-columns": "0.3fr 0.3fr 0.3fr",
              "grid-template-rows": "0.5fr 0.5fr",
            }}
          >
            {this.renderPlayers(
              this.props.players,
              this.props.playerPercentages
            )}
          </ul>
        )}
      </div>
    );
  }
}

export default PlayerBoard;
