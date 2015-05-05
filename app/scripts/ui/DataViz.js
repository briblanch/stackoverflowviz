var DateSelector = require('./DateSelector');
var Canvas = require('./Canvas');
var api = require('../api');

var DataViz = React.createClass({
  getInitialState: function() {
    return {
      fromDate: null,
      toDate: null,
      data: null
    }
  },

  fromDateSelected: function(date) {
    this.setState({
      fromDate: date
    });
  },

  toDateSelected: function(date) {
    this.setState({
      toDate: date
    });
  },

  componentDidUpdate: function(prevState, prevState) {
    if (!(this.state.toDate == prevState.toDate && this.state.fromDate == prevState.fromDate)) {
      this.getDataForDates();
    }
  },

  getDataForDates: function() {
    if (this.state.fromDate && this.state.toDate) {
      api.getDataForDates(this.state.fromDate, this.state.toDate, function(result) {
        this.setState({
          data: result
        })

        this.props.setData(this.state.fromDate, this.state.toDate, result);
      }.bind(this));
    }
  },

  getDataForAllTime: function() {
    this.setState({
      fromDate: null,
      toDate: null
    });

    api.getDataForAllTime(function(result) {
      this.setState({
        data: result
      })

      this.props.setData(null, null, result);
    }.bind(this));
  },

  render: function() {
    var colNum = 12 / this.props.numViz;

    return (
      <div className={'col-md-' + colNum}>
        <DateSelector
          fromDateSelected={this.fromDateSelected}
          toDateSelected={this.toDateSelected}
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          allTimeSelected={this.getDataForAllTime}
        />
        <Canvas key={this.props.key} data={this.state.data} />
      </div>
    )
  }
});

module.exports = DataViz;
