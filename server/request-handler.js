/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var messages = [];
var fs = require('fs');

var headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "Access-Control-Max-Age": 10,
  'Content-Type': "text/plain"
};

var writeResponse = function (response, obj, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(obj));
};

var sendMessage = function (request, response) {
  writeResponse(response, messages);
};

var saveMessages = function (request, response) {
  collectData(request, response, function (data) {
    messages.push(data);
  });
  writeResponse(response, 'Yeah, got it! Thanks for the message!');
};

var sendBackStatusCode = function (request, response) {
  writeResponse(response, "Come on in!");
};

var collectData = function (request, response, cb) {
  var data = '';
  request.on('data', function(chunk){
    if (chunk) {
      console.log('messages:',messages);
      data += chunk;
      console.log('chunk:', data);
    }
  });
  request.on('end', function () {
    cb(JSON.parse(data));
  });
};

var actionRouter = {
  "GET": sendMessage,
  "POST": saveMessages,
  "OPTIONS": sendBackStatusCode
};

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  if (actionRouter[request.method] === undefined){
    response.writeHead(404, headers);
    response.end(null);
  } else {
    actionRouter[request.method](request, response);
  }
};

exports.handleRequest = handleRequest;