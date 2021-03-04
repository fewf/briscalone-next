import { table, getMinifiedRecord } from './utils/airtable.js';
import auth0 from './utils/auth0';
import { getUserGame } from './getGame';
import { generateGame } from '../../game/GameEngine';

export default auth0.requireAuthentication(async (req, res) => {
  const { user } = await auth0.getSession(req);
  const { bid } = req.body;
  if (bid < 0 || bid > 9) {
    res.statusCode = 400;
    res.json({ err: `Bad bid: ${bid}` });
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
    if (round.nextAction !== 'bid') {
      res.statusCode = 400;
      res.json({ err: 'Not bid time' });
      return;
    }
    const stateChanged = brisca.pushBidAction(bid);
    if (!stateChanged) {
      res.statusCode = 400;
      res.json({ err: 'Bid not accepted' });
      return;
    }
    console.log(`player${seatIndex + 1} bid ${bid}`);
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
