var nvd3 = require('nvd3');

var BarChart = function() {
  var chartContainer;
  var chart;

  var percentageFormat = function(d) { return d + '%'; };

  function getChangePercentage(values) {
    var startCount = values[0];
    var endCount = values[1];
    return ((endCount - startCount) / startCount) * 100;
  }

  function formatForC3(originalDataObj) {
    return [originalDataObj.name, getChangePercentage(originalDataObj.values)];
  }

  function formatForNvd3(originalDataObj) {
    return {
      label: originalDataObj.name,
      value: getChangePercentage(originalDataObj.values)
    };
  }

  function create(el) {
    chartContainer = d3.select(el);
    nv.addGraph(function() {
      chart = nv.models.discreteBarChart()
                    .margin({top: 10, right: 10, bottom: 10, left: 85})
                    .x(function(d) { return d.label;  })
                    .y(function(d) { return d.value;  })
                    .staggerLabels(true)
                    .tooltips(true)
                    .showValues(true)
                    .transitionDuration(350)
                    ;

      chart.yAxis
           .showMaxMin(false)
           .axisLabel('Percent Change')
           .tickFormat(percentageFormat);

      chartContainer.append('svg')
                    .datum([])
                    .attr('class', 'bar')
                    .call(chart)
                    ;

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }

  function updateTitle(newTitle) {
    var svg = chartContainer.select('svg');
    var title = svg.selectAll('.title')
                   .data([newTitle], function(x) { return x; });
    title.enter()
         .append('text')
         .attr('class', 'title')
         .attr('x', svg.node().getBoundingClientRect().width / 2)
         .attr('y', 16)
         .attr('text-anchor', 'middle')
         .style('font-size', '1.4em')
         .text(function(d) { return d; })
         ;
    title.exit().remove();
  }

  function update(data) {
    nv.addGraph(function() {
      chartContainer.select('svg')
                    .datum([{
                      values: data.data.map(formatForNvd3).sort(function(a, b) {
                        return Math.abs(b.value) - Math.abs(a.value);
                      }).slice(0, 10)
                    }])
                    .call(chart)
                    ;
      return chart;
    });

    var title = 'Percent Difference from ' + data.fromDate + ' to ' + data.toDate;

    setTimeout(function() { updateTitle(title); }, 1000);
  }

  return {
    create: create,
    update: update
  };
};

module.exports = BarChart;
