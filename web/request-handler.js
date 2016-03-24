var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');
var httpHelpers = require('./http-helpers');
var _ = require('underscore');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      var url = path.join(archive.paths.siteAssets, '/index.html');
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
    var queryData = '';
    var loadingPath = path.join(archive.paths.siteAssets, '/loading.html');
    req.on('data', function(chunk) {
      queryData += chunk;
    });
    req.on('end', function() {
      queryDataUrl = queryData.slice(4);
      if (queryData.slice(0, 3) === 'url') {
        archive.isUrlInList(queryDataUrl, function(exists) {
          if (!exists) {
            archive.addUrlToList(queryDataUrl, _.identity);
            fs.readFile(loadingPath, 'utf8', function(err, data) {
              if (err) {
                console.log('Could not load loading.html', err);
              } else {
                res.writeHead(302);
                res.end(data);
              }
            });
          } else {
            var archivePath = path.join(archive.paths.archivedSites, queryDataUrl);
            fs.readFile(archivePath, 'utf8', function(err, data) {
              if (err) {
                fs.readFile(loadingPath, 'utf8', function(err, data) {
                  if (err) {
                    console.log('Could not load loading.html', err);
                  } else {
                    res.writeHead(302);
                    res.end(data);
                  }
                });
              } else {
                res.writeHead(302);
                res.end(data);
              }
            });
          }
        });
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  }

  // res.end(archive.paths.list);
};
