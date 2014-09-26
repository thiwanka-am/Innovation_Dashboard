//new code
var radarChart, indexBarChart, worldMap;
var isMapVisible = false;
var currentPositionLevel = 1;
var prevSelection;
var positionSelectedGIId;

$(document).ready(function() {
	// hide map
	$("#position-map").hide();
	
	// setting gi selection
	$("#position-giselection-div").css("width", $(window).width() - 390);
	
	// setting breadcrumb
//	$("#position-breadcrumb-div").css("width", $(window).width() - 320);
//	$("#position-breadcrumb-ol").empty();
//	$("#position-breadcrumb-ol").append('<li class="active">Global Innovation Index</li>');
	
	
	// radar chart
	initializeRadarChart();
	
	// index bar chart
    initializeIndexBarChart();
    
    // world map
    //initializeWorldMap();
	
	
	//drawRadarChart();
    //drawIndexBarChart();
    
    //getAjaxChartData("Global Innovation Index", 2013);
    
    getAjaxGIData();
    
    
    // drawMap button action
    $("#toggleMapButton").click(function() {
    	if(!isMapVisible){
    		$("#toggleMapButton").html("<img src='images/chart.png' style='margin-right: 8px;'><span>View Chart</span>");
    		// <img src="images/small-world-map.png" style="margin-right: 8px;"><span>View Map</span>
			$("#position-radar-wrapper").hide(500);
			$("#position-map-wrapper").show(500);
            $("#position-map").show();
			isMapVisible = true;
			drawWorldMap();
		} else {
			$("#toggleMapButton").html("<img src='images/small-world-map.png' style='margin-right: 8px;'><span>View Map</span>");
    		$("#position-radar-wrapper").show(500);
    		$("#position-map-wrapper").hide(500);
    		isMapVisible = false;
    		drawRadarChart();
    	}
    });
    
    // update selection
    prevSelection = "gii";
    
    // In level 1
    currentPositionLevel = 1;
    
    $("#position-gi-name-selection").change(function(){
    	positionSelectedGIId = $("#position-gi-name-selection option:selected" ).val();
    	console.log(positionSelectedGIId);
    });
    
});

$(window).resize(function() {
  //$("#drawArea1").css("width", $(window).width() - 20);
  //lc.draw();

});

function initializeRadarChart(){
	var radarData = [];
	
	var radarChartOptions = {
        marginTop: 10,
        marginRight: 40,
        marginBottom: 20,
        marginLeft: 40,
        w: 340, // w and h should be equal
        h: 340,
        //maxValue: 60, // maximum axis value, if actual values are below than this
        levels: 5, // number of circles in the web
        ExtraWidthX: 480, // extra horizontal space in addition to w
        ExtraWidthY: 110, // extra vertical space in addition to w
        factor: 1, // size of the spider web
        factorLegend: 1, // distance from center to leg text
        radians: 2 * Math.PI, // angle of the web. starting from top
        ToRight: 8, // distance between y axis and axis labels
        TranslateX: 210, // horizontal translation from left
        TranslateY: 65, // vertical translation from top
        valuePrecision: 2, // number of decimal points in values
        colors: ["#B42D00", "#109618", "#3366CC", "#B77322", "#990099", "#0099C6", "#DD4477", "#AAAA11", "#E67300", "#16D620", "#FF9900"]
    };

    radarChart = new NormRadarChart("position-radar-chart", radarData, radarChartOptions);
    
}

function drawRadarChart(newData){
	$("#position-radar-chart").css({"width": $(window).width() - 220, "height": "455px"});
	if(typeof newData !== "undefined"){
		radarChart.setData(newData);
	}
	radarChart.draw();
}

