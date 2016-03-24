var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

var urlStorage = {};

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback) {
  // fs.readFile(paths.list, 'utf8', function(err, data) {
  //   if (err) {
  //     throw err;
  //   } else {
  //     var urls = data.split('\n');
  //     callback(urls);
  //   }
  // });
  return new Promise(function(resolve, reject) {
    fs.exists(paths.list, function(exists) {
      if (exists) {
        fs.readFile(paths.list, 'utf8', function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    });
  })
  .then(function(data) {
    var urls = data.split('\n');
    callback(urls);
  })
  .catch(function(err) {
    console.log('Could not read list of urls', err);
  });
};

exports.isUrlInList = isUrlInList = function(url, callback) {
  readListOfUrls(function(urls) {
    callback(urls.indexOf(url) !== -1);
  });
};

exports.addUrlToList = function(url, callback) {
  return new Promise(function(resolve, reject) {
    urlStorage[url] = url;
    fs.writeFile(paths.list, url + '\n', {flag: 'a'}, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
  .then(function() {
    callback();
  })
  .catch(function(err) {
    console.log('Could not add url to list', err);
  });
};

exports.isUrlArchived = isUrlArchived = function(url, callback) {
  var urlPath = path.join(paths.archivedSites, url);
  fs.exists(urlPath, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(urlsArray) {
  _.each(urlsArray, function(url) {
    isUrlArchived(url, function(exists) {
      if (!exists) {
        http.get('http://' + url, function(response) {
          var data = '';
          response.on('data', function(chunk) {
            data += chunk;
          });
          response.on('end', function() {
            fs.writeFile(paths.archivedSites + '/' + url, data, 'utf8', function(err) {
              if (err) {
                console.log(err);
                throw err;
              } else {
                console.log('Successfully saved file');
              }
            });
          });
        })
        .on('error', function(err) {
          console.log('Could not save url ' + url, err);
        });
        
      }
    });
  });
};
