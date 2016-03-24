var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    var requestPath = path.join(__dirname, '/public/index.html');
    fs.exists(requestPath, function(exists) {
      if (exists) {
        httpHelpers.readAssetsAsync(requestPath)
          .then(function(data) {
            httpHelpers.serveAssets(res, data);
          })
          .catch(function(err) {
            console.log('that was an error', err);
          });
      } else {
        console.log('index.html does not exist');
      }
    });
  } else if (req.method === 'GET') {
    var url = path.join(__dirname, '../test/testdata/sites', req.url);
    fs.exists(url, function(exists) {
      if (exists) {
        httpHelpers.readAssetsAsync(url)
          .then(function(data) {
            httpHelpers.serveAssets(res, data);
          })
          .catch(function(err) {
            console.log('that was an error', err);
          });
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  } else if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      data = JSON.parse(data);
      console.log('--------------->' + data.url); 
      archive.addUrlToList(data.url);
      res.writeHead(201);
      res.end();
    });
  }

  // res.end(archive.paths.list);
};
