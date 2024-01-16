/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Client } = require('pg');

function isArrayOfStrings(array) {
  return array.every((element) => typeof element === 'string');
}

function validateSpecializations(specialization) {
  return (
    specialization.beginner &&
    Array.isArray(specialization.beginner) &&
    isArrayOfStrings(specialization.beginner) &&
    specialization.intermediate &&
    Array.isArray(specialization.intermediate) &&
    isArrayOfStrings(specialization.intermediate) &&
    specialization.advanced &&
    Array.isArray(specialization.advanced) &&
    isArrayOfStrings(specialization.advanced)
  );
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
        const query = {
          text: 'SELECT specializations FROM p2preview.users WHERE uuid = $1;',
          values: [userUUID],
        };
        const result = await db.query(query);
        console.log(result);

        const specializations = result.rows[0];

        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify(specializations),
        };
      }
      case 'PUT': {
        const specializations = JSON.parse(event.body);
        if (!validateSpecializations(specializations)) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({ message: 'Invalid data in the request' }),
          };
        }

        const query = {
          text: 'UPDATE p2preview.users SET specializations = $1 WHERE uuid = $2;',
          values: [specializations, userUUID],
        };
        const result = await db.query(query);
        console.log(result);

        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify(specializations),
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
