$.get('http://127.0.0.1:8080/sites', function(response) {
  response = JSON.parse(response);
  var template = _.template('<button name="url" value="<%= url %>"><%= url %></button>');
  _.each(response, function(url) {
    if (url !== '') {
      var obj = {url: url};
      var buttonString = $(template(obj));
      $('#pagebuttons').append(buttonString);
    }
  });

  // $('button').on('click', function(event) {
  //   $.post('http://127.0.0.1:8080', 'url=' + $(this).html(), function(response) {
  //     $('html').html(response);
  //   });
  // });
});