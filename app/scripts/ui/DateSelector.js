var DatePicker = require('react-day-picker');
var moment = require('moment');

var DateSelector = React.createClass({
  getInitialState: function() {
    return {
      showDatePicker: false,
      currentId: null,
      minDate: null,
      maxDate: moment(),
      selectedDay: null
    }
  },

  handleOnFocus: function(e) {
    var targetId = e.target.id;

    if (targetId == 'from') {
      this.props.fromDateSelected(null);
      this.props.toDateSelected(null);

      this.setState({
        minDate: null,
        maxDate: moment()
      });
    } else {
      this.setState({
        maxDate: moment()
      })
    }

    this.setState({
      showDatePicker: true,
      currentId: targetId
    })
  },

  handleDateSelect: function(day, modifiers, event) {
    React.findDOMNode(this.refs.all).checked = false;
    React.findDOMNode(this.refs.month).checked = false;
    React.findDOMNode(this.refs.week).checked = false;

    if (this.state.currentId == 'from') {
      this.props.fromDateSelected(day);
      this.setState({
        minDate: day
      });

      React.findDOMNode(this.refs.toInput).focus();
    } else {
      this.props.toDateSelected(day);
      this.setState({
        currentId: null,
        maxDate: moment,
        showDatePicker: false
      });
    }
  },

  dismiss: function() {
    this.setState({
      showDatePicker: false
    })
  },

  handleBlur: function(e) {
    this.setState({
      showDatePicker: false
    })
  },

  onAllChange: function(e) {
    React.findDOMNode(this.refs.month).checked = false;
    React.findDOMNode(this.refs.week).checked = false;

    if (e.target.checked) {
      this.props.allTimeSelected();
    }
  },

  onMonthChange: function(e) {
    React.findDOMNode(this.refs.all).checked = false;
    React.findDOMNode(this.refs.week).checked = false;

    if (e.target.checked) {
      var now = moment();
      var lastMonth = moment(now).subtract(1, 'month');
      this.props.fromDateSelected(lastMonth);
      this.props.toDateSelected(now);
    }
  },

  onWeekChange: function(e) {
    React.findDOMNode(this.refs.all).checked = false;
    React.findDOMNode(this.refs.month).checked = false;

    if (e.target.checked) {
      var now = moment();
      var lastWeek = moment(now).subtract(1, 'week');
      this.props.fromDateSelected(lastWeek);
      this.props.toDateSelected(now);
    }
  },

  modifiers: function() {
    return {
      today: function (day) {
        // add the `today` modifier for the current day
        return moment().isSame(day, 'day');
      },
      disabled: function (day) {
        day = day.startOf('day');
        var today = moment().startOf('day');

        if (!this.state.minDate) {
          return day.diff(today, 'day') > 0;
        } else {
          var minDate = this.state.minDate.startOf('day');
          return day.diff(today, 'day') > 0 || day.diff(minDate, 'day') < 0;

        }
      }.bind(this)
    };
  },

  render: function() {
    var fromDateString = this.props.fromDate ? this.props.fromDate.format('L') : null;
    var toDateString = this.props.toDate ? this.props.toDate.format('L') : null;

    return (
      <div className='vertical-center'>
        <form className='form-inline'>
          <div className='form-group overlay'>
            <input className='form-control'
              id='from'
              ref='fromInput'
              value={fromDateString}
              onFocus={this.handleOnFocus}
              placeholder="from..."
            />
          </div>
          <div className='form-group overlay'>
            <input className='form-control'
              id='to'
              ref='toInput'
              value={toDateString}
              onFocus={this.handleOnFocus}
              placeholder='to...'
            />
          </div>
          <div className='checkbox'>
            <label>
              <input type='checkbox'
                ref='all'
                onChange={this.onAllChange}
              /> All Time
            </label>
          </div>
          <div className='checkbox'>
            <label>
              <input type='checkbox'
                ref='month'
                onChange={this.onMonthChange}
              /> Last Month
            </label>
          </div>
          <div className='checkbox'>
            <label>
              <input type='checkbox'
                ref='week'
                onChange={this.onWeekChange}
              /> Last Week
            </label>
          </div>
          {this.state.showDatePicker ? <div className='dismiss' onClick={this.dismiss}></div> : null}
          <div>
            {this.state.showDatePicker ? <DatePicker className='overlay' modifiers={this.modifiers()}
                                            onDayClick={this.handleDateSelect}
                                          /> : null}
          </div>
        </form>
      </div>
    )
  }
})

module.exports = DateSelector;