function initializeWorldMap(){
	// create AmMap object
    worldMap = new AmCharts.AmMap();
    // set path to images
    worldMap.pathToImages = "lib/ammap/images/";

	var balloon = worldMap.balloon;
    
    balloon.adjustBorderColor = true;
	balloon.color = "#FFFFFF"; // Color of text in the balloon.
	balloon.fillColor = "#000000"; // Balloon background color. Only if "adjustBorderColor" is "true" this color will be used.
	balloon.borderColor = "#000000"; // Balloon border color. Will only be used of adjustBorderColor is false.
	balloon.borderThickness = 0;
	balloon.fillAlpha = 0.8;
	balloon.fontSize = 14;
	balloon.shadowAlpha = 0;
	balloon.cornerRadius = 0;
    
    worldMap.panEventsEnabled = true;
    worldMap.zoomControl.panControlEnabled = true;
    worldMap.zoomControl.zoomControlEnabled = true;
    
    worldMap.backgroundAlpha  = 0;
    worldMap.dragMap = true;
    worldMap.fontFamily = "Helvetica Neue";
    
    worldMap.areasSettings = {
    	unlistedAreasColor: "#bcbcbc",
    	unlistedAreasOutlineColor: "#F2F2F2",
        autoZoom: false,
        color: "#FFCC00",
        outlineColor: "#F2F2F2",
        rollOverColor: "#f97924",
        rollOverOutlineColor: "#F2F2F2",
        selectedColor: "#f97924",
        balloonText: "<h4>[[title]]</h4>[[customData]]"
    };

    var dataProvider = {
        map: "worldHigh",
        selectable: false,
        zoomLevel: 10,
        zoomLongitude: 79,
		zoomLatitude: 16,
		getAreasFromMap : false
    };
    
//    var countryAreas = new Array();
//    var giiCountryData = getGiiCountryDataArray();
//    giiCountryData.forEach(function(d, i){
//    	countryAreas.push({title: ""+d.name+"", id: ""+d.code+"", customData: "Rank: <strong>"+ d.rank +"</strong>, Score: <strong>"+ d.score +"</strong>"});
//    });
//    for (var i=0; i < countryAreas.length; i++) {
//    	if(countryAreas[i].id == "LK"){
//    		countryAreas[i].color = "#B42D00"; // #1F77B4
//    		countryAreas[i].outlineColor = "#B42D00";
//    		countryAreas[i].rollOverColor = "#f97924";
//    		countryAreas[i].rollOverOutlineColor = "#f97924";
//    	}
//    	else if(countryAreas[i].id == "IN"){
//    		countryAreas[i].color = "#E4CD5C";
//    	}
//    	else if(countryAreas[i].id == "NP"){
//    		countryAreas[i].color = "#DA6161";
//    	}
//    	else if(countryAreas[i].id == "BD"){
//    		countryAreas[i].color = "#34C490";
//    	}
//    	else if(countryAreas[i].id == "PK"){
//    		countryAreas[i].color = "#56A54B";
//    	} else {
//    		countryAreas[i].color = "#9b9b9b";
//    	}
//    };
    
//    dataProvider.areas = countryAreas;
    
    // pass data provider to the map object
    worldMap.dataProvider = dataProvider;

    // write the map to container div
    //worldMap.write("region-map-area");
	
	worldMap.addListener("rollOverMapObject", function (event) {
    	//changeCustomChartTriangle(event.mapObject.id, event.mapObject.title);
    	indexBarChart.markCountry(event.mapObject.id);
	});

	worldMap.addListener("rollOutMapObject", function (event) {
    	indexBarChart.resetCountry(event.mapObject.id);
	});
}

