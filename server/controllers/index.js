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
      //post message info to db:
      console.log(req.body);
      models.messages.post(req.body)
        .then(function() {
          res.end();
        })
        .catch(function(err) {
          res.status(500).send(JSON.parse(err));
        });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get()
        .then(function(results) {
          res.send({results: results});
        });
    },
    post: function (req, res) {
      models.users.post(req.body)
        .then(function() {
          res.end();
        })
        .catch(function(err) {
          res.status(500).send(JSON.parse(err));
        }); 
    }
  }
};

