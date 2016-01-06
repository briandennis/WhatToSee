var React = require('react');
var ReactDOM = require('react-dom');

var Heading = React.createClass({
  render: function(){
    return <h1>Testing updated gulp watch 2.0 </h1>;
  }
});

ReactDOM.render(
  <Heading />,
  document.getElementById('content')
);
