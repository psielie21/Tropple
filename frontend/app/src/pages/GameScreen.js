import React from "react";
import Disk from "../components/Disk.js";
import PlayerBoard from "../components/PlayerBoard.js";

class GameScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.players.length <= 3 ? (
          <div
            style={{
              display: "grid",
              "grid-template-rows": "0.05fr 0.1fr 0.35fr 0.05fr 0.45fr",
            }}
          >
            <h1>Und los!</h1>
            <PlayerBoard
              players={this.props.players}
              victor={this.props.victor}
              playerPercentages={this.props.playerPercentages}
            />
            {!this.props.victor && (
              <Disk
                radius={100}
                symbolIds={this.props.centerDiskIds}
                handleSymbolClick={(i) => console.log(i)}
              />
            )}
            {!this.props.victor && <div></div>}

            {!this.props.victor && (
              <Disk
                radius={150}
                symbolIds={this.props.playerDiskIds}
                handleSymbolClick={this.props.symbolClickHandler}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              "grid-template-rows": "0.05fr 0.15fr 0.33fr 0.05fr 0.422fr",
            }}
          >
            <h1>Und los!</h1>
            <PlayerBoard
              players={this.props.players}
              victor={this.props.victor}
              playerPercentages={this.props.playerPercentages}
            />
            {!this.props.victor && (
              <Disk
                radius={100}
                symbolIds={this.props.centerDiskIds}
                handleSymbolClick={(i) => console.log(i)}
              />
            )}
            {!this.props.victor && <div></div>}

            {!this.props.victor && (
              <Disk
                radius={150}
                symbolIds={this.props.playerDiskIds}
                handleSymbolClick={this.props.symbolClickHandler}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default GameScreen;
