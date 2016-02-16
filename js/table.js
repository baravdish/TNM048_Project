function tabulate() {
	var table_data = {color: ["#50b4e6","#009933", "#6BB7EC", "#231977", "#83CF39", "#EE2020", "#AF0000", "#DDDD00", "#572B85"]
					party: ["Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Socialdemokraterna", "Vänsterpartiet", "Sverigedemokraterna", "Övriga Partier"]
					};
	var table_head = ["Color", "Party"]
    var table = d3.select("body").append("table")
            .attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(table_head)
        .enter()
        .append("th")
            .text(function(d, i) { return d[i]; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(table_data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
            .html(function(d) { return d.value; });
    
    return table;
}

// render the table
 //var peopleTable = tabulate(data, ["date", "close"]);
 