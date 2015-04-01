var Scroller = (function() {
	

	var scroller = {};
	
	var mobile_cutoff = 585;
	var topbar_offset = 80;
	
	scroller.recalc = function(e) {
		var container = $('#submenu');
		
		// Mobile width is getting messed up
		if ( $(window).width() <= mobile_cutoff ) {
			if ($(window).width() != container.width()) 
				$('#navigation').width($(window).width());
		} else {
			$('div.article-cover,div.blog-cover').css({'margin-top': ''});
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
			offset += $(window).height()/2;
		}
		$('body').animate( {scrollTop: target.offset().top - offset }, 'slow' );
	//	return false;
	}
	
	return scroller;
})();


$(document).ready( function() {
	var out = '<ul id="submenu">';
	var amap = {};
	$('article h1,article h2:not(.subtitle)').each( function(i) { //sections
		var anchor = Scroller.sanitize($(this).text());
		if ( amap.hasOwnProperty(anchor) ) 
			anchor += i;
		
		amap[anchor] = true;
		var caption = $(this).text();
		$(this).prepend('<a name="'+anchor+'"></a>');
		out += '<li><a href="#'+anchor+'">'+caption+'</a></li>';
	});
	out += '</ul>';
	$('#navigation ul').after( out );
	$('#submenu a').click( Scroller.scrollToAnchor );
	$(window).scroll( Scroller.recalc ).resize( Scroller.recalc ).resize();
	
	
	$('#nav-toggle').click( function() {
			if ( $(this).hasClass('active') ) {
				$(this).removeClass('active')
				$('#navigation').removeClass('show')
				$('article').removeClass('background');
			} else {
				$('#navigation').addClass('show')
				$(this).addClass('active');
				$('article').addClass('background');
			}
			return false;
		});
});


