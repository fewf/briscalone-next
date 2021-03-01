import { createContext, useEffect, useState } from 'react';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [game, setGame] = useState(false);

  const playBid = async (bid) => {
    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        body: JSON.stringify({ bid }),
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedGame = await res.json();
      if (updatedGame.err) return;
      setGame(updatedGame);
    } catch (err) {
      console.error(err);
    }
  };

  const playMonkey = async (monkey) => {
    try {
      const res = await fetch('/api/monkey', {
        method: 'POST',
        body: JSON.stringify({ monkey }),
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedGame = await res.json();
      if (updatedGame.err) return;
      setGame(updatedGame);
    } catch (err) {
      console.error(err);
    }
  };

  const playCard = async (card) => {
    try {
      const res = await fetch('/api/throw', {
        method: 'POST',
        body: JSON.stringify({ card }),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('hullo')
      const updatedGame = await res.json();
      if (updatedGame.err) return;
      setGame(updatedGame);
    } catch (err) {
      console.error(err);
    }
  };

  const setName = async (name) => {
    try {
      const res = await fetch('/api/setName', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedGame = await res.json();
      if (updatedGame.err) return;
      setGame(updatedGame);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        playBid,
        playMonkey,
        playCard,
        setName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameProvider, GameContext };
