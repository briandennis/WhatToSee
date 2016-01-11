//dependencies
var express = require('express');
var url = require('url');
var request = require('request');
var path = require('path');

//initiate express
var app = express();
app.use(express.static(__dirname + '/public'));

//handle get request of home page
app.get('/',function(req, res){
  //res.sendFile(path.join(__dirname + '/index.html'));
});

//handle get request to api
app.get('/api/',function(req, res){

  //get movie query
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var movieSearch = query.movie;

  //search with Rotten Tomatoes API
  var movieUrlPart1 = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=ny97sdcpqetasj8a4v2na8va&q=';
  var movieUrlPart2 = '&page_limit=3';
  var finalUrl = movieUrlPart1 + movieSearch + movieUrlPart2;
  request(finalUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.sendStatus(JSON.stringify(JSON.parse(body).movies[0]));
    }
  });
});

app.listen(3000, function(){
  console.log('running on port 3000.....');
});
