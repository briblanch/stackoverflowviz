var BarChart = require('./BarChart');

var BarChartCanvas = React.createClass({
  componentDidMount: function() {
    this.chart = new BarChart();

    var el = this.getDOMNode();
    this.chart.create(el);
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    if (this.props.data) {
      this.chart.update(this.props.data);
    }
  },

  render: function() {
    return (
      <div className='bar-chart'></div>
    )
  }
});

module.exports = BarChartCanvas;
