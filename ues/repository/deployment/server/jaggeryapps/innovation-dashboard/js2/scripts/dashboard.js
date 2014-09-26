$(document).ready(function(){
	var tabPara = getDashboardUrlParameters("tab", "", true);
	$('#dash-tab a[href="#' + tabPara + '"]').tab('show');

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var activeTab = "" + e.target; // Active Tab
		var previousTab = e.relatedTarget // previous tab
		console.log("active: " + activeTab + ", previous: " + previousTab);
		
		$(this).blur();
	});
});

function getDashboardUrlParameters(parameter, staticURL, decode){
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