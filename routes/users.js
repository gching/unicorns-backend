// users.js
// Handles everything with users.
var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var braintree = require('braintree');
var helper = require('./helper');





var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'zgbd22s3hvs8wz5n',
  publicKey: '75yxqwfjgyr98nsm',
  privateKey: 'beb1e6838b2c7a96db149da04521d359'
});



// Setup gatway with sandbox.
// Use Firebase
var generalRef = new Firebase("https://pay-my-face.firebaseio.com/");
var usersRef = new Firebase("https://pay-my-face.firebaseio.com/users");


/**
  GET /users
  Returns a list of users
*/
router.get('/', function(req, res, next){
  usersRef.once('value', function(data){
    res.send({ users: data.val() });
  })
});

/**
  POST /users
  Creates a new user.
  Parameters: {
    first_name:
    last_name:
    email:
    pictures:
    password:
    phone_number:
    credit_card_number:
    credit_card_expiry_date:
  }
*/
router.post('/', function(req, res, next){
  generalRef.createUser({
    email    : req.body.email,
    password : req.body.password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
      next(error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      // Setup the data for the saved user
      var actualUserData = {
        uid: userData.uid,
        email: req.body.email,
        first_name: req.body.first_name || null,
        last_name: req.body.last_name || null,
        phone_number: req.body.phone_number || null,
        credit_card_number: req.body.credit_card_number || null,
        credit_card_expiry_date: req.body.credit_card_expiry_date || null
      };
      // Create submerchant on brainTree
      gateway.merchantAccount.create({
        individual: {
          firstName: actualUserData.first_name || 'Alexis',
          lastName: actualUserData.last_name || 'Ohanian',
          email: actualUserData.email,
          phone: actualUserData.phone_number || '6479212199',
          dateOfBirth: '1981-11-19',
          address: {
            streetAddress: '111 Main St',
            locality: 'Chicago',
            region: 'IL',
            postalCode: '60622'
          }
        },
        funding: {
          destination: 'email',
          email: actualUserData.email
        },
        tosAccepted: true,
        masterMerchantAccountId: 'randomcompany',
      }, function(err, results){

        // Save the submerchant id
        actualUserData.merchant_id = results.merchantAccount.id;

        // We also have to create a users on Firebase itself.
        var newUsersRef = usersRef.push(actualUserData);

        // Store the name
        actualUserData.id = newUsersRef.name();

        // Send back.
        res.send({ user: actualUserData});


      });


    }
  });
});

/**
  GET /users/:id
*/
router.get('/:id', function(req, res, next){
  usersRef.child(req.params.id).once('value', function(data){

    var user = data.val();
    user.id = data.key();

    res.send({ user: user });
  })
});

/**
  GET /users/:id/images
*/
router.get('/:id/images', function(req, res, next){
  usersRef.child(req.params.id).child('images').once('value', function(data){
    if (data.val() === null){
      res.send({images: {}});
    } else {
      res.send({ images: data.val() });
    }
  })
});

/**
  POST /users/:id/images
*/
router.post('/:id/images', function(req, res, next){
  var baseImage = req.body.image_string;
  var imageType = req.body.image_type;


  if (imageType == 'face'){ // Face
    helper.uploadFace(baseImage, function(err, faceResults){
      if (err){
        next(err);
      }
      var faceResRef = usersRef.child(req.params.id).child('images')
        .push(faceResults);

      // Get the new id into it
      faceResults.id = faceResRef.name();

      res.send({images: [faceResults]});
    });
  } else { // Type

    helper.uploadLogo(baseImage, function(err, logoResults){
      var logoTypeRef = usersRef.child(req.params.id).child('images')
        .push(logoResults);

      logoResults.id = logoTypeRef.name();
      res.send({images: [logoResults]});
    })

  }

});

module.exports = router
