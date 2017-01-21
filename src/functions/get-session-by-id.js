'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const responder = require('../utils/http-responder');

module.exports.handler = (event, context, callback) => {
  const ddbParams = {
    TableName: process.env.SESSIONS_TABLE_NAME,
    Key: {
      id: event.pathParameters.id
    }
  };

  return dynamoDb.get(ddbParams).promise()
    .then((ddbData) => {
      const s3Params = {
        Bucket: process.env.SESSIONS_BUCKET_NAME,
        Key: ddbData.Item.id + ".json"
      }
      return s3.getObject(s3Params).promise().then((s3Data) => {
        const resource = ddBdata.Item;
        resource.geoData = s3Data;
        return resource;
      });
    })
    .then((data) => {
      responder.respond(callback, 200, null, resource);
    })
    .catch((error) => {
      responder.error(callback, 500, `Could not get session ${event.pathParameters.id}`, error);
    });
};
