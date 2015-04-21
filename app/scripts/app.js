var React = window.React = require('react');
var moment = window.moment = require('moment');
var d3 = window.d3 = require('d3');

var DataViz = require('./ui/DataViz');
var BarChartCanvas = require('./ui/BarChartCanvas');

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
          <h1 className='heading'>Explore popular tags for a date range</h1>
          <button type='button'
            id='add-viz'
            className='btn btn-lg btn-success text-center'
            onClick={this.addViz}>Compare
          </button>
          <div className='row'>
            {vizs}
          </div>
          <div className='row'>
            <BarChartCanvas  />
          </div>
        </div>
      </div>
    )
  }
});

React.render(<App />, mountNode);
