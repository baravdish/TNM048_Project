function pc(){

    var self = this; // for internal d3 functions
	var votes = [];

    var pcDiv = $("#pc");
	
	//initialize tooltip
    var tooltip = d3.select("body")
    .append("div")
	.style("backgroundColor", "white")
	.style("opacity", 0);
	
	//Initialize color scale
	var colors = d3.scale.category20();

    var margin = [30, 10, 30, 30],
        width = 960 - margin[1] - margin[3],
        height = 400 - margin[0] - margin[2];

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
		max;
        
	var selMuns = [];

    var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
        foreground,
		g;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

	function update(muns){
		//Clear lines
		if(typeof foreground !== 'undefined'){
			foreground.remove();
		}
		
		//Clear scales
		if(typeof g !== 'undefined'){
			g.remove();
		}
		
		//Get data
		self.data = barchart1.getData();
		
		//Filter data
		self.data = self.data.filter(function(d){
			for(var i=0; i<muns.length; i++){
				if(d.region_name === muns[i]){
					return d;
				}
			}
		});
		
		//Extract votes
		votes = [];
		for(var j=0; j<self.data.length; j++){
			var points = [];
			points.push(muns[j]);
			for(var k=0; k<self.data[j].info.length; k++){
				points.push(self.data[j].info[k].votes);
			}
			votes.push(points);
		}
		
		// Create Dimensions
		dimensions = ["Län", "Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Socialdemokraterna", "Vänsterpartiet", "Sverigedemokraterna", "övriga partier"];
		x.domain(dimensions);
				
		//Add scale
		y[dimensions[0]] = d3.scale.ordinal()
				.domain(muns)
				.rangePoints([height, 0]);
		
		//Find max vote value for normalization
		if(typeof votes[0] !== 'undefined'){
			max = votes[0][1];
			for(var i=0; i<votes.length; i++){
				for(j=1; j< votes[i].length; j++){
					if(max < votes[i][j]){
						max = votes[i][j];
					}
				}
			}
		}
		else{
			max = 1;
		}

		for(var i=1; i<10; i++){
			y[dimensions[i]] = d3.scale.linear()
				.domain([0, max*100])
				.range([height, 0]);
		}

		draw();
	}
    function draw(){
        // Add lines
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path 
            .data(votes)
            .enter()
			.append("path")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke",  function(d){ return colors(d[0]); })
			.on("mouseover", function(d){
				d3.select(this)
					.style("stroke", "blue")
					.style("stroke-width", 4);
				return tooltip
				.style("opacity", 1)
				.text(d[0]);
			})
			.on("mousemove", function (d) {
				return tooltip
					.style("top", (d3.event.pageY + 16) + "px")
					.style("left", (d3.event.pageX + 16) + "px");
			})
			.on("mouseout", function(d){
				d3.select(this)
					.style("stroke",  function(d){ return colors(d[0]); })
					.style("stroke-width", 1);
				return tooltip.style("opacity", 0);
			});

        // Add a group element for each dimension.
        g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
			.each(function(d) {
				d3.select(this).call(axis.scale(y[d]));
			})
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", height + 15)
            .text(String);
    }

    // Returns the path for a given data point.
    function path(d) {
		return line(dimensions.map(function(p, i) {
			if(p === "Län"){
				return [x(p), y[p](d[0])];
			}
			else{
				return [x(p), -d[i]/max*height+height];
			}
		}));
    }

	this.setSelectedMuns = function(value){
		selMuns = value;
		update(value);
	};
	
	this.updateGraph = function(){
		update(selMuns);
	}
	update([""]);
}
