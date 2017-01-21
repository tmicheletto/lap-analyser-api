'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const responder = require('../utils/http-responder');

module.exports.handler = (event, context, callback) => {
  const params = {
    TableName: process.env.SESSIONS_TABLE_NAME,
  };

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      console.error(error); // eslint-disable-line no-console
      responder.error(callback, 500, 'Could not retrieve sessions', error);
      return;
    }
    responder.respond(callback, 200, null, data.Items);
  });
};
