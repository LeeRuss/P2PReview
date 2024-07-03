/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	dbEndpoint
	dbName
	dbPassword
	dbUser
	dbPort
	sendingEmail
	targetEmail
	reportsToFlagg
Amplify Params - DO NOT EDIT */
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Client } = require('pg');
const AWS = require('aws-sdk');

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const connectionParams = {
    user: process.env.dbUser,
    host: process.env.dbEndpoint,
    database: process.env.dbName,
    password: process.env.dbPassword,
    port: process.env.dbPort,
  };
  const sendingEmail = process.env.sendingEmail;
  const targetEmail = process.env.targetEmail;
  const reportsToFlagg = process.env.reportsToFlagg;
  const db = new Client(connectionParams);
  const ses = new AWS.SES({ region: process.env.REGION });
  const userUUID = event.requestContext.authorizer.claims.sub;
  try {
    await db.connect();

    switch (event.httpMethod) {
      case 'POST': {
        const data = JSON.parse(event.body);
        let query = {
          text: 'SELECT id, specializations FROM p2preview.users WHERE uuid = $1;',
          values: [userUUID],
        };
        let result = await db.query(query);
        console.log(result);
        const userId = result.rows[0].id;
        query = {
          text: 'SELECT id FROM p2preview.work_reports WHERE user_id = $1 AND work_id = $2',
          values: [userId, data.workId],
        };
        result = await db.query(query);
        if (result.rowCount > 0)
          return {
            statusCode: 403,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
              error: 'reported',
              message: `Your already reported this work.`,
            }),
          };
        query = {
          text: 'INSERT INTO p2preview.work_reports(user_id, work_id, report_type) VALUES ($1, $2, $3) RETURNING *',
          values: [userId, data.workId, data.report_type],
        };
        result = await db.query(query);

        query = {
          text: 'SELECT work_id, COUNT(id) as report_count FROM p2preview.work_reports WHERE work_id = $1 GROUP BY work_id;',
          values: [data.workId],
        };
        console.log(result);
        result = await db.query(query);
        if (result.rows[0].report_count == reportsToFlagg) {
          query = {
            text: 'UPDATE p2preview.works SET flagged = true WHERE id = $1;',
            values: [data.workId],
          };
          result = await db.query(query);
          const params = {
            Destination: {
              ToAddresses: [targetEmail],
            },
            Message: {
              Body: {
                Text: {
                  Data: `Hello, work with id: ${data.workId} have been reported multiple times.
                        System flagged it as unwelcome and it won't be showed for other users.`,
                },
              },
              Subject: {
                Data: `Multiple reports of work: ${data.workId}`,
              },
            },
            Source: sendingEmail,
          };

          result = await ses.sendEmail(params).promise();

          return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
              message: `Reported with sending email`,
            }),
          };
        } else
          return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
              message: `Reported without changing flag`,
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
      body: JSON.stringify({ message: 'Internal Server Error', error: error }),
    };
  } finally {
    await db.end();
  }
};
