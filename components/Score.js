import React, { Component } from "react";
import range from "lodash/range";
import {
  TOP_TABLE_ROW_HEIGHT,
  MIDDLE_TABLE_HEIGHT,
  BOTTOM_TABLE_HEIGHT,
  ROUND_INFO_HEIGHT,
  GAME_SCORES_HEIGHT
} from "../constants/LAYOUT";

class Score extends Component {
  render() {
    const { gameScore, roundScores, users } = this.props;
    const divStyle = { display: "inline-block", minWidth: "20%" };
    return (
      <div className="col-start-1 col-end-4 row-start-5 row-end-7">
        {range(5).map(index => (
          <div key={index} style={divStyle}>
            P{index + 1}
          </div>
        ))}
        <div>
          {gameScore.map((total, i) => (
            <div key={i} style={{ fontWeight: "bold", ...divStyle }}>
              {total}
            </div>
          ))}
        </div>
        {roundScores.map((scores, i) => (
          <div key={i}>
            {scores.map((score, j) => (
              <div key={j} style={divStyle}>
                {score}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Score;
