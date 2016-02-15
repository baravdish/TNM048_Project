function map(data) {
	'use strict';

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;
    

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filteredData_time = [];
	var filteredData_mag = [];
	var filteredData = [];

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

	var magValue = 4;

	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
	
    //Sets the map projection
    var projection = d3.geo.mercator()
				.center([8.25, 56.8])
				.scale(700);

		//Creates a new geographic path generator and assing the projection        
		var path = d3.geo.path().projection(projection);
		
		//Formats the data in a feature collection trougth geoFormat()
		var geoData = {type: "FeatureCollection", features: geoFormat(data)};
		//console.log(geoData.features);
    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries, geoData);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];
		//console.log(array);
        array.map(function (d, i) {
            //Complete the code //done?
			data[i] = {"type": "Feature", "geometry": {
				       "type": "Point", "coordinates": [array[i].lon, array[i].lat]},
					   "properties": {
						   "time" : format.parse(array[i].time), 
							"mag" : array[i].mag,
							"depth" : array[i].depth,
							"id" : array[i].id
							}
					  };
        });
		//console.log(data);
        return data;
    }
	//console.log(geoData.features);

    //Draws the map and the points
    function draw(countries, geoData)
    {
		//console.log("hej");
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

        //draw point        
        var point = g.selectAll(".point").data(geoData.features);
		//console.log(point);
		point.enter().append("path")
					.attr("d", path)
					.attr("class", "point").
					on("mousemove", function(d) {
						//...    
					})
					.on("mouseout", function(d)  {  
						tooltip.transition()
						.duration(200)
						.style("opacity", 0);
					} )
					.on("mouseover", function(d) {
						if(d3.select(this).style("opacity") !== 0){
						tooltip.transition()
						.duration(200)
						.style("opacity", 0.9);
						tooltip.html("Depth : " + d.properties.depth)
						.style("left", (d3.event.pageX + 5) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
						}
					});
					//Complete the code //done
    }

    //Filters data points according to the specified magnitude
    function filterMag(value) {
		magValue = value;
        filteredData = [];
		filteredData_mag = [];
		g.selectAll(".point").attr('opacity', function(d){
			if(d.properties.mag < value){
				return 0;
			}else{
				filteredData_mag.push(d);
			}
		});
		
		for(var i = 0; i <filteredData_mag.length; i++){
			filteredData[i] = filteredData_mag[i];
		}
    }
    
    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        //Complete the code
	filteredData = [];
	filteredData_time = [];
		g.selectAll(".point").attr("opacity", function(d){ 
		//console.log(value[0]);
			if( (d.properties.time <= value[0]) || (d.properties.time >= value[1]) ){
				return 0;
			}else{
				filteredData_time.push(d);
			}
		});	
		//console.log(filteredData_time);
		for(var i = 0; i <filteredData_time.length; i++){
			filteredData[i] = filteredData_time[i];
		}
    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        
		//Complete the code
		//console.log(filteredData_mag);
		//console.log(filteredData_time);
		var kmeansRes = [];
		var test = [];
		var colormap = d3.scale.category20();
		var k = document.getElementById("k").value;
		if(filteredData_time.length > 1){
			kmeansRes = kmeans(filteredData, k, magValue);
		}else if( filteredData_mag.length > 1 ){
			kmeansRes = kmeans(filteredData, k, "time");
		}else{
			kmeansRes = kmeans(filteredData, k, "normal");
		}

		g.selectAll(".point").style("fill", function(d) { 
				for(var j = 0; j < filteredData.length; j++){
					if(d.properties.id == filteredData[j].properties.id){
						return colors[kmeansRes[j]];
					}
				}
		});
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value['place'] + " / Depth: " + value['depth'] + " / Magnitude: " + value['mag'] + "&nbsp;";
    }

}
