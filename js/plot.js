function plot()
{
	var plotDiv = $("#plot");
	
	var colormap = ["#50b4e6","#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "#572B85"];

	var formatData_2002 = [];
	var formatData_2006 = [];
	var formatData_2010 = [];
	var formatData = [];
	var dataArray = [];
	var predictYear = 2018;

	var margin = {top: 20, right: 70, bottom: 30, left: 40},
		width = plotDiv.width() - margin.left - margin.right,
		height = plotDiv.height() - margin.top - margin.bottom;

	var xScale = d3.scale.linear().range([0, width]).domain([2002,2018]);
	// var xScale = d3.scale.linear().range([0, width]).domain([2000, 2010]);

	var yScale = d3.scale.linear().range([height, margin.bottom]).domain([0, 0.6]);
	// var yScale = d3.scale.linear().range([height, margin.bottom]).domain([134, 215]);

	xAxis = d3.svg.axis()
    				.scale(xScale).ticks(6);
  
	yAxis = d3.svg.axis()
		  		  .scale(yScale)
		    		.orient("left");
					
	//d3.selectAll("path").style("fill", "black");

	var svg = d3.select("#plot").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 1);
	
	this.draw = function (data,time) {
		
	svg.selectAll("g").remove();
	svg.selectAll("path").remove();
 	svg.selectAll("dot").remove();
 	svg.selectAll("circle").remove();

 		for(var nParty = 0; nParty < data[0][0].info.length; nParty++)
 		{

 	  var array = [{}];
 	  var mun = data[0][0].info[nParty].party_name;
    for(var i = 0; i < data.length; i++)
    {
	    array[i] = {vote: data[i][time].info[nParty].votes, year: [2002, 2006, 2010, 2014], party_name: mun};
    }

		var mean = computeMean(array);
		var standardDeviation = computeStandDev(array, mean);
		var correlation = computeCorrelation(array, mean, standardDeviation);
		var b = correlation*(standardDeviation[0]/standardDeviation[1]);
		var A = mean[0] - b*mean[1];

		// console.log(mean);
		// console.log(standardDeviation);
		// console.log(correlation);
		// console.log(A);

		var predictedPos = b*predictYear + A;
		array.push({vote:predictedPos, year: [2002, 2006, 2010, 2014, 2018], party_name: mun});

		svg.selectAll("dot")
			.data(array)
		 	.enter().append("circle")
	  	.attr("r", 5)
			.attr("cx", function(d,i) { return xScale(d.year[i]); })
			.attr("cy", function(d) { return yScale(d.vote); })
			.style("fill", function (d) {
					return colormap[nParty];
			})
			.on("mouseover", function(d){

				tooltip.transition()
				.style("opacity", 1);

				tooltip.html("<h1> " + d.party_name + ": " +  Math.round(d.vote*10000)/100  + " % " + "</h1>")
				.style("left", (d3.event.pageX + 20) + "px")
				.style("top", (d3.event.pageY - 70) + "px");
			})
			.on("mouseout", function(d){
				tooltip.transition().duration(500)
			.style("opacity", 0);
			});

  	var lineGen = d3.svg.line()
        .x(function(d, i) {
            return xScale(d.year[i]);
        })
        .y(function(d,i) {
            return yScale(d.vote);
        })
        .interpolate("linear");

		/*var lineGen2 = d3.svg.line()
        .x(function(d, i) {
            return xScale(d.year[i]);
        })
        .y(function(d,i) {
            return yScale(b*d.year[i] + A);
        })
        .interpolate("linear");*/

  	svg.append("svg:path")
        .attr("d", lineGen(array))
        .attr("stroke", function (d) {
        	return colormap[nParty];
        })
        .attr("stroke-width", 3);

 		}

		/*svg.append('svg:path')
        .attr('d', lineGen2(array))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .style('fill', 'none');*/

	    // X-axis
		 svg.append("g")
			.attr("class", "x axis")
		 	.call(xAxis)
			.attr("transform", "translate(0," + height + ")")
			.append("text")
			.text("Year")
			.attr("transform", "translate(" + (width + 20) + "," + 0 + ")");
	
		// Y-axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("y", 5)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-size", "12px")
			.text("Votes"); 

		};

		function computeStandDev(data, mean) {
			var sumX  = 0;
			var sumY  = 0;

			for(var i = 0; i < data.length; i++)
			{
				sumX = sumX + Math.pow(data[i].vote - mean[0],2);
				sumY = sumY + Math.pow(data[i].year[i] - mean[1],2);
			}
			// console.log(data);
			var varianceX = sumX/(data.length-1);
			var varianceY = sumY/(data.length-1);

			var standardDeviation = []; 
			standardDeviation.push(Math.sqrt(varianceX));
			standardDeviation.push(Math.sqrt(varianceY));

			return standardDeviation;
		}

		function computeMean(data) {
			var sumX  = 0;
			var sumY  = 0;

			for(var i = 0; i < data.length; i++)
			{
				sumX = sumX + data[i].vote;
				sumY = sumY + data[i].year[i];
			}
			// console.log(data);
			var mean = [];
			mean.push(sumX/data.length);
			mean.push(sumY/data.length);
			return mean;
		}
		
		function computeCorrelation(data, mean, standardDeviation){	
			
			var sum = 0;
			
			for(var i = 0; i < data.length; i++)
			{
				sum = sum + (data[i].vote - mean[0])*(data[i].year[i] - mean[1]);
			}

			var r = sum/(data.length * standardDeviation[0]*standardDeviation[1]);
			return r;
		}
}