var express   = require('express');
var multer    = require('multer');
var md5       = require('MD5');
var Q         = require('q');
var Thumbnail = require('thumbnail');

var app             = express();
var targetFolder    = '/var/www/mysite/files/full/';
var thumbnailFolder = '/var/www/mysite/files/thumbs/';
var thumbnail       = new Thumbnail(targetFolder, thumbnailFolder);
var makeThumbnail   = Q.nbind(thumbnail.ensureThumbnail,thumbnail);
var thumbnailSizes  = [30,96,128];

app.post('/upload', function(req,res,next) {
  //Check the authentication here, this is the first middleware.
  if(authenticated) {
    next();
  } else {
    res.send(401);
  }
}, multer({
  dest: targetFolder,
  rename: function (fieldname, filename) {
    //Rename the file with it's name + date hash
    return md5(filename + Date.now());
  },
  onFileUploadComplete: function(file, req, res) {
    var resizePromises = [];
    for(var i in thumbnailSizes) {
        var p = makeThumbnail(file.name,thumbnailSizes[i],thumbnailSizes[i]);
        resizePromises.push(p);
    }

    Q.all(resizePromises).done(function(){
        // The file has been resized to the specified format.
        res.send(200);
    },function(err) {
        console.log(err);
        res.send(500);
        // Error !
    });
  }
})
