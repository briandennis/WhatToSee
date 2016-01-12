//Dependancies
var React = require('react');
var ReactDOM = require('react-dom');

//------------------------ Begin Components --------------------------------------


//Initial entry of movie and messages
var PrimaryEntry = React.createClass({
  getInitialState: function(){
    return {message: 'enter a movie you would like to rate'};
  },

  getMovie: function(){
    //variables needed
    var errorMessage = 'Please enter a valid movie title!';

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
      console.log('Response: ' + response.movies[0].title);

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
        <input type='text' id='mainEntry' autoComplete='off'></input>
        <button onClick={this.getMovie}> &lt; </button>
        <p>{this.state.message}</p>
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
