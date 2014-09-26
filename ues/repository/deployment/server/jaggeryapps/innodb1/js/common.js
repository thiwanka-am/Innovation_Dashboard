
function changeSubArea(){
	$('#chart_div').hide();
	$('#top-people-area').show();
	$('#people-draw-area').show();
	$('#people-draw-area-donut').show();
	donutChart();
}

function load(tab){
	$('#top-people-area').hide();
	$('#people-draw-area').hide();
	$('#people-draw-area-donut').hide();
	//$('#myTab a:'+window.location.search.split('option=')[1]+'').tab('show');
	$('#myTab a[href="#'+tab+'"]').tab('show');
	$('#chart_div').show();
}

function pageLoad(){
	$('#myTab a[href="#' + window.location.search.split('option=')[1] + '"]').tab('show');
	$('#top-people-area').hide();
	$('#people-draw-area').hide();
	$('#people-draw-area-donut').hide();
	//$('#myTab a:'+window.location.search.split('option=')[1]+'').tab('show');
	$('#chart_div').show();
}

function activeTab(tab){
	window.open("temp.html", "_self");
	//window.open("home.html?option="+tab, "_self");
};

function changeTab(tab){
	$('#myTab a[href="#'+tab+'"]').tab('show');
};

function loadGrid() {

	oTable = $('#peopleGrid').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"iDisplayLength": 5,
		"bLengthChange" :true,
		"aaSorting": [[ 0, "asc" ]],
		"aLengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
		"aaData": [
		/* Reduced data set */
		[ ' P Abdul Salam ','University of Colombo' , 65  , 0 ] ,
		[ ' Abeysena C  ' ,'University of Colombo' , 27  , 0 ] ,
		[ ' Arulampalam A ' , 'University of Colombo' ,78  , 0 ] ,
		[ ' Balasuriya A  ' ,'University of Colombo' , 124  , 0 ] ,
		[ ' Herath C  ' , 'University of Colombo' ,45  , 0 ] ,
		[ ' Lareef Zubair ' , 'University of Colombo' ,78  , 0 ] ,
		[ ' Lautze J  ' ,'University of Colombo' , 56  , 0 ] ,
		[ ' Maithripala D ' ,'University of Colombo' , 89  , 0 ] ,
		[ ' Manderson L ' , 'University of Colombo' ,32  , 0 ] ,
		[ ' Merrey D  ' , 'University of Colombo' ,58  , 0 ] ,
		[ ' Michael Abramson  ' ,'University of Colombo' , 74  , 0 ] ,
		[ ' Mowjood M ' ,'University of Colombo' , 49  , 0 ] ,
		[ ' Noojipady P ' ,'University of Colombo' , 27  , 0 ] ,
		[ ' P G McCornick ' ,'University of Colombo' , 36  , 0 ] ,
		[ ' Suneth Agampodi ' ,'University of Colombo' , 21  , 0 ] 
		],
		"aoColumns": [
		{ "sTitle": "Researcher Name" ,"sWidth": "36%"},
		{ "sTitle": "Institute","sWidth": "36%" },
		{ "sTitle": "# Papers","sWidth": "14%" },
		{ "sTitle": "# Patents","sWidth": "15%" }
		]
	});

/* Add a click handler to the rows - this could be used as a callback */
$("#peopleGrid tbody").click(function(event) {
	$(oTable.fnSettings().aoData).each(function (){
		$(this.nTr).removeClass('row_selected');
	});
	$(event.target.parentNode).addClass('row_selected');
});
}

function popitup(url) {
  newwindow=window.open(url,'name','height=700,width=600');
  if (window.focus) {newwindow.focus()}
  return false;
}

function loadPublicationGrid() {
	var g2 = document.getElementById('publicationGrid');
	if ($.fn.DataTable.fnIsDataTable( g2 ) ) {
			oTable.fnDestroy();
	}
	oTable = $('#publicationGrid').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"iDisplayLength": 5,
		"bLengthChange" :true,
		"aaSorting": [[ 0, "asc" ]],
		"aLengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
		"aaData": [
		/* Reduced data set */
		[ ' Impact of habitat disturbance on the distribution of endemic species of small mammals and birds in a tropical rain forest in Sri Lanka ','<a>http://journals.cambridge.org/production/action/cjoGetFulltext?fulltextid=345034</a>' , 2005  , 12 ] ,
		[ ' Effects of diazinon on larvae of the Asian common toad (Bufo melanostictus, Schneider 1799)  ' ,'<a>http://onlinelibrary.wiley.com/doi/10.1897/07-315.1/full</a>' , 2008  , 2 ] ,
		[ ' What causes the vulnerability of endemic animals? A case study from Sri Lanka ' , '<a>http://journals.cambridge.org/abstract_S0952836904004959</a>' ,2004  , 1 ] 
		],
		"aoColumns": [
		{ "sTitle": "Publication Title" ,"sWidth": "36%"},
		{ "sTitle": "URL","sWidth": "36%" },
		{ "sTitle": "Year","sWidth": "10%" },
		{ "sTitle": "Citations","sWidth": "16%" }
		]
	});

/* Add a click handler to the rows - this could be used as a callback */
$("#publicationGrid tbody").click(function(event) {
	$(oTable.fnSettings().aoData).each(function (){
		$(this.nTr).removeClass('row_selected');
		$('#btns').show();
	});
	$(event.target.parentNode).addClass('row_selected');
});

}