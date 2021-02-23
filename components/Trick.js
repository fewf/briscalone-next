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

class Trick extends Component {
  render() {
    const {
      seatIndex,
      trickFirstPlayerIndex,
      trick,
      bidderIndex,
      bidPoints
    } = this.props;
    return (
      <>
        {range(5).map(index => {
          const offset = (index + 5 - seatIndex) % 5;
          const playerCard =
            trick &&
            trick
              .filter((ba, i) => (i + trickFirstPlayerIndex) % 5 === index)
              .pop();
          return (
            <div className={[
              'col-start-6 row-start-3',
              'col-start-4 row-start-3',
              'col-start-5 row-start-2',
              'col-start-7 row-start-2',
              'col-start-9 row-start-3',
            ][index]}>
              <Card
                key={index}
                card={playerCard}/>
            </div>
          );
        })}
      </>
    );
  }
}

export default Trick;
