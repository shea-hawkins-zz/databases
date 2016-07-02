var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      return new Promise(function(resolve, reject) {
        var queryStr = `
          SELECT message, users.name username, rooms.name roomname
          FROM messages 
            INNER JOIN users on messages.user_id = users.id
            INNER JOIN rooms on messages.room_id = rooms.id
        `;
        db.query(queryStr, function(err, results) {
          !err ? resolve(results) : reject(err);
        });
      });
    }, // a function which produces all the messages
    post: function (msgObj) { // a function which can be used to insert a message into the database
      return new Promise(function(resolve, reject) {
        var queryStr = `
          INSERT IGNORE INTO rooms (name)
          SELECT '${msgObj.roomname}';
          INSERT IGNORE INTO users (name)
          SELECT '${msgObj.username}';
          INSERT IGNORE INTO messages (message, user_id, room_id)
          SELECT '${msgObj.message}', users.id, rooms.id
          FROM users, rooms
          WHERE users.name like '${msgObj.username}'
            AND rooms.name like '${msgObj.roomname}';
        `;
        db.query(queryStr, function(err) {
          !err ? resolve() : reject(err);
        });
      });
    } 
  },
  users: {
    // Ditto as above.
    get: function () {
      return new Promise(function(resolve, reject) {
        var queryStr = `
          SELECT users.name username 
          FROM users;
        `;
        db.query(queryStr, function(err) {
          !err ? resolve() : reject(err);
        });
      });
    },
    post: function (user) {
      return new Promise(function(resolve, reject) {
        var queryStr = `
          INSERT IGNORE INTO users (name)
          SELECT '${user.username}'
        `;
        db.query(queryStr, function(err) {
          !err ? resolve() : reject(err);
        });
      });
    }
  }
};
