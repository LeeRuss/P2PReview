/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Client } = require('pg');

function validateData(data) {
  if (
    typeof data.content === 'string' &&
    data.content.length >= 400 &&
    data.content.length <= 2000 &&
    typeof data.mark === 'number' &&
    typeof data.workId === 'number'
  )
    return true;
  return false;
}

function isUserCompetent(userSpecializations, work) {
  if (work.advancement === 'advanced') {
    if (userSpecializations.advanced.includes(work.department)) {
      return true;
    }
    return false;
  }

  if (work.advancement === 'intermediate') {
    if (
      userSpecializations.advanced.includes(work.department) ||
      userSpecializations.intermediate.includes(work.department)
    ) {
      return true;
    }
    return false;
  }

  if (work.advancement === 'beginner') {
    if (
      userSpecializations.advanced.includes(work.department) ||
      userSpecializations.intermediate.includes(work.department) ||
      userSpecializations.beginner.includes(work.department)
    ) {
      return true;
    }
    return false;
  }
  return false;
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
        let query = {
          text: `SELECT 
          reviews.id, reviews.content, reviews.mark, 
          users.name AS user_name, users.specializations AS user_specializations, CAST(DATE_PART('year', AGE(CURRENT_DATE, users.birth_date)) AS INT) AS user_age
           FROM p2preview.reviews reviews
           LEFT JOIN p2preview.users users
            on reviews.user_id = users.id 
            WHERE reviews.work_id = $1;`,
          values: [workID],
        };
        let result = await db.query(query);
        console.log(result);
        const reviews = result.rows;
        query = {
          text: `SELECT 
            department 
             FROM p2preview.works
              WHERE works.id = $1;`,
          values: [workID],
        };
        result = await db.query(query);
        const department = result.rows[0].department;
        reviews.forEach((record) => {
          if (record.user_specializations.advanced.includes(department)) {
            record.user_advancement = 'advanced';
          } else if (
            record.user_specializations.intermediate.includes(department)
          ) {
            record.user_advancement = 'intermediate';
          } else if (
            record.user_specializations.beginner.includes(department)
          ) {
            record.user_advancement = 'beginner';
          } else record.user_advancement = 'unknown';
          delete record.user_specializations;
        });
        return {
          statusCode: 200,
          //  Uncomment below to enable CORS requests
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify(reviews),
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
          text: 'SELECT id, specializations FROM p2preview.users WHERE uuid = $1;',
          values: [userUUID],
        };
        let result = await db.query(query);

        console.log(result);
        const id = result.rows[0].id;
        const userSpecializations = result.rows[0].specializations;
        query = {
          text: 'SELECT id FROM p2preview.reviews WHERE user_id = $1 AND work_id = $2;',
          values: [id, data.workId],
        };
        result = await db.query(query);
        if (result.rowCount > 0) {
          return {
            statusCode: 403,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
              error: 'reviewed',
              message: `Your already reviewed this work.`,
            }),
          };
        }
        query = {
          text: 'SELECT department, advancement FROM p2preview.works WHERE id = $1;',
          values: [data.workId],
        };
        result = await db.query(query);
        if (isUserCompetent(userSpecializations, result.rows[0])) {
          query = {
            text: 'INSERT INTO p2preview.reviews(content, mark, user_id, work_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [data.content, data.mark, id, data.workId],
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
            body: JSON.stringify(result.rows[0]),
          };
        } else
          return {
            statusCode: 403,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
              error: 'specializations',
              message: `Your account specializations settings indicate that you are not competent enough to review this work.`,
            }),
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
