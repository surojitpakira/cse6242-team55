var fileName = "./static/csv/employment_summary_ALL.csv";
var employmentyears = ["< 1 year", "1 year", "2 years", "3 years", 
                        "4 years", "5 years", "6 years", "7 years",     
                        "8 years", "9 years", "10+ years"];

d3.csv(fileName, function(error, data) {
    var binMap = {};
    data.forEach(function(d) {
        var Bins = d.Bins;
        binMap[Bins] = [];
        employmentyears.forEach(function(field) {
            binMap[Bins].push( +d[field] );
        });
    });
    makeVis(binMap);
});

var makeVis = function(binMap) {

    // Define dimensions of vis
    var margin = { top: 30, right: 50, bottom: 100, left: 50 },
        width  = 500 - margin.left - margin.right,
        height = 275 - margin.top  - margin.bottom;

    // Make x scale
    var xScale = d3.scale.ordinal()
        .domain(employmentyears)
        .rangeRoundBands([0, width], 0.1);

    // Make y scale, the domain will be defined on bar update
    var yScale = d3.scale.linear()
        .range([height, 0]);

    // Create canvas
    var canvas = d3.select("#chart2")
      .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("font-size", "10px");

    // Make x-axis and add to canvas
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                })
            .style("font-size", "10px");

    // Make y-axis and add to canvas
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var yAxisHandleForUpdate = canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percent Accepted")
        .style("font-size", "10px");

    var updateBars = function(data) {
        // First update the y-axis domain to match data
        yScale.domain( d3.extent(data) );
        yAxisHandleForUpdate.call(yAxis);

        var bars = canvas.selectAll(".bar").data(data);

        // Add bars for new data
        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return xScale( employmentyears[i] ); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d,i) { return yScale(d); })
            .attr("height", function(d,i) { return height - yScale(d); });

        // Update old ones, already have x / width from before
        bars
            .transition().duration(250)
            .attr("y", function(d,i) { return yScale(d); })
            .attr("height", function(d,i) { return height - yScale(d); });

        // Remove old ones
        bars.exit().remove();
    };

    // Handler for dropdown value change
    var dropdownChange = function() {
        var newBin = d3.select(this).property('value'),
            newData   = binMap[newBin];

        updateBars(newData);
    };

    // Get names of cereals, for dropdown
    var cereals = Object.keys(binMap);

    var dropdown = d3.select("#chart2")
        .insert("select", "svg")
        .on("change", dropdownChange)
        .style("font-size", "10px");

    dropdown.selectAll("option")
        .data(cereals)
      .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d // capitalize 1st letter
        });

    var initialData = binMap[ cereals[0] ];
    updateBars(initialData);

};
