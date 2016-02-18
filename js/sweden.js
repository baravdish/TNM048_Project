function sweden()
{
		// TODO: third area with single plot over time

	var all_mun;
	var mun;
	
	d3.select("#search").on("input", function(){
		barchart1.setSelected_Mun(this.value);
		filterMun(this.value);
	});

	var mapDiv = $("#sweden");
    
	var zoom = d3.behavior.zoom()
						  .scaleExtent([1, 8])
						  .on("zoom", move);

	var margin = {top: 20, right: mapDiv.width() /4, bottom: 20, left: 20},
	  	width = (mapDiv.width() - margin.right - margin.left),
	  	height = mapDiv.height() - margin.top - margin.bottom;

	var projection = d3.geo.albers()
	    .center([5, 70])
	    .rotate([-10, 0])
	    .parallels([30, 60])
	    .scale(700 * 5)
	    .translate([width / 2, 0]);

	var tooltip = d3.select("body").append("div")
									.attr("class", "tooltip")
									.style("opacity", 1);

	var path = d3.geo.path().projection(projection);

//Assings the svg canvas to the map div
    var svg = d3.select("#sweden").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);
						
	d3.json("data/swe_mun.topojson", function(error, data) {
		all_mun = topojson.feature(data, data.objects.swe_mun);
		draw(all_mun);
	});

	function draw(muns) {

		mun = svg.selectAll(".mun").data(muns.features);
		mun.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "black")
			.style("fill", function(d){
					return barchart1.getColor(d.properties.name);
			})
			.on("mouseover", function (d) {
				d3.select("#mapmuntext").select("h1").remove();
				d3.select("#mapmuntext").append("h1").text(d.properties.name);
				d3.select(this)
				  .style("fill", "white");
			})
			.on("mouseout", function(d) {
					
					d3.select(this)
						.style("fill", function(d){
											return barchart1.getColor(d.properties.name);
										});
			}).on("click", function(d) { 
					barchart1.isSelected(d.properties.name);
								});
	}
	
	var year;
	this.year = function(value)
	{
		console.log("hej");
		//var k = document.getElementById("k").value;
	}
	
	function filterMun(value)
	{
		mun.style("fill", function(d){ 
				if (value == d.properties.name){return "white";}
				else{ return barchart1.getColor(d.properties.name);}
			});
	}
	
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        //zoom.translate(t);
        svg.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

}