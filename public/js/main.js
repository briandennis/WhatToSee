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
    var titleFont = 'normal';
    var shortTitle = this.props.movie.title;
    if(shortTitle.length > 15){
      titleFont = 'smallFont';
      if(shortTitle.length > 25){
        shortTitle = shortTitle.substring(0,22) + '...';
      }
    }

    return (
      <div className='movie'>
        <div className='moviePosterWrapper'>
          <img className='poster' src={this.props.movie.poster}></img>
        </div>
        <div className='movieInfoWrapper'>
          <a target='_blank' href={this.props.movie.link}><h2 className={titleFont}>{shortTitle}</h2></a>
          <div className='rating'>
            <Rating className='rating' empty={<EmptyStar />} full={<FilledStar />} onChange={this.rateMovie} />
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
    };
  },

  recieveRating: function(movie){
    this.props.returnFunction([movie]);
  },

  getMovie: function(){
    //variables needed
    var errorMessage = <p className='message'>Please enter a valid movie title!</p>;

    //function for getting movie object
    var getMovie = function(name){
      //format URL
      var movieUrl = 'http://localhost:3000/api?movie=' + name ;

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
      console.log('Response: ' + response.movies[0].poster);
      displayMessage = (
        <div className='moviePreview'>
          <Movie beenRatedFunction={this.recieveRating} movie={response.movies[0]} />
          <p className='message'>Awesome, now give it a rating! Or try another search</p>
        </div>
      );

      //set message
      this.setState({message: displayMessage});
    }
    else{
      this.setState({message: errorMessage});
    }
  },

  render: function(){

    return(
      <div id='primaryEntry'>
        <div className='movieInput'>
          <input type='text' id='mainEntry' autoComplete='off'></input>
          <button onClick={this.getMovie}> &lt; </button>
        </div>
        {this.state.message}
      </div>
    );
  }
});

//Movie list component, holder for all movies
var MovieList = React.createClass({

  getDefaultProps: function(){
    movies: []
  },

  render: function(){
    return (
      <div className='movieList'>
        <ul className='listGroup'>
          <MovieListItem />
        </ul>
      </div>
    );
  }

});

//Movie list item component, used for displaying each movie
var MovieListItem = React.createClass({

  render: function(){

    return (
      <li className='list-group-item movieListItem'>
        This is a test list item!
      </li>
    );
  }
});

//Main component, holds all others

var MainContent = React.createClass({

  getInitialState: function(){
    return {progression: 0};
  },

  getDefaultProps: function(){
    return {
      movies: []
    };
  },

  updateProgression: function(movies){
      console.log("Movies Value: " + movies);
      if(this.state.progression === 0){
        if(movies.length = 1){
          this.props.movies.push(movies[0]);
          console.log("Added First Movie: " + movies[0].title);
          this.setState({progression: 1});
        }
      }
  },

  render: function(){

    //determine state and pick components accordingly
    var components;

    if (this.state.progression === 0){
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
    if(this.state.progression === 1){
      components = (
        <div className='container-fluid'>
          <div className='row' id='additionalEntry'>
            <div className='col-md-6'>
              <div className='ratedMovies'>
                <div id='ratedMoviesTitle'>
                  <h2>Rated Movies</h2>
                  <MovieList />
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='movieEntry'>
                <h1>This is where the entry will be!</h1>
              </div>
            </div>
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
