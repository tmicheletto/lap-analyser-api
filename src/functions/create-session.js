'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const uuid = require('uuid');
const responder = require('../utils/http-responder');

module.exports.handler = (event, context, callback) => {
    const now = new Date().toISOString();
    const data = {
        id: uuid.v1(),
        createdAt: now,
        updatedAt: now,
        title: event.body.title,
        date: event.body.date,
        track: event.body.track
    };

    const params = {
        TableName: process.env.SESSIONS_TABLE_NAME,
        Item: data
    };

    var param = {
        Bucket: process.env.SESSIONS_BUCKET_NAME,
        Key: data.id + ".json",
        ContentType: 'application/json',
        Body: JSON.stringify(event.body.geoData)
    };

    s3.upload(param, function(err, data) {
        if (err) {
            responder.error(callback, 500, 'Could not upload session to S3 bucket', err);
            return;
        }

        return dynamoDb.put(params, (error, data) => {
            if (error) {
                responder.error(callback, 500, 'Could not create session in dynamodb', error);
            }
            responder.respond(callback, 200, null, data.Item);
        });
    });
};
