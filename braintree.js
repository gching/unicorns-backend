var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'zgbd22s3hvs8wz5n',
  publicKey: '75yxqwfjgyr98nsm',
  privateKey: 'beb1e6838b2c7a96db149da04521d359'
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
    destination: 'email',
    email: 'jane@14ladders.com'
  },
  tosAccepted: true,
  masterMerchantAccountId: 'randomcompany',
}, function(err, results){
  //console.log(results.errors.errorCollections.merchantAccount.validationErrors);
  console.log(results);



});