function setWorldMapData(newData){
	if (typeof newData !== "undefined") {
		//
		// create AmMap object
	    worldMap = new AmCharts.AmMap();
	    // set path to images
	    worldMap.pathToImages = "lib/ammap/images/";

		var balloon = worldMap.balloon;
	    
	    balloon.adjustBorderColor = true;
		balloon.color = "#FFFFFF"; // Color of text in the balloon.
		balloon.fillColor = "#000000"; // Balloon background color. Only if "adjustBorderColor" is "true" this color will be used.
		balloon.borderColor = "#000000"; // Balloon border color. Will only be used of adjustBorderColor is false.
		balloon.borderThickness = 0;
		balloon.fillAlpha = 0.8;
		balloon.fontSize = 14;
		balloon.shadowAlpha = 0;
		balloon.cornerRadius = 0;
	    
	    worldMap.panEventsEnabled = true;
	    worldMap.zoomControl.panControlEnabled = true;
	    worldMap.zoomControl.zoomControlEnabled = true;
	    
	    worldMap.backgroundAlpha  = 0;
	    worldMap.dragMap = true;
	    worldMap.fontFamily = "Helvetica Neue";
	    
	    worldMap.areasSettings = {
	    	unlistedAreasColor: "#aaa",
	    	unlistedAreasOutlineColor: "#BEBEBE",
	        autoZoom: false,
	        color: "#FFCC00",
	        outlineColor: "#BEBEBE",
	        rollOverColor: "#f97924",
	        rollOverOutlineColor: "#F2F2F2",
	        selectedColor: "#f97924",
	        balloonText: "<h4>[[title]]</h4>[[customData]]"
	    };
		//
		
		var dataProvider = {
	        map: "worldHigh",
	        selectable: false,
	        zoomLevel: 10,
	        zoomLongitude: 79,
			zoomLatitude: 16,
			getAreasFromMap : false
	    };
		
	    var countryAreas = new Array();
	    var giCountryData = newData;
	    giCountryData.forEach (function(d, i) {
	    	countryAreas.push({title: ""+d.name+"", id: ""+d.code+"", customData: "Rank: <strong>"+ d.rank +"</strong>, Score: <strong>"+ d.score +"</strong>"});
	    });
	    for (var i=0; i < countryAreas.length; i++) {
	    	if(countryAreas[i].id == "LK"){
	    		countryAreas[i].color = "#B42D00"; // #1F77B4
	    		countryAreas[i].outlineColor = "#B42D00";
	    		countryAreas[i].rollOverColor = "#f97924";
	    		countryAreas[i].rollOverOutlineColor = "#f97924";
	    	}
	    	else if(countryAreas[i].id == "IN"){
	    		countryAreas[i].color = "#EEAE2F"; // #E4CD5C
	    	}
	    	else if(countryAreas[i].id == "NP"){
	    		countryAreas[i].color = "#EEAE2F"; // #DA6161
	    	}
	    	else if(countryAreas[i].id == "BD"){
	    		countryAreas[i].color = "#EEAE2F"; // #34C490
	    	}
	    	else if(countryAreas[i].id == "PK"){
	    		countryAreas[i].color = "#EEAE2F"; // #56A54B
	    	} else {
	    		countryAreas[i].color = "#84C378";//"#F4CF8b"; // #9b9b9b
	    	}
	    };
	    
	    dataProvider.areas = countryAreas;
	    
	    // pass data provider to the map object
	    worldMap.dataProvider = dataProvider;
	    
	    var mapLegend = {
            width: "330",
            backgroundAlpha: 0.5,
	        backgroundColor: "#FFFFFF",
	        borderColor: "#666666",
	        borderAlpha: 1,
            bottom: 4,
            left: 0,
            horizontalGap: 4,
            fontSize: 14,
            data: [{
                    title: "Sri Lanka",
                    color: "#B42D00"
                }, {
                    title: "South Asia",
                    color: "#EEAE2F"
                }, {
                    title: "Other countries",
                    color: "#84C378"
                }, {
                    title: "Data not available",
                    color: "#aaa"
                }]
	        };
	        
	    worldMap.legend = mapLegend;
	    
	    worldMap.smallMap = new AmCharts.SmallMap();
	    
	    //
	    worldMap.addListener("rollOverMapObject", function (event) {
	    	//changeCustomChartTriangle(event.mapObject.id, event.mapObject.title);
	    	indexBarChart.markCountry(event.mapObject.id);
		});

		worldMap.addListener("rollOutMapObject", function (event) {
	    	indexBarChart.resetCountry(event.mapObject.id);
		});
	    //
	}
}

