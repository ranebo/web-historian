// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

// crontab instructions
// crontab -e
// add to file: */1 * * * * /usr/local/bin/node ~/desktop/2016-02-web-historian/workers/htmlfetcher.js
// crontab -l to view existing crons

var archive = require('../helpers/archive-helpers.js');

archive.readListOfUrls()
  .then(function(urls) {
    archive.downloadUrls(urls);
  })
  .catch(function(err) {
    console.log('Could not read list of URLs', err);
  });
