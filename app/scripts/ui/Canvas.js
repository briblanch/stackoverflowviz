var Chart = require('./Chart');

var Canvas = React.createClass({
  componentDidMount: function() {
    var el = this.getDOMNode();
    Chart.create(el)
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    if (this.props.data) {
      Chart.update(this.props.data);
    }
  },

  render: function() {
    return (
      <div className='bubbleChart'></div>
    )
  }
});

module.exports = Canvas;
