function sweden()
{
		// TODO: zoom
		// TODO: third area with single plot over time

	var single_mun;

	var mapDiv = $("#sweden");
    
	var zoom = d3.behavior.zoom()
						  .scaleExtent([0.5, 8])
						  .on("zoom", move);

	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	  	width = mapDiv.width() - margin.right - margin.left,
	  	height = mapDiv.height() - margin.top - margin.bottom;

	var projection = d3.geo.albers()
	    .center([20, 70])
	    .rotate([-10, 0])
	    .parallels([30, 60])
	    .scale(700 * 5)
	    .translate([width / 2, 0]);

	var tooltip = d3.select("body").append("div")
									.attr("class", "tooltip")
									.style("opacity", 1);

	var path = d3.geo.path().projection(projection);

	var svg = d3.select("#sweden")
					   .append("svg")
	    			   .attr("width", width)
	    			   .attr("height", height);
						
	d3.json("data/swe_mun.topojson", function(error, data) {
		single_mun = topojson.feature(data, data.objects.swe_mun);
		draw(single_mun);
	});

	function draw(muns) {

		var mun = svg.selectAll(".mun").data(muns.features);
		mun.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "black")
			.on("mouseover", function (d) {
				
				d3.select(this)
				  .style("fill", "red");

				tooltip.transition()
			  			 .style("opacity", 1);

				tooltip.html("<h1> Municipal: " + d.properties.name + "</h1>")
							 .style("left", (d3.event.pageX + 20) + "px")
							 .style("top", (d3.event.pageY - 70) + "px");
			})
			.on("mouseout", function(d) {
					
					d3.select(this)
						.style("fill", d.color);
					
					tooltip.transition()
								 .style("opacity", 0);
			}).on("click", function(d) { 
					d3.select("#barChartText").select("h1").remove();
					d3.select("#barChartText").append("h1").text(d.properties.name);
					barchart1.isSelected(d.properties.name);
								});
	}
	
	    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

}