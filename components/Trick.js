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
      <div className="col-start-1 col-end-3 row-start-2 row-end-4 md:col-start-4 md:col-end-10 md:row-start-2 md:row-end-4">
        {/* {range(5).map(index => {
          const offset = (index + 5 - seatIndex) % 5;
          const playerCard =
            trick &&
            trick
              .filter((ba, i) => (i + trickFirstPlayerIndex) % 5 === index)
              .pop();
          return (
            <div
              key={index}
              className={[
                'md:col-start-6 md:row-start-3',
                'md:col-start-5 md:row-start-3',
                'md:col-start-5 md:row-start-2',
                'md:col-start-7 md:row-start-2',
                'md:col-start-7 md:row-start-3',
              ][offset]
            }>
              <Card
                card={playerCard}
                width={85}
                cardStyle={{
                  transform: [
                    null,
                    'rotate(65deg)',
                    'rotate(-25deg)',
                    'rotate(25deg)',
                    'rotate(-65deg)',
                  ][offset]
                }}
              />
            </div>
          );
        })} */}
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
                transform: `translate(${100 * 9/23},50) rotate(${72 * index - 134}, 100, 100) rotate(-215,${100 * 9/23},50)`
              }}
            />
          );})}
        </svg>
      </div>
    );
  }
}

export default Trick;
