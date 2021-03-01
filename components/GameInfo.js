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
    const { bidIsFinal, bidRank, monkeySuit, roundNumber, round, users, lastRound } = this.props;
    console.log(JSON.stringify(round));
    console.log(lastRound.bidTeamPoints);
    console.log(lastRound.bidTeamTricks);
    return (
      <div className="col-start-2 col-end-3 row-start-8 row-end-9 md:col-start-1 md:col-end-4 md:row-start-4 md:row-end-5">
        <p>
          ROUND: {roundNumber}
          {bidIsFinal ? ` • WINNING BID: ${rankOrder[bidRank]}` : null}
          {monkeySuit ? ` • MONKEY SUIT: ${suitOrder[monkeySuit]}` : null}
          {
            bidIsFinal && !round.trickCards.length ? (
              <p>
                {users[round.bidderIndex].name || `Player ${round.bidderIndex + 1}`} wins the bid with {rankOrder[bidRank]}
              </p>
            ) : round.trickCards.length && !round.trick.length ? (
              `Player ${round.resolveTrickWinner(round.previousTrick) + 1} takes the trick`
            ) : !round.trickCards.length && !round.bidActions.length && lastRound ? (
              <p>
                {
                  users.filter((u, i) => lastRound.bidTeamWins ? [lastRound.bidderIndex, lastRound.partnerIndex].indexOf(i) !== -1 : [lastRound.bidderIndex, lastRound.partnerIndex].indexOf(i) === -1).map(u => u.name).join(' & ')
                } win with {lastRound.bidTeamWins ? lastRound.bidTeamPoints : lastRound.defendTeamPoints} points!
              </p>
            ) : null
          }
        </p>
      </div>
    );
  }
}

export default GameInfo;
