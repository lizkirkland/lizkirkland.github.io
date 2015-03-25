var Scroller = (function() {
	

	var scroller = {};
	
	var mobile_cutoff = 585;
	var topbar_offset = 80;
	
	scroller.recalc = function(e) {
		var container = $('#submenu');
		
		// Mobile width is getting messed up
		if ($(window).width() <= container.width()) {
			container.width($(window).width());
		} else {
			container.width( 'auto' );	
		}
		if ( $(window).width() <= mobile_cutoff ) {
			$('div.article-cover,div.blog-cover').attr('style', 'margin-top: ' + $(container).height() + 'px;');
		} else
			$('div.article-cover,div.blog-cover').attr('style', '');

		
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
				container.find('li a[href=#' + blocks[i].anchor + ']').parent().addClass('current');
			}
		}
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
	var out = '<div id="submenu"><ul>';
	var amap = {};
	$('h1,h2:not(.subtitle)').each( function(i) { //sections
		var anchor = Scroller.sanitize($(this).text());
		if ( amap.hasOwnProperty(anchor) ) 
			anchor += i;
		
		amap[anchor] = true;
		var caption = $(this).text();
		$(this).prepend('<a name="'+anchor+'"></a>');
		out += '<li><a href="#'+anchor+'">'+caption+'</a></li>';
	});
	out += '</ul><div class="clr">.</div></div>';
	$('section.site-nav').after( out );
	$('#submenu a').click( Scroller.scrollToAnchor );
	$(window).scroll( Scroller.recalc ).resize( Scroller.recalc );
});


