var width = 1200;
var height = 800;

var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height);

var projection = d3.geo.mercator()
                        .center([126.9895, 37.5651])
                        .scale(100000)
                        .translate([width/2, height/2]);

var map = svg.append("g").attr("id", "map");
var places = svg.append("g").attr("id", "places");
var path = d3.geo.path().projection(projection);

function test(data) {
    console.log(data.category);
    console.log(data.title);
    console.log(data.grade);
    console.log(data.homepage);
    console.log(data.address);
    console.log(data.phone);
}

$.get("/get_seoul_topojson", function(data) {
    var features = topojson.feature(data, data.objects.seoul_municipalities_geo).features;
    map.selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("class", function(d) { console.log(); return "municipality c" + d.properties.code })
        .attr("d", path);
            
    map.selectAll("text")
        .data(features)
        .enter().append("text")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("class", "municipality-label")
        .text(function(d) { return d.properties.name; })
})

$.get("/get_res_position", function(data) {
    places.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
        .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
        .attr("id", function(d) { return d.title})
        .attr("onclick", function(d) {return "test("+JSON.stringify(d)+")"})
        .attr("r", 5);
});