import { table, getMinifiedRecord } from './utils/airtable.js';
import auth0 from './utils/auth0';
import { getUserGame } from './getGame';
import { generateGame } from '../../game/GameEngine';

export default auth0.requireAuthentication(async (req, res) => {
  const { user } = await auth0.getSession(req);
  try {
    const game = await getUserGame(user.sub);
    const brisca = generateGame(JSON.parse(game.fields.gameJson));
    const round = brisca.loadRound();
    if (!round.isFinal) {
      res.statusCode = 200;
      res.json(getMinifiedRecord(game));
      return;
    }
    brisca.initializeRound();
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
