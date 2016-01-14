//dependencies
var express = require('express');
var url = require('url');
var request = require('request');
var path = require('path');
var syncRequest = require('urllib-sync').request;

//initiate express
var app = express();
app.use(express.static(__dirname + '/public'));

//handle get request of home page
app.get('/',function(req, res){
  //res.sendFile(path.join(__dirname + '/index.html'));
});

//get box office
app.get('/api/out/',function(req,res){
  request('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=ny97sdcpqetasj8a4v2na8va', function(error, response, body){

    //Setup Return varaible.
    var returnObject = {};
    returnObject.movies = [];

    if (!error && response.statusCode == 200) {
      var movieObject = JSON.parse(body);

      for(var i = 0; i < movieObject.movies.length; i++){
        //grab current movie
        var movie = movieObject.movies[i];

        //create and populate movie object
        var curr = {};
        curr.title = movie.title;
        curr.year = movie.year;
        curr.runtime = movie.runtime;
        curr.criticRating = movie.ratings.critics_score;
        curr.peopleRating = movie.ratings.audience_score;

        //get imdb info
        if (movie.alternate_ids){
          var imdbUrl = 'http://www.omdbapi.com/?i=tt' + movie.alternate_ids.imdb;
          var imdbResponse = JSON.parse(syncRequest(imdbUrl).data);
          curr.link = 'http://www.imdb.com/title/tt' + movie.alternate_ids.imdb;
          curr.imdbRating = imdbResponse.imdbRating;
          curr.metascore = imdbResponse.Metascore;
          curr.poster = imdbResponse.Poster;
          curr.director = imdbResponse.Director;
          curr.actors = imdbResponse.Actors;
        }

        //put movie object in return object
        returnObject.movies.push(curr);

      }
    }

    //send response
    res.sendStatus(JSON.stringify(returnObject));

  });
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

    //create return variables
    var returnObject = {};
    returnObject.movies = [];

    if (!error && response.statusCode == 200) {
      //Create variables
      var movieObject = JSON.parse(body);

      //format movie objects
      for(var i = 0; i < movieObject.movies.length; i++){
        //grab current movie
        var movie = movieObject.movies[i];

        //create and populate movie object
        var curr = {};
        curr.title = movie.title;
        curr.year = movie.year;
        curr.runtime = movie.runtime;
        curr.criticRating = movie.ratings.critics_score;
        curr.peopleRating = movie.ratings.audience_score;

        //get imdb info
        if (movie.alternate_ids){
          var imdbUrl = 'http://www.omdbapi.com/?i=tt' + movie.alternate_ids.imdb;
          var imdbResponse = JSON.parse(syncRequest(imdbUrl).data);
          curr.link = 'http://www.imdb.com/title/tt' + movie.alternate_ids.imdb;
          curr.imdbRating = imdbResponse.imdbRating;
          curr.metascore = imdbResponse.Metascore;
          curr.poster = imdbResponse.Poster;
          curr.director = imdbResponse.Director;
          curr.actors = imdbResponse.Actors;
        }

        //put movie object in return object
        returnObject.movies.push(curr);

      }
    }

    res.sendStatus(JSON.stringify(returnObject));

  });
});

app.listen(3000, function(){
  console.log('running on port 3000.....');
});
