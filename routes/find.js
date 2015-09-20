// find.js
// Helps find a user by image or phone
var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var usersRef = new Firebase("https://pay-my-face.firebaseio.com/users");

function euclidean(a, b){
  // Euclidean distance between two vectors
  var d = 0;
  for (i = 0; i < a.length; i++){
    d += Math.pow(a[i] - b[i], 2)
  }
  return Math.sqrt(d)
}

/**
  POST /find
  Either send in an number, email or image to compare against
*/
router.post('/', function(req, res, next){
  var emailOrPhone = req.body.search_param;
  var imageParam = req.body.image_param || {};

  var imageBase64 = imageParam.image64;
  var imageType = imageParam.image_type;

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
    if (imageBase64 === undefined || imageType === undefined){
      res.send({result: false})
    }

    if (imageType == 'face'){ // Face

    } else { // Logo

    }


  }
});

module.exports = router;
