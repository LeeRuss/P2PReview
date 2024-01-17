/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Client } = require('pg');

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

    if (event.httpMethod === 'GET') {
      let query = {
        text: 'SELECT id, specializations FROM p2preview.users WHERE uuid = $1;',
        values: [userUUID],
      };
      let result = await db.query(query);
      console.log(result);
      const id = result.rows[0].id;
      const specializations = result.rows[0].specializations;
      if (
        specializations.beginner.length != 0 ||
        specializations.intermediate.length != 0 ||
        specializations.advanced.length != 0
      ) {
        query = {
          text: `SELECT  works.id, works.title, works.short_description, works.department, works.advancement 
                FROM    p2preview.works works
                            LEFT JOIN p2preview.users users
                                on works.user_id = users.id
                            LEFT JOIN p2preview.reviews reviews
                                on works.user_id = reviews.work_id
                WHERE   works.user_id != $1 OR (reviews.user_id !=  $1 AND reviews.work_id = works.id);`,
          values: [id],
        };
        result = await db.query(query);
        console.log(result);
        result = result.rows;
        result = result.filter((record) => {
          if (record.advancement === 'advanced') {
            if (specializations.advanced.includes(record.department)) {
              record.score = 15;
              return true;
            }
            return false;
          }

          if (record.advancement === 'intermediate') {
            if (
              specializations.advanced.includes(record.department) ||
              specializations.intermediate.includes(record.department)
            ) {
              record.score = 10;
              return true;
            }
            return false;
          }

          if (record.advancement === 'beginner') {
            if (
              specializations.advanced.includes(record.department) ||
              specializations.intermediate.includes(record.department) ||
              specializations.beginner.includes(record.department)
            ) {
              record.score = 5;
              return true;
            }
            return false;
          }
        });
        result.sort((a, b) => a.score - b.score);
        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify(result),
        };
      } else
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({
            error: 'specializations',
            message: `Your account don't have specializations settings set. Change your settings.`,
          }),
        };
    } else
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
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
