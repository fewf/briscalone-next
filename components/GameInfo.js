import React, { Component } from "react";
import { rankOrder, suitOrder } from "../constants/CARDS";

class GameInfo extends Component {
  render() {
    const { bidIsFinal, bidRank, monkeySuit, roundNumber, round, users } = this.props;
    return (
      <div className="col-start-2 col-end-3 row-start-8 row-end-9 md:col-start-1 md:col-end-4 md:row-start-4 md:row-end-5">
        <p>
          {bidIsFinal ? `WINNING BID: ${rankOrder[bidRank]}` : null}
          {typeof monkeySuit === "number" ? <> • MONKEY SUIT: <span style={{fontSize: '2rem', color: ['red', 'black'][monkeySuit % 2]}}>{suitOrder[monkeySuit]}</span></> : null}
        </p>
        {
          bidIsFinal && !round.trickCards.length ? (
            <p>
              {users[round.bidderIndex].name || `Player ${round.bidderIndex + 1}`} wins the bid with {rankOrder[bidRank]}
            </p>
          ) : round.trickCards.length && !round.trick.length ? (
            <p>
              {users[round.resolveTrickWinner(round.previousTrick)].name || `Player ${round.resolveTrickWinner(round.previousTrick) + 1}`} takes the trick
            </p>
          ) : null
        }{
          round.isFinal ? (
            <p>
              {
                users.filter((u, i) => round.bidTeamWins ? [round.bidderIndex, round.partnerIndex].indexOf(i) !== -1 : [round.bidderIndex, round.partnerIndex].indexOf(i) === -1).map(u => u.name).join(' & ')
              } win with {round.bidTeamWins ? round.bidTeamPoints : round.defendTeamPoints} points!
            </p>
          ) : null
        }
      </div>
    );
  }
}

export default GameInfo;