function drawWorldMap(){
	$("#position-map").css({"width": $(window).width() - 220, "height": "455px"});
	//worldMap.validateNow();
	worldMap.write("position-map");
}

function initializeIndexBarChart(){
	var indexData = [];
	
	var indexChartOptions = {
        marginTop: 5,
        marginRight: 5,
        marginBottom: 5,
        marginLeft: 5
    };
	
	indexBarChart = new IndexBarChart("position-index-bar-chart", indexData, indexChartOptions);
}

function drawIndexBarChart(newData){
	$("#position-index-bar-chart").css({"width": $(window).width() - 220, "height": "100px"});
	if(typeof newData !== "undefined"){
		indexBarChart.setData(newData);
	}
	indexBarChart.draw();
}


function loadPositionFirstLevel(){

	getAjaxChartData(positionSelectedGIId);

    $("#position-radar-wrapper").show(500);
    $("#position-map-wrapper").hide(500);
	isMapVisible = false;
	
	$("#toggleMapButton").html("<img src='images/small-world-map.png' style='margin-right: 8px;'><span>View Map</span>");

	//drawRadarChart(radarData);
	
	//var indexData = getGiiCountryDataArray();
	//drawIndexBarChart(indexData);
	
	//update breadcrumb
	//$("#position-breadcrumb-ol").empty();
	//$("#position-breadcrumb-ol").append('<li class="active">Global Innovation Index</li>');
	
	// update selection
	prevSelection = "gii";
	
	// update level
	currentPositionLevel = 1;
	
}

function loadPositionSecondLevel(selection, pillarId){
	if (currentPositionLevel === 1) { // from first level
		loadPositionSecondLevelContent(selection, pillarId);
	} else if (currentPositionLevel === 2) { // from second level
		if (prevSelection === selection) { // same selection pressed
			loadPositionFirstLevel();
		} else {
			loadPositionSecondLevelContent(selection, pillarId);
		}
	}
}

function loadPositionSecondLevelContent(selection, pillarId){

	getAjaxChartData(positionSelectedGIId, pillarId);
	
	$("#toggleMapButton").html("<img src='images/small-world-map.png' style='margin-right: 8px;'><span>View Map</span>");
	
    $("#position-radar-wrapper").show(500);
    $("#position-map-wrapper").hide(500);
	isMapVisible = false;
	
	// update selection
	prevSelection = selection;
	
	// update level
	currentPositionLevel = 2;
}

function setGISelectionData(dataArray){
	var tags = "";
	var selectedGIId = 0;
	for(var i = 0; i < dataArray.length; i++){
		tags += "<option value='"+ dataArray[i].id +"'>" + dataArray[i].name + " - " + dataArray[i].year + "</option>";
		$("#position-gi-name-selection").html(tags);
		
		if(i == 0){
			selectedGIId = dataArray[i].id;
			positionSelectedGIId = dataArray[i].id;
		}
	}
	getAjaxGIMenuData(selectedGIId);
	getAjaxChartData(positionSelectedGIId);
}

function getAjaxChartData(giId, pillarId){
	if ('undefined' == typeof pillar) {
		pillar = "";
	}
	$.ajax({
		url: "positionChartData",
		dataType: "json",
		type: "POST",
		data: {
			//giName: gi,
			//year: year,
			//pillarName: pillar,
			giId: giId,
			pillarId: pillarId
		},
		success: function(data, status, xhr){
			var radarDataArray = data.radar_data;
			for (var i = 0; i < radarDataArray.length; i++) {
				var d = radarDataArray[i].data;
				//console.log("{name: "+radarDataArray[i].name);
				//console.log("data: [");
				for(var j = 0; j < d.length; j++){
					var n = d[j].value;
					if(n === "NaN"){
						d[j].value = NaN;
					}
					//
					//console.log("{axis: \""+ d[j].axis + "\", value: " + d[j].value + "},");
					//if(d[j].axis === "Researchers, headcounts/mn pop"){
					//	d.splice(j, 1);
					//}
				}
				//console.log("]");
				//console.log("},");
			}
			
			var indexBarDataArray = data.index_bar_data;
			
			drawRadarChart(radarDataArray);
			drawIndexBarChart(indexBarDataArray);
			
			setWorldMapData(indexBarDataArray);
		},
		error:function(xhr, status, err){
			console.log(xhr);
		}
	});
}

