var Chart = require('./Chart');

var Canvas = React.createClass({
  componentDidMount: function() {
    this.chart = new Chart();

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
      <div className='bubble-chart'></div>
    )
  }
});

module.exports = Canvas;
