var Chart = function() {
  var margin = 20;
  var diameter = 960;
  var format = d3.format(',d');
  var chartContainer;
  var svg;
  var circles;
  var labels;
  var focus;
  var nodesData;
  var view;

  var color = d3.scale.linear()
    .domain([-1, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) { return d.size; });

  var create = function(el) {
    chartContainer = d3.select(el);
    chartContainer.style('width', diameter + 'px')
                  .style('height', diameter + 'px');

    svg = chartContainer.append('svg')
                        .attr('width', '100%')
                        .attr('height', '100%')
                        .append('g')
                        .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');
  }

  function dataKey(d) {
    var parents = [];
    var it = d.parent;
    while (it) {
      parents.unshift(it.name);
      it = it.parent;
    }
    return (parents.length > 0) ? parents.join('>>') + '>>' + d.name : d.name;
  }

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = svg.transition()
      .duration(750)
      .tween('zoom', function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) { zoomTo(i(t), true); };
      });

    transition
      .selectAll('text')
      .filter(function(d) { return d.parent === focus || this.style.display === 'inline'; })
      .style('fill-opacity', function(d) { return d.parent === focus ? 1 : 0; })
      .each('start', function(d) { if (d.parent === focus) this.style.display = 'inline'; })
      .each('end', function(d) { if (d.parent !== focus) this.style.display = 'none'; });
  }

  function zoomTo(v, inTransition) {
    var k = diameter / v[2];
    view = v;
    function transform(d) {
      return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')';
    }
    function delay(d, i) {
      return (1 - (nodesData.length - i) / nodesData.length) * 250;
    }
    if (!inTransition) {
      labels.transition()
             .delay(delay)
             .attr('transform', transform)
             ;
      circles.transition()
             .delay(delay)
             .attr('transform', transform)
             .attr('r', function(d) { return d.r * k; })
             ;
    } else {
      labels.attr('transform', transform);
      circles.attr('transform', transform)
             .attr('r', function(d) { return d.r * k; });
    }
  }

  var update = function(data) {
    var root = $.extend(true, {}, data);
    focus = root;
    nodesData = pack.nodes(root);
    view = null;

    circles = svg.selectAll('circle')
      .data(nodesData, dataKey);
    // Add new circles
    circles
      .enter()
      .append('circle')
      .attr('class', function(d) { return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root'; })
      .style('fill', function(d) { return d.children ? color(d.depth) : null; })
      .on('click', function(d) {
        if (focus !== d && d.children) zoom(d);
        d3.event.stopPropagation();
      })
      .append('title')
      .text(function(d) { return d.name + ': ' + format(d.value); })
      ;
    // Delete old circles
    circles.exit().remove();

    labels = svg.selectAll('text')
      .data(nodesData, dataKey);
    // Add new labels
    labels.enter().append('text')
      .attr('class', 'label')
      .style('fill-opacity', function(d) { return d.parent === root ? 1 : 0; })
      .style('display', function(d) { return d.parent === root ? 'inline' : 'none'; })
      .text(function(d) { return d.name; });
    // Delete old labels
    labels.exit().remove();

    chartContainer.on('click', null);
    chartContainer.on('click', function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin], false);
  }

  return {
    create: create,
    update: update
  }
}

module.exports = Chart;
