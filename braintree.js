var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'cx4fcmcdnjxk6k8m',
  publicKey: '5jggjrvh24jth45n',
  privateKey: '2d12417b4a738713af464ed689f6b484'
});

gateway.merchantAccount.create({
  individual: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@14ladders.com',
    phone: '5553334444',
    dateOfBirth: '1981-11-19',
    address: {
      streetAddress: '111 Main St',
      locality: 'Chicago',
      region: 'IL',
      postalCode: '60622'
    }
  },
  funding: {
    destination: 'email'
  },
  tosAccepted: true,
  masterMerchantAccountId: 'derpina',
}, function(err, results){
  console.log(err);
  console.log(results);
});
