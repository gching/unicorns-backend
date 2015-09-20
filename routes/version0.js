// version0.js
// Routes defined here for version 0.

var express = require('express')
var router = express.Router()

var users = require('./users');
var transactions = require('./transactions');
var find = require('./find');

// Define routes
router.get('/', function(req, res, next){
  res.send({
    'routes': [
      '/users', '/transactions', '/find'
    ]
  })
});


// User routing
router.use('/users', users);
// Transaction routing
router.use('/transactions', transactions);
// Finding routing
router.use('/find', find)

module.exports = router;
