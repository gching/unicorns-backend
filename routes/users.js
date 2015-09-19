// users.js
// Handles everything with users.
var express = require('express');
var router = express.Router();
var Firebase = require('firebase');

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
    name:
    email:
    pictures:
    password:
    phone_number:
    credit_card_number:
    credit_card_expiry_date:
    credit_card_cvc:
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
      // We also have to create a users on Firebase itself.
      var actualUserData = {
        uid: userData.uid,
        email: req.body.email,
        name: req.body.name || null,
        phone_number: req.body.phone_number || null,
        credit_card_number: req.body.credit_card_number || null,
        credit_card_expiry_date: req.body.credit_card_expiry_date || null,
        credit_card_cvc: req.body.credit_card_cvc || null
      };
      usersRef.push(actualUserData);
      res.send({ user: actualUserData});
    }
  });
});

/**
  GET /users/:id
*/
router.get('/:id', function(req, res, next){
  usersRef.child(req.params.id).once('value', function(data){
    //if (data === null){}
    res.send({ user: data.val() });
  })
});


module.exports = router
