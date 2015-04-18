var React = window.React = require('react');
var moment = window.moment = require('moment');

var DataViz = require('./ui/DataViz');

var mountNode = document.getElementById('app');

var App = React.createClass({
  getInitialState: function() {
    return {
      numViz: 1
    }
  },

  addViz: function() {
    this.setState({
      numViz: this.state.numViz + 1
    })
  },

  render: function() {
    var vizs = [];
    for (var i = 0; i < this.state.numViz; i++) {
      vizs.push(<DataViz key={i} numViz={this.state.numViz} />)
    }

    return (
      <div className='container-fluid'>
        <div className='text-center'>
          <h3 className='heading'>Explore popular tags for a date range</h3>
          <button type='button'
            id='add-viz'
            className='btn btn-lg btn-success text-center'
            onClick={this.addViz}>Add Viz
          </button>
          <div className='row'>
            {vizs}
          </div>
        </div>
      </div>
    )
  }
});

React.render(<App />, mountNode);
