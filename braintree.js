var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'cx4fcmcdnjxk6k8m',
  publicKey: '5jggjrvh24jth45n',
  privateKey: '2d12417b4a738713af464ed689f6b484'
});

gateway.merchantAccount.create(

);
