import { table, getMinifiedRecord } from './utils/airtable.js';
import auth0 from './utils/auth0';
import { getUserGame } from './getGame';
import { generateGame } from '../../game/GameEngine';

export default auth0.requireAuthentication(async (req, res) => {
  const { user } = await auth0.getSession(req);
  const monkey = Number(req.body.monkey);
  if (!monkey) {
    res.statusCode = 400;
    res.json({ err: 'No monkey sent' });
    return;
  }
  if (monkey < 0 || monkey > 3) {
    console.log(monkey)
    res.statusCode = 400;
    res.json({ err: 'Bad monkey' });
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
    if (round.nextAction !== 'monkey') {
      res.statusCode = 400;
      res.json({ err: 'Not monkey time' });
      return;
    }
    brisca.setSuit(monkey);
    console.log(`player${seatIndex + 1} called ${monkey} monkey`);
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
