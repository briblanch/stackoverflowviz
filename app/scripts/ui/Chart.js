var Chart = function() {
  var diameter = 750;
  var format = d3.format(',d');
  var color = d3.scale.linear()
                .domain([0, 50])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl)
                ;

  var bubble = d3.layout.pack()
                        .sort(null)
                        .size([diameter, diameter])
                        .padding(1.5)
                        ;

  var chartContainer;
  var svg;

  d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
      this.parentNode.appendChild(this);
    });
  };

  function create(el) {
    chartContainer = d3.select(el);
    chartContainer.style('width', diameter + 'px')
                  .style('height', diameter + 'px')
                  ;

    svg = chartContainer.append('svg')
                        .attr('width', '100%')
                        .attr('height', '100%')
                        .attr('class', 'bubble')
                        ;
  }

  function formatTagDataPoint(dataPoint) {
    return {
      name: dataPoint.name,
      value: dataPoint.children.map(function(x) { return x.size; }).reduce(function(a, b) { return a + b; }, 0)
    };
  }

  function update(data) {
    var tags = {children: data.children.map(formatTagDataPoint)};
    var node = svg.selectAll('.node')
      .data(bubble.nodes(tags).filter(function(d) { return !d.children; }),
          function(d) { return d.name; });

    // Add new nodes
    var newNodes = node.enter()
                       .append('g')
                       .attr('class', 'node')
                       .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    newNodes.append('title')
            .text(function(d) { return d.name + ': ' + format(d.value);  });

    newNodes.append('circle')
            .attr('class', 'bubble')
            .attr('r', 0)
            .style('fill', function(d, i) { return color(i); })
            .style('stroke', function(d, i) { return d3.rgb(color(i)).darker(1); })
            .transition()
            .delay(function(d, i) { return (tags.children.length - i) / tags.children.length * 250; })
            .attr('r', function(d) { return d.r; });

    newNodes.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .text(function(d) { return d.name.substring(0, d.r / 4); })
            .style('opacity', 0)
            .transition()
            .delay(function(d, i) { return (tags.children.length - i) / tags.children.length * 250; })
            .style('opacity', 1)
            ;

    // Update existing nodes
    node.transition()
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    node.select('title')
        .text(function(d) { return d.name + ': ' + format(d.value);  });

    node.select('circle')
        .transition()
        .attr('r', function(d) { return d.r; });

    node.select('text')
        .text(function(d) { return d.name.substring(0, d.r / 4); });

    svg.selectAll('.node')
       .on('mouseover', null)
       .on('mouseover', function() {
         d3.select(this).moveToFront();
       });

    // Remove any unneeded nodes
    node.exit().remove();
  }

  return {
    create: create,
    update: update
  };
};

module.exports = Chart;
