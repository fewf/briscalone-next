import Airtable from 'airtable';
Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME);

const getMinifiedRecord = (record) => {
  return record && {
    id: record.id,
    fields: record.fields,
  } || null;
};

export { table, getMinifiedRecord };
