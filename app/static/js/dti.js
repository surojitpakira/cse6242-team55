var fileName = "./dti_summary_ALL.csv";
var dtibins = [ "0%-4.9%", "5%-9.9%", "10%-14.9%", "15%-19.9%", "20%-24.9%", 
                        "25%-29.9%", "30%-49.9%", "50%-74.9%", "75%-99.9%", "100%-199.9%",
                        "200%-499.9%", "500%+"]

d3.csv(fileName, function(error, data) {
    var dtibinMap = {};
    data.forEach(function(d) {
        var Bins = d.Bins;
        dtibinMap[Bins] = [];
        dtibins.forEach(function(field) {
            dtibinMap[Bins].push( +d[field] );
        });
    });
    makedtiViz(dtibinMap);
});

var makedtiViz = function(dtibinMap) {

    // Define dimensions of vis
    var margin = { top: 30, right: 50, bottom: 100, left: 50 },
        width  = 700 - margin.left - margin.right,
        height = 350 - margin.top  - margin.bottom;

    // Make x scale
    var xScale = d3.scale.ordinal()
        .domain(dtibins)
        .rangeRoundBands([0, width], 0.1);  

    // Make y scale, the domain will be defined on bar update
    var yScale = d3.scale.linear()
        .range([height, 0]);

    // Create canvas
    var canvas = d3.select("#dti_object")
      .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                });;;

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
        .text("Percent Accepted");

    var updateBars = function(data) {
        // First update the y-axis domain to match data
        yScale.domain( d3.extent(data) );
        yAxisHandleForUpdate.call(yAxis);

        var bars = canvas.selectAll(".bar").data(data);

        // Add bars for new data
        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return xScale( dtibins[i] ); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d,i) { return yScale(d); })
            .attr("height", function(d,i) { return height - yScale(d); });

        // Update old ones, already have x / width from before
        bars
            .transition().duration(250)
            .attr("y", function(d,i) { return yScale(d); })
            .attr("height", function(d,i) { return height - yScale(d); })

        // Remove old ones
        bars.exit().remove();
    };

    // Handler for dropdown value change
    var dropdownChange = function() {
        var dtinewBen = d3.select(this).property('value'),
            newData   = dtibinMap[dtinewBen];

        updateBars(newData);
    };

    // Get names of dtiamounts, for dropdown
    var dtiamounts = Object.keys(dtibinMap);

    var dropdown = d3.select("#dti_object")
        .insert("select", "svg")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
        .data(dtiamounts)
      .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d // capitalize 1st letter
        });

    var initialData = dtibinMap[ dtiamounts[0] ];
    updateBars(initialData);

};