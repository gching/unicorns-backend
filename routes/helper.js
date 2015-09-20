// helper.js
// Shares many methods.
var indico = require('indico.io');
indico.apiKey =  'ad294a5bead684b29ab27f40bbabbb02';
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'gavinching',
  api_key: '647891574133533',
  api_secret: 'IurlRqzcOHItdfndsh_ZtiUzg00'
});
var base64 = require('node-base64-image');


/**
  Helps with uploading a Face and returning its facial features.
*/
function uploadFace(baseImage, callback){

  // Upload to cloudinary to do cropping.
  var uriImage = 'data:image/png;base64,' + baseImage;
  cloudinary.uploader.upload(uriImage, function(cloudinary_res){
    var imageId = cloudinary_res.public_id;

    // Image uploaded, now do a crop by using indico API
    indico.facialLocalization(baseImage)
    .then(function(facialLocRes) {

      if (facialLocRes.length === 0){
        indico.facialFeatures(baseImage)
        .then(function(faceFeatRes){
          // Got facial features, save it in firebase
          var faceRes = {
            image_type: 'face',
            image_calc: faceFeatRes
          }
          callback(null, faceRes)

        })
        .catch(function(err){
          callback(err)
        })
      } else {
        // Coords to crop and then store to images.
        var coords = facialLocRes[0];
        var topLeft = coords.top_left_corner;
        var bottomRight = coords.bottom_right_corner;

        var x = topLeft[0];
        var y = topLeft[1];
        var width = bottomRight[0] - x;
        var height = bottomRight[1] - y;


        // Get the buffer from the cloudinary url alongside the proper cropping
        var cloudUrl = cloudinary.url(imageId,
          {width: width, height: height, x: x, y: y, crop: "crop"});

        base64.base64encoder(cloudUrl, undefined, function (err, image) {
            if (err) { callback(err); }
            var imageBase64Cropped = image.toString('base64');
            // ACTUALLY  call indico to get facial features
            // then finally save it
            indico.facialFeatures(imageBase64Cropped)
            .then(function(faceFeatRes){
              // Got facial features, save it in firebase
              var faceRes = {
                image_type: 'face',
                image_calc: faceFeatRes,
                cropped_image: cloudUrl+'.jpg'
              }

              callback(null, faceRes)

            })
            .catch(function(err){
              callback(err)
            })
        });


      }


    })
    .catch(function(err){
      callback(err);
    });

  });

};


/**
  Helps with uploading a picture thats logo
*/
function uploadLogo(baseImage, callback){
  indico.imageFeatures(baseImage)
  .then(function(imageFeatRes){
    var logoRes = {
      image_type: 'logo',
      image_calc: imageFeatRes
    }

    callback(null, logoRes)

  }).catch(function(err){
    callback(err)
  })
}

module.exports = {
  uploadFace: uploadFace,
  uploadLogo: uploadLogo
}
