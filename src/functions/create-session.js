'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const uuid = require('uuid/v4');
const responder = require('../utils/http-responder');

module.exports.handler = (event, context, callback) => {
  const now = new Date().toISOString();
  const body = JSON.parse(event.body);
  const sessionId = uuid();

  const s3Params = {
    Bucket: process.env.SESSIONS_BUCKET_NAME,
    Key: sessionId + ".json",
    ContentType: 'application/json',
    Body: JSON.stringify(body.geoData)
  };
  return s3.upload(s3Params).promise().then((s3Data) => {
      const ddbParams = {
        TableName: process.env.SESSIONS_TABLE_NAME,
        Item: {
          id: sessionId,
          createdAt: now,
          title: body.title,
          date: body.date,
          track: body.track
        }
      };
      return dynamoDb.put(ddbParams).promise().then((ddbData) => {
        responder.respond(callback, 200, null, ddbData.Item);
      })
    })
    .catch((error) => {
      responder.error(callback, 500, 'Could not create session', error);
    });
};
