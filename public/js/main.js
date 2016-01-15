//Dependancies
var React = require('react');
var ReactDOM = require('react-dom');
var Rating = require('react-rating');

//------------------------ Begin Components --------------------------------------

//Component for empty rating star
var EmptyStar = React.createClass({
  render: function(){
    return (
      <i className='fa fa-star emptyStar'></i>
    );
  }
})

//Component for filled rating star
var FilledStar = React.createClass({
  render: function(){
    return (
      <i className='fa fa-star filledStar'></i>
    );
  }
})

//Component for displaying movies
var Movie = React.createClass({

  getDefaultProps: function(){
    return {
      movie: {
        poster: 'http://ia.media-imdb.com/images/M/MV5BMjA1MTc1NTg5NV5BMl5BanBnXkFtZTgwOTM2MDEzNzE@._V1_SX300.jpg',
        title: 'Testing Eight',
      }
    }
  },

  rateMovie: function(rating){
    console.log('rating function entered!');
    if(rating){
      if([1,2,3,4,5].indexOf(rating) >= 0){
        this.props.movie.rating = rating;
        this.props.beenRatedFunction(this.props.movie);
      }
    }
  },

  render: function(){

    var ratingModule;
    if(this.props.movie.prediction){
      ratingModule = <Rating className='rating' empty={<EmptyStar />} full={<FilledStar />} readonly={true} initialRate={Math.round(this.props.movie.prediction)} /> ;
    }
    else{
      ratingModule = <Rating className='rating' empty={<EmptyStar />} full={<FilledStar />} onChange={this.rateMovie} /> ;
    }

    var titleFont = 'normal';
    var shortTitle = this.props.movie.title;
    if(shortTitle.length > 15){
      titleFont = 'smallFont';
      if(shortTitle.length > 25){
        shortTitle = shortTitle.substring(0,22) + '...';
      }
    }

    var moviePoster = <div className='iconDiv'><i className='fa fa-film movieIcon'></i></div>;
    if(this.props.movie.poster){
      moviePoster = <img className='poster' src={this.props.movie.poster}></img>;
    }

    return (
      <div className='movie'>
        <div className='moviePosterWrapper'>
          {moviePoster}
        </div>
        <div className='movieInfoWrapper'>
          <a target='_blank' href={this.props.movie.link}><h2 className={titleFont}>{shortTitle}</h2></a>
          <div className='rating'>
            {ratingModule}
          </div>
        </div>
      </div>
    );

  }
});

//Initial entry of movie and messages
var PrimaryEntry = React.createClass({
  getInitialState: function(){
    return {
      message: <p className='message'>enter a movie you would like to rate</p>,
      emptyString: ""
    };
  },

  recieveRating: function(movie){
    this.setState({message: <p className='message'>enter a movie you would like to rate</p>});
    this.props.returnFunction([movie]);
  },

  getKeyPress: function(e){
    console.log('entered!!');
    if(e.keyCode==13){
      alert('you pressed enter!');
    }
  },

  getMovie: function(){

    //variables needed
    var errorMessage = <p className='message'>wasn't able to find anything for that... try another search!</p>;

    //function for getting movie object
    var getMovie = function(name){

      //format URL
      var movieUrl = 'https://boiling-springs-9862.herokuapp.com/api?movie=' + name ;

      //get the movie via http request
      var request = new XMLHttpRequest();
      request.open('GET', movieUrl, false);
      request.send();
      return JSON.parse(request.response);
    };

    var movieTitle = document.getElementById('mainEntry').value;
    if(movieTitle.length > 0){
      //format input
      var tmpArray = movieTitle.split(' ');
      movieTitle = tmpArray.join('+');

      //get movies
      var response = getMovie(movieTitle);
      var displayMessage = errorMessage;

      if(response.movies.length === 0){
        displayMessage = errorMessage;
      }
      else{
        displayMessage = (
          <div className='moviePreview'>
            <Movie beenRatedFunction={this.recieveRating} movie={response.movies[0]} />
            <p className='message'>Awesome, now give it a rating! Or try another search</p>
          </div>
        );
      }

      //set message
      this.setState({message: displayMessage});
      this.refs.mainInput.value = '';
    }
    else{
      this.setState({message: errorMessage});
    }
  },

  render: function(){

    return(
      <div id='primaryEntry'>
        <div className='movieInput'>
          <input ref='mainInput' type='text' id='mainEntry' autoComplete='off' defaultValu=''></input>
          <button onClick={this.getMovie}> &lt; </button>
        </div>
        {this.state.message}
      </div>
    );
  }
});

//Movie list component, holder for all movies
var MovieList = React.createClass({

  render: function(){

    var movieItems = [];
    for(var i = 0; i < this.props.movies.length; i++){
        movieItems.push(<MovieListItem key={i} movie={this.props.movies[i]} />);
    }


    return (
      <div className='movieList'>
        <div className='listGroup'>
          {movieItems}
        </div>
      </div>
    );
  }

});

//Movie list item component, used for displaying each movie
var MovieListItem = React.createClass({

  render: function(){

    return (
      <div className='list-group-item movieListItem'>
        <div className='movieTitle'>
          {this.props.movie.title}
        </div>
        <div className='movieRating'>
          <Rating className='rating' empty={<EmptyStar />} full={<FilledStar />} readonly={true} initialRate={this.props.movie.rating} />
        </div>
      </div>
    );
  }
});

//Main component, holds all others

