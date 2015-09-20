// find.js
// Helps find a user by image or phone
var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var usersRef = new Firebase("https://pay-my-face.firebaseio.com/users");

/**
  POST /find
  Either send in an number, email or image to compare against
*/
router.post('/', function(req, res, next){
  var emailOrPhone = req.body.search_param;
  var imageBase = req.body.image_param;

  if (emailOrPhone !== undefined){ // Search by phone or email
    // Get all the users

    usersRef.once('value', function(data){

      var users = data.val();

      for(var user_id in users){
        var user = users[user_id]
        var userPhone = user.phone_number;
        var userEmail = user.email;

        if (userPhone === emailOrPhone || userEmail === emailOrPhone){
          user.id = user_id;
          res.send({result: user});
        }

      }
      res.send({result: false});
    })
  } else { // Image API

  }
});

module.exports = router;
