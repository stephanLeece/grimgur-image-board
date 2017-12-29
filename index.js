const express = require('express');
const app = express();
const dbGets = require('./dbGets.js')
const dbSets = require('./dbSets.js')
const s3 = require('./s3.js')
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const bodyParser = require('body-parser');
const knox = require('knox');
const fs = require('fs');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())



app.use(express.static('./public'));

var diskStorage = multer.diskStorage({
  // destination: function(req, file, callback) {
  //   callback(null, __dirname + '/uploads');
  // },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

var uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

app.get('/images', function(req, res) {
  dbGets.getImages().then(function(images) {
    res.json(images);
  }).catch(function(err) {
    console.log(err);
  });
});

app.get('/popular', function(req, res) {
  dbGets.getImages(true).then(function(images) {
    res.json(images);
  }).catch(function(err) {
    console.log(err);
  });
});

app.get('/tagged/:tag', function(req, res) {
  const tag = req.params.tag;
    dbGets.getImagebyTags(tag).then(function(images) {
      console.log('heres ya pics',images);
    res.json(images);
  }).catch(function(err) {
    console.log(err);
  });
});

app.post('/like', function(req, res) {
  console.log(req.body.aValue, req.body.imageid);
  dbSets.likeImage(req.body.aValue, req.body.imageid);
});

app.post('/image/:id', function(req, res) {
  dbSets.saveComment(req.body.username, req.body.comment, req.body.imageid);
});

app.get('/image/:id', function(req, res) {
  const id = req.params.id;
  var imageWithComments = {
    image: '',
    title:'',
    username: '',
    descrip: '',
    comments: [],
    tags: []
  };
  dbGets.getimage(id)

    .then(function(image) {
      console.log(image);
      imageWithComments.title = image.title;
      imageWithComments.image = image.image;
      imageWithComments.username = image.username;
      imageWithComments.description = image.description;
      return id;
    })

    .then(function(id) {
      dbGets.getimageComments(id).then(function(results) {
          for (let i = 0; i < results.length; i++) {
            let timestamp = `${results[i].created_at}`;
            let time = timestamp.split(" ");
            let useCom = {
              username: `${results[i].username}`,
              date: `${time[0]} ${time[1]} ${time[2]}, ${time[3]}`,
              comment: `${results[i].comment}`
            };
            imageWithComments.comments.push(useCom)
          }
          return id;
        })

        .then(function(id) {
          dbGets.getTagsbyImage(id).then(function(allTags) {
            for (let i = 0; i < allTags.length; i++) {
              // if (imageWithComments.tags.indexOf(allTags[i].tag) == -1) {
                imageWithComments.tags.push(allTags[i].tag)
              // }
            }
          }).then(function() {
            console.log(imageWithComments);
            res.json(imageWithComments);
          });
        })


    });
});




app.post('/upload', uploader.single('file'), function(req, res) {
  if (req.file) {
    s3.upload(req.file).then(function() {
      dbSets.saveImage(req.file.filename, req.body.user, req.body.title, req.body.descrip).then(function(id) {
        if (req.body.tags) {

          var tags = req.body.tags.split(',');
          var trimmedTags = []
          var tagsToSend = []

          for (let i = 0; i < tags.length; i++) {
          trimmedTags.push(tags[i].trim())
          }

          for (let i = 0; i < trimmedTags.length; i++) {
            if (tagsToSend.indexOf(trimmedTags[i]) == -1) {
              tagsToSend.push(trimmedTags[i])
            }
          }

          for (let i = 0; i < tagsToSend.length; i++) {
            dbSets.saveTags(id, tagsToSend[i]);
          }

        } else {
          console.log('no tags');
        }
      });
    })
  }
});




app.listen(process.env.PORT || 8080, function() {
  console.log("I'm listening.");
});
