const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

const draw = () => 
  myData => {
    let nodes = myData.nodes,
        links = myData.links,
        width = 1200, height = 800,
        simulation = d3.forceSimulation(nodes)
                        .force('charge', d3.forceManyBody().distanceMax(100).distanceMin(40))
                        .force('center', d3.forceCenter(width / 2, height / 2))
                        .force('link', d3.forceLink().links(links))
                        .force("collide", d3.forceCollide().radius(20))
                        .on('tick', ticked),
        tooltip = d3.select('#content')
                      .append('div')
                      .classed('tooltip', true)
                      .style('opacity', 0);
    const dragStart = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.8).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    const drag = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    const dragStop = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
        

function updateLinks() {
  let u = d3.select('.links')
    .selectAll('line')
    .data(links)

  u.enter()
    .append('line')
    .merge(u)
    .attr('x1', function(d) {
      return d.source.x
    })
    .attr('y1', function(d) {
      return d.source.y
    })
    .attr('x2', function(d) {
      return d.target.x
    })
    .attr('y2', function(d) {
      return d.target.y
    })

  u.exit().remove()
}

function updateNodes() {
  let u = d3.select('#content')
    .selectAll('img')
    .data(nodes)

  u.enter()
    .append('img')
    .merge(u)
    .attr('class', d => 'flag flag-' + d.code)
    .style("left",(d)=>{  return (d.x + 145)+"px"; })
    .style("top",(d)=>{  return (d.y + 80)+"px"; })
    .on('mouseover', function(d) {
              tooltip.transition()
                .duration(300)
                .style('opacity', 0.8);
              tooltip.html(d.country)
                .style('left', (d3.event.pageX + 30) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
            })
            .on('mouseout', function(d) {
              tooltip.transition()
                .duration(300)
                .style('opacity', 0);
            })
            .call(d3.drag()
              .on('start', dragStart)
              .on('drag', drag)
              .on('end', dragStop))

  u.exit().remove()
}

function ticked() {
  updateLinks()
  updateNodes()
}
  }

d3.json(url, draw());
