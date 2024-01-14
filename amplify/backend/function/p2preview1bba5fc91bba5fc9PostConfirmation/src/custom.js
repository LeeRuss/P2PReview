/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Client } = require('pg');

exports.handler = async (event, context) => {
  const connectionParams = {
    user: process.env.dbUser,
    host: process.env.dbEndpoint,
    database: process.env.dbName,
    password: process.env.dbPassword,
    port: process.env.dbPort,
  };
  const db = new Client(connectionParams);
  const query = {
    text: 'INSERT INTO p2preview.users(uuid, name, surname, birth_date, specializations) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    values: [
      event.request.userAttributes.sub,
      event.request.userAttributes.given_name,
      event.request.userAttributes.family_name,
      event.request.userAttributes.birthdate,
      { beginner: [], intermediate: [], advanced: [] },
    ],
  };

  try {
    await db.connect();
    const result = await db.query(query);
    console.log(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await db.end();
  }
  return event;
};
