import React, { Component, useState } from "react";
import sortBy from "lodash/sortBy";
import flatten from "lodash/flatten";
import random from "lodash/random";
import Card from "./Card";
import { rankOrder, suitOrder } from "../constants/CARDS";
import { getPoints, getRank, getSuit } from "../game/cardUtils";

const Player = props => {
  const {
    round,
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
      ][offset]} ${
        [3,4].indexOf(offset) !== -1 ? 'text-right md:text-left' : ''
      } p-2`}>
        <div className={`${isCurrentPlayer ? "rounded-lg border-2 border-green-800 p-2" :''}`}>
          {
            isSeatedPlayer ? (
              <NameForm playerName={playerName} setNameOnRecord={setNameOnRecord} />
            ) : <p>{playerName}</p>
          }
        </div>
        <p>
          {handIndex === bidderIndex ? (
            <span style={{ fontWeight: "bold" }}> • {bidIsFinal ? "bid winner" : "highest bid"}</span>
          ) : null}
        </p>
        <div>
          {
            !round.isFinal
            ? playerTricks.map((_, index) => <TakenTrick key={index} />)
            : <>
                <p>Points taken: {playerPointsTaken}</p>
                {flatten(playerTricks).filter(card => getPoints(card)).map(card => <Card
                  key={card}
                  style={{ width: "12%"}}
                  card={card}
                  className="handCard inline-block"/>
                )}
              </>
          }
        </div>
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
        !bidIsFinal && ["number", "string"].indexOf(typeof playerLastBid) !== -1 && (
          <div className={`p-8 ${[
            'col-start-1 col-end-3 row-start-4 row-end-5 md:col-start-6 md:col-end-8 md:row-start-3 md:row-end-4',
            'col-start-1 col-end-2 row-start-3 row-end-4 md:col-start-4 md:col-end-6 md:row-start-3 md:row-end-4',
            'col-start-1 col-end-2 row-start-2 row-end-3 md:col-start-5 md:col-end-7 md:row-start-2 md:row-end-3',
            'col-start-2 col-end-3 row-start-2 row-end-3 md:col-start-7 md:col-end-9 md:row-start-2 md:row-end-3',
            'col-start-2 col-end-3 row-start-3 row-end-4 md:col-start-8 md:col-end-10 md:row-start-3 md:row-end-4',
          ][offset]}`}>
            <p className={`${isSeatedPlayer && 'w-1/2 mx-auto'} rounded-lg border-2 border-black p-2`}>

              {isSeatedPlayer ? "You say" : `${playerName} says`} "{playerLastBid === undefined
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

const TakenTrick = () => {
  const [ rotate1 ] = useState(random(0, 360));
  const [ rotate2 ] = useState(random(0, 360));
  const [ rotate3 ] = useState(random(0, 360));
  const [ rotate4 ] = useState(random(0, 360));
  const [ rotate5 ] = useState(random(0, 360));
  return (
    <svg className="inline-block mr-2" style={{height: 30, width: 30}}  viewBox="-25 -25 125 125"
          xmlns="http://www.w3.org/2000/svg">
      <image href="https://www.random.org/playing-cards/b1fv.png" {...{
        height: "100",
        width: `${100 * 18/23}`,
        transform: `rotate(${rotate1},${100 * 9/23},50)`}}
      />
      <image href="https://www.random.org/playing-cards/b1fv.png" {...{
        height: "100",
        width: `${100 * 18/23}`,
        transform: `rotate(${rotate2},${100 * 9/23},50)`}}
      />
      <image href="https://www.random.org/playing-cards/b1fv.png" {...{
        height: "100",
        width: `${100 * 18/23}`,
        transform: `rotate(${rotate3},${100 * 9/23},50)`}}
      />
      <image href="https://www.random.org/playing-cards/b1fv.png" {...{
        height: "100",
        width: `${100 * 18/23}`,
        transform: `rotate(${rotate4},${100 * 9/23},50)`}}
      />
      <image href="https://www.random.org/playing-cards/b1fv.png" {...{
        height: "100",
        width: `${100 * 18/23}`,
        transform: `rotate(${rotate5},${100 * 9/23},50)`}}
      />
    </svg>
  );
}

const NameForm = ({playerName, setNameOnRecord}) => {
  const [name, setName] = useState(playerName);
  return (
    <form onSubmit={e => {e.preventDefault(); setNameOnRecord(name)}}>
      <input className="w-full" type="text" value={name} onChange={e => setName(e.target.value)} />
    </form>
  );
};

export default Player;
