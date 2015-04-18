var DateSelector = require('./DateSelector');
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
      api.getTagsForDates(this.state.fromDate, this.state.toDate, function(result) {
        this.setState({
          data: result
        })
      }.bind(this));
    }
  },

  getDataForAllTime: function() {
    this.setState({
      fromDate: null,
      toDate: null
    });

    api.getAllTimeTags(function(result) {
      this.setState({
        data:result
      })
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
      </div>
    )
  }
});

module.exports = DataViz;
