var database = require('./database');
var readDocument = database.readDocument;

// Imports the express Node module.
var express = require('express');
// Creates an Express server.
var app = express();

//Imports Body Parser module.
var bodyParser = require('body-parser');
//uses body text
app.use(bodyParser.text());
//import reverseString module
//var Util = require('./util');
//var reverseString = Util.reverseString;

// You run the server from `server`, so `../client/build` is `server/../client/build`.
// '..' means "go up one directory", so this translates into `client/build`!
app.use(express.static('../client/build'));

// Defines what happens when it receives the `GET /` request
//app.get('/', function (req, res) {
  //res.send('Hello World!');
//});

// Starts the server on port 3000!
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/**
 * Get the feed data for a particular user.
 */
function getFeedData(user, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/user/4/feed');
  xhr.setRequestHeader('Authorization', 'Bearer eyJpZCI6NH0=');
  xhr.addEventListener('load', function() {
    // Call the callback with the data.
    cb(JSON.parse(xhr.responseText));
  });
  xhr.send();
}

/**
 * Get the user ID from a token. Returns -1 (an invalid ID)
 * if it fails.
 */
function getUserIdFromToken(authorizationLine) {
  try {
    // Cut off "Bearer " from the header value.
    var token = authorizationLine.slice(7);
    // Convert the base64 string to a UTF-8 string.
    var regularString = new Buffer(token, 'base64').toString('utf8');
    // Convert the UTF-8 string into a JavaScript object.
    var tokenObj = JSON.parse(regularString);
    var id = tokenObj['id'];
    // Check that id is a number.
    if (typeof id === 'number') {
      return id;
    } else {
      // Not a number. Return -1, an invalid ID.
      return -1;
    }
  } catch (e) {
    // Return an invalid ID.
    return -1;
  }
}

/**
 * Get the feed data for a particular user.
 */
app.get('/user/:userid/feed', function(req, res) {
  var userid = req.params.userid;
  var fromUser = getUserIdFromToken(req.get('Authorization'));
  // userid is a string. We need it to be a number.
  // Parameters are always strings.
  var useridNumber = parseInt(userid, 10);
  if (fromUser === useridNumber) {
    // Send response.
    res.send(getFeedData(userid));
  } else {
    // 401: Unauthorized request.
    res.status(401).end();
  }
});
