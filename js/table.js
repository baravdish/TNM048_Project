function table() {
	var column = 2;
	
	var mapDiv = $("#table");
	
	/*var margin = {top: 20, right: 20, bottom: 20, left: 20},
	  	width = mapDiv.width() - margin.right - margin.left,
	  	height = mapDiv.height() - margin.top - margin.bottom;*/
		
	/*var svg = d3.select("#table").append("svg")
        .attr("width", width)
        .attr("height", height);*/
	
	/*var table_data = {color: ["#50b4e6","#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "#572B85"],
					party: ["Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Socialdemokraterna", "Vänsterpartiet", "Sverigedemokraterna", "Övriga Partier"]
					};*/
					
	var table_data = [{color:"#50b4e6", party:"Moderaterna"}, {color:"#009933", party:"Centerpartiet"}, {color:"#6BB7EC", party:"Folkpartiet"}, {color:"#231977", party:"Kristdemokraterna"}, 
								{color:"#83CF39", party:"Miljöpartiet"}, {color:"#EE2020", party:"Socialdemokraterna"}, {color:"#AF0000", party:"Vänsterpartiet"},
								{color:"#DDDD00", party:"Sverigedemokraterna"}, {color:"#572B85", party:"Övriga Partier"}];
					
	var table_head = ["", "Party"];
	
    var table = d3.select("#table").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(table_head)
        .enter()
        .append("th")
            .text(function(d) { 
				//console.log(d);
			return d; }); //d[i]
			

    // create a row for each object in the data
    var rows = tbody.selectAll("td")
        .data(table_head)
        .enter()
        .append("td")
		.attr("style", "font-family: Courier") // sets the font style
            .html(function(d) { return "";
			});

    // create a cell in each row for each column
    var cells = rows.selectAll("tr")
        .data(table_data)
        .enter()
        .append("tr")
        .attr("style", "font-family: Courier") // sets the font style
            .html(function(d,i,j) { if(j==0){ 
																	/*console.log(d.color);
																	d3.select(this).style({"background-color": "yellow"});*/
																	return "";
																	}
																else{
																	
																	return d.party;};
			});//.attr("style", "font-weight:bold");//.attr("style", "font-weight:bold");.attr("style", "font-size:150%");
			
		cells.style("background-color", function(d){d3.select(this).style("stroke-width", 5).style("stroke", "red");
																		return d.color});
													/*function(d,i,j) {console.log("hej"); if(j==0){ 
																	return d.color;
																	}
																else{
																	return "";
																	}
			});*/
}


 