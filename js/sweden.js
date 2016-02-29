function sweden()
{
		// TODO: third area with single plot over time

	var all_mun;
	var mun;
	var selected_muns = [];
	
	var mouseDown = 0;
	document.body.onmousedown = function() { 
	  ++mouseDown;
	};
	document.body.onmouseup = function() {
	  --mouseDown;
	};
	
	d3.select("#search").on("input", function(){
		barchart1.setSelected_Mun(this.value);
		filterMun(this.value);
	});
	
	//Move selection to front
	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
		this.parentNode.appendChild(this);
	  });
	};
	
	//Move selection back
	d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};
	
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
		  
	d3.json("data/swe_mun.topojson", function(error, data) {
		all_mun = topojson.feature(data, data.objects.swe_mun);

		draw(all_mun);
	});
	
	//Assigns the svg canvas to the map div
    var svg = d3.select("#sweden").append("svg")
            .attr("width", width)
            .attr("height", height);
            //.call(zoom);
	
	function draw(muns) {
		
		svg.selectAll(".mun").remove();

		mun = svg.selectAll(".mun").data(muns.features);
		mun.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "black")
			.style("fill", function(d,i){
							return barchart1.getColor(d.properties.name);
			})
			.on("mouseover", function (d) {
				d3.select("#mapmuntext").select("h1").remove();
				d3.select("#mapmuntext").append("h1").text(d.properties.name);
				if(d3.select(this)[0][0].style.fill !== "white"){
					sel = d3.select(this)
						.style("stroke-width", 4)
						.style("stroke", "#EEEEEE");
					
					if(!mouseDown){
						sel.moveToFront();
					}
					else{
						sel.moveToBack();
					}
				}
			})
			.on("mouseout", function(d) {
				d3.select(this)
					.style("stroke-width", 1)
					.style("stroke", "black");
			})
			.on("click", function(d) { 
				d3.select(this)
					.style("stroke-width", 1)
					.style("stroke", "black");
				filterMun(d.properties.name);
				barchart1.isSelected(d.properties.name);
				pc1.setSelectedMuns([d.properties.name]);
			});
			
		// Init the lasso on the svg that contains the geometry
		svg.call(lasso);
								
		lasso.items(d3.selectAll("path"));
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

        zoom.translate(t);
        svg.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }
	
	// Lasso functions to execute while lassoing
	var lasso_start = function() {
		selected_muns = [];
		lasso.items()
			.classed({"selected":false});
	};

	var lasso_draw = function() {
		// Style the possible muns
		lasso.items().filter(function(d) {return d.possible===true})
		.style("fill", "#DDDDDD")
		.classed({"possible":true});
		
		// Reset non-possible muns
		lasso.items().filter(function(d) {return d.possible===false})
		.style("fill", function(d){
			if(typeof d.properties !== 'undefined'){
				return barchart1.getColor(d.properties.name);
			}
		})
		.classed({"possible":false});
	};

	var lasso_end = function() {
		//Store selected muns
		lasso.items().filter(function(d){
			if(d.selected === true && typeof d.properties !== 'undefined'){
				selected_muns.push(d.properties.name);
			}
		});
		
	  // Style the selected muns
	  lasso.items().filter(function(d) {return d.selected===true})
		.style("fill", "#FFFFFF")
		.classed({"possible":false});

	  // Reset the not selected muns
	  lasso.items().filter(function(d) {return d.selected===false})
		.style("fill", function(d){
			if(typeof d.properties !== 'undefined'){
				return barchart1.getColor(d.properties.name);
			}
		})
		.classed({"possible":false});
		
		pc1.setSelectedMuns(selected_muns);
	};
	
	// Define the lasso
	var lasso = d3.lasso()
		  .closePathDistance(75) // max distance for the lasso loop to be closed
		  .closePathSelect(true) // can items be selected by closing the path?
		  .hoverSelect(true) // can items by selected by hovering over them?
		  .area(svg) // area where the lasso can be started
		  .on("start",lasso_start) // lasso start function
		  .on("draw",lasso_draw) // lasso draw function
		  .on("end",lasso_end); // lasso end function
			
}