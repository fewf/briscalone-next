import React, { Component, useState } from "react";
import sortBy from "lodash/sortBy";
import Card from "./Card";
import { rankOrder, suitOrder } from "../constants/CARDS";
import { getRank, getSuit } from "../game/cardUtils";

const Player = props => {
  const {
    bidActions,
    bidderIndex,
    bidIsFinal,
    bidPoints,
    bidRank,
    handIndex,
    nextAction,
    playerHand,
    playerIndex,
    playerTricks,
    playerPointsTaken,
    playBid,
    playMonkey,
    playCard,
    roundFirstPlayerIndex,
    setName: setNameOnRecord,
    seatIndex,
    users
  } = props;
  const isCurrentPlayer = playerIndex === handIndex;
  const isSeatedPlayer = seatIndex === handIndex;
  const offset = (handIndex + 5 - seatIndex) % 5;
  const isTopPlayer = offset === 2 || offset === 3;
  const isMiddlePlayer = !isTopPlayer && !isSeatedPlayer;
  const playerName = users[handIndex].name || `Player ${handIndex + 1}`;
  const [name, setName] = useState(playerName);
  const [selectedCard, setSelectedCard] = useState(null);

  const playerLastBid = bidActions
    .filter((ba, i) => (i + roundFirstPlayerIndex) % 5 === handIndex)
    .pop();
  return (
    <>
      <div className={`${[
        'col-start-1 col-end-2 row-start-8 row-end-9 md:col-start-4 md:col-end-7 md:row-start-4 md:row-end-7',
        'col-start-1 col-end-2 row-start-6 row-end-7 md:col-start-1 md:col-end-4 md:row-start-3 md:row-end-4',
        'col-start-1 col-end-2 row-start-1 row-end-2 md:col-start-4 md:col-end-7 md:row-start-1 md:row-end-2',
        'col-start-2 col-end-3 row-start-1 row-end-2 md:col-start-7 md:col-end-10 md:row-start-1 md:row-end-2',
        'col-start-2 col-end-3 row-start-6 row-end-7 md:col-start-10 md:col-end-13 md:row-start-3 md:row-end-4',
      ][offset]} ${[3,4].indexOf(offset) !== -1 && 'text-right md:text-left'}`}>
        {
          isSeatedPlayer ? (
            <form onSubmit={e => {e.preventDefault(); setNameOnRecord(name)}}>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </form>
          ) : <p>{name}</p>
        }
        <p>
          {handIndex === bidderIndex ? (
            <span style={{ fontWeight: "bold" }}> • {bidIsFinal ? "bid winner" : "highest bid"}</span>
          ) : null}
        </p>
        <p>
          TRICKS: {playerTricks.length} • POINTS: {playerPointsTaken}
        </p>
      </div>
      {isSeatedPlayer ? (
        <div className="col-start-1 col-end-3 row-start-7 row-end-8  md:col-start-7 md:col-end-13 md:row-start-4 md:row-end-7">
          <div>
            {sortBy(playerHand, [getSuit, getRank]).map(card => (
              <Card
                key={card}
                style={{ width: "12%"}}
                cardStyle={{border: card === selectedCard ? "3px solid green" : null }}
                card={card}
                className="handCard inline-block"
                onClick={isCurrentPlayer && (() => card === selectedCard ? playCard(card) : setSelectedCard(card)) || undefined}
              />
            ))}
          </div>

          {!isSeatedPlayer || !isCurrentPlayer ? null : !bidIsFinal ? (
            <div>
              <button
                className="btn btn-blue"
                style={{ margin: 10, fontSize: 24 }}
                onClick={() => playBid('P')}
              >
                Pass
              </button>
              {bidRank === 0 ? (
                <button
                  className="btn btn-blue"
                  style={{ margin: 10, fontSize: 24 }}
                  onClick={() => playBid('Y')}
                >
                  2 and {bidPoints + 2} points
                </button>
              ) : (
                rankOrder
                  .filter((x, i) => i < bidRank)
                  .map((rank, i) => (
                    <button
                      className="btn btn-blue"
                      style={{ margin: 10, fontSize: 24 }}
                      key={i}
                      disabled={false}
                      onClick={() => playBid(i)}
                    >
                      {rank}
                    </button>
                  ))
              )}
            </div>
          ) : nextAction === "monkey" ? (
            suitOrder.map((suit, i) => (
              <button
                className="btn btn-blue mx-4"
                key={i}
                style={{
                  color: i % 2 ? "black" : "red",
                  fontSize: 30
                }}
                onClick={() => playMonkey(i)}
              >
                {suit}
              </button>
            ))
          ) : null}
        </div>
      ) : null}
      {
        !bidIsFinal && playerLastBid && (
          <div className={`p-8 ${[
            'col-start-1 col-end-3 row-start-4 row-end-5 md:col-start-6 md:col-end-8 md:row-start-3 md:row-end-4',
            'col-start-1 col-end-2 row-start-3 row-end-4 md:col-start-4 md:col-end-6 md:row-start-3 md:row-end-4',
            'col-start-1 col-end-2 row-start-2 row-end-3 md:col-start-5 md:col-end-7 md:row-start-2 md:row-end-3',
            'col-start-2 col-end-3 row-start-2 row-end-3 md:col-start-7 md:col-end-9 md:row-start-2 md:row-end-3',
            'col-start-2 col-end-3 row-start-3 row-end-4 md:col-start-8 md:col-end-10 md:row-start-3 md:row-end-4',
          ][offset]}`}>
            <p className={`${isSeatedPlayer && 'w-1/2 mx-auto'} rounded-lg border-2 border-black p-2`}>

              {isSeatedPlayer ? "You say" : `${name} says`} "{playerLastBid === undefined
                ? null
                : playerLastBid === "P"
                ? "I pass"
                : playerLastBid === "Y"
                ? `I bid 2 and ${bidPoints} points.`
                : `I bid ${rankOrder[playerLastBid]}`}"
            </p>
          </div>
        )
      }
    </>
  );
}

export default Player;
