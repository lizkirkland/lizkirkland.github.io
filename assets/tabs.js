var Scroller = (function() {

	var scroller = {};

	scroller.recalc = function(e) {
		var offset = $(window).scrollTop();
		var height = $(window).height();

		var middle = offset + height/2;
		var blocks = [];

		$('#submenu a').each( function(i) {
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

		$('#submenu li.current').removeClass();
		for( var i=0; i < blocks.length; i++ ) {
			if ( middle > blocks[i].from && middle < blocks[i].to ) {
				console.log('in the middle of ' + blocks[i].anchor);
				$('#submenu li a[href=#' + blocks[i].anchor + ']').parent().addClass('current');
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
		$('body').animate( {scrollTop: target.offset().top }, 'slow' );
	//	return false;
	}

	return scroller;
})();


$(document).ready( function() {
	var out = '<ul id="submenu">';
	var amap = {};
	$('h2').each( function(i) { //sections
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
	$('body').append( out );
	$('#submenu a').click( Scroller.scrollToAnchor );
	$(window).scroll( Scroller.recalc ).resize( Scroller.recalc );
});
