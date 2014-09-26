
var svgWidth = 800;
var svgHeight = 530;
var isPlacesVisited = false;

$(document).ready(function(){
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var activeTab = "" + e.target; // Active Tab
     	//var prevTab = "" + e.relatedTarget; // Previous Tab
     	var currentTab = activeTab.substring(activeTab.lastIndexOf("#") + 1);

     	if(currentTab == "places"){
     		if(!isPlacesVisited){
     			drawSLMap();
     			drawTopInstituteGraph();
     		}
     		isPlacesVisited = true;
     	}
	});
	
});

function drawSLMap(){
	// create AmMap object
    var map = new AmCharts.AmMap();
    // set path to images
    map.pathToImages = "lib/ammap/images/";

    map.balloon.color = "#000000";

    // uni icon
    //var icon = "M21.25,8.375V28h6.5V8.375H21.25zM12.25,28h6.5V4.125h-6.5V28zM3.25,28h6.5V12.625h-6.5V28z";
    //var universityIcon = "M23.458,12.229l-0.712-4.11l-8.713,5.195L5.488,8.118l-0.71,4.436c0.003-0.006,0.01-0.012,0.017-0.019c-0.102,0.17-0.158,0.345-0.158,0.524c0,1.567,6.577,6.393,8.768,6.393c2.193,0,10.196-4.825,10.196-6.393C23.601,12.89,23.545,12.726,23.458,12.229z M14.101,12.396L0.711,4.282L14.138,0l13.391,4.221L14.101,12.396z M0.803,5L0,13.89l0.803,2.666l0.744-2.666L0.803,5z";
    //var researchIcon = "M23.303,20.484l-4.912-4.914l-0.638,0.389l-0.968-0.938c1.512-2.122,1.332-5.08-0.57-6.983c-0.13-0.13-0.278-0.228-0.418-0.341V0h-4.112v6.509c-0.599,0.076-1.18,0.253-1.731,0.529V5.06H5.845v16.274h4.108v-4.619c0.551,0.275,1.133,0.452,1.731,0.528v4.09h4.112v-4.781l0.634,0.611l-0.365,0.733l4.913,4.91c0,0,1.068,0.014,1.712-0.722C23.337,21.349,23.303,20.484,23.303,20.484z M9.419,8.917c1.627-1.634,4.28-1.635,5.914-0.001c1.632,1.635,1.633,4.28-0.003,5.919c-1.631,1.631-4.281,1.633-5.916-0.002C7.78,13.201,7.781,10.551,9.419,8.917z";
    
    var insImagesPath = "images/user-images/institutions/";

    /* create data provider object
     map property is usually the same as the name of the map file.
     
     getAreasFromMap indicates that amMap should read all the areas available
     in the map data and treat them as they are included in your data provider.
     in case you don't set it to true, all the areas except listed in data
     provider will be treated as unlisted.
     */

    var dataProvider = {
        map: "sriLankaHigh",
        //mapURL: "ammap/maps/svg/worldLow.svg",
        getAreasFromMap: true,
        zoomLevel: 1
    };
    
    dataProvider.images = [
	    {
	    	imageURL: insImagesPath + "uop.png",
		    latitude: 7.263993,
		    longitude: 80.599746,
		    centered: true,
		    title: "University of Peradeniya",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uop.png" class="regiontip-image" />The University of Peradeniya is the heir to a sixty year old University tradition which commenced with the inception of the <strong>University of Ceylon</strong>, the first institution of its kind established in Colombo on <strong>1 July 1942</strong>. It moved to the banks of Mahaweli River, the longest in the Country, in <strong>1952</strong>.</p><span>Web: <a href="http://www.pdn.ac.lk/" target="_blank">www.pdn.ac.lk/</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uoc.png",
		    latitude: 6.901909,
		    longitude: 79.860466,
		    centered: true,
		    title: "University of Colombo",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uoc.png" class="regiontip-image" />The oldest University in Sri Lanka, the University of Colombo is a sprawling complex located in the heart of the capital city of Colombo.</p><span>Web: <a href="http://www.cmb.ac.lk/" target="_blank">www.cmb.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "tri.png",
		    latitude: 6.722905,
		    longitude: 80.366291,
		    centered: true,
		    title: "Tea Research Institute",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'tri.png" class="regiontip-image" />TRI was first established in 1925 as an arm of the Planters Association of Ceylon, in order to enrich the tea industry through professional research findings.</p><span>Web: <a href="http://www.tri.lk/" target="_blank">www.tri.lk/</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "rrisl.png",
		    latitude: 6.505423,
		    longitude: 80.168500,
		    centered: true,
		    title: "Rubber Research Institute",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'rrisl.png" class="regiontip-image" />The origin of research on rubber goes back to 1909, when a group of planters in the Kalutara District met and agreed to engage a Chemist to study the coagulation of rubber. This was later expanded to form a Rubber Research Scheme in 1913, with 60% Government funds and the balance came from private subscribers.</p><span>Web: <a href="http://www.rrisl.lk/" target="_blank">www.rrisl.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uom.png",
		    latitude: 6.796877,
		    longitude: 79.901810,
		    centered: true,
		    title: "University of Moratuwa",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uom.png" class="regiontip-image" />The University of Moratuwa Sri Lanka is an independent state university located at Katubedda, Moratuwa overlooking the picturesque Bolgoda Lake. It was established as the University of Moratuwa (UoM), Sri Lanka on 22 December 1978 under the Universities Act No.16 of 1978 and operates under the general direction of the University Grants Commission.</p><span>Web: <a href="http://www.mrt.ac.lk/" target="_blank">www.mrt.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "sjp.png",
		    latitude: 6.853023,
		    longitude: 79.905474,
		    centered: true,
		    title: "University of Sri Jayewardenepura",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'sjp.png" class="regiontip-image" />The University of Sri Jayewardenepura is located in a beautiful setting at Gangodawila, Nugegoda, Sri Lanka, fifteen kilometers away from Colombo.</p><span>Web: <a href="http://www.sjp.ac.lk/" target="_blank">www.sjp.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uok.png",
		    latitude: 6.972919,
		    longitude: 79.915826,
		    centered: true,
		    title: "University of Kelaniya",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uok.png" class="regiontip-image" />The University of Kelaniya is one of the major national universities in Sri Lanka. It is located just outside the municipal limits of Colombo, in the ancient and historical city of Kelaniya on the north bank of the Kelani River.</p><span>Web: <a href="http://www.kln.ac.lk/‎" target="_blank">www.kln.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uoj.png",
		    latitude: 9.685606,
		    longitude: 80.022919,
		    centered: true,
		    title: "University of Jaffna",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uoj.png" class="regiontip-image" />The establishment of a full fledged University in Jaffna had been a long standing aspiration of the people of Jaffna. This was fulfilled when a campus of the University of Srilanka was established in 1974 by an order made by the Honourable Minister of Education.</p><span>Web: <a href="http://www.jfn.ac.lk/‎" target="_blank">www.jfn.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "seusl.png",
		    latitude: 7.296952,
		    longitude: 81.850044,
		    centered: true,
		    title: "South Eastern University of Sri Lanka",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'seusl.png" class="regiontip-image" />The establishment of the South Eastern University of Sri Lanka and its predecessor, the South Eastern University College of Sri Lanka, no doubt fulfilled the long felt needs of the people of the South eastern region.</p><span>Web: <a href="http://www.seu.ac.lk/" target="_blank">www.seu.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "wusl.png",
		    latitude: 7.464862,
		    longitude: 80.019289,
		    centered: true,
		    title: "Wayamba University of Sri Lanka",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'wusl.png" class="regiontip-image" />The Wayamba University of Sri Lanka marked a decade of existence in 2009 since being granted the autonomous status in 1999.</p><span>Web: <a href="http://www.wyb.ac.lk/" target="_blank">www.wyb.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uor.png",
		    latitude: 5.938944,
		    longitude: 80.576459,
		    centered: true,
		    title: "University of Ruhuna",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uor.png" class="regiontip-image" />The University of Ruhuna was established by a Special Presidential Decree on 1st September 1978, as Ruhuna University College, fulfilling a long cherished desire of the people of Southern Sri Lanka.</p><span>Web: <a href="http://www.ruh.ac.lk/" target="_blank">www.ruh.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uwu.png",
		    latitude: 6.982003,
		    longitude: 81.077546,
		    centered: true,
		    title: "Uva Wellassa University",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uwu.png" class="regiontip-image" />The Uva Wellassa University is a National University in Sri Lanka. It is the first all entrepreneurial university in Sri Lanka where students are getting trained on market oriented programs aiming for national growth and private sector employment.</p><span>Web: <a href="http://www.uwu.ac.lk/" target="_blank">www.uwu.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "eusl.png",
		    latitude: 7.831279,
		    longitude: 81.555830,
		    centered: true,
		    title: "Eastern University of Sri Lanka",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'eusl.png" class="regiontip-image" />The Eastern University, Sri Lanka, was established on the 01st of October 1986 by a University Order dated 26th September 1986 issued under Section 2 of the Universities Act No: 16 of 1978.</p><span>Web: <a href="http://www.esn.ac.lk/" target="_blank">www.esn.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "ousl.png",
		    latitude: 6.884212,
		    longitude: 79.883960,
		    centered: true,
		    title: "Open University of Sri Lanka",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'ousl.png" class="regiontip-image" />The Open University of Sri Lanka (OUSL) is the premier Open and Distance learning institution in Sri Lanka where students can pursue their studies through Open and Distance Learning (ODL) methodologies.</p><span>Web: <a href="http://www.ou.ac.lk/" target="_blank">www.ou.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "rusl.png",
		    latitude: 8.363564,
		    longitude: 80.504261,
		    centered: true,
		    title: "Rajarata University of Sri Lanka",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'rusl.png" class="regiontip-image" />Rajarata University of Sri Lanka , located in the historic city of Mihintale, which is situated 14 kilometres away from the east of Anuradhapura, was established on 31st of January, 1996.</p><span>Web: <a href="http://www.rjt.ac.lk/" target="_blank">www.rjt.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "susl.png",
		    latitude: 6.713095,
		    longitude: 80.789341,
		    centered: true,
		    title: "Sabaragamuwa University of Sri Lanka",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'susl.png" class="regiontip-image" />The Sabaragamuwa University of Sri Lanka located in Belihuloya, Balangoda, Sri Lanka. It was founded on 20 November 1991 and consists of 5 Faculties.</p><span>Web: <a href="http://www.sab.ac.lk/" target="_blank">www.sab.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "uovpa.png",
		    latitude: 6.909918,
		    longitude: 79.862376,
		    centered: true,
		    title: "University of the Visual & Performing Arts",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'uovpa.png" class="regiontip-image" />University of the Visual & Performing Arts was established on 1st of July 2005, by the former President of the Socialist Republic of Sri Lanka, (Government Gazette notification issued on 09th November 2005).</p><span>Web: <a href="http://www.vpa.ac.lk/" target="_blank">www.vpa.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "ifs.png",
		    latitude: 7.283812,
		    longitude: 80.632160,
		    centered: true,
		    title: "Institute of Fundamental Studies",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'ifs.png" class="regiontip-image" />The Institute of Fundamental Studies is a research institute which is unique in Sri Lanka, and it was established in 1981 by an Act of the Parliament of Sri Lanka.</p><span>Web: <a href="http://www.ifs.ac.lk/" target="_blank">www.ifs.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "crisl.png",
		    latitude: 7.331016,
		    longitude: 79.879383,
		    centered: true,
		    title: "Coconut Research Institute",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'crisl.png" class="regiontip-image" />The Coconut Research Institute (CRI) is a National Institute founded in 1929 as the Coconut Research Scheme under the Coconut Research Ordinance No. 24 of 1928. The scheme established its headquarters at Bandirippuwa Estate, Lunuwila (North Western Province) and began its research activities with three Technical Divisions namely, Genetics, Chemistry and Soil Chemistry for assisting coconut growers with technical information on coconut cultivation.</p><span>Web: <a href="http://www.cri.gov.lk/" target="_blank">www.cri.gov.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "accimt.png",
		    latitude: 6.795127,
		    longitude: 79.900109,
		    centered: true,
		    title: "Arthur C Clarke Institute for Modern Technologies",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'accimt.png" class="regiontip-image" />The Arthur C Clarke Institute for Modern Technologies (ACCIMT) is a State Institution for Research & Development and Training. The Institute specializes in the disciplines of Electronics, Micro-electronics, Telecommunications, Information Technology, Space Technologies, Robotics and other related fields of modern technologies.</p><span>Web: <a href="http://www.accimt.ac.lk/" target="_blank">www.accimt.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    },{
	    	imageURL: insImagesPath + "kdu.png",
		    latitude: 6.819080,
		    longitude: 79.890597,
		    centered: true,
		    title: "General Sir John Kotelawala Defence University",
		    description: '<p class="regiontip-para"><img src="'+ insImagesPath + 'kdu.png" class="regiontip-image" />General Sir John Kotelawala Defence University (KDU) is the only university offering graduate courses in defence studies in the South Asian region. Being a member of the Association of Commonwealth Universities (United Kingdom), we maintain world class standards for educating and grooming Officer Cadets to successfully meet the challenges of modern defence management and are proud to contribute to the making of outstanding Army, Navy and Air Force officers dedicated for the motherland forever.</p><span>Web: <a href="http://www.kdu.ac.lk/" target="_blank">www.kdu.ac.lk</a></span>',
		    width: 24,
		    height: 24,
		    descriptionWindowX: -250,
		    descriptionWindowY: 0
	    }
    ];
    
    // pass data provider to the map object
    map.dataProvider = dataProvider;

    /* create areas settings
     * autoZoom set to true means that the map will zoom-in when clicked on the area
     * selectedColor indicates color of the clicked area.
     */
    map.areasSettings = {
        autoZoom: true,
        color: "#FFCC00",
        outlineColor: "#FFFFFF",
        rollOverColor: "#f97924",
        rollOverOutlineColor: "#FFFFFF",
        selectedColor: "#f97924"
    };

    // let's say we want a small map to be displayed, so let's create it
    //map.smallMap = new AmCharts.SmallMap();

    // write the map to container div
    map.write("sri-lanka-map-area");
}

