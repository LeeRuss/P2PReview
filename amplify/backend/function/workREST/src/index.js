/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Client } = require('pg');

function validateLinksArray(array) {
  if (array.length > 5) return false;
  return array.every((element) => {
    try {
      new URL(element.link);
      return typeof element.description === 'string' ? true : false;
    } catch (error) {
      return false;
    }
  });
}

function validateData(data) {
  if (
    typeof data.title !== 'string' &&
    data.title.length > 150 &&
    data.title.length === 0
  )
    return false;
  if (
    typeof data.short_description !== 'string' &&
    data.short_description.length > 500 &&
    data.short_description.length < 200
  )
    return false;
  if (
    typeof data.description !== 'string' &&
    data.description.length > 1500 &&
    data.description.length < 600
  )
    return false;
  if (
    typeof data.department !== 'string' &&
    data.department.length > 100 &&
    data.department.length === 0
  )
    return false;
  if (
    data.advancement !== 'beginner' &&
    data.advancement !== 'intermediate' &&
    data.advancement !== 'advanced'
  )
    return false;
  if (
    typeof data.expected !== 'string' &&
    data.expected.length > 1500 &&
    data.expected.length < 50
  )
    return false;
  return validateLinksArray(data.links);
}

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const connectionParams = {
    user: process.env.dbUser,
    host: process.env.dbEndpoint,
    database: process.env.dbName,
    password: process.env.dbPassword,
    port: process.env.dbPort,
  };
  const db = new Client(connectionParams);
  const userUUID = event.requestContext.authorizer.claims.sub;

  try {
    await db.connect();

    switch (event.httpMethod) {
      case 'GET': {
        const workID = event.queryStringParameters.workId;
        const query = {
          text: `SELECT works.id, works.title, works.short_description, works.description, works.department, works.advancement, works.links,  work.end_date,  work.expected, users.uuid AS user_uuid FROM p2preview.works works
          LEFT JOIN p2preview.users users
           on works.user_id = users.id  WHERE works.id = $1;`,
          values: [workID],
        };
        const result = await db.query(query);
        console.log(result);
        const work = result.rows[0];
        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify(work),
        };
      }
      case 'POST': {
        const data = JSON.parse(event.body);

        if (!validateData(data)) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({ message: 'Invalid data.' }),
          };
        }

        let query = {
          text: 'SELECT id FROM p2preview.users WHERE uuid = $1;',
          values: [userUUID],
        };
        let result = await db.query(query);
        console.log(result);
        const id = result.rows[0].id;
        query = {
          text: 'INSERT INTO p2preview.works(title, short_description, description, department, advancement, user_id, links, expected, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;',
          values: [
            data.title,
            data.short_description,
            data.description,
            data.department,
            data.advancement,
            id,
            JSON.stringify(data.links),
            data.expected,
            data.end_date,
          ],
        };
        result = await db.query(query);
        console.log(result);

        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify(result.rows[0].id),
        };
      }
    }
  } catch (error) {
    console.error('Error fetching records', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    await db.end();
  }
};
