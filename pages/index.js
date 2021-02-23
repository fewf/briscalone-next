import { getMinifiedRecord, table } from './api/utils/airtable';
import { useEffect, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import auth0 from './api/utils/auth0';
import { generateGame } from '../game/GameEngine';
import Table from "../components/Table";
import Bids from "../components/Bids";
import Trick from "../components/Trick";
import Player from "../components/Player";
import Score from "../components/Score";
import GameInfo from "../components/GameInfo";
// import { getUserGame } from './api/getGame';
// import useInterval from '@use-it/interval';

export default function Home({ initialGame, user }) {
  const { game, setGame, playCard, playBid, playMonkey } = useContext(GameContext);
  useEffect(() => {
    let interval;
    if (window) {
      interval = setInterval(async () => {
        setGame(await (await fetch('/api/getGame')).json());
      }, 30000);
    }
    setGame(initialGame);
    return () => clearInterval(interval);
  }, []);


  if (!user) {
    return (
      <div className="flex">
        {user ? (
          <a
            href="/api/logout"
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
          >
            Logout
          </a>
        ) : (
          <a
            href="/api/login"
            className="rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
          >
            Login
          </a>
        )}
      </div>
    );
  }
  if (!game) {
    return null;
  }
  console.log(game);
  const users = [game.fields.user1Id, game.fields.user2Id, game.fields.user3Id, game.fields.user4Id, game.fields.user5Id];
  console.log(users)
  if (users.filter(x => !x).length) {
    return (
      <div style={{ position: "relative" }}>
        <h1>Hi {user.sub}, we're waiting for more players</h1>
      </div>
    );
  }
  const brisca = generateGame(JSON.parse(game.fields.gameJson));
  const seatIndex = users.indexOf(user.sub);
  const round = brisca.loadRound();
  return (
    <div className="grid grid-cols-12 grid-rows-6 h-screen">
      <>
        {round.playerHands &&
          round.playerHands.map((playerHand, handIndex) => (
            <Player
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
            />
          ))}
      </>
      <Table seatIndex={seatIndex} bidderIndex={round.bidderIndex}>
        {round.bidIsFinal ? (
          <Trick
            bidderIndex={round.bidderIndex}
            bidPoints={round.bidPoints}
            trick={round.trick}
            trickFirstPlayerIndex={round.trickFirstPlayerIndex}
            seatIndex={seatIndex}
          />
        ) : (
          <Bids
            bidActions={round.bidActions}
            bidderIndex={round.bidderIndex}
            bidPoints={round.bidPoints}
            roundFirstPlayerIndex={round.roundFirstPlayerIndex}
            seatIndex={seatIndex}
          />
        )}
      </Table>
      <GameInfo
        bidIsFinal={round.bidIsFinal}
        bidRank={round.bidRank}
        monkeySuit={round.monkeySuit}
        roundNumber={brisca.rounds.length}
      />
      <Score
        gameScore={brisca.gameScore}
        roundScores={brisca.roundScores}
        users={users}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);

  let game = null;
  if (session?.user) {
    game = (await table
      .select({ filterByFormula: `OR(user1Id = '${session.user.sub}',user2Id = '${session.user.sub}',user3Id = '${session.user.sub}',user4Id = '${session.user.sub}',user5Id = '${session.user.sub}')` })
      .firstPage())[0];

    if (!game) {
      const gameToJoin = (await table
        .select({ filterByFormula: `OR(NOT(user1Id),NOT(user2Id),NOT(user3Id),NOT(user4Id),NOT(user5Id))` })
        .firstPage())[0];
      if (gameToJoin) {
        for (let index = 1; index < 6; index++) {
          if (!gameToJoin.fields[`user${index}Id`]) {
            game = (await table.update([{
              id: gameToJoin.id,
              fields: { ...gameToJoin.fields, [`user${index}Id`]: session.user.sub }
            }]))[0];
            break;
          }
        }
      } else {
        const brisca = generateGame();
        brisca.initializeRound();
        game = await table.create([{
          fields: {
            gameJson: JSON.stringify(brisca.rounds),
            user1Id: session.user.sub
          }
        },])[0];
      }
    }
  }
  return {
    props: {
      initialGame: (game && getMinifiedRecord(game)) || null,
      user: session?.user || null,
    },
  };
}