function drawTopInstituteGraph(){
	var topInstData = [
		{"name": "University of Moratuwa", "icon": "uom.png", "products": "456", "publications": "178", "patents": "84"},
		{"name": "University of Colombo", "icon": "uoc.png", "products": "378", "publications": "121", "patents": "17"},
		{"name": "University of Sri Jayewardenepura", "icon": "sjp.png", "products": "360", "publications": "59", "patents": "11"},
		{"name": "Open University of Sri Lanka", "icon": "ousl.png", "products": "160", "publications": "254", "patents": "110"},
		{"name": "Arthur C Clark Institute", "icon": "accimt.png", "products": "170", "publications": "114", "patents": "50"},
		{"name": "Institute of Fundamental Studies", "icon": "ifs.png", "products": "447", "publications": "244", "patents": "28"},
		{"name": "University of Peradeniya", "icon": "uop.png", "products": "398", "publications": "179", "patents": "69"},
		{"name": "Tea Research Institute", "icon": "tri.png", "products": "470", "publications": "78", "patents": "22"},
		{"name": "Sabaragamuwa University of Sri Lanka", "icon": "susl.png", "products": "214", "publications": "95", "patents": "10"},
		{"name": "Uwa Wellassa University", "icon": "uwu.png", "products": "199", "publications": "87", "patents": "17"}
	];
	
	var imagesPath = "images/user-images/institutions/";
	
	var instSvgWidth = 305;
	var instSvgHeight = 60;
	
	var valueArr = new Array();
	for (var i=0; i < topInstData.length; i++) {
		valueArr.push(parseInt(topInstData[i].products));
		valueArr.push(parseInt(topInstData[i].publications));
		valueArr.push(parseInt(topInstData[i].patents));
	};
	var maxValue = d3.max(valueArr);
	
	drawTopInstituteLegend();
	
	var instAccordion = d3.select("#top-institutions-area")
		.append("div") // <div class="panel-group" id="top-institutions-accordion">
		.attr("id", "top-institutions-accordion")
		.attr("class", "panel-group");
	
	//var instDiv = new Array();
	//var panelTitle = new Array();
	//var instPanel = new Array();
	//var instGroup = new Array();
	//var defs = new Array();
	
	for (var i=0; i < topInstData.length; i++) {
		var instDiv = instAccordion.append("div") // <div class="panel panel-default">
			.attr("class", "panel panel-default");
		
		// institute heading
		var panelTitle = instDiv.append("div") // <div class="panel-heading">
			.attr("class", "panel-heading")
			.append("h4") // <h4 class="panel-title">
			.attr("class", "panel-title");
		
		panelTitle.append("span")
			.style("margin-right", 10+"px")
			.text(i + 1 + ".");
		panelTitle.append("img") // <img src="images/user-images/institutions/uoc.png" width="24" />
			.attr("src", imagesPath + topInstData[i].icon)
			.attr("width", "24")
			.style("margin-right", "10px");
		panelTitle.append("a") // <a data-toggle="collapse" data-parent="#top-institutions-accordion" href="#desc-inst-1">University of Colombo</a>
			.attr("data-toggle", "collapse")
			.attr("data-parent", "#top-institutions-accordion")
			.attr("href", "#desc-inst-" + i)
			.text(topInstData[i].name);
		
		var instPanel = instDiv.append("div") // <div id="desc-inst-1" class="panel-collapse collapse in">
			.attr("id", "desc-inst-" + i);
		if(i == 0){
			instPanel.attr("class", "panel-collapse collapse in");
		} else {
			instPanel.attr("class", "panel-collapse collapse");
		}
			
		var instBody =	instPanel.append("div") // <div class="panel-body">
			.attr("class", "panel-body");
			
		var instGroup = instBody.append("svg")
			.attr("width", instSvgWidth)
			.attr("height", instSvgHeight)
			.attr("xmlns", "http://www.w3.org/2000/svg")
			.attr("xlink", "http://www.w3.org/1999/xlink")
			.append("g");
		
		var defs = instGroup.append("defs");
		
		var grad1 = defs.append("linearGradient")
			.attr("id", "topInstGrad1" + i)
			.attr("x1", "0%")
		    .attr("y1", "0%")
		    .attr("x2", "100%")
		    .attr("y2", "0%");
		grad1.append("svg:stop")
			.attr("offset", "0%")
			.attr("stop-color", "#62a710") // 4682B4
			.attr("stop-opacity", 1);
		grad1.append("svg:stop")
		    .attr("offset", "100%")
		    .attr("stop-color", "#3CE55D") // 50acf9
		    .attr("stop-opacity", 1);
		
		var grad2 = defs.append("linearGradient")
			.attr("id", "topInstGrad2" + i)
			.attr("x1", "0%")
		    .attr("y1", "0%")
		    .attr("x2", "100%")
		    .attr("y2", "0%");
		grad2.append("svg:stop")
			.attr("offset", "0%")
			.attr("stop-color", "#665ba0") // A52A2A
			.attr("stop-opacity", 1);
		grad2.append("svg:stop")
		    .attr("offset", "100%")
		    .attr("stop-color", "#47b7b8") // ec3e3e
		    .attr("stop-opacity", 1);
		
		var grad3 = defs.append("linearGradient")
			.attr("id", "topInstGrad3" + i)
			.attr("x1", "0%")
		    .attr("y1", "0%")
		    .attr("x2", "100%")
		    .attr("y2", "0%");
		grad3.append("svg:stop")
			.attr("offset", "0%")
			.attr("stop-color", "#990000") // FFCC00
			.attr("stop-opacity", 1);
		grad3.append("svg:stop")
		    .attr("offset", "100%")
		    .attr("stop-color", "#C86C38") // dabe4c
		    .attr("stop-opacity", 1);
		
		var barWidth = parseInt(parseInt(topInstData[i].products) * (instSvgWidth - 35) / maxValue);
			
		instGroup.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", barWidth )
			.attr("height", 15)
			.attr("rx", 2)
			.attr("ry", 2)
			.style("fill", "url(#topInstGrad1" + i + ")");
			
		instGroup.append("text")
			.attr("x", barWidth + 5)
			.attr("y", 12)
			.style("font-size", 10+"px")
			.text(parseInt(topInstData[i].products));
			
		barWidth = parseInt(parseInt(topInstData[i].publications) * (instSvgWidth - 35) / maxValue);
		
		instGroup.append("rect")
			.attr("x", 0)
			.attr("y", 20)
			.attr("width", barWidth)
			.attr("height", 15)
			.attr("rx", 2)
			.attr("ry", 2)
			.style("fill", "url(#topInstGrad2" + i + ")");
			
		instGroup.append("text")
			.attr("x", barWidth + 5)
			.attr("y", 32)
			.style("font-size", 10+"px")
			.text(parseInt(topInstData[i].publications));
		
		barWidth = parseInt(parseInt(topInstData[i].patents) * (instSvgWidth - 35) / maxValue);
		
		instGroup.append("rect")
			.attr("x", 0)
			.attr("y", 40)
			.attr("width", barWidth)
			.attr("height", 15)
			.attr("rx", 2)
			.attr("ry", 2)
			.style("fill", "url(#topInstGrad3" + i + ")");
		
		instGroup.append("text")
			.attr("x", barWidth + 5)
			.attr("y", 52)
			.style("font-size", 10+"px")
			.text(parseInt(topInstData[i].patents));
		
		instBody.append("div")
			.style("text-align", "right")
			.append("a")
			.attr("href", "#")
			.text("more");
	}
	
}

