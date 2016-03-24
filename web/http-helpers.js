var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');

exports.headers = headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  res.writeHead(200, headers);
  res.end(callback ? callback(asset) : asset);
};

readAssets = function(pathname, callback) {
  return fs.readFile(pathname, 'utf8', function(err, data) {
    if (err) {
      throw callback(err);
    } else {
      return callback(null, data);
    }
  });  
};

exports.readAssetsAsync = Promise.promisify(readAssets);


// As you progress, keep thinking about what helper functions you can put here!
