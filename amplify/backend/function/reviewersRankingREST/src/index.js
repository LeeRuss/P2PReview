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

  try {
    await db.connect();

    if (event.httpMethod === 'GET') {
      const department = event.pathParameters.department;
      const query = {
        text: `SELECT users.id, users.name, users.surname, COUNT(reviews.id) AS reviews_count
        FROM p2preview.users
        LEFT JOIN p2preview.reviews ON p2preview.users.id = p2preview.reviews.user_id
        LEFT JOIN p2preview.works ON p2preview.reviews.work_id= p2preview.works.id
        WHERE
	    EXISTS (
	        SELECT 1
	        FROM json_array_elements_text(specializations->'beginner')
	        WHERE value = $1
	    )
	    OR EXISTS (
	        SELECT 1
	        FROM json_array_elements_text(specializations->'intermediate')
	        WHERE value = $1
	    )
	    OR EXISTS (
	        SELECT 1
	        FROM json_array_elements_text(specializations->'advanced')
	        WHERE value = $1
	    )
        AND works.department = $1
        GROUP BY users.id ORDER BY reviews_count DESC;`,
        values: [department],
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
        body: JSON.stringify(result.rows),
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
