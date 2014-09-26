// new code
var isPeopleTabVisited = false;
var peopleBarChart, peopleGroupedBarChart, peopleLineChart;
var peopleCurrentSelection; // people, publications, patents
var peoplePreviousAreaOfInterest;
var peopleCurrentLevel; // 1, 2, 3

// storing ajax data
var peoplePeopleCountForAOIData, peoplePeopleGenderCountForAOIData, 
peoplePublicationCountForAOIData, peopleAnnualPublicationCountForAOIData;

$(document).ready(function () {
	// bar chart
	initializeBarChart();
	
	// grouped bar chart
	initializeGroupedBarChart();
	
	// line chart
	initializeLineChart();
	
	peopleCurrentLevel = 1;
	peopleCurrentSelection = "people";
	peoplePreviousAreaOfInterest = "";
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var activeTab = "" + e.target; // Active Tab
     	var currentTab = activeTab.substring(activeTab.lastIndexOf("#") + 1);
     	if(currentTab == "people") {
     		if(!isPeopleTabVisited) { // first visit
     			// initializing text animations
     			initPeopleTextAnimations();
     			
     			// menu
     			getAjaxPeopleAOIData();
     			
     			loadPeopleFirstLevel();
     			isPeopleTabVisited = true;
     			
     			peopleCurrentSelection = "people";
     			$("#aPeoplePeo").addClass("peopleSelectionSelected");
     			$("#aPeoplePub").addClass("peopleSelectionUnselected");
     			$("#aPeoplePat").addClass("peopleSelectionUnselected");
     		} else { // other visits
     			
     		}
     	}
	});
	
	$("#aPeoplePeo").click(function() {
		if(peopleCurrentSelection !== "people") { // new click
			peopleCurrentSelection = "people";
			$("#aPeoplePeo").removeClass("peopleSelectionUnselected").addClass("peopleSelectionSelected");
			$("#aPeoplePub").removeClass("peopleSelectionSelected").addClass("peopleSelectionUnselected");
			$("#aPeoplePat").removeClass("peopleSelectionSelected").addClass("peopleSelectionUnselected");
			drawPeopleTopChart();
			drawPeopleBottomChart();
		}
	});
	
	$("#aPeoplePub").click(function() {
		if(peopleCurrentSelection !== "publications") { // new click
			peopleCurrentSelection = "publications";
			console.log("pubs clicked");
			$("#aPeoplePub").removeClass("peopleSelectionUnselected").addClass("peopleSelectionSelected");
			$("#aPeoplePeo").removeClass("peopleSelectionSelected").addClass("peopleSelectionUnselected");
			$("#aPeoplePat").removeClass("peopleSelectionSelected").addClass("peopleSelectionUnselected");
			drawPeopleTopChart();
			drawPeopleBottomChart();
		}
	});
	
	$("#aPeoplePat").click(function() {
		if(peopleCurrentSelection !== "patents") { // new click
			peopleCurrentSelection = "patents";
			$("#aPeoplePat").removeClass("peopleSelectionUnselected").addClass("peopleSelectionSelected");
			$("#aPeoplePeo").removeClass("peopleSelectionSelected").addClass("peopleSelectionUnselected");
			$("#aPeoplePub").removeClass("peopleSelectionSelected").addClass("peopleSelectionUnselected");
			drawPeopleTopChart();
			drawPeopleBottomChart();
		}
	});
	
});

