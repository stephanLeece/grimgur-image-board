const fs = require("fs");
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:Stephan:postgres@localhost:5432/grimgur');
const config = require('./config.json');

// get single user

// get multiple users
module.exports.getImages = function(aValue) {
  if (aValue) {
    return db.query(`SELECT * FROM images ORDER BY likes DESC;`).then(function(results) {

      results.rows.forEach(function(row) {
        row.image = config.s3Url + row.image;
      })
      return results.rows;
    });
  } else {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC;`).then(function(results) {
      results.rows.forEach(function(row) {
        row.image = config.s3Url + row.image;
      })
      return results.rows;
    });
  }
}




module.exports.getimage = function(id) {
  return db.query(`SELECT * FROM images Where id = $1`, [id]).then(function(results) {
    results.rows[0].image = config.s3Url + results.rows[0].image;
    return results.rows[0];
  });
}


module.exports.getimageComments = function(id) {
  return db.query(`SELECT * FROM comments Where imageid = $1 ORDER BY created_at DESC`, [id]).then(function(results) {
    return results.rows;
  });
}

module.exports.getTagsbyImage = function(id) {
  return db.query(`SELECT tag FROM tags Where imageid = $1`, [id]).then(function(results) {
    return results.rows;
  });
}

module.exports.getImagebyTags = function(tag) {
  return db.query(`SELECT tags.imageid,
  images.id, images.image, images.username, images.title, images.description, images.likes, images.created_at
  FROM tags
  LEFT JOIN images ON tags.imageid = images.id
  Where tag = $1`, [tag]).then(function(results) {
    results.rows.forEach(function(row) {
      row.image = config.s3Url + row.image;
    })
    return results.rows;
  });
}
