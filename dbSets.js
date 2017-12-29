const fs = require("fs");
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:Stephan:postgres@localhost:5432/grimgur');
const config = require('./config.json');



module.exports.saveImage = function(image, username, title, description, likes) {
  return db.query('INSERT INTO images (image, username, title, description, likes) VALUES ($1, $2, $3, $4, $5) RETURNING id', [image || null, username || null, title || null, description, 0]).then(function(results) {
      return results.rows[0].id;
  });
};

module.exports.saveTags = function(imageid, tag) {
  return db.query('INSERT INTO tags (imageid, tag) VALUES ($1, $2)', [imageid, tag]).then(function() {});
};

module.exports.saveComment = function(username, comment, imageid) {
  return db.query('INSERT INTO comments (username, comment, imageid) VALUES ($1, $2, $3)', [username || null, comment || null, imageid]).then(function() {});
};

module.exports.likeImage = function(aValue, id) {
  if (aValue) {
    return db.query('UPDATE images SET likes = likes + 1 Where id = $1;', [id]).then(function() {
      console.log('liked');
    });
  } else {
    return db.query('UPDATE images SET likes = likes - 1 Where id = $1;', [id]).then(function() {
      console.log('disliked');
    });
  }
};