function drawTopInstituteLegend(){
	var instLegendGroup = d3.select("#top-institutions-area")
		.append("div")
		.style("background-color", "#ffffff")
		.style("margin-bottom", 5+"px")
		.style("border-width", 1+"px")
		.style("border-style", "solid")
		.style("border-color", "#DDDDDD")
		.style("border-top-left-radius", "3px")
		.style("border-top-right-radius", "3px")
		.style("border-bottom-left-radius", "3px")
		.style("border-bottom-right-radius", "3px")
		.append("svg")
		.attr("width", 340)
		.attr("height", 25)
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xlink", "http://www.w3.org/1999/xlink")
		.append("g");
		
	instLegendGroup.append("rect")
		.attr("x", 5)
		.attr("y", 8)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", 10)
		.attr("height", 15)
		.style("fill", "#62a710");
	
	instLegendGroup.append("text")
		.attr("x", 20)
		.attr("y", 20)
		.style("font-size", 12+"px")
		.text("Products");
	
	instLegendGroup.append("rect")
		.attr("x", 130)
		.attr("y", 8)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", 10)
		.attr("height", 15)
		.style("fill", "#665CA0");
	
	instLegendGroup.append("text")
		.attr("x", 145)
		.attr("y", 20)
		.style("font-size", 12+"px")
		.text("Publications");
		
	instLegendGroup.append("rect")
		.attr("x", 270)
		.attr("y", 8)
		.attr("rx", 2)
		.attr("ry", 2)
		.attr("width", 10)
		.attr("height", 15)
		.style("fill", "#990000");
	
	instLegendGroup.append("text")
		.attr("x", 285)
		.attr("y", 20)
		.style("font-size", 12+"px")
		.text("Patents");
}


