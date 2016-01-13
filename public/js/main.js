//Dependancies
var React = require('react');
var ReactDOM = require('react-dom');

//------------------------ Begin Components --------------------------------------

//Component for rating system
var Stars = React.createClass({

  ratingUpdate: function(){
    console.log("rating is: " + this.value);
  },

  render: function(){
      return (
        <div className='stars'>
          <span className="star-rating">
            <input type="radio" name="rating" value="1" onClick={this.ratingUpdate}></input>
            <i></i>
            <input type="radio" name="rating" value="2"></input>
            <i></i>
            <input type="radio" name="rating" value="3"></input>
            <i></i>
            <input type="radio" name="rating" value="4"></input>
            <i></i>
            <input type="radio" name="rating" value="5"></input>
            <i></i>
          </span>
        </div>
      );
  }
});

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
    if(rating){
      if([1,2,3,4,5].contains(rating)){
        this.props.movie.rating = rating;
        console.log(rating);
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
          <Stars updateFunction={this.rateMovie} />
        </div>
      </div>
    );

  }
});

//Initial entry of movie and messages
var PrimaryEntry = React.createClass({
  getInitialState: function(){
    return {message: <p className='message'>enter a movie you would like to rate</p>};
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
          <Movie movie={response.movies[0]} />
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

var MainContent = React.createClass({

  getInitialState: function(){
    return {initialScreen: true};
  },

  render: function(){
    //determine state and pick components accordingly
    var components;
    if (this.state.initialScreen){
      components = (
        <div id='initialPrompt'>
          <PrimaryEntry />
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
