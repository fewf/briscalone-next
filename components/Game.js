import React from 'react';
import Table from "../components/Table";
import Trick from "../components/Trick";
import Player from "../components/Player";
import Score from "../components/Score";
import GameInfo from "../components/GameInfo";

export default function Game({ users, brisca, seatIndex, round, setGame, playCard, playBid, playMonkey, setName, startRound, refreshGame }) {
  return (
    <div className="grid grid-cols-2 grid-rows-9 md:grid-cols-12 md:grid-rows-6 h-screen">
      <>
        {round.playerHands &&
          round.playerHands.map((playerHand, handIndex) => (
            <Player
              key={handIndex}
              round={round}
              roundFirstPlayerIndex={round.roundFirstPlayerIndex}
              bidActions={round.bidActions}
              bidderIndex={round.bidderIndex}
              bidIsFinal={round.bidIsFinal}
              bidPoints={round.bidPoints}
              bidRank={round.bidRank}
              handIndex={handIndex}
              nextAction={round.nextAction}
              playerHand={playerHand}
              playerIndex={round.playerIndex}
              playerTricks={round.playerTricks(handIndex)}
              playerPointsTaken={round.playerPointsTaken(handIndex)}
              seatIndex={seatIndex}
              users={users}
              playBid={playBid}
              playMonkey={playMonkey}
              playCard={playCard}
              setName={setName}
            />
          ))}
      </>
      <Table seatIndex={seatIndex} bidderIndex={round.bidderIndex}>
        {!!round.trickCards.length &&
          <Trick
            round={round}
            seatIndex={seatIndex}
            startRound={startRound}
          />
        }
      </Table>
      <GameInfo
        bidIsFinal={round.bidIsFinal}
        bidRank={round.bidRank}
        monkeySuit={round.monkeySuit}
        roundNumber={brisca.rounds.length}
        round={round}
        users={users}
      />
      <Score
        gameScore={brisca.gameScore}
        roundScores={brisca.roundScores}
        users={users}
      />
    </div>
  );
}
