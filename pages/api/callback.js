import auth0 from './utils/auth0';
import { table } from './utils/airtable.js';
import { generateGame } from '../../game/GameEngine';

export default async function callback(req, res) {
  try {
    const user = auth0.getSession();
    const games = await table
      .select({ filterByFormula: `user1Id = '${user.sub}' | user2Id = '${user.sub}' | user3Id = '${user.sub}' | user4Id = '${user.sub}' | user5Id = '${user.sub}'` })
      .firstPage();
    if (!games.length) {
      const gameToJoin = await table
        .select({ filterByFormula: `user2Id = '' | user3Id = '' | user4Id = '' | user5Id = ''` })
        .firstPage()[0];

      if (gameToJoin) {
        for (let index = 2; index < array.length; index++) {
          if (!gameToJoin.fields[`user${index}Id`]) {
            await table.update([{
              id: gameToJoin.id,
              fields: { ...gameToJoin.fields, [`user${index}Id`]: user.sub }
            }]);
          }
          break;
        }
      } else {
        const game = generateGame();
        game.initializeRound();
        await table.create([{
          fields: {
            gameJson: JSON.parse(game),
            user1Id: user.sub
          }
        },]);
      }
    }
    await auth0.handleCallback(req, res, { redirectTo: '/' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