function initializeBarChart(){
	var barData = [];
	
	var barChartOptions = {
        marginTop: 40,
        marginRight: 20,
        marginBottom: 50,
        marginLeft: 50,
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
	
	peopleBarChart = new BarChart("people-top-chart-div", barData, barChartOptions);
}

function drawBarChart(newData, newOptions){
	$("#people-top-chart-div").css({"width": $(window).width() - 220, "height": "260px"});
	if(typeof newData !== "undefined"){
		peopleBarChart.setData(newData);
	}
	if(typeof newOptions !== "undefined"){
		peopleBarChart.setOptions(newOptions);
	}
	peopleBarChart.draw();
}

function initializeGroupedBarChart(){
	var groupedBarData = [];
	
	var groupedBarChartOptions = {
			marginTop: 40,
	        marginRight: 20,
	        marginBottom: 50,
	        marginLeft: 50,
	        chartTitle: "Number of People over Area of Interests",
	        xAxisTitle: "",
	        yAxisTitle: "Number of researchers",
	        barHighlightColor: "#be4620",
	        barHighlightColorRotationDegree: 10,
	        barBorderColor: "#23415a",
	        barBorderHighlightColor: "#531400",
	        colors: ["#990099", "#0099C6", "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"],
	        colorRotationDegree: 20
    };
	
	peopleGroupedBarChart = new GroupedBarChart("people-bottom-chart-div", groupedBarData, groupedBarChartOptions);
}

function drawGroupedBarChart(newData) {
	$("#people-bottom-chart-div").css({"width": $(window).width() - 220, "height": "260px"});
	if(typeof newData !== "undefined"){
		peopleGroupedBarChart.setData(newData);
	}
	peopleGroupedBarChart.draw();
}

function initializeLineChart(){
	var lineData = [];
	
	var lineChartOptions = {
			marginTop: 40,
	        marginRight: 20,
	        marginBottom: 40,
	        marginLeft: 50,
	        chartTitle: "Yearly publication distribution",
	        xAxisTitle: "",
	        yAxisTitle: "",
	        lineColor: "#A52A2A",
	        valuePrecision: 2,
	        nanMessage: "Data not available"
    };
	
	peopleLineChart = new LineChart("people-bottom-chart-div", lineData, lineChartOptions);
}

function drawLineChart(newData, newOptions){
	$("#people-bottom-chart-div").css({"width": $(window).width() - 220, "height": "250px"});
	if(typeof newData !== "undefined"){
		peopleLineChart.setData(newData);
	}
	if(typeof newOptions !== "undefined"){
		peopleLineChart.setOptions(newOptions);
	}
	peopleLineChart.draw();
}

function loadPeopleFirstLevel() {
	loadHeadingData ("People", "people.svg", 0, 0, 0);
	peoplePreviousAreaOfInterest = "people";
	peopleCurrentLevel = 1;

	// draw bootom chart
	getAjaxPeopleCountData();
}

function loadPeopleSecondLevel(areaOfInterest, aoiId, iconName, numPeople, numPubs, numPatents){
	if(areaOfInterest !== peoplePreviousAreaOfInterest) { // new click
		loadHeadingData (areaOfInterest, iconName, numPeople, numPubs, numPatents);
		peoplePreviousAreaOfInterest = areaOfInterest;
		peopleCurrentLevel = 2;
		
		getAjaxPeopleCountData(aoiId);
	} else { // clicked on same expanded item
		loadPeopleFirstLevel();
	}
}

function loadHeadingData (areaOfInterest, iconName, numPeople, numPubs, numPatents){
	// heading
    $("#peopleTitle").addClass("animated fadeInLeft");
    $("#peopleTitle").text(areaOfInterest);
	
	// subject logo
    $("#peopleTitleImage").attr("src", "images/svg/" + iconName);
    
    // People description value
	$("#peopleNumPeo").text("");
	
	// Publication description value
	$("#peopleNumPub").text("");
	
	// patents description value
	$("#peopleNumPat").text(numPatents);
}

function setHeadingPeopleCount(peoCount){
	$("#peopleNumPeo").text(peoCount);
}

function setHeadingPublicationCount(pubCount){
	$("#peopleNumPub").text(pubCount);
}

function initPeopleTextAnimations(){
	$('#peopleTitle').bind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$("#peopleTitle").removeClass();
	});
}

