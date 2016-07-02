var db = require('../db');

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function (msgObj) { // a function which can be used to insert a message into the database
      console.log('msg', msgObj);
      var queryStr = `
        INSERT INTO rooms (name)
        SELECT '${msgObj.roomname}';
        INSERT INTO users (name)
        SELECT '${msgObj.username}';
        INSERT INTO messages (message, user_id, room_id)
        SELECT '${msgObj.message}', users.id, rooms.id
        FROM users, rooms
        WHERE users.name like '${msgObj.username}'
          AND rooms.name like '${msgObj.roomname}';
      `;
      db.query(queryStr, function(err) {
        if (err) {
          throw err;
        } else {
          console.log('message inserted: ', msgObj.message);
        }
      });
    } 
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

module.exports.messages.post({
  username: 'shea',
  roomname: 'maine',
  message: 'hi, im from Montana'
});
