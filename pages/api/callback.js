import auth0 from './utils/auth0';
import { table } from './utils/airtable.js';
import { generateGame } from '../../game/GameEngine';

export default async function callback(req, res) {
  try {
    await auth0.handleCallback(req, res, { redirectTo: '/' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