function drawPeopleBottomChart(){
//	if(peopleCurrentLevel === 1) {
		if(peopleCurrentSelection === "people") {
			// grouped bar chart
			drawGroupedBarChart(peoplePeopleGenderCountForAOIData);
		} else if (peopleCurrentSelection === "publications") {
			// line chart
			var lineOptions = {
				chartTitle: "Number of Publications",
		        yAxisTitle: "Number of publications"
			};
			drawLineChart(peopleAnnualPublicationCountForAOIData, lineOptions);
		} else if (peopleCurrentSelection === "patents") {
			// line chart (temp)
			var lineDataArray = new Array();
			var yearArray = ["2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];
			for(var i = 0; i < yearArray.length; i++) {
				var jsonObj = {};
				jsonObj["name"] = yearArray[i];
				jsonObj["value"] = Math.random() * 10;
				lineDataArray.push(jsonObj);
			}
			
			var lineOptions = {
					chartTitle: "Yearly patent distribution",
			        yAxisTitle: "Number of patents"
				};
				
			drawLineChart(lineDataArray, lineOptions);
		}
//	}
}

function drawPeopleTopChart() {
//	if(peopleCurrentLevel === 1) {
		console.log("1st level");
		if(peopleCurrentSelection === "people") {
			// bar chart
			var barOptions = {
				chartTitle: "Number of People over Area of Interests",
		        yAxisTitle: "Number of People"
			};
			drawBarChart(peoplePeopleCountForAOIData, barOptions);
		} else if (peopleCurrentSelection === "publications") {
			console.log("draw top chart");
			// bar chart
			var barOptions = {
				chartTitle: "Number of Publications over Area of Interests",
		        yAxisTitle: "Number of Publications"
			};
			drawBarChart(peoplePublicationCountForAOIData, barOptions);
		} else if (peopleCurrentSelection === "patents") {
			// bar chart
			var barDataArray = new Array();
			var saiArray = getSubAreaArray("People");
			for(var i = 0; i < saiArray.length; i++) {
				var jsonObj = {};
				jsonObj["name"] = saiArray[i];
				jsonObj["value"] = Math.random() * 10;
				barDataArray.push(jsonObj);
			}
			var barOptions = {
				chartTitle: "Number of Patents over Area of Interests",
		        yAxisTitle: "Number of Patents"
			};
			drawBarChart(barDataArray, barOptions);
		}
//	} else if (peopleCurrentLevel === 2) {
//		console.log("2nd level");
//	}
}

function getAjaxPeopleAOIData(){
	$.ajax({
		url: "peopleAOIData",
		dataType: "json",
		type: "POST",
		data: {},
		success: function(data, status, xhr) {
			var aoiDataArray = data.aoi_data;
			createAOIMenu(aoiDataArray);
		},
		error:function(xhr, status, err){
			console.log(xhr);
		}
	});
}

function getAjaxPeopleCountData(aoiId) {
	$.ajax({
		url: "peoplePCData",
		dataType: "json",
		type: "POST",
		data: {
			aoiId: aoiId
		},
		success: function(data, status, xhr) {
			var allPeopleCount = data.all_people_count;
			peoplePeopleCountForAOIData = data.people_count_data;
			peoplePeopleGenderCountForAOIData = data.people_gender_count_data;
			
			setHeadingPeopleCount(allPeopleCount);
			//drawBarChart(peoplePeopleCountForAOIData);
			//drawGroupedBarChart(peoplePeopleGenderCountForAOIData);
			
			
			var allPublicationCount = data.all_publication_count;
			peoplePublicationCountForAOIData = data.publication_count_data;
			peopleAnnualPublicationCountForAOIData = data.annual_pbl_count_data;
			
			setHeadingPublicationCount(allPublicationCount);
			
			
			drawPeopleTopChart();
			drawPeopleBottomChart();
		},
		error:function(xhr, status, err) {
			console.log(xhr);
		}
	});
}

function createAOIMenu(newData) {
	if ('undefined' !== typeof newData) {
		var ulElem = document.createElement("ul");
		
		var liElem = document.createElement("li");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "#");
		aElem.setAttribute("onclick", "loadContent('People', 'Number of People',  'people.svg', 5489, 7678, 789)");
		var spanElem = document.createElement("span");
		var text = document.createTextNode("Area of Interest");
		spanElem.appendChild(text);
		aElem.appendChild(spanElem);
		liElem.appendChild(aElem);
		ulElem.appendChild(liElem);
		
		for(var i = 0; i < newData.length; i++){
			var liElem = document.createElement("li");
			var aElem = document.createElement("a");
			aElem.setAttribute("href", "#");
			aElem.setAttribute("onclick", "loadPeopleSecondLevel('"+ newData[i].aoiName +"', "+ newData[i].aoiId +",  '"+ newData[i].aoiImage +"', 5489, 7678, 789)");
			
			var spanElem = document.createElement("span");
			var text = document.createTextNode(newData[i].aoiName);
			
			spanElem.appendChild(text);
			aElem.appendChild(spanElem);
			liElem.appendChild(aElem);
			
			var ulElem2 = document.createElement("ul");
			for(var j = 0; j < newData[i].saoi.length; j++){
				var liElem2 = document.createElement("li");
				var aElem2 = document.createElement("a");
				aElem2.setAttribute("href", "#");
				aElem2.setAttribute("onclick", "loadPeopleThirdLevel()");
				var text2 = document.createTextNode(newData[i].saoi[j].saoiName);
				aElem2.appendChild(text2);
				liElem2.appendChild(aElem2);
				ulElem2.appendChild(liElem2);
			}
			liElem.appendChild(ulElem2);
			ulElem.appendChild(liElem);
		}
		var divElem = document.getElementById("cssmenu");
		divElem.appendChild(ulElem);
		
		initPeopleMenu(); // calling method in main.js
	}
}

