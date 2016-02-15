function barchart(){

	var mapDiv = $("#barchart");

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");

	var svg = d3.select("#barchart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var formatData = [];
	
	d3.csv("data/Swedish_Election_2014.csv", function(error, data) {
		  if (error) throw error;
		  formatData = format(data);
		  console.log(formatData);
   		  draw(data);
	});
	
	function format(data){
		var formatted = {region_id: 0, region_name: "", party_name: [], votes: []};
		var format_array = []
		var j = 0;
		var compare = data[0].region.split(" ");
		formatted.region_id = compare[0];
		if(compare.length == 3){
			formatted.region_name = compare[1] + " " + compare[2];
		}else{ 
			formatted.region_name = compare[1];
		}
		formatted.party_name.push(data[0].party);
		formatted.votes.push(data[0].votes);
		format_array.push(formatted);
		
		for(var i = 1; i <data.length; i++){
			compare = data[i].region.split(" ");
			if(format_array[j].region_id == compare[0]){
				format_array[j].party_name.push(data[i].party);
				format_array[j].votes.push(data[i].votes);
			}else{
				formatted.region_id = compare[0];
				formatted.region_name = compare[1];
				formatted.party_name.push(data[i].party);
				formatted.votes.push(data[i].votes);
				format_array.push(formatted);
				j++;				
			}
			
		}
		return format_array;
	}
	
	function draw(data)
	{
		
	}
	
	
	
	
	
	
	/*d3.tsv("data/data.tsv", type, function(error, data) {
	  if (error) throw error;

	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Frequency");

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.letter); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.frequency); })
		  .attr("height", function(d) { return height - y(d.frequency); });
	});

	function type(d) {
	  d.frequency = +d.frequency;
	  return d;
	}*/
}