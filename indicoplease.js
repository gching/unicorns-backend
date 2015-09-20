var indico = require('indico.io');
indico.apiKey =  'ad294a5bead684b29ab27f40bbabbb02';
var fs = require('fs');
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'gavinching',
  api_key: '647891574133533',
  api_secret: 'IurlRqzcOHItdfndsh_ZtiUzg00'
});

var base64 = require('node-base64-image');

var filename = "test.png";

fs.readFile(filename, function(err, data) {
  var base64data = new Buffer(data).toString('base64');
  //base64data = 'data:image/png;base64,' + base64data;

  console.log(base64data);
  indico.facialLocalization(base64data)
  .then(function(res) {
    console.log(res);
  }).catch(function(err) {
    console.warn(err);
  });
/**
  cloudinary.uploader.upload(base64data, function(res){
    console.log('hi')
    console.log(res);
  })
*/
});

/*
var url = cloudinary.url('vxrvwpkc28dyscfwdjph',{width: 58, x: 30, y: 40, crop: "crop"});
console.log('hi there')
console.log(url)

base64.base64encoder(url, undefined, function (err, image) {
    if (err) { console.log(err); }
    console.log('safsafjflkjfkjfklajfsa')
    //console.log(image.toString('base64'));
    var fakeUpload = 'data:image/png;base64,' + image.toString('base64');

    cloudinary.uploader.upload(fakeUpload, function(res){
      console.log('hi')
      console.log(res);
    })


});
*/
