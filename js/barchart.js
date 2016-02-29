function barchart(){

	var colormap = ["#50b4e6","#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "#572B85"];

	var barDiv = $("#barchart");
	
	var selected_mun;
	
	var formatData_2002 = [];
	var formatData_2006 = [];
	var formatData_2010 = [];
	var formatData = [];
	var allData = [];

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 900 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

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
	
	
	d3.csv("data/Swedish_Election_2014.csv", function(error, data) {
		  if (error) throw error;
		  formatData = format(data);
	});
	d3.csv("data/Swedish_Election_2002.csv", function(error, data) {
		  if (error) throw error;
		  formatData_2002 = format(data);
	});
	d3.csv("data/Swedish_Election_2006.csv", function(error, data) {
		  if (error) throw error;
		  formatData_2006 = format(data);
	});
	d3.csv("data/Swedish_Election_2010.csv", function(error, data) {
		  if (error) throw error;
		  formatData_2010 = format(data);
	});

	var year = 2014;
	this.setYear = function()
	{
		allData = [];
		allData.push(formatData_2002);
		allData.push(formatData_2006);
		allData.push(formatData_2010);
		allData.push(formatData);

		year = document.getElementById("slider").value;
		if(selected_mun !== undefined)
		{
			switch (Number(year)) {
			    case 2002:
			        draw(allData, 0);
			        break;
			    case 2006:
			        draw(allData, 1);
			        break;
			    case 2010:
			        draw(allData, 2);
			        break;
			    case 2014:
			        draw(allData, 3);
			        break;
			    default:
			        draw(allData, 3);
			        break;
			}
		}
	};

	this.isSelected = function(name)
	{
		selected_mun = name;
		if(selected_mun !== undefined)
		{
			
			allData = [];
			allData.push(formatData_2002);
			allData.push(formatData_2006);
			allData.push(formatData_2010);
			allData.push(formatData);

			var year = document.getElementById("slider").value;
			switch (Number(year)) {
			    case 2002:
			        draw(allData, 0);
			        // draw(formatData_2002);
			        break;
			    case 2006:
			        draw(allData, 1);
			        // draw(formatData_2006);
			        break;
			    case 2010:
			        draw(allData, 2);
			        // draw(formatData_2010);
			        break;
			    case 2014:
			        draw(allData, 3);
			        // draw(formatData);
			        break;
			    default:
			        // draw(formatData);
			        draw(allData, 3);

			}
		}
	};

	this.setSelected_Mun = function(value){
		selected_mun = value;
		var year = document.getElementById("slider").value;

			allData = [];
			allData.push(formatData_2002);
			allData.push(formatData_2006);
			allData.push(formatData_2010);
			allData.push(formatData);

		switch (Number(year)) {
		    case 2002:
		        draw(allData, 0);
		        break;
		    case 2006:
		        draw(allData, 1);
		        break;
		    case 2010:
		        draw(allData, 2);
		        break;
		    case 2014:
		        draw(allData, 3);
		        break;
		    default:
		        draw(allData,3);
		} 
	};
	
	this.getColor = function(value){
		
		// var year = document.getElementById("slider").value;
		var year = 2014;
		switch (Number(year)) {
		    case 2002:
		       	return getHighestVote(value, formatData_2002);
		    case 2006:
		        return getHighestVote(value, formatData_2006);
		    case 2010:
		        return getHighestVote(value, formatData_2010);
		    case 2014:
		        return getHighestVote(value, formatData);
		    default:
		        return getHighestVote(value, formatData);
		}
	};
	
	function getHighestVote(value, data)
	{
		for(var i=0; i<data.length; i++){
			var index = 22;
			if(data[i].region_name == value){
				var max = data[i].info[0].votes;
				for(var j=0; j<data[i].info.length; j++){
					if(max <= data[i].info[j].votes){
						max =  data[i].info[j].votes;
						index = j;
					}
				}
			}
			if(index != 22){
				return colormap[index];
			}
		}
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
	
	var tooltip = d3.select("body").append("div")
					.attr("class", "tooltip")
					.style("opacity", 1);
	function draw(aD, nTime)
	{
		// console.log(allData);
		// console.log(nTime);
		var data = allData[nTime];

		svg.selectAll(".bar").remove();
		svg.selectAll(".axis").remove();	
		svg.selectAll("g").remove();	

		for(var i = 0; i <data.length; i++){
			if(selected_mun == data[i].region_name){

				d3.select("#barChartText").select("h1").remove();
				d3.select("#barChartText").append("h1").text(selected_mun);

				x.domain(data[i].info.map(function(d) {return d.party_name; }));
				y.domain([0, d3.max(data[i].info, function(d) { return d.votes; } ) ] );

				// X-axis
				 svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				
				// Y-axis
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
				.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 5)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.style("font-size", "12px")
					.text("Percent"); 
				
				svg.selectAll(".bar")
				   .data(data[i].info)
				   .enter().append("rect")
				   .attr("class", "bar")
				   .attr("x", function(d) { 
									return x(d.party_name); 
								})
				   .attr("width", x.rangeBand())
				   .attr("y", function(d) { 
									return y(d.votes);  
								})
				   .style("fill", function(d,i) {return colormap[i];} )
				   .attr("height", function(d) {		  
										return (height - y(d.votes));  
									})
				   	.on("click", function (d,i) {
				   		//plot1.draw(d);
					})
					.on("mouseover", function(d){

							tooltip.transition()
								.style("opacity", 1);

							tooltip.html("<h1> " + d.party_name + " : " + Math.round(d.votes*10000)/100 +  "%" + "</h1>")
								.style("left", (d3.event.pageX + 20) + "px")
								.style("top", (d3.event.pageY - 70) + "px");
								})
					.on("mouseout", function(d){
						tooltip.transition()
						.style("opacity", 0);
					});

					drawPrediction(allData, i);
				break;
			}
		}
	}

	function drawPrediction(allData,i) {
		plot1.draw(allData,i);
	}
	
	this.getData = function(){
		return formatData;
	};

	this.getAllData = function()
	{
		return allData;
	};
}