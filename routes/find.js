// find.js
// Helps find a user by image or phone
var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var usersRef = new Firebase("https://pay-my-face.firebaseio.com/users");
var helper = require('./helper');


function euclidean(a, b){
  // Euclidean distance between two vectors
  var d = 0;
  for (i = 0; i < a.length; i++){
    d += Math.pow(a[i] - b[i], 2)
  }
  return Math.sqrt(d)
}


// Go through all the users
function getLowestScore(users, feature){
  // Keep track of the scores of users
  var userScores = {};

  for(var user_id in users){
    var user = users[user_id];
    var userImageResult = [];
    var images = user.images;

    // Go through all images
    console.log(' user stuff blah')
    console.log(user);
    for (var image_id in images){
      console.log('for loop in images')
      var image = images[image_id];

      // Compare only if same type
      if (feature.image_type !== image.image_type){
        continue;
      }

      // Same type, so perform comparison.
      console.log(feature.image_calc)
      console.log(image.image_calc)
      userImageResult.push(euclidean(feature.image_calc, image.image_calc));
    }
    // Done, calculate the average and store it in user scores.
    console.log(userImageResult)
    if (userImageResult.length !== 0 ){
      var total = 0.0;
      for (var i = 0; i < userImageResult.length; i++){
        total += userImageResult[i];
      }

      userScores[user_id] = total / userImageResult.length;
    }

  }

  console.log(userScores);
  // Go through the scores and find the lowest
  var lowest_user = null;
  var lowest_score = null;
  for (var user_id in userScores){
    var score = userScores[user_id];
    if (lowest_user === null){
      lowest_user = user_id;
      lowest_score = score
    } else {
      if (score < lowest_score){
        lowest_user = user_id;
        lowest_score = score;
      }
    }

  }
  return {user: users[lowest_user], score: lowest_score};
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
        var user = users[user_id];
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
    usersRef.once('value', function(data){
      var users = data.val();
      var userResults = null;

      if ( imageType === 'face'){
        helper.uploadFace(imageBase64, function(err, faceFeature){
          if (err){
            console.log(err);
          }
          console.log('uploadFace - ')
          console.log(faceFeature)
          var results = getLowestScore(users, faceFeature);
          res.send({result: results})

        })
      } else { // Logo
        helper.uploadLogo(imageBase64, function(err, logoFeature){
          var results = getLowestScore(users, logoFeature)
          res.send({result: results})

        })
      }



    })


  }
});

module.exports = router;
