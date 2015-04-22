var c3 = require('c3');

var sampleData = [
  {
    name: "java",
    values: [100, 120]
  },
  {
    name: "javascript",
    values: [20, 40]
  },
  {
    name: "react",
    values: [50, 25]
  },
];

var BarChart = function() {
  var chart;
  var chartContainer;

  function getChangePercentage(values) {
    var startCount = values[0];
    var endCount = values[1];
    return ((endCount - startCount) / startCount) * 100;
  }

  function formatForC3(originalDataObj) {
    return [originalDataObj.name, getChangePercentage(originalDataObj.values)];
  }

  function create(el) {
    chartContainer = d3.select(el);
    chart = c3.generate({
      bindto: chartContainer,
      data: {
        columns: [],
        type: 'bar'
      },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      axis: {
        x: {
          show: false
        },
        y: {
          tick: {
            format: function(x) { return x + '%'; }
          }
        }
      },
      grid: {
        y: {
          show: true
        }
      }
    });

    // For testing:
    // chart.load({columns: sampleData.map(formatForC3)});
    updateTitle('Test Title');
  }

  function updateTitle(newTitle) {
    var title = chartContainer.select('svg')
      .selectAll('.title')
      .data([newTitle], function(x) { return x; });
    title.enter()
      .append('text')
      .attr('x', chartContainer.select('svg').node().getBoundingClientRect().width / 2)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.4em')
      .text(function(d) { return d; })
      ;
    title.exit().remove();
  }

  function update(data) {
    chart.load({columns: data.map(formatForC3)});

    //updateTitle(newTitle);
  }

  return {
    create: create,
    update: update
  };
};

module.exports = BarChart;
