/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var messages = [];
// var $ = require('../client/bower_components/jquery/jquery.min.js');
// var _ = require('../client/bower_components/underscore/underscore-min.js');
// var Backbone = require('../client/bower_components/backbone/backbone-min.js');
// var config = require('../client/scripts/config.js');
// var index = require('../client/index.html');
// var css = require('../client/styles/styles.css');
var fs = require('fs');
//var app = require('../client/scripts/app.js');

var handleRequest = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var statusCode;

  if (request.method === "GET" || request.method === "OPTIONS" ) {
    statusCode = 200;
  } else if (request.method === "POST") {
    statusCode = 201;
  }
  // if (request.url !== "/" || request.url.indexOf('classes') === -1) {
  //   statusCode = 404;
  // }

  response.writeHead(statusCode, headers);

  request.on('data', function(data){
    if (data) {
      console.log('messages:',messages);
      console.log('data:',"" + data);
      messages.push(JSON.parse("" + data));
    }
  });
  if (statusCode === 200) {
    if (request.url === "/classes/messages") {
      response.end(JSON.stringify(messages));
    } else {
      sendDataProcess(request.url, headers, response);
    }
  } else if (statusCode === 201) {
    response.end("Success!");
  } else {
    response.end("Error: Not found");
  }
};

var sendDataProcess = function(requestURL, headers, response) {
  if (requestURL === "/") {
    requestURL = "/index.html";
  }
  fs.readFile('client' + requestURL, function(err, content) {
    headers['Content-Type'] = "text/html";
    response.writeHead(200, headers);
    response.write(content);
    response.end();
  });
};

var defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "Access-Control-Max-Age": 10 // Seconds.
};


exports.handleRequest = handleRequest;