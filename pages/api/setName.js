import { table } from './utils/airtable.js';
import auth0 from './utils/auth0';
import { getUserGame } from './getGame';

const handler = async (req, res) => {
  const { user } = await auth0.getSession(req);
  const { name } = req.body;

  try {
    let game = await getUserGame(user.sub);

    for (let index = 1; index < 6; index++) {
      if (game.fields[`user${index}Id`] === user.sub) {
        game = (await table.update([{
          id: game.id,
          fields: {
            ...game.fields,
            [`user${index}Name`]: name,
          }
        }]))[0];
        break;
      }
    }
    res.statusCode = 200;
    res.json(game);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ msg: 'Something went wrong' });
  }
};

export default auth0.requireAuthentication(handler);
