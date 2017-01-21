'use strict'

let currentEnv = '';

if (typeof process.env.STAGE !== "undefined") {
  currentEnv = process.env.STAGE;
} else {
  currentEnv = "dev";
}

const getEnv = () => {
  console.log('getEnv called: ', currentEnv);
  return currentEnv;
}

const defaultHeaders = () => {
  return {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*' // Required for CORS support to work
  }
};

const buildResponse = (statusCode, headers, body) => {
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  return {
    statusCode: statusCode,
    headers: Object.assign(defaultHeaders(), headers),
    body: body
  }
};

const buildError = (statusCode, message, details) => {
  const body = {
    error: {
      message: message
    }
  }

  if (currentEnv == 'dev') {
    body.error.details = details;
  }

  return buildResponse(statusCode, null, body);
};

const respond = (callback, statusCode, headers, body) => {
  if (currentEnv == 'dev') {
    console.log('DEBUG: calling responseUtils.respond function with', statusCode, headers, body);
  }
  callback(null, buildResponse(statusCode, headers, body));
};

const error = (callback, statusCode, message, details) => {
  if (currentEnv = 'dev') {
    console.log('DEBUG: calling responseUtils.error function with', statusCode, message, details);
  }
  callback(buildError(statusCode, message, details));
};

module.exports = {
  respond: respond,
  error: error,
  getEnv: getEnv
}
