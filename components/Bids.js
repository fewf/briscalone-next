import React, { Component } from "react";
import { rankOrder } from "../constants/CARDS";
import range from "lodash/range";
import {
  TABLE_TOP_OFFSETS,
  TABLE_BOTTOM_OFFSETS,
  TABLE_LEFT_OFFSETS,
  TABLE_RIGHT_OFFSETS,
  TABLE_ROTATE_OFFSETS
} from "../constants/LAYOUT";

class Bids extends Component {
  render() {
    const {
      bidActions,
      seatIndex,
      roundFirstPlayerIndex,
      bidderIndex,
      bidPoints
    } = this.props;
    return (
      <svg style={{height: "100%"}} className="mx-auto"
        xmlns="http://www.w3.org/2000/svg">
        {range(5).map(index => {
          const offset = (index + 5 - seatIndex) % 5;
          const playerLastBid = bidActions
            .filter((ba, i) => (i + roundFirstPlayerIndex) % 5 === index)
            .pop();
          return (

            <g key={index} {...{
              height: "100",
              width: `${100 * 18/23}`,
              transform: `translate(${100 * 9/23},50) rotate(${72 * offset - 134}, 100, 100) rotate(-215,${100 * 9/23},50)`
            }}>
              <text y="100">
                {playerLastBid === undefined
                ? null
                : playerLastBid === "P"
                ? "I pass"
                : playerLastBid === "Y"
                ? `I bid 2 and ${bidPoints} points.`
                : `I bid ${rankOrder[playerLastBid]}`}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
}

export default Bids;
