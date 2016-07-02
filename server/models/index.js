var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      return new Promise(function(resolve, reject) {
        var queryStr = `
          SELECT message text, users.name username, rooms.name roomname
          FROM messages 
            INNER JOIN users on messages.user_id = users.id 
            INNER JOIN rooms on messages.room_id = rooms.id
          ORDER BY messages.ID
        `;                                                                                          //could we have used id instead of users/rooms.id?
        db.query(queryStr, function(err, results) {
          !err ? resolve(results) : reject(err);
        });
      });
    }, // a function which produces all the mess u.rages
    post: function (msgObj) { // a function which can be used to insert a message into the database
      return new Promise(function(resolve, reject) {
        var queryStr = `
          INSERT IGNORE INTO rooms (name)
          SELECT ${db.escape(msgObj.roomname)};
          INSERT IGNORE INTO users (name)
          SELECT ${db.escape(msgObj.username)};
          INSERT IGNORE INTO messages (message, user_id, room_id)
          SELECT ${db.escape(msgObj.text)}, users.id, rooms.id
          FROM users, rooms
          WHERE users.name like ${db.escape(msgObj.username)}
            AND rooms.name like ${db.escape(msgObj.roomname)};
        `;
        console.log(queryStr);
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
        db.query(queryStr, function(err, results) {
          !err ? resolve(results) : reject(err);
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