var MainContent = React.createClass({

  getInitialState: function(){
    return {progression: -1, movieCount: 0};
  },

  getDefaultProps: function(){
    return {
      movies: []
    };
  },

  reset: function(){
    this.props.movies.length = 0;
    this.setState({progression: 0});
  },

  updateProgression: function(movies){
      if(this.state.progression === 0){
        if(movies.length == 1){
          this.props.movies.push(movies[0]);
          console.log("Added First Movie: " + movies[0].title);
          this.setState({progression: 1, movieCount: this.state.movieCount++});
        }
      }
      else if(this.state.progression === 1){
        if(movies.length == 1){
          this.props.movies.push(movies[0]);
          this.setState({movieCount: this.state.movieCount++});
          this.props.uniqueId++;
          console.log("Additional Movie Added: " + movies[0].title);
          if(this.props.movies.length >= 5){
            this.setState({progression: 2});
          }
        }
      }
  },

  render: function(){

    //determine state and pick components accordingly
    var components;

    if(this.state.progression === -1){
      components = (
        <div className='splashWrapper'>
          <div className='splashTitle'>
            <img src='images/logo.png'></img>
            <h1>What to See?</h1>
          </div>
          <p className ='splashDescription'>
            Rate 5 movies and <span id='accent'>What to See?</span> will use an artificial neural network to predict which movie currently in theaters you would like most!
          </p>
          <div className='button'>
            <div className='resetWrapper' onClick={this.reset}>
              <h3>Start</h3>
            </div>
          </div>
        </div>
      );
    }

    else if (this.state.progression === 0){
      console.log('Progression is 0');
      components = (
          <div className='container-fluid'>
            <div className='row' id='title'>
              <div className='col-md-12'>
                <div>
                  <img src='images/logo.png'></img>
                  <h1>What to See?</h1>
                </div>
              </div>
            </div>
            <div className='row' id='entryField'>
              <div className='col-md-12'>
                <div id='initialPrompt'>
                  <PrimaryEntry returnFunction={this.updateProgression} />
                </div>
              </div>
            </div>
          </div>
      );
    }
    else if(this.state.progression === 1){

      console.log("Progression 1 Entered, Movies is equal to: " + this.props.movies);

      components = (
        <div className='container-fluid'>
          <div className='row' id='additionalEntry'>
            <div className='col-sm-6'>
              <div className='ratedMovies'>
                <div id='ratedMoviesTitle'>
                  <h2>Rated Movies</h2>
                </div>
                <MovieList movies={this.props.movies} />
                <p class='message'>please rate {5 - this.props.movies.length} more movies</p>
                <div className='resetButton'>
                  <div className='resetWrapper' onClick={this.reset}>
                    <h3>Reset</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='movieEntry'>
                <div className='container-fluid'>
                  <div className='row' id='title'>
                    <div className='col-md-12'>
                      <div>
                        <img src='images/logo.png'></img>
                        <h1>What to See?</h1>
                      </div>
                    </div>
                  </div>
                  <div className='row' id='entryField'>
                    <div className='col-md-12'>
                      <div id='initialPrompt'>
                        <PrimaryEntry returnFunction={this.updateProgression} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if(this.state.progression === 2){

      //function for getting movie object
      var getBoxOffice = function(name){

        //format URL
        var movieUrl = 'https://boiling-springs-9862.herokuapp.com/api/out';

        //get the movie via http request
        var request = new XMLHttpRequest();
        request.open('GET', movieUrl, false);
        request.send();
        return JSON.parse(request.response);
      };


      //formats movie into input
      function formatInputMovie(movie){
        var dataPoint = {input: {}, output: {}};

        //set input values
        dataPoint.input.year = movie.year / 2020;
        dataPoint.input.runtime = movie.runtime / 300;
        dataPoint.input.criticRating = movie.criticRating /100;
        dataPoint.input.peopleRating = movie.peopleRating / 100;
        dataPoint.input.imdbRating = movie.imdbRating / 10;
        dataPoint.input.metascore = movie.metascore / 100;

        dataPoint.output.rating = movie.rating / 5;

        return dataPoint;

      };

      function formatOutputMovie(movie){
        var dataPoint = {};

        //set input values
        dataPoint.year = movie.year / 2020;
        dataPoint.runtime = movie.runtime / 300;
        dataPoint.criticRating = movie.criticRating /100;
        dataPoint.peopleRating = movie.peopleRating / 100;
        dataPoint.imdbRating = movie.imdbRating / 10;
        dataPoint.metascore = movie.metascore / 100;

        return dataPoint;

      };

      //set up neural net
      var net = new brain.NeuralNetwork();
      var dataArray = [];

      //format input
      var movieArray = this.props.movies;
      for(var i = 0; i < movieArray.length; i++){
        dataArray.push(formatInputMovie(movieArray[i]));
      }

      //train the net
      net.train(dataArray);

      //get movies out nows
      var outNow = getBoxOffice();
      var max = 0;
      var maxIndex = 0;
      for(var i = 0; i < outNow.movies.length; i++){
        outNow.movies[i].prediction = net.run(formatOutputMovie(outNow.movies[i])).rating * 5;
        if(outNow.movies[i].prediction > max){
          max = outNow.movies[i].prediction;
          maxIndex = i;
        }
      }



      components = (
        <div className='predictionWrapper'>
          <div className = 'ratedMoviesTitle'>
            <h2>Okay, thanks for the info! You should go see...</h2>
          </div>
          <div className='thePrediction'>
            <Movie movie={outNow.movies[maxIndex]} />
          </div>
          <div className='resetWrapper' onClick={this.reset}>
            <h3>Try Again</h3>
          </div>
        </div>
      );
    }

    return components;
  }
});

ReactDOM.render(
  (<MainContent />),
  document.getElementById('content')
);
