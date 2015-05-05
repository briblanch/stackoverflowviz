var React = window.React = require('react');
var moment = window.moment = require('moment');
var d3 = window.d3 = require('d3');
var _ = window._ = require('underscore');

var DataViz = require('./ui/DataViz');
var BarChartCanvas = require('./ui/BarChartCanvas');

var mountNode = document.getElementById('app');

var App = React.createClass({
  getInitialState: function() {
    return {
      numViz: 1,
      viz1Data: {},
      viz2Data: {},
      commonData: []
    }
  },

  addViz: function() {
    if (this.state.numViz < 2) {
      this.setState({
        numViz: this.state.numViz + 1
      })
    }
  },

  setViz1Data: function(startDate, endDate, data) {
    var newData = {
      date: [startDate, endDate],
      data: data
    };

    this.setState({
      viz1Data: newData
    });
  },

  setViz2Data: function(startDate, endDate, data) {
    var newData = {
      date: [startDate, endDate],
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
    var result = {
      data: []
    };
    var data1IsEarlier;

    if (!this.state.viz1Data.date[0]) {
      data1IsEarlier = true;
      result.fromDate = 'All Time';
      result.toDate = this.state.viz2Data.date[0].format('MMM Do, YYYY') + ' - ' + this.state.viz2Data.date[1].format('MMM Do, YYYY');
    } else if (this.state.viz2Data.date && !this.state.viz2Data.date[0]) {
      data1IsEarlier = false;
      result.fromDate = 'All Time';
      result.toDate = this.state.viz2Data.date[0].format('MMM Do, YYYY') + ' - ' + this.state.viz2Data.date[1].format('MMM Do, YYYY');
    } else {
      data1IsEarlier = this.state.viz1Data.date[0].diff(this.state.viz2Data.date[0], 'day') <= 0;

      if (data1IsEarlier) {
        result.fromDate = this.state.viz1Data.date[0].format('MMM Do, YYYY') + ' - ' + this.state.viz1Data.date[1].format('MMM Do, YYYY');
        result.toDate = this.state.viz2Data.date[0].format('MMM Do, YYYY') + ' - ' + this.state.viz2Data.date[1].format('MMM Do, YYYY');
      } else {
        result.fromDate = this.state.viz2Data.date[0].format('MMM Do, YYYY') + ' - ' + this.state.viz2Data.date[1].format('MMM Do, YYYY');
        result.toDate = this.state.viz1Data.date[0].format('MMM Do, YYYY') + ' - ' + this.state.viz1Data.date[1].format('MMM Do, YYYY');
      }
    }

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
      };

      if (data1IsEarlier) {
        commonData.values = [value1.count, value2.count];
      } else {
        commonData.values = [value2.count, value1.count];
      }

      result.data.push(commonData);
    }

    this.setState({
      commonData: result
    })
  },

  render: function() {
    var vizs = [];
    for (var i = 0; i < this.state.numViz; i++) {
      if (i == 0) {
        vizs.push(<DataViz setData={this.setViz1Data} key={i} numViz={this.state.numViz} />);
      } else {
        vizs.push(<DataViz setData={this.setViz2Data} key={i} numViz={this.state.numViz} />);
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
          <div className='row'>
            {this.state.commonData.data != null && this.state.commonData.data.length > 0 ? <BarChartCanvas data={this.state.commonData} /> : null}
          </div>
        </div>
      </div>
    )
  }
});

React.render(<App />, mountNode);