// temp
function getSubAreaArray(area){
	var subAreaArr = new Array();
	if(area == "People"){
		subAreaArr.push("Natural Sciences");
		subAreaArr.push("Engineering and Technology");
		subAreaArr.push("Medical and Health Sciences");
		subAreaArr.push("Agricultural Sciences");
		subAreaArr.push("Social Sciences");
		subAreaArr.push("Humanities");
	} else if (area == "Natural Sciences") {
		subAreaArr.push("Mathematics");
		subAreaArr.push("Computer and information sciences");
		subAreaArr.push("Physical sciences");
		subAreaArr.push("Chemical sciences");
		subAreaArr.push("Earth and related environmental sciences");
		subAreaArr.push("Biological sciences");
		subAreaArr.push("Other natural sciences");
	} else if(area == "Engineering and Technology"){
		subAreaArr.push("Civil engineering");
		subAreaArr.push("Electrical engineering, electronic engineering, information engineering");
		subAreaArr.push("Mechanical engineering");
		subAreaArr.push("Chemical engineering");
		subAreaArr.push("Materials engineering");
		subAreaArr.push("Medical engineering");
		subAreaArr.push("Environmental engineering");
		subAreaArr.push("Environmental biotechnology");
		subAreaArr.push("Industrial Biotechnology");
		subAreaArr.push("Nano-technology");
		subAreaArr.push("Other engineering and technologies");
	} else if(area == "Medical and Health Sciences"){
		subAreaArr.push("Basic medicine");
		subAreaArr.push("Clinical medicine");
		subAreaArr.push("Health sciences");
		subAreaArr.push("Health biotechnology");
		subAreaArr.push("Other medical sciences");
	} else if(area == "Agricultural Sciences"){
		subAreaArr.push("Agriculture, forestry, and fisheries");
		subAreaArr.push("Animal and dairy science");
		subAreaArr.push("Veterinary science");
		subAreaArr.push("Agricultural biotechnology");
		subAreaArr.push("Other agricultural sciences");
	} else if(area == "Social Sciences"){
		subAreaArr.push("Psychology");
		subAreaArr.push("Economics and business");
		subAreaArr.push("Educational sciences");
		subAreaArr.push("Sociology");
		subAreaArr.push("Law");
		subAreaArr.push("Political Science");
		subAreaArr.push("Social and economic geography");
		subAreaArr.push("Media and communications");
		subAreaArr.push("Other social sciences");
	} else if(area == "Humanities"){
		subAreaArr.push("History and archaeology");
		subAreaArr.push("Languages and literature");
		subAreaArr.push("Philosophy, ethics and religion");
		subAreaArr.push("Art (arts, history of arts, performing arts, music)");
		subAreaArr.push("Other humanities");
	} else if(area == ""){
		subAreaArr.push("");
	}
	return subAreaArr;
}
