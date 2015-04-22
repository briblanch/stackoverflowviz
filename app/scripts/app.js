var React = window.React = require('react');
var moment = window.moment = require('moment');
var d3 = window.d3 = require('d3');
var _ = window._ = require('underscore');

var DataViz = require('./ui/DataViz');

var mountNode = document.getElementById('app');

var App = React.createClass({
  getInitialState: function() {
    return {
      numViz: 1,
      viz1Data: {},
      viz2Data: {},
      commonData: {}
    }
  },

  addViz: function() {
    if (this.state.numViz < 2) {
      this.setState({
        numViz: this.state.numViz + 1
      })
    }
  },

  setViz1Data: function(startDate, data) {
    var newData = {
      date: startDate,
      data: data
    };

    this.setState({
      viz1Data: newData
    });
  },

  setViz2Data: function(startDate, data) {
    var newData = {
      date: startDate,
      data: data
    };

    this.setState({
      viz2Data: newData
    })
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.numViz > 1 && (!_.isEqual(prevState.viz1Data, this.state.viz1Data) || !_.isEqual(prevState.viz2Data, this.state.viz2Data))) {
        this.computeCommonData();
    }
  },

  computeCommonData: function() {
    var result = [];

    var data1IsEarlier = this.state.viz1Data.date.diff(this.state.viz2Data.date, 'day') <= 0;

    var data1 = this.state.viz1Data.data;
    var data2 = this.state.viz2Data.data;

    var viz1Names = _.map(data1, function(d) {
      return d.name;
    });

    var viz2Name = _.map(data2, function(d) {
      return d.name;
    });

    var commonNames = _.intersection(viz1Names, viz2Name);

    for (var i = 0; i < commonNames.length; i++) {
      var value1 = _.where(data1, {name: commonNames[i]})[0];
      var value2 = _.where(data2, {name: commonNames[i]})[0];

      var commonData = {
        name: commonNames[i]
      }

      if (data1IsEarlier) {
        commonData.values = [value1.count, value2.count];
      } else {
        commonData.values = [value2.count, value1.count];
      }

      result.push(commonData);
    }

    this.setState({
      comonData: result
    })
  },

  render: function() {
    var vizs = [];
    for (var i = 0; i < this.state.numViz; i++) {
      if (i == 0) {
        vizs.push(<DataViz setData={this.setViz1Data} key={i} numViz={this.state.numViz} commonData={this.state.commonData} />);
      } else {
        vizs.push(<DataViz setData={this.setViz2Data} key={i} numViz={this.state.numViz} commonData={this.state.commonData} />);
      }
    }

    return (
      <div className='container-fluid'>
        <div className='text-center'>
          <h1 className='heading'>Explore popular tags for a date range</h1>
          <button type='button'
            id='add-viz'
            className='btn btn-lg btn-success text-center'
            onClick={this.addViz}
            disabled={this.state.numViz >= 2 ? 'disabled' : null}>Compare
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
