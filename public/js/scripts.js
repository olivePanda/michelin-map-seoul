var $category = $('#category');
var $title = $('#title');
var $grade = $('#grade');
var $homepage = $('#homepage');
var $address = $('#address');
var $phone = $('#phone');

var $menu1 = $("#menu1");
var $menu2 = $("#menu2");
var $apply = $("#apply");

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

/* dropdown */
$("#category-menu li a").click(function(){
    $menu1.text($(this).text());
    $menu1.val($(this).text());
});
$("#grade-menu li a").click(function(){
    $menu2.text($(this).text());
    $menu2.val($(this).text());
});

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

$apply.click(function(){
    $('#places').empty();    
    
    $.post("/get_test_position", {category : changeWord($menu1.val()), grade : changeWord($menu2.val())} ,function(data) {
        places.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
            .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
            .attr("id", function(d) { return d.title})
            .attr("onclick", function(d) {return "test("+JSON.stringify(d)+")"})
            .attr("r", 5);
});

});

function changeWord(str) {
    if (str == 'Category' || str == 'Grade') {
        return '';
    } else {
        return str;
    }
}

function test(data) {
    $category.text(data.category);
    $title.text(data.title);
    $grade.text(replaceGrade(data.grade));
    $homepage.empty();
    $homepage.append("<a href='"+data.homepage+"'>바로가기</a>");
    $address.text(data.address);
    $phone.text(data.phone);
}

function replaceGrade(grade) {
    if (grade == 'icon-star3') {
        return '★★★';
    } else if (grade == 'icon-star2') {
        return '★★';
    } else if (grade == 'icon-star') {
        return '★';
    } else if ((grade == 'icon-bib-gourmand')) {
        return '빕구르망';
    } else {
        return 'others';
    }
}