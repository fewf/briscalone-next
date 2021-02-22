import React, { Component } from "react";
import { getSuit } from "../game/cardUtils";
const cardGlyphs = [
  "🃂",
  "🃃",
  "🃄",
  "🃅",
  "🃆",
  "🃋",
  "🃍",
  "🃎",
  "🃊",
  "🃁",
  "🂢",
  "🂣",
  "🂤",
  "🂥",
  "🂦",
  "🂫",
  "🂭",
  "🂮",
  "🂪",
  "🂡",
  "🂲",
  "🂳",
  "🂴",
  "🂵",
  "🂶",
  "🂻",
  "🂽",
  "🂾",
  "🂺",
  "🂱",
  "🃒",
  "🃓",
  "🃔",
  "🃕",
  "🃖",
  "🃛",
  "🃝",
  "🃞",
  "🃚",
  "🃑"
];

const num2Card = num => [
  ["2", "3", "4", "5", "6", "jack", "queen", "king", "10", "ace"][num % 10],
  ["diamonds", "spades", "hearts", "clubs"][getSuit(num)]
];
const card2fileName = num => `https://www.random.org/playing-cards/${
  ([12, 11, 10, 9, 8, 3, 2, 1, 4, 0][num % 10] * 4) + ([3, 1, 2, 0][getSuit(num)]) + 1
}.png`
  // `${card[0]}_of_${card[1]}${
  //   ["jack", "queen", "king"].indexOf(card[0]) !== -1 ? "2" : ""
  // }.svg`;

class Card extends React.Component {
  render() {
    const { card, style, onClick, className } = this.props;
    if (isNaN(card)) return null;
    return (
      <span className={className} onClick={onClick} style={{ color: getSuit(card) % 2 ? 'black' : 'red' }}>
        {/* {cardGlyphs[card]} */}
        <img

          width="80"
          style={style}
          src={card2fileName(card)}
          alt={num2Card(card).join(" of ")}
        />
      </span>
    );
  }
}

export default Card;
