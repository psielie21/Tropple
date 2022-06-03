import React from "react";
import { getLogoById } from "../logos/logo.js";

class Symbol extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Logo = getLogoById(this.props.symbolId);
    return (
      <g
        transform={`translate(${this.props.x}, 
        ${this.props.y})`}
      >
        <Logo width={this.props.size} height={this.props.size} />
        <rect
          fill="transparent"
          width={this.props.size}
          height={this.props.size}
          onClick={() => this.props.onClick(this.props.symbolId)}
        ></rect>
      </g>
    );
  }
}

export default Symbol;
