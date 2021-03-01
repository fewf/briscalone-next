import { getMinifiedRecord, table } from './api/utils/airtable';
import { useEffect, useContext } from 'react';
import range from 'lodash/range';
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
  const { game, setGame, playCard, playBid, playMonkey, setName } = useContext(GameContext);
  useEffect(() => {
    // let interval;
    // if (window) {
    //   interval = setInterval(async () => {
    //     setGame(await (await fetch('/api/getGame')).json());
    //   }, 5000);
    // }
    setGame(initialGame);
    // return () => clearInterval(interval);
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
  const users = range(5).map(n => game.fields[`user${n+1}Id`] && ({
    id: game.fields[`user${n+1}Id`],
    name: game.fields[`user${n+1}Name`] || game.fields[`user${n+1}AuthName`],
  }))

  console.log(users)
  if (users.filter(x => !x).length) {
    return (
      <div style={{ position: "relative" }}>
        <h1>Hi {user.name || user.sub}, we're waiting for more players</h1>
      </div>
    );
  }
  const brisca = generateGame(JSON.parse(game.fields.gameJson));
  const seatIndex = users.findIndex(u => u.id === user.sub);
  const round = brisca.loadRound();
  return (
    <div className="grid grid-cols-2 grid-rows-9 md:grid-cols-12 md:grid-rows-6 h-screen">
      <>
        {round.playerHands &&
          round.playerHands.map((playerHand, handIndex) => (
            <Player
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
        {round.bidIsFinal &&
          <Trick
            bidderIndex={round.bidderIndex}
            bidPoints={round.bidPoints}
            trick={!round.trickCards.length || round.trick.length ? round.trick : round.previousTrick}
            trickFirstPlayerIndex={round.trickFirstPlayerIndex}
            seatIndex={seatIndex}
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
        lastRound={brisca.rounds.length > 1 && brisca.loadRound(brisca.rounds[brisca.rounds.length - 2])}
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
              fields: {
                ...gameToJoin.fields,
                [`user${index}Id`]: session.user.sub,
                [`user${index}AuthName`]: session.user.name,
                [`user${index}Name`]: session.user.name || `Player ${index}}`,
              }
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
            user1Id: session.user.sub,
            user1AuthName: session.user.name,
            user1Name: session.user.name || 'Player 1',
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
