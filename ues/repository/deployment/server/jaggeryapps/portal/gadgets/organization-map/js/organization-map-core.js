var pref = new gadgets.Prefs();
var mapData;
var geocoder, map;

$(document).ready(function(){
	initGeocoderAndMap();

	fetchData();
	
	// on resize the window
	$(window).resize(function(){
		resetMap();
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

function onDataReceived(data) {
	mapData = data.org_data;
	setGeoLocations(mapData);
}

function initGeocoderAndMap() {
	$("#placeholder").empty();
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(7.904744859248549, 80.76626096874999);
	var mapOptions = {
		zoom: 7,
		center: latlng
	}
	map = new google.maps.Map(document.getElementById('placeholder'), mapOptions);
}

function setGeoLocations(orgData){
	var orgLocData = [];
	for(var i = 0; i < orgData.length; i++){
		var orgName = orgData[i].name;
		var orgImage = orgData[i].image;
		setLocationTimeout(i, orgName, orgImage)
	}
}

function setLocationTimeout(i, orgName, orgImage){
	setTimeout(function(){
		geocoder.geocode( { 'address': orgName}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var image = {
					url: '../../portal/gadgets/organization-map/images/' + orgImage,
					scaledSize: new google.maps.Size(24, 24),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(12, 12)
				};
				
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon: image
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
