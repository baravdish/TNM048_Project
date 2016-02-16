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
		.ticks(5, "%");

	var svg = d3.select("#barchart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var formatData = [];
	
	d3.csv("data/Swedish_Election_2014.csv", function(error, data) {
		  if (error) throw error;
		  formatData = format(data);
	});
	var selected_mun;
	
	this.isSelected = function(name)
	{
		selected_mun = name;
		draw(formatData);
	}
	
	function format(data){
		var formatted = {region_id: 0, region_name: "", info: [  ] };
		var format_array = [ ];
		var j = 0;
		var compare = data[0].region.split(" ");
		formatted.region_id = Number(compare[0]);
		if(compare.length == 3){
			formatted.region_name = compare[1] + " " + compare[2];
		}else{ 
			formatted.region_name = compare[1];
		}
		formatted.info.push({party_name: data[0].party, votes: Number(data[0].votes)/100 } );
		format_array.push(formatted);
		
		for(var i = 1; i <data.length; i++){
			compare = data[i].region.split(" ");
			//console.log();
			if(Number(format_array[j].region_id) == Number(compare[0])){
				if(!isNaN(data[i].votes)){
					
					format_array[j].info.push({party_name: data[i].party, votes: Number(data[i].votes)/100 } );
				}else{}
			}else{
				formatted = {};
				formatted.region_id = Number(compare[0]);
				if(compare.length == 3){
					formatted.region_name = compare[1] + " " + compare[2];
				}else{ 
					formatted.region_name = compare[1];
				}
				formatted.info = [];
				formatted.info.push({party_name: data[i].party, votes: Number(data[i].votes)/100 } );
				format_array.push(formatted);
				formatted = {region_id: 0, region_name: "", info: [{party_name: "", votes: 0 }]  };
				j++;				
			}
		//console.log(formatted.region_name);
		}
		//console.log(format_array);
		return format_array;
	}
	
	function draw(data)
	{
		svg.selectAll(".bar").remove();
		svg.selectAll(".axis").remove();	


		for(var i = 0; i <data.length; i++){
			//console.log("selected_mun == data[i].region_name => " + selected_mun + " == " + data[i].region_name);
			console.log(selected_mun);
			console.log(data[i].region_name);
			if(selected_mun == data[i].region_name){
			console.log(data[i]);
				x.domain(data[i].info.map(function(d) {return d.party_name; }));
				y.domain([0, d3.max(data[i].info, function(d) { return d.votes; } ) ] );
				console.log(y.range());	

				 svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
				.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 5)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Percent"); 
				//console.log(data[i].info);
				
				svg.selectAll(".bar")
				   .data(data[i].info)
				   .enter().append("rect")
				   .attr("class", "bar")
				   .attr("x", function(d) { 
									//console.log("x(d.party) = " + x(d.party));
									return x(d.party_name); 
								})
				   .attr("width", x.rangeBand())
				   .attr("y", function(d) { 
									//console.log("y(d.vote) = " + y(d.vote));
									return y(d.votes);  
								})
				   .attr("height", function(d) {		  
										return (height - y(d.votes));  
									});
				break;
			}
		}
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