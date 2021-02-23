import { table, getMinifiedRecord } from './utils/airtable.js';
import auth0 from './utils/auth0';

export async function getUserGame(userId) {
  return getMinifiedRecord((await table
    .select({ filterByFormula: `OR(user1Id = '${userId}',user2Id = '${userId}',user3Id = '${userId}',user4Id = '${userId}',user5Id = '${userId}')` })
    .firstPage())[0]);
}

export default auth0.requireAuthentication(async (req, res) => {
  const { user } = await auth0.getSession(req);
  try {
    const game = await getUserGame(user.sub);
    res.statusCode = 200;
    res.json(game);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ msg: 'Something went wrong' });
  }
});
