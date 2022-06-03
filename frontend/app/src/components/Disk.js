import React from "react";
import Symbol from "./Symbol.js";

class Disk extends React.Component {
  constructor(props) {
    super(props);
    this.logoSize = 0.5 * this.props.radius;
  }

  renderLogos() {
    return this.props.symbolIds.map((symbolId, index) => (
      <Symbol
        key={index}
        symbolId={symbolId}
        onClick={this.props.handleSymbolClick}
        size={`${this.logoSize}px`}
        x={this.getXCoordinate(index, 4)}
        y={this.getYCoordinate(index, 4)}
      />
    ));
  }

  getXCoordinate(k, n) {
    return (
      (this.props.radius / 1.5) * Math.cos((k * Math.PI) / n) +
      (this.props.radius - this.logoSize / 2)
    );
  }

  getYCoordinate(k, n) {
    return (
      (this.props.radius / 1.5) * Math.sin((k * Math.PI) / n) +
      (this.props.radius - this.logoSize / 2)
    );
  }

  render() {
    return (
      <div>
        <svg width={2 * this.props.radius} height={2 * this.props.radius}>
          <circle
            cx={this.props.radius}
            cy={this.props.radius}
            r={this.props.radius}
            fill="pink"
          />
          {this.renderLogos(this.props.symbolIds)}
        </svg>
      </div>
    );
  }
}

export default Disk;
