import { table, getMinifiedRecord } from './utils/airtable.js';
import auth0 from './utils/auth0';
import { getUserGame } from './getGame';
import { generateGame } from '../../game/GameEngine';

export default auth0.requireAuthentication(async (req, res) => {
  const { user } = await auth0.getSession(req);
  const { card } = req.body;
  if (card < 0 || card > 39) {
    res.statusCode = 400;
    res.json({ err: `Bad card: ${card}` });
    return;
  }
  try {
    const game = await getUserGame(user.sub);
    const users = [game.fields.user1Id, game.fields.user2Id, game.fields.user3Id, game.fields.user4Id, game.fields.user5Id];
    const brisca = generateGame(JSON.parse(game.fields.gameJson));
    const seatIndex = users.indexOf(user.sub);
    const round = brisca.loadRound();
    if (round.playerIndex !== seatIndex) {
      res.statusCode = 400;
      res.json({ err: 'Not your turn' });
      return;
    }
    if (round.nextAction !== 'throw') {
      res.statusCode = 400;
      res.json({ err: 'Not throw time' });
      return;
    }


    const updatedRound = brisca.pushTrickCard(card);
    if (!updatedRound) {
      res.statusCode = 400;
      res.json({ err: 'Throw not accepted' });
      return;
    }
    console.log(`${seatIndex + 1} threw ${card}`)
    const updatedGame = (await table.update([{
      id: game.id,
      fields: { ...game.fields, gameJson: JSON.stringify(brisca.rounds)}
    }]))[0];
    res.statusCode = 200;
    res.json(getMinifiedRecord(updatedGame));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ err: 'Something went wrong' });
  }
});