function getAjaxGIData() {
	$.ajax({
		url: "positionGIData",
		dataType: "json",
		type: "POST",
		data: {},
		success: function (data, status, xhr) {
			var giDataArray = data.gi_data;
			setGISelectionData(giDataArray);
		},
		error:function(xhr, status, err){
			console.log(xhr);
		}
	});
}

function getAjaxGIMenuData(giId){
	$.ajax({
		url: "positionGIData",
		dataType: "json",
		type: "POST",
		data: {
			giId: giId
		},
		success: function(data, status, xhr) {
			var pniDataArray = data.pni_data;
			createGIMenu(pniDataArray);
		},
		error:function(xhr, status, err){
			console.log(xhr);
		}
	});
}

function createGIMenu(newData){
	if ('undefined' !== typeof newData) {
		var ulElem = document.createElement("ul");
		
		var liElem = document.createElement("li");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "#");
		aElem.setAttribute("onclick", "loadPositionFirstLevelTem()");
		var spanElem = document.createElement("span");
		var text = document.createTextNode("Global Index");
		spanElem.appendChild(text);
		aElem.appendChild(spanElem);
		liElem.appendChild(aElem);
		ulElem.appendChild(liElem);
		
		for(var i = 0; i < newData.length; i++){
			var liElem = document.createElement("li");
			var aElem = document.createElement("a");
			aElem.setAttribute("href", "#");
			aElem.setAttribute("onclick", "loadPositionSecondLevel('"+ newData[i].name +"', "+ newData[i].id +")");
			//console.log(newData[i].id);
			
			var spanElem = document.createElement("span");
			var text = document.createTextNode(newData[i].name);
			
			spanElem.appendChild(text);
			aElem.appendChild(spanElem);
			liElem.appendChild(aElem);
			
			var ulElem2 = document.createElement("ul");
			for(var j = 0; j < newData[i].nis.length; j++){
				var liElem2 = document.createElement("li");
				var aElem2 = document.createElement("a");
				aElem2.setAttribute("href", "#");
				aElem2.setAttribute("onclick", "");
				var text2 = document.createTextNode(newData[i].nis[j].name);
				aElem2.appendChild(text2);
				liElem2.appendChild(aElem2);
				ulElem2.appendChild(liElem2);
			}
			liElem.appendChild(ulElem2);
			ulElem.appendChild(liElem);
		}
		var divElem = document.getElementById("cssmenu2");
		// remove current menu elements
		while (divElem.firstChild) {
			divElem.removeChild(divElem.firstChild);
		}
		divElem.appendChild(ulElem);
		
		initPositionMenu(); // calling method in main.js
	}
}

