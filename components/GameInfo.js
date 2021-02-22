import React, { Component } from "react";
import {
  TOP_TABLE_ROW_HEIGHT,
  MIDDLE_TABLE_HEIGHT,
  BOTTOM_TABLE_HEIGHT,
  ROUND_INFO_HEIGHT
} from "../constants/LAYOUT";
import { rankOrder, suitOrder } from "../constants/CARDS";

class GameInfo extends Component {
  render() {
    const { bidIsFinal, bidRank, monkeySuit, roundNumber } = this.props;
    return (
      <div className="col-start-1 col-end-4 row-start-4 row-end-5">
        <p>
          ROUND: {roundNumber}
          {bidIsFinal ? ` • WINNING BID: ${rankOrder[bidRank]}` : null}
          {monkeySuit ? ` • MONKEY SUIT: ${suitOrder[monkeySuit]}` : null}
        </p>
      </div>
    );
  }
}

export default GameInfo;
