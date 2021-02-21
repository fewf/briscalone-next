import { table, getMinifiedRecord, minifyRecords } from './utils/airtable.js';
import auth0 from './utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
    const { user } = await auth0.getSession(req);
    console.log(user);
    try {
        const records = await table
            .select({ filterByFormula: `user1Id = '${user.sub}' | user2Id = '${user.sub}' | user3Id = '${user.sub}' | user4Id = '${user.sub}' | user5Id = '${user.sub}'` })
            .firstPage();
        const formattedRecords = minifyRecords(records);
        res.statusCode = 200;
        res.json(formattedRecords);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.json({ msg: 'Something went wrong' });
    }
});
