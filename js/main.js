var area1;
var map1;

//var format = d3.time.format.utc.("%Y-%m-%dT%H:%M:%S.%LZ");
/*
function type(d){ //never called, ask "why?"
		d.id = +d.id;
		d.time = format.parse(d.time);
		d.lat = +d.lat;
		d.lon = +d.lon;
		d.depth = +d.depth;
		d.mag = +d.mag;
		d.place = +d.place;
		//console.log(d);
		return d;		
}*/

d3.csv("data/data.csv", function (data) {

    area1 = new area(data);
    map1 = new map(data);
	
});