// temp
function getGiiCountryDataArray(){
	var giiCountryData = [
		{"name": "Switzerland", "code": "CH", "rank": "1", "score": "66.59"},
		{"name": "Sweden", "code": "SE", "rank": "2", "score": "61.36"},
		{"name": "United Kingdom", "code": "GB", "rank": "3", "score": "61.25"},
		{"name": "Netherlands", "code": "NL", "rank": "4", "score": "61.14"},
		{"name": "United States of America", "code": "US", "rank": "5", "score": "60.31"},
		{"name": "Finland", "code": "FI", "rank": "6", "score": "59.51"},
		{"name": "Hong Kong (China)", "code": "HK", "rank": "7", "score": "59.43"},
		{"name": "Singapore", "code": "SG", "rank": "8", "score": "59.41"},
		{"name": "Denmark", "code": "DK", "rank": "9", "score": "58.34"},
		{"name": "Ireland", "code": "IE", "rank": "10", "score": "57.91"},
		{"name": "Canada", "code": "CA", "rank": "11", "score": "57.60"},
		{"name": "Luxembourg", "code": "LU", "rank": "12", "score": "56.57"},
		{"name": "Iceland", "code": "IS", "rank": "13", "score": "56.40"},
		{"name": "Israel", "code": "IL", "rank": "14", "score": "55.98"},
		{"name": "Germany", "code": "DE", "rank": "15", "score": "55.83"},
		{"name": "Norway", "code": "NO", "rank": "16", "score": "55.64"},
		{"name": "New Zealand", "code": "NZ", "rank": "17", "score": "54.46"},
		{"name": "Korea, Rep.", "code": "KR", "rank": "18", "score": "53.31"},
		{"name": "Australia", "code": "AU", "rank": "19", "score": "53.07"},
		{"name": "France", "code": "FR", "rank": "20", "score": "52.83"},
		{"name": "Belgium", "code": "BE", "rank": "21", "score": "52.49"},
		{"name": "Japan", "code": "JP", "rank": "22", "score": "52.23"},
		{"name": "Austria", "code": "AT", "rank": "23", "score": "51.87"},
		{"name": "Malta", "code": "MT", "rank": "24", "score": "51.79"},
		{"name": "Estonia", "code": "EE", "rank": "25", "score": "50.60"},
		{"name": "Spain", "code": "ES", "rank": "26", "score": "49.41"},
		{"name": "Cyprus", "code": "CY", "rank": "27", "score": "49.32"},
		{"name": "Czech Republic", "code": "CZ", "rank": "28", "score": "48.36"},
		{"name": "Italy", "code": "IT", "rank": "29", "score": "47.85"},
		{"name": "Slovenia", "code": "SI", "rank": "30", "score": "47.32"},
		{"name": "Hungary", "code": "HU", "rank": "31", "score": "46.93"},
		{"name": "Malaysia", "code": "MY", "rank": "32", "score": "46.92"},
		{"name": "Latvia", "code": "LV", "rank": "33", "score": "45.24"},
		{"name": "Portugal", "code": "PT", "rank": "34", "score": "45.10"},
		{"name": "China", "code": "CN", "rank": "35", "score": "44.66"},
		{"name": "Slovakia", "code": "SK", "rank": "36", "score": "42.25"},
		{"name": "Croatia", "code": "HR", "rank": "37", "score": "41.95"},
		{"name": "United Arab Emirates", "code": "AE", "rank": "38", "score": "41.87"},
		{"name": "Costa Rica", "code": "CR", "rank": "39", "score": "41.54"},
		{"name": "Lithuania", "code": "LT", "rank": "40", "score": "41.39"},
		{"name": "Bulgaria", "code": "BG", "rank": "41", "score": "41.33"},
		{"name": "Saudi Arabia", "code": "SA", "rank": "42", "score": "41.21"},
		{"name": "Qatar", "code": "QA", "rank": "43", "score": "41.00"},
		{"name": "Montenegro", "code": "ME", "rank": "44", "score": "40.95"},
		{"name": "Moldova, Rep.", "code": "MD", "rank": "45", "score": "40.94"},
		{"name": "Chile", "code": "CL", "rank": "46", "score": "40.58"},
		{"name": "Barbados", "code": "BB", "rank": "47", "score": "40.48"},
		{"name": "Romania", "code": "RO", "rank": "48", "score": "40.33"},
		{"name": "Poland", "code": "PL", "rank": "49", "score": "40.12"},
		{"name": "Kuwait", "code": "KW", "rank": "50", "score": "40.02"},
		{"name": "TFYR of Macedonia", "code": "MK", "rank": "51", "score": "38.18"},
		{"name": "Uruguay", "code": "UY", "rank": "52", "score": "38.08"},
		{"name": "Mauritius", "code": "MU", "rank": "53", "score": "38.00"},
		{"name": "Serbia", "code": "RS", "rank": "54", "score": "37.87"},
		{"name": "Greece", "code": "GR", "rank": "55", "score": "37.71"},
		{"name": "Argentina", "code": "AR", "rank": "56", "score": "37.66"},
		{"name": "Thailand", "code": "TH", "rank": "57", "score": "37.63"},
		{"name": "South Africa", "code": "ZA", "rank": "58", "score": "37.60"},
		{"name": "Armenia", "code": "AM", "rank": "59", "score": "37.59"},
		{"name": "Colombia", "code": "CO", "rank": "60", "score": "37.38"},
		{"name": "Jordan", "code": "JO", "rank": "61", "score": "37.30"},
		{"name": "Russian Federation", "code": "RU", "rank": "62", "score": "37.20"},
		{"name": "Mexico", "code": "MX", "rank": "63", "score": "36.82"},
		{"name": "Brazil", "code": "BR", "rank": "64", "score": "36.33"},
		{"name": "Bosnia and Herzegovina", "code": "BA", "rank": "65", "score": "36.24"},
		{"name": "India", "code": "IN", "rank": "66", "score": "36.17"},
		{"name": "Bahrain", "code": "BH", "rank": "67", "score": "36.13"},
		{"name": "Turkey", "code": "TR", "rank": "68", "score": "36.03"},
		{"name": "Peru", "code": "PE", "rank": "69", "score": "35.96"},
		{"name": "Tunisia", "code": "TN", "rank": "70", "score": "35.82"},
		{"name": "Ukraine", "code": "UA", "rank": "71", "score": "35.78"},
		{"name": "Mongolia", "code": "MN", "rank": "72", "score": "35.77"},
		{"name": "Georgia", "code": "GE", "rank": "73", "score": "35.56"},
		{"name": "Brunei Darussalam", "code": "BN", "rank": "74", "score": "35.53"},
		{"name": "Lebanon", "code": "LB", "rank": "75", "score": "35.47"},
		{"name": "Viet Nam", "code": "VN", "rank": "76", "score": "34.82"},
		{"name": "Belarus", "code": "BY", "rank": "77", "score": "34.62"},
		{"name": "Guyana", "code": "GY", "rank": "78", "score": "34.36"},
		{"name": "Dominican Republic", "code": "DO", "rank": "79", "score": "33.28"},
		{"name": "Oman", "code": "OM", "rank": "80", "score": "33.25"},
		{"name": "Trinidad and Tobago", "code": "TT", "rank": "81", "score": "33.17"},
		{"name": "Jamaica", "code": "JM", "rank": "82", "score": "32.89"},
		{"name": "Ecuador", "code": "EC", "rank": "83", "score": "32.83"},
		{"name": "Kazakhstan", "code": "KZ", "rank": "84", "score": "32.73"},
		{"name": "Indonesia", "code": "ID", "rank": "85", "score": "31.95"},
		{"name": "Panama", "code": "PA", "rank": "86", "score": "31.82"},
		{"name": "Guatemala", "code": "GT", "rank": "87", "score": "31.46"},
		{"name": "El Salvador", "code": "SV", "rank": "88", "score": "31.32"},
		{"name": "Uganda", "code": "UG", "rank": "89", "score": "31.21"},
		{"name": "Philippines", "code": "PH", "rank": "90", "score": "31.18"},
		{"name": "Botswana", "code": "BW", "rank": "91", "score": "31.14"},
		{"name": "Morocco", "code": "MA", "rank": "92", "score": "30.89"},
		{"name": "Albania", "code": "AL", "rank": "93", "score": "30.85"},
		{"name": "Ghana", "code": "GH", "rank": "94", "score": "30.60"},
		{"name": "Bolivia, Plurinational St.", "code": "BO", "rank": "95", "score": "30.48"},
		{"name": "Senegal", "code": "SN", "rank": "96", "score": "30.48"},
		{"name": "Fiji", "code": "FJ", "rank": "97", "score": "30.46"},
		{"name": "Sri Lanka", "code": "LK", "rank": "98", "score": "30.45"},
		{"name": "Kenya", "code": "KE", "rank": "99", "score": "30.28"},
		{"name": "Paraguay", "code": "PY", "rank": "100", "score": "30.28"},
		{"name": "Tajikistan", "code": "TJ", "rank": "101", "score": "30.00"},
		{"name": "Belize", "code": "BZ", "rank": "102", "score": "29.98"},
		{"name": "Cape Verde", "code": "CV", "rank": "103", "score": "29.69"},
		{"name": "Swaziland", "code": "SZ", "rank": "104", "score": "29.60"},
		{"name": "Azerbaijan", "code": "AZ", "rank": "105", "score": "28.99"},
		{"name": "Mali", "code": "ML", "rank": "106", "score": "28.84"},
		{"name": "Honduras", "code": "HN", "rank": "107", "score": "28.80"},
		{"name": "Egypt", "code": "EG", "rank": "108", "score": "28.48"},
		{"name": "Namibia", "code": "NA", "rank": "109", "score": "28.36"},
		{"name": "Cambodia", "code": "KH", "rank": "110", "score": "28.07"},
		{"name": "Gabon", "code": "GA", "rank": "111", "score": "28.04"},
		{"name": "Rwanda", "code": "RW", "rank": "112", "score": "27.64"},
		{"name": "Iran, Islamic Rep.", "code": "IR", "rank": "113", "score": "27.30"},
		{"name": "Venezuela, Bolivarian Rep.", "code": "VE", "rank": "114", "score": "27.25"},
		{"name": "Nicaragua", "code": "NI", "rank": "115", "score": "27.10"},
		{"name": "Burkina Faso", "code": "BF", "rank": "116", "score": "27.03"},
		{"name": "Kyrgyzstan", "code": "KG", "rank": "117", "score": "26.98"},
		{"name": "Zambia", "code": "ZM", "rank": "118", "score": "26.79"},
		{"name": "Malawi", "code": "MW", "rank": "119", "score": "26.73"},
		{"name": "Nigeria", "code": "NG", "rank": "120", "score": "26.57"},
		{"name": "Mozambique", "code": "MZ", "rank": "121", "score": "26.50"},
		{"name": "Gambia", "code": "GM", "rank": "122", "score": "26.39"},
		{"name": "Tanzania, United Rep.", "code": "TZ", "rank": "123", "score": "26.35"},
		{"name": "Lesotho", "code": "LS", "rank": "124", "score": "26.29"},
		{"name": "Cameroon", "code": "CM", "rank": "125", "score": "25.71"},
		{"name": "Guinea", "code": "GN", "rank": "126", "score": "25.70"},
		{"name": "Benin", "code": "BJ", "rank": "127", "score": "25.10"},
		{"name": "Nepal", "code": "NP", "rank": "128", "score": "24.97"},
		{"name": "Ethiopia", "code": "ET", "rank": "129", "score": "24.80"},
		{"name": "Bangladesh", "code": "BD", "rank": "130", "score": "24.52"},
		{"name": "Niger", "code": "NE", "rank": "131", "score": "24.03"},
		{"name": "Zimbabwe", "code": "ZW", "rank": "132", "score": "23.98"},
		{"name": "Uzbekistan", "code": "UZ", "rank": "133", "score": "23.87"},
		{"name": "Syrian Arab Republic", "code": "SY", "rank": "134", "score": "23.73"},
		{"name": "Angola", "code": "AO", "rank": "135", "score": "23.46"},
		{"name": "Côte d'Ivoire", "code": "CI", "rank": "136", "score": "23.42"},
		{"name": "Pakistan", "code": "PK", "rank": "137", "score": "23.33"},
		{"name": "Algeria", "code": "DZ", "rank": "138", "score": "23.11"},
		{"name": "Togo", "code": "TG", "rank": "139", "score": "23.04"},
		{"name": "Madagascar", "code": "MG", "rank": "140", "score": "22.95"},
		{"name": "Sudan", "code": "SD", "rank": "141", "score": "19.81"},
		{"name": "Yemen", "code": "YE", "rank": "142", "score": "19.32"}
	];
	return giiCountryData;
}

