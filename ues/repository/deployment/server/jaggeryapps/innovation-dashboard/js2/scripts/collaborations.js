var clbData, mapData, startOrg;
var geocoder, map;
var startMarker;
var viewType;

$(document).ready(function(){
	initGeocoderAndMap();

	fetchData();
	
	// on resize the window
	$(window).resize(function(){
		resetMap();
	});
	
	$("input:radio[name=clb-view]").change(function() {
        var option = $("input:radio[name=clb-view]:checked").val();
		viewType = option;
        if (option === "map") {
            createMap();
        } else if (option === "list") {
            createListView();
        }
    });
});

function initGeocoderAndMap() {
	$("#placeholder").empty();
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(14.133358596831147, 41.94423948437499); // 7.904744859248549, 80.76626096874999
	var mapOptions = {
		zoom: 2,
		center: latlng,
		panControl: true,
  		zoomControl: true,
   		mapTypeControl: false,
  		scaleControl: false,
  		streetViewControl: false,
  		overviewMapControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById('placeholder'), mapOptions);
	
	var styles = [
	  {
		featureType: "road",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "poi.business",
		elementType: "labels",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "transit",
		elementType: "all",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "poi.park",
		elementType: "all",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "administrative.locality",
		elementType: "labels.text",
		stylers: [
		  { visibility: "off" }
		]
	  }
	];
	
	map.setOptions({styles: styles});
}

function fetchData() {
	var url =  "scripts/collaborations-data.jag";
	var idParameter = getUrlParameters("oid", "", true);
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		data:{
			id: idParameter
		},
		success: onDataReceived
	});
}

function onDataReceived(data) {
	clbData = data.clb_data;
	mapData = data.map_data;
	startOrg = data.map_start_org;

	setStartLocation(startOrg.org_name, startOrg.org_image);
	
	//setGeoLocations(mapData);
}

function setStartLocation(locName, locImage){
	geocoder.geocode( { 'address': locName}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var image = {
				url: '../../innovation-dashboard/images/organizations/' + locImage,
				scaledSize: new google.maps.Size(20, 20),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10)
			};
			
			startMarker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				icon: image
			});
			
			google.maps.event.addListener(startMarker, 'click', function() {
				map.setZoom(8);
				map.setCenter(startMarker.getPosition());
			});
			
			setGeoLocations(mapData);
		}
	});
}

function setGeoLocations(data){
	for(var i = 0; i < data.length; i++){
		var name = data[i].cou_name;
		var image = "marker.png";
		var orgCount = data[i].org_count;
		var orgsArr = data[i].orgs;
		setLocationTimeout(i, name, image, orgCount, orgsArr)
	}
}

function setLocationTimeout(i, locName, markerImage, orgCount, orgsArr){
	setTimeout(function(){
		geocoder.geocode( { 'address': locName}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var image = {
					url: '../../portal/gadgets/route-map/images/' + markerImage + "1",
					scaledSize: new google.maps.Size(20, 20),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(10, 10)
				};
				
				/*var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon: image
				});*/
				
				var marker = new MarkerWithLabel({
					position: results[0].geometry.location,
					draggable: false,
					map: map,
					labelContent: orgCount,
					labelAnchor: new google.maps.Point(14, 14),
					labelClass: "clb-label", // the CSS class for the label
					labelStyle: {opacity: 0.75},
					icon: image
				});
				
				var poly = new google.maps.Polyline({
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 1,
					map: map,
					path: [startMarker.getPosition(), marker.getPosition()]
				});
				
				var infoContent = '<div style="width: 200px;"><h5>' + locName + "</h5>";
				infoContent += "<ol>"
				for(var i = 0; i < orgsArr.length; i++){
					infoContent += "<li>" + orgsArr[i] + "</li>";
				}
				infoContent += "</ol></div>"
				
				var infowindow = new google.maps.InfoWindow({
					content: infoContent,
					position: marker.getPosition()
				});
				
				google.maps.event.addListener(marker, 'click', function(event) {
					infowindow.open(map, this);
				});
				
			} else {
				// not found or error
				console.log(status);
			}
		});
	}, i * 500);
}

function resetMap() {
	var x = map.getZoom();
	var c = map.getCenter();
	google.maps.event.trigger(map, 'resize');
	map.setZoom(x);
	map.setCenter(c);
}

function createMap(){
	$("#clb-org-details").hide();
	var place = $("#placeholder");
	place.show();
}

function createListView(data){
	if('undefined' === typeof data){
		data = clbData;
	}
	$("#placeholder").hide();
	var place = $("#clb-org-details");
	place.show();
	place.empty();
	
	var tableElem = document.createElement("table");
	tableElem.setAttribute("class", "table table-striped");
	var theadElem = document.createElement("thead");
	
	// heading row
	var trElem = document.createElement("tr");
	var thElem0 = document.createElement("th");
	thElem0.style.width = "8%";
	var thElem1 = document.createElement("th");
	thElem1.style.width = "46%";
	var thElem2 = document.createElement("th");
	thElem2.style.width = "46%";
	
	var text = document.createTextNode(" # ");
	thElem0.appendChild(text);
	text = document.createTextNode("Organization");
	thElem1.appendChild(text);
	text = document.createTextNode("Country");
	thElem2.appendChild(text);
	
	trElem.appendChild(thElem0);
	trElem.appendChild(thElem1);
	trElem.appendChild(thElem2);
	theadElem.appendChild(trElem);
	tableElem.appendChild(theadElem);
	
	var tbodyElem = document.createElement("tbody");
	
	for (var i = 0; i < data.length; i++) {
		trElem = document.createElement("tr");
		var tdElem0 = document.createElement("td");
		var tdElem1 = document.createElement("td");
		var tdElem2 = document.createElement("td");
		
		var text = document.createTextNode((i + 1));
		tdElem0.appendChild(text);
		text = document.createTextNode(data[i].org_name);
		tdElem1.appendChild(text);
		text = document.createTextNode(data[i].cou_name);
		tdElem2.appendChild(text);
		
		trElem.appendChild(tdElem0);
		trElem.appendChild(tdElem1);
		trElem.appendChild(tdElem2);
		tbodyElem.appendChild(trElem);
	}
	tableElem.appendChild(tbodyElem);
	
	place.append(tableElem);
}

function getUrlParameters(parameter, staticURL, decode){
   var currLocation = (staticURL.length)? staticURL : window.location.search, parArr = currLocation.split("?")[1].split("&"), returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        } else{
            returnBool = false;            
        }
   }
   if(!returnBool) return false;  
}