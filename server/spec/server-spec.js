/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'chat',
  multipleStatements: true
    });
    dbConnection.connect();

    var tablename = 'messages'; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    console.log('test');
    new Promise(function(resolve, reject) {
      console.log('1');
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: { username: 'Valjean' }
      }, function(err, res) {
        err ? reject() : resolve();
      });
    }).then(function() {
      console.log('2');
      return new Promise(function(resolve, reject) {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/messages',
          json: {
            username: 'Valjean',
            text: 'In mercy\'s name, three days is all I need.',
            roomname: 'Hello'
          }
        }, function(err, res) {
          console.log('err');
          err ? reject() : resolve();
        });
      });
    }).then(function() {
      console.log('3');
      var queryString = 'SELECT message text FROM messages';
      console.log(queryString);
      var queryArgs = [];
      return new Promise(function(resolve, reject) {
        dbConnection.query(queryString, queryArgs, function(err, results) { 
          err ? reject(err) : resolve(results);
        });
      }); 
    }).then(function(results) {
      console.log('4');
      // Should have one result:
      expect(results.length).to.equal(1);
      // TODO: If you don't have a column named text, change this test.
      expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');
      done();
    }).catch(function(err) {
      console.log('err', err);
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    var tablename = 'messages'; // TODO: fill this out
    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */
    var queryString = `
          INSERT IGNORE INTO rooms (name)
          SELECT 'main';
          INSERT IGNORE INTO users (name)
          SELECT 'me';
          INSERT IGNORE INTO messages (message, user_id, room_id)
          SELECT 'Men like you can never change!', users.id, rooms.id
          FROM users, rooms
          WHERE users.name like 'me'
            AND rooms.name like 'main';
    `;
    var queryArgs = [];

    dbConnection.query(queryString, queryArgs, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body).results;
        expect(messageLog[0].text).to.equal('Men like you can never change!');
        expect(messageLog[0].roomname).to.equal('main');
        done();
      });
    });
  });
});
