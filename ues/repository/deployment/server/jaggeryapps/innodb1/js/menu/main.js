$(document).ready(function(){

	//initPeopleMenu();

	initPlacesMenu();

	initPositionMenu();
	
});

function initPeopleMenu(){
	$('#cssmenu > ul > li:has(ul)').addClass("has-sub");

	  $('#cssmenu > ul > li > a').click(function() {
	    var checkElement = $(this).next();
	    
	    $('#cssmenu li').removeClass('active');
	    $(this).closest('li').addClass('active');	
	    
	    if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
	      $(this).closest('li').removeClass('active');
	      checkElement.slideUp('normal');
	    }
	    
	    if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
	      $('#cssmenu ul ul:visible').slideUp('normal');
	      checkElement.slideDown('normal');
	    }
	    
	    if (checkElement.is('ul')) {
	      return false;
	    } else {
	      return true;	
	    }		
	  });
}

function initPositionMenu(){
	
	$('#cssmenu2 > ul > li:has(ul)').addClass("has-sub");	  
	  
	$('#cssmenu2 > ul > li > a').click(function() {
		var checkElement = $(this).next();

		$('#cssmenu2 li').removeClass('active');
		$(this).closest('li').addClass('active'); 

		if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
			$(this).closest('li').removeClass('active');
		  	checkElement.slideUp('normal');
		}

		if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
			$('#cssmenu2 ul ul:visible').slideUp('normal');
			checkElement.slideDown('normal');
		}

		if (checkElement.is('ul')) {
			return false;
		} else {
    		return true;
    	}
	});
}

function initPlacesMenu(){
	$('#cssmenu3 > ul > li:has(ul)').addClass("has-sub");

	$('#cssmenu3 > ul > li > a').click(function() {
		var checkElement = $(this).next();

		$('#cssmenu3 li').removeClass('active');
		$(this).closest('li').addClass('active');

		if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
			$(this).closest('li').removeClass('active');
			checkElement.slideUp('normal');
		}

		if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
			$('#cssmenu3 ul ul:visible').slideUp('normal');
			checkElement.slideDown('normal');
		}

		if (checkElement.is('ul')) {
			return false;
		} else {
			return true;
		}
	});
}