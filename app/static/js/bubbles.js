
// SET THE VARIABLES
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
},
width = 1500 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

var radius = d3.scale.sqrt().range([25, 25]);
var padding = 5;
var nodes = 
    	[
        {   "title" : "Loan Amount", 
            "desc" : "How much do you want to borrow?",
            "impt" : "This is the largest determinate in whether or not your loan will be accepted.",
            "color" : "lightpink",
            "color2" : "lightsalmon",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Term", 
            "desc" : "How long do you want to repay your loan?",
            "impt" : "Choose 36 or 60. Shorter loans will have larger monthly payments.",
            "color" : "lightsalmon",
            "color2" : "lightcoral",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Employment Length", 
            "desc" : "This is the length you have been employed for your entire career",
            "impt" : "This is important because longer employment demonstrates lower risk.",
            "color" : "lightcoral",
            "color2" : "firebrick",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Home Ownership", 
            "desc" : "Do you own a home, have a mortgage, or rent?",
            "impt" : "Owning a home increase the amount of money you can borrow.",
            "color" : "slategray",
            "color2" : "lightpink",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Annual Income", 
            "desc" : "How much will you earn this year?",
            "impt" : "The more you earn, the more you can borrow.",
            "color" : "slategray",
            "color2" : "mediumseagreen",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Zip Code", 
            "desc" : "Where do you live?",
            "impt" : "Our analysis has determined different locations carry different risks.",
            "color" : "MediumSeaGreen",
            "color2" : "darkkhaki",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "DTI", 
            "desc" : "What is the ratio of your debt to income?",
            "impt" : "The lower your DTI, the lower your risk of defaulting.",
            "color" : "darkkhaki",
            "color2" : "orchid",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Recent Delinquencies", 
            "desc" : "Have you missed any payments or defaulted in the last two years?",
            "impt" : "Missing payments is a bad thing and demonstrates series risk.",
            "color" : "Orchid",
            "color2" : "lightgreen",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Recent Inquiries", 
            "desc" : "Have you missed any payments or defaulted in the last two years?",
            "impt" : "Inquires may reduce your credit score as lenders may see too much activity as risky.",
            "color" : "lightgreen",
            "color2" : "royalblue",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Months Since Last Delincuency", 
            "desc" : "Have you missed any payments or defaulted in the last two years?",
            "impt" : "Missing payments is a bad thing and demonstrates series risk.",
            "color" : "RoyalBlue",
            "color2" : "sienna",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Open Accounts", 
            "desc" : "How many open accounts do you have?",
            "impt" : "A low DTI combined with many open accounts could show you're a responsible borrower.",
            "color" : "sienna",
            "color2" : "steelblue",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Total Accounts", 
            "desc" : "How many open accounts have you ever had?",
            "impt" : "More accounts indicate more credit. If you handled it responsibly, that's a good thing.",
            "color" : "steelblue",
            "color2" : "plum",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Revolving Balances", 
            "desc" : "What is the balance you have on all of your current open accounts?",
            "impt" : "Having high revolving balances lowers your chances of getting a loan.",
            "color" : "plum",
            "color2" : "seagreen",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Credit Length", 
            "desc" : "How long have you had credit in your entire life?",
            "impt" : "Lenders like a long, rich history of credit, especially when handled responsibly.",
            "color" : "seagreen",
            "color2" : "darkturquoise",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 

        {   "title" : "Revolving Balance / Annual Income", 
            "desc" : "What's your revolving balance / annual income?",
            "impt" : "A low ratio for this metric indicates a better likelihood of repayment.",
            "color" : "darkturquoise",
            "color2" : "lightpink",
            "radius" : 25,
            "cx" : 250,
            "cy" : 150}, 
      ]
;

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", function (d) { return d.radius; })
    .style("fill", function (d) { return d.color})
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .call(force.drag)

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



// CREATE MOUSE EVENT HANDLERS
function handleMouseOver(d) { 

    d3.select(this)
        .transition().duration(150)
        .style("fill", "lightgray");

    svg.append("text")
        .attr({
            id: "id",  
            x: d.x,
            y: d.y + 6
            })
        .text(function() { return d.title; })
        .attr("font-size", 15);


    svg.append("text").attr({
            id: "id2",  
            x: 900,
            y: 125
            })
        .text(function() { return d.desc; })
        .attr("fill", function() { return d.color; })
        .attr("font-size", 15);


    svg.append("text").attr({
            id: "id3",  
            x: 900,
            y: 200
            })
        .text(function() { return d.impt; })
        .attr("fill", function() { return d.color2; })
        .attr("font-size", 20);
        

}

function handleMouseOut(d) {
    d3.select(this)
        .transition().duration(150)
        .attr({
            r: 25
        })
        .style("fill", function(d) { return d.color});

    d3.select("#id").remove();
    d3.select("#id2").remove();
    d3.select("#id3").remove();  // Remove text location
};
 
