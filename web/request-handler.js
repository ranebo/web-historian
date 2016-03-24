var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      var url = path.join(__dirname, '/public/index.html');
    } else {
      var url = path.join(__dirname, '../test/testdata/sites', req.url);
    }
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
      archive.addUrlToList(data.url, function() {
        res.writeHead(302);
        res.end();
      });
    });
  }

  // res.end(archive.paths.list);
};
