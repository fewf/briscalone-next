import React, { Component } from "react";
import Card from "./Card";
import range from "lodash/range";
import {
  TABLE_TOP_OFFSETS,
  TABLE_BOTTOM_OFFSETS,
  TABLE_LEFT_OFFSETS,
  TABLE_RIGHT_OFFSETS,
  TABLE_ROTATE_OFFSETS
} from "../constants/LAYOUT";
import startRound from "../pages/api/startRound";

class Trick extends Component {
  render() {
    const {
      seatIndex,
      round,
      startRound,
    } = this.props;

    const [trick, trickFirstPlayerIndex] = round.trick.length ? [
        round.trick, round.trickFirstPlayerIndex
      ] : [
        round.previousTrick,
        round.playerHandsDealt.findIndex(hand => hand.indexOf(round.previousTrick[0]) !== -1)
      ];
    return (

      <div onClick={() => startRound()} className="col-start-1 col-end-3 row-start-2 row-end-5 md:col-start-4 md:col-end-10 md:row-start-2 md:row-end-4">
        <svg style={{height: "100%"}} className="mx-auto"
          xmlns="http://www.w3.org/2000/svg">

        {range(5).map(index => {
          const offset = (index + 5 - seatIndex) % 5;
          const playerCard =
            trick &&
            trick
              .filter((ba, i) => (i + trickFirstPlayerIndex) % 5 === index)
              .pop();
          return (
            <Card
              card={playerCard}
                svgAttrs={{
                  height: "100",
                  width: `${100 * 18/23}`,
                  transform: `translate(${100 * 9/23},50) rotate(${72 * offset - 134}, 100, 100) rotate(-215,${100 * 9/23},50)`
              }}
            />
          );})}
        </svg>
      </div>
    );
  }
}

export default Trick;
