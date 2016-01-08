var React = require('react');
var ReactDOM = require('react-dom');

var PrimaryInfo = React.createClass({
  render: function(){
    return (
      <p id='entryPrompt'>
        enter a movie you would like to see
      </p>
    );
  }
});

var PrimaryEntry = React.createClass({
  getInitialState: function(){
    return {needPrompt: true};
  },

  flipPrompt: function(){
    this.setState({needPrompt: !this.state.needPrompt});
  },

  render: function(){

    return(
      <div id='primaryEntry'>
        <form action='#'>
          <input type='text' name='primaryInput' autoComplete='off'></input>
          <button onClick={this.flipPrompt}> &lt; </button>
        </form>
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
          <PrimaryInfo />
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
