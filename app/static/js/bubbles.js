
// SET THE VARIABLES
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 100
},

width = 1500 - margin.left - margin.right,
height = 550 - margin.top - margin.bottom;

var radius = d3.scale.sqrt().range([30, 30]);
var padding = 5;
var nodes = 
    	[
        {   "title" : "Loan Amount", 
            "desc" : "How much do you want to borrow?",
            "impt" : "This is important because...",
            "color" : "lightpink",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325}, 

        {   "title" : "Term", 
            "desc" : "Length of the loan you may apply for",
            "impt" : "This is important because...",
            "color" : "lightsalmon",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325}, 

        {   "title" : "Employment Length", 
            "desc" : "This is the length you have been employed for your entire career",
            "impt" : "This is important because...",
            "color" : "lightcoral",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Home Ownership", 
            "desc" : "Do you own a home, have a mortgage, or rent?",
            "impt" : "This is important because...",
            "color" : "firebrick",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Annual Income", 
            "desc" : "How much will you earn this year?",
            "impt" : "This is important because...",
            "color" : "slategray",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Zip Code", 
            "desc" : "Where do you live?",
            "impt" : "This is important because...",
            "color" : "mistyrose",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "DTI", 
            "desc" : "What is the ratio of your debt to income?",
            "impt" : "This is important because...",
            "color" : "darkkhaki",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Recent Delinquencies", 
            "desc" : "Have you missed any payments or defaulted in the last two years?",
            "impt" : "This is important because...",
            "color" : "lavender",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Recent Inquiries", 
            "desc" : "Have you missed any payments or defaulted in the last two years?",
            "impt" : "This is important because...",
            "color" : "lightgreen",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Months Since Last Delincuency", 
            "desc" : "Have you missed any payments or defaulted in the last two years?",
            "impt" : "This is important because...",
            "color" : "lightcyan",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Open Accounts", 
            "desc" : "How many open accounts do you have?",
            "impt" : "This is important because...",
            "color" : "sienna",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Total Accounts", 
            "desc" : "How many open accounts have you ever had?",
            "impt" : "This is important because...",
            "color" : "steelblue",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Revolving Balances", 
            "desc" : "What is the balance you have on all of your current open accounts?",
            "impt" : "This is important because...",
            "color" : "plum",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Credit Length", 
            "desc" : "How long have you had credit in your entire life?",
            "impt" : "This is important because...",
            "color" : "seagreen",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325},

        {   "title" : "Revolving Balance / Annual Income", 
            "desc" : "What's your revolving balance / annual income?",
            "impt" : "This is important because...",
            "color" : "darkturquoise",
            "radius" : 50,
            "cx" : 350,
            "cy" : 325}
      ]
;

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", function (d) {
    return d.radius;
})
    .style("fill", function (d) {
    return d.color;
})
    .call(force.drag);

function tick(e) {
    circle.each(gravity(.2 * e.alpha))
        .each(collide(.5))
        .attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
    return function (d) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
    };
}

// Resolve collisions between nodes.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = d.radius + radius.domain()[1] + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

// RESOLVE COLLISIONS BETWEEN NODES
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
        var r = 20 + radius.domain()[1] + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}

// CREATE THE SVG OBJECTS
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", function (d) { return d.radius; })
    .style("fill", function (d) { return d.color})
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .call(force.drag)

// CREATE MOUSE EVENT HANDLERS
function handleMouseOver(d) { 

    d3.select(this)
        .transition().duration(100)
        .style("fill", "lightgray");

    svg.append("text")
        .attr({
            id: "id",  
            x: d.x,
            y: d.y + 11
            })
        .text(function() { return d.title; });

    svg.append("text").attr({
            id: "id2",  
            x: 1000,
            y: 200
            })
        .text(function() { return d.desc; });

    svg.append("text").attr({
            id: "id3",  
            x: 1000,
            y: 325
            })
        .text(function() { return d.impt; });
        

}

function handleMouseOut(d) {
    d3.select(this)
        .transition().duration(100)
        .attr({
            r: 50
        })
        .style("fill", function(d) { return d.color});

    d3.select("#id").remove();
    d3.select("#id2").remove();
    d3.select("#id3").remove();  // Remove text location
};

console.log(nodes);
 
