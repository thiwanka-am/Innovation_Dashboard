var psnData;
var peoplePerPage;
var peoplePageNum;
var peopleMaxPageNum;

$(document).ready(function(){
	peoplePerPage = 50;
	peoplePageNum = 1;
	
	fetchPeopleData();
	
	$("body").on("click", "#people-pagination .pagination li", function(event){
		event.preventDefault();
		var value = parseInt($(this).text());
		
		$("#people-pagination .pagination li").removeAttr("class");
		
		if(!isNaN(value)){ // value button clicked
			peoplePageNum = value;
			$(this).attr("class", "active");
		}
		
		$("#people-pagination .pagination li a").blur();
		
		if (isNaN(value)){
			if ($(this).text() == "\253"){ // left
				if (peoplePageNum !== 1) {
					peoplePageNum--;
					createPeopleList(((peoplePageNum - 1) * peoplePerPage), (peoplePageNum * peoplePerPage));
				}
				$("#lipag" + peoplePageNum).attr("class", "active");
			} else if ($(this).text() == "\273"){ // right
				if (peoplePageNum !== peopleMaxPageNum) {
					peoplePageNum++;
					createPeopleList(((peoplePageNum - 1) * peoplePerPage), (peoplePageNum * peoplePerPage));
				}
				$("#lipag" + peoplePageNum).attr("class", "active");
			}
		} else {
			createPeopleList(((value - 1) * peoplePerPage), (value * peoplePerPage));
		}
		
		if (peoplePageNum == 1) {
			$("#lipagleft").attr("class", "disabled");
		} else if (peoplePageNum == peopleMaxPageNum) {
			$("#lipagright").attr("class", "disabled");
		}
	});
	
});

function fetchPeopleData(){
	var url =  "scripts/people-data.jag";
	var idParameter = $("#orgid").val();
	
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		data:{
			oid: idParameter
		},
		success: onPeopleDataReceived
	});
}

function onPeopleDataReceived(data) {
	psnData = data.psn_data;
	createPagination();
	createPeopleList(0, peoplePerPage);
}

function createPeopleList(start, end){
	var place = $("#people-details");
	place.empty();
	
	if(end > psnData.length){
		end = psnData.length;
	}
	
	for(var i = start; i < end; i++){
		var divElem = document.createElement("div");
		$(divElem).css("margin", "20px 0px 20px");
		
		var divRowElem = document.createElement("div");
		divRowElem.setAttribute("class", "row");
		// -------------------------------------
		var divCol1Elem = document.createElement("div");
		divCol1Elem.setAttribute("class", "col-md-1");
		
		var text = document.createTextNode((i+1)+".");
		divCol1Elem.appendChild(text);
		
		divRowElem.appendChild(divCol1Elem);
		// -------------------------------------
		var divCol2Elem = document.createElement("div");
		divCol2Elem.setAttribute("class", "col-md-2");
		
		var imgElem = document.createElement("img");
		if(psnData[i].per_image == null){
			if(psnData[i].per_gender == 0){
				imgElem.setAttribute("src", "images/people/blank/woman.svg");
			} else {
				imgElem.setAttribute("src", "images/people/blank/man.svg");
			}
		} else {
			imgElem.setAttribute("src", "images/people/" + psnData[i].per_image);
		}
		
		$(imgElem).css("width", "80px");
		divCol2Elem.appendChild(imgElem);
		
		divRowElem.appendChild(divCol2Elem);
		// -------------------------------------
		var divCol3Elem = document.createElement("div");
		divCol3Elem.setAttribute("class", "col-md-9");
		
		text = document.createTextNode(psnData[i].per_title + " " + psnData[i].per_name);
		
		var h4Elem = document.createElement("h4");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "person.jag?pid=" + psnData[i].per_id);
		aElem.appendChild(text);
		
		h4Elem.appendChild(aElem);
		divCol3Elem.appendChild(h4Elem);
		
		divRowElem.appendChild(divCol3Elem);
		// -------------------------------------
		
		divElem.appendChild(divRowElem);
		place.append(divElem);
	}
	
}

function createPagination(){
	var numOfPeople = psnData.length;
	var numOfPages = numOfPeople / peoplePerPage;
	
	var place = $("#people-pagination");
	place.empty();
	
	var ulElem = document.createElement("ul");
	ulElem.setAttribute("class", "pagination");
	
	if(numOfPages > 1){
		var liElem = document.createElement("li");
		liElem.setAttribute("id", "lipagleft");
		liElem.setAttribute("class", "disabled");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "#");
		var text = document.createTextNode("\253");
		aElem.appendChild(text);
		
		liElem.appendChild(aElem);
		ulElem.appendChild(liElem);
	}

	for(var i = 0; i < numOfPages; i++){
		var liElem = document.createElement("li");
		liElem.setAttribute("id", "lipag"+(i+1));
		if(i == 0){
			liElem.setAttribute("class", "active");
		}
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "#");
		var text = document.createTextNode(i+1);
		aElem.appendChild(text);
		
		liElem.appendChild(aElem);
		ulElem.appendChild(liElem);
		
		peopleMaxPageNum = (i+1);
	}
	
	if(numOfPages > 1){
		var liElem = document.createElement("li");
		liElem.setAttribute("id", "lipagright");
		var aElem = document.createElement("a");
		aElem.setAttribute("href", "#");
		var text = document.createTextNode("\273");
		aElem.appendChild(text);
		
		liElem.appendChild(aElem);
		ulElem.appendChild(liElem);
	}
	
	place.append(ulElem);
	
}
