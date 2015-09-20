// transactions.js
// Handles everything with transactions in terms of history, paying someone,


var express = require('express');
var router = express.Router();
var braintree = require('braintree');
var Firebase = require('firebase');
var usersRef = new Firebase("https://pay-my-face.firebaseio.com/users");



var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'zgbd22s3hvs8wz5n',
  publicKey: '75yxqwfjgyr98nsm',
  privateKey: 'beb1e6838b2c7a96db149da04521d359'
});





/**
  GET /transactions
*/
router.get('/', function(req, res, next){
  var stream = gateway.transaction.search(function (search) {
  }, function (err, response) {
    res.send({transactions: response.ids});
  })
});

/**
  POST /transactions
*/
router.post('/', function(req, res, next){
  var amountToPay = req.body.amount || '10.00';
  var senderUserId = req.body.sender_id;
  var receiverUserId = req.body.receiver_id;
  if (senderUserId === undefined || receiverUserId === undefined){
    next("Error: need sender and receiver user ids");
  }

  // Get the sender and receiver data.
  usersRef.child(senderUserId).once('value', function(data){
    if (data === null) {
      next('Error: user with id ' + senderUserId + ' does not exist');
    }
    var senderData = data.val();
    usersRef.child(receiverUserId).once('value', function(data){
      if (data === null) {
        next('Error: user with id ' + receiverUserId + ' does not exist');
      }
      var receiverData = data.val();
      gateway.transaction.sale({
        amount: amountToPay,
        merchantAccountId: receiverData.merchant_id,
        serviceFeeAmount: '1.00',
        creditCard: {
          number: '4111111111111111',
          expirationDate: '05/19'
        },
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
        if (err) next(err);

        if (result.success) {

          // Successful transaction, save results in Firebase
          var saveTransaction = {
            amount: amountToPay,
            sender_id: senderUserId,
            receiver_id: receiverUserId
          };
          // Saves the transaction in the sender and receiver
          // Saves it in trans/sent or trans/received
          usersRef.child(senderUserId)
            .child('trans').child('sent').child(result.transaction.id)
            .set(saveTransaction);

            usersRef.child(receiverUserId)
              .child('trans').child('received').child(result.transaction.id)
              .set(saveTransaction);

          res.send({transaction: saveTransaction});
        } else {
          res.send(result);
        }
      });

    })
  })
});

/**
  [GET] /transactions/:user_id
*/
router.get('/:user_id', function(req, res, next){
  var userId = req.params.user_id;
  usersRef.child(userId).child('trans').on('value', function(response){
    res.send({transactions:response.val()});
  });
});

module.exports = router;
