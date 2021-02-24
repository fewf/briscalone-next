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
    const { bidIsFinal, bidRank, monkeySuit, roundNumber, round } = this.props;
    return (
      <div className="col-start-2 col-end-3 row-start-6 row-end-7 md:col-start-1 md:col-end-4 md:row-start-4 md:row-end-5">
        <p>
          ROUND: {roundNumber}
          {bidIsFinal ? ` • WINNING BID: ${rankOrder[bidRank]}` : null}
          {monkeySuit ? ` • MONKEY SUIT: ${suitOrder[monkeySuit]}` : null}
          {round.trickCards.length && !round.trick.length && `Player ${round.resolveTrickWinner(round.previousTrick) + 1} takes the trick`}
        </p>
      </div>
    );
  }
}

export default GameInfo;
