var models = require('../models');
var express = require('express');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get()
        .then(function(results) {
          res.send({results: results});
        });


    }, // a function which handles a get request for all messages
    post: function (req, res) { // a function which handles posting a message to the database
      //grab stream of buffer data and compose
      console.log(req.body);
      //post message info to db:
      models.messages.post(req.body)
        .then(function() {} )
        .catch(function(err) {
          res.status(500).send(JSON.parse(err));
        });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

