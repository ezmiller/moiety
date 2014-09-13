define(["jquery"], function() {
	
	$.fn.vAlign = function() {
		return this.each(function() {
			var ah = $(this).outerHeight();
			var ph = $(this).parent().outerHeight();
			var mh = (ph - ah) / 2;
			$(this).css('margin-top', mh);
//			console.log('element:'+ah+',parent:'+ph+'margin:'+mh);
  		});
	};

	$.fn.vAlignInViewport = function() {
		return this.each(function() {
			var ah = $(this).outerHeight();
	    	var ph = $(window).outerHeight();
	    	var mh = (ph - ah) / 2;
	    	$(this).css('margin-top', mh);
		});
	};

	$.fn.hAlign = function() {
		return this.each(function() {
			var aw = $(this).outerWidth();
			var pw = $(this).parent().outerWidth();
			var mw = (pw - aw) / 2;
			$(this).css('margin-left', mw);
			console.log('element:'+aw+',parent:'+pw+'margin:'+mw);
  		});
	};


	$.fn.hAlignInViewport = function() {
		return this.each(function() {
			var ah = $(this).outerWidth();
	    	var ph = $(window).outerWidth();
	    	var mh = (ph - ah) / 2;
	    	$(this).css('margin-left', mh);
		});
	};



});