/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var messages = [];
// var jquery = require('../client/bower_components/jquery/jquery.min.js');
// var underscore = require('../client/bower_components/underscore/underscore-min.js');
// var backbone = require('../client/bower_components/backbone/backbone-min.js');
// var config = require('../client/scripts/config.js');
// var app = require('../client/scripts/app.js');
// var index = require('../client/index.html');
// var css = require('../client/styles/styles.css');
var fs = require('fs');

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  // this.message = "";
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;

  if (request.method === "GET" || request.method === "OPTIONS" ) {
    statusCode = 200;
  } else if (request.method === "POST") {
    statusCode = 201;
  }
  if (request.url.indexOf('classes') === -1 && request.url !== "/") {
    statusCode = 404;
  }

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  // var that = this;
  request.on('data', function(data){
    if (data) {
      console.log('messages:',messages);
      console.log('data:',"" + data);
      messages.push(JSON.parse("" + data));
    }
  });

  if (statusCode === 200){
    if (request.url === "/") {
     fs.readFile('client/index.html', function(err, content) {
        headers['Content-Type'] = "text/html";
        response.writeHead(200, headers);
        response.write(content);
        response.end();
     });
    } else {
      response.end(JSON.stringify(messages));
    }
  } else if (statusCode === 201) {
    response.end("Success!");
  } else {
    response.end("Error: Not found");
  }
};

var defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "Access-Control-Max-Age": 10 // Seconds.
};


exports.handleRequest = handleRequest;