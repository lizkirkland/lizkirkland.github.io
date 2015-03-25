var Scroller = (function() {

	var scroller = {};
	
	var mobile_cutoff = 585;
	var topbar_offset = 65;
	
	scroller.recalc = function(e) {
		var container = $('#submenu');
		
		// Mobile width is getting messed up
		if ($(window).width() <= container.width()) {
			container.width($(window).width());
		} else {
			container.width( 'auto' );	
		}
			

		
		var offset = $(window).scrollTop();
		if ( offset > topbar_offset )
			container.addClass('fixed');
		else 
			container.removeClass('fixed');
		var height = $(window).height();
		
		var middle = offset + height/2;
		var blocks = [];
		
		container.find('a').each( function(i) {
			var anchor = $(this).attr('href').substr(1);
			var pos = $('a[name='+anchor+']').offset().top;
			if ( i > 0 ) {
				var last = blocks[blocks.length-1];
				last.to = pos;
			}

			blocks.push({
				anchor: anchor,
				from: pos,
				to: 0
			});
		});

		blocks[blocks.length-1].to = $(document).height();
		
		container.find('li.current').removeClass();
		for( var i=0; i < blocks.length; i++ ) {
			if ( middle > blocks[i].from && middle < blocks[i].to ) {
				console.log('in the middle of ' + blocks[i].anchor);
				container.find('li a[href=#' + blocks[i].anchor + ']').parent().addClass('current');
			}
		}
		
		
		console.debug( blocks );
	}

	scroller.sanitize = function( text ) {
		return text.replace(/\s+/g, '-').replace(/[^0-9a-z\-]/ig, '');
	}
	
	scroller.scrollToAnchor = function(e) {
		var a = $(e.currentTarget);
		var target = $('a[name=' + a.attr('href').substr(1) + ']');
		var offset = 0;
		if ($(window).width() <= mobile_cutoff) {
			offset += $('#submenu').height();
		}
		$('body').animate( {scrollTop: target.offset().top - offset }, 'slow' );
	//	return false;
	}
	
	return scroller;
})();


$(document).ready( function() {
	var out = '<ul id="submenu">';
	var amap = {};
	$('h1,h2').each( function(i) { //sections
		var anchor = Scroller.sanitize($(this).text());
		if ( amap.hasOwnProperty(anchor) ) 
			anchor += i;
		
		amap[anchor] = true;
		var caption = $(this).text();
		var cutoff = 32;
		if ( caption.length > cutoff )
			caption = caption.substr(0,cutoff-3) + '...';
		$(this).prepend('<a name="'+anchor+'"></a>');
		out += '<li><a href="#'+anchor+'">'+caption+'</a></li>';
	});
	out += '</ul>';
	$('section.site-nav').after( out );
	$('#submenu a').click( Scroller.scrollToAnchor );
	$(window).scroll( Scroller.recalc ).resize( Scroller.recalc );
});


