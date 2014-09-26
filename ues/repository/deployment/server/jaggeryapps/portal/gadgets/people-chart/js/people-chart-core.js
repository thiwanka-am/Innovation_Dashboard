var pref = new gadgets.Prefs();
var barChart, lineChart, pieChart;
var chartData;
var chartType; // bar, line, pie, list

$(document).ready(function(){
	chartType = "bar";
	
	initBarChart();
	
	initLineChart();
	
	initPieChart();
	
	fetchData();
	
	// on resize the window
	$(window).resize(function(){
		drawChartsAndList();
	});
	
	// switching charts
	$(".btn-group button").click(function(){
		$(".btn-group button").removeClass("btn-success");
		$(this).addClass("btn-success");
		$(this).blur();
		chartType = $(this).text().toLowerCase();
		drawChartsAndList(chartData);
	});
	
	$(".back").click(function(){
		fetchCustomData("aoi");
		$(this).blur();
		setChartTitle("");
	});
});

function fetchData() {
	var url =  pref.getString("dataSource");
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		success: onDataReceived
	});
}

function fetchCustomData(type, id, name) {
	var url =  pref.getString("dataSource");
	url =  url + "?type=" + type + "&id=" + id;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		success: onDataReceived
	});
	setChartTitle(name);
}

function onDataReceived(data) {
	chartData = data.people_count_data;
	drawChartsAndList(chartData);
}

function setChartTitle(name){
	$("#chartState").text(name);
}

function drawChartsAndList(data){
	var place = $("#placeholder");
	place.empty();

	if ('undefined' !== typeof data) {
		if(chartType === "bar"){
			drawBarChart(data);
		} else if (chartType === "line"){
			drawLineChart(data);
		} else if (chartType === "pie"){
			drawPieChart(data);
		} else if (chartType === "list"){
			createList(data);
		}
	} else {
		if(chartType === "bar"){
			drawBarChart();
		} else if(chartType === "line"){
			drawLineChart();
		} else if(chartType === "pie"){
			drawPieChart();
		} else if(chartType === "list"){
			createList();
		}
	}
}

function initBarChart(){
	var data = [];
	var barChartOptions = {
        marginTop: 20,
        marginRight: 5,
        marginBottom: 50,
        marginLeft: 30,
        chartTitle: "Number of People over Area of Interests",
        xAxisTitle: "",
        yAxisTitle: "Number of researchers",
        barBottomColor: "#447fb0",
        barTopColor: "#315a7c",
        barBorderColor: "#23415a",
        barBottomHighlightColor: "#be4620",
        barTopHighlightColor: "#a42800",
        barBorderHighlightColor: "#531400"
    };
	barChart = new BarChart("placeholder", data, barChartOptions);
}

function drawBarChart(data, options){
	if ('undefined' !== typeof data) {
		barChart.setData(data);
	}
	if ('undefined' !== typeof options) {
		barChart.setOptions(options);
	}
	barChart.draw();
}

/*function redrawBarChart(){
	//$("#placeholder").css({"width": "100%", "height": "90%"});
	barChart.draw();
}*/

function initLineChart(){
	var data = [];
	var lineChartOptions = {
			marginTop: 20,
	        marginRight: 5,
	        marginBottom: 50,
	        marginLeft: 30,
	        chartTitle: "Number of researchers over area of interests",
	        xAxisTitle: "",
	        yAxisTitle: "",
	        lineColor: "#A52A2A",
	        valuePrecision: 2,
	        nanMessage: "Data not available"
    };
	lineChart = new LineChart("placeholder", data, lineChartOptions);
}

function drawLineChart(data, options){
	if ('undefined' !== typeof data) {
		lineChart.setData(data);
	}
	if ('undefined' !== typeof options) {
		lineChart.setOptions(options);
	}
	lineChart.draw();
}

function initPieChart(){
	var data = [];
	var pieChartOptions = {
		marginTop: 20,
		marginRight: 20,
		marginBottom: 20,
		marginLeft: 20,
		colors: ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#AAAA11", "#E67300", "#B77322", "#16D620"]
    };
	
	pieChart = new PieChart("placeholder", data, pieChartOptions);
}

function drawPieChart(data, options){
	if ('undefined' !== typeof data) {
		pieChart.setData(data);
	}
	if ('undefined' !== typeof options) {
		pieChart.setOptions(options);
	}
	pieChart.draw();
}

function createList(data){
	if('undefined' === typeof data){
		data = chartData;
	}
	var place = $("#placeholder");
	
	var divElem = document.createElement("div");
	divElem.style.paddingLeft = "16px";
	divElem.style.paddingRight = "16px";
	
	var tableElem = document.createElement("table");
	tableElem.setAttribute("class", "table table-striped");
	var theadElem = document.createElement("thead");
	
	// heading row
	var trElem = document.createElement("tr");
	var thElem1 = document.createElement("th");
	thElem1.style.width = "70%";
	var thElem2 = document.createElement("th");
	thElem2.style.width = "30%";
	var text = document.createTextNode("Area of Interest");
	thElem1.appendChild(text);
	text = document.createTextNode("Value");
	thElem2.appendChild(text);
	
	trElem.appendChild(thElem1);
    trElem.appendChild(thElem2);
	theadElem.appendChild(trElem);
    tableElem.appendChild(theadElem);
	
	var tbodyElem = document.createElement("tbody");
	for (var i = 0; i < data.length; i++) {
		trElem = document.createElement("tr");
		var tdElem1 = document.createElement("td");
		var tdElem2 = document.createElement("td");
		
		var text = document.createTextNode(data[i].name);
		tdElem1.appendChild(text);
		
		text = document.createTextNode(data[i].value);
		tdElem2.appendChild(text);
		
		trElem.appendChild(tdElem1);
        trElem.appendChild(tdElem2);
		
		tbodyElem.appendChild(trElem);
	}
	tableElem.appendChild(tbodyElem);
	
	divElem.appendChild(tableElem);
	place.append(divElem);
}

