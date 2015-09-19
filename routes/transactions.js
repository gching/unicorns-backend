// transactions.js
// Handles everything with transactions in terms of history, paying someone,


var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next){
  res.send({
    hi: 'tehere'
  })
});

module.exports = router
