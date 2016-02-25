function plot()
{
	var mapDiv = $("#barchart");
		
	var formatData_2002 = [];
	var formatData_2006 = [];
	var formatData_2010 = [];
	var formatData = [];
	var dataArray = [];

	d3.csv("data/Swedish_Election_2002.csv", function(error, data) {
	  if (error) throw error;
	  formatData_2002 = format(data);
	  dataArray.push(formatData_2002);

		d3.csv("data/Swedish_Election_2006.csv", function(error, data) {
		  if (error) throw error;
		  formatData_2006 = format(data);
		  dataArray.push(formatData_2006);
		  
		  d3.csv("data/Swedish_Election_2010.csv", function(error, data) {
			  if (error) throw error;
			  formatData_2010 = format(data);
			  dataArray.push(formatData_2010);
			  
			  d3.csv("data/Swedish_Election_2014.csv", function(error, data) {
			  	if (error) throw error;
			  	formatData = format(data);
			  	dataArray.push(formatData);
			  	formatTime(dataArray);
				});
			});
		});
	});


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
		}
		return format_array;
	}

	function formatTime(data) {
		draw(data);
	}


	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var xScale = d3.scale.linear().range([0, width]).domain([2002,2018]);
	// var xScale = d3.scale.linear().range([0, width]).domain([2000, 2010]);

	var yScale = d3.scale.linear().range([height, margin.bottom]).domain([0,1]);
	// var yScale = d3.scale.linear().range([height, margin.bottom]).domain([134, 215]);

	xAxis = d3.svg.axis()
    				.scale(xScale).ticks(5);
  
	yAxis = d3.svg.axis()
		  		  .scale(yScale)
		    		.orient("left");

	var svg = d3.select("#plot").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	function draw(data) {
        var array = [{}];
        for(var i = 0; i < data.length; i++)
        {
	        array[i] = {vote: data[i][0].info[0].votes, year: [2002, 2006, 2010, 2014]};
        }

        console.log(array);
				
				// var correlation = computeCorr(array);
				// X-axis
				 svg.append("g")
				 	.call(xAxis)
					.attr("transform", "translate(0," + height + ")")
				.append("text")
					.text("Year");
				
				// Y-axis
				svg.append("g")
					.call(yAxis)
				.append("text")
					.attr("y", 5)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.style("font-size", "12px")
					.text("Votes"); 

					svg.selectAll("dot")
        		.data(array)
     			 	.enter().append("circle")
       		  .attr("r", 3.5)
        		.attr("cx", function(d,i) { return xScale(d.year[i]); })
        		.attr("cy", function(d) { return yScale(d.vote); });

          var lineGen = d3.svg.line()
              .x(function(d, i) {
                  return xScale(d.year[i]);
              })
              .y(function(d,i) {
                  return yScale(d.vote);
              })
              .interpolate("linear");

          svg.append('svg:path')
              .attr('d', lineGen(array))
              .attr('stroke', 'green')
              .attr('stroke-width', 2)
              .style('fill', 'none');
		}

		function computeStandDev(data) {
		}

		function computeMean(data) {
			var sum  = 0;
			for(var i = 0; i < data.length; i++)
			{
				sum = sum + data[i].info;
			}
		}
		
		function computeCorrelation(data){	

		}

}