/*  agres css spread'r,
 *    jquery addition to auto v center agres'ed lines elements
 * 
 * © 2k15~2k16 noferi Mickaël ~ r043v/dph
 *   under creative common BY-NC-SA
 * 
 */
(function($){
	$.fn.agres = function(opts){
		opts = $.extend({},{ resize:200, move:200 },opts);
		
		function setMarginTop($, mtop){
			if( opts.move ){
				//var fit = $.css('object-fit'); $.css('object-fit','none');
				$.stop(true,false).animate( { marginTop:mtop }, opts.move, function(){
					//$.css('object-fit',fit);
				});
			} else $.css({ marginTop:mtop});
		}
			
		var $lines = $(this), $elems = $lines.children();
		function vCenter($e, recursive){
			if( !$e.is($elems) ) return;// console.log('wtf');
			var maxh = $e.innerHeight(), line = [ { $:$e, h:maxh } ];
			
			function check($e,way){
				var $n = $e, append = way === 'prev' ? 'unshift' : 'push';
				while(1){
					$n = $n[way](); // check prev/next elem
					if(!$n.length) break; // no more sibblings this way
					var isClear = $n.css('clear') === 'left';
					
					if( isClear && way === 'next' ){ // $n is a new line start
						if(recursive === true) setTimeout(function(){ vCenter($n,true); },0);
						break;
					}
					
					/* append this elem into the line */
					var h = $n.innerHeight(); if(h > maxh) maxh = h;
					line[append]( { $:$n,h:h } );
					
					if( isClear && way === 'prev' ) break; // current line start
				};
			}
			
			if($e.css('clear') !== 'left') // not line start, check backward elems of same line
				check($e,'prev');
			
			// check forward elems in same line
			check($e,'next');
			
			if(line.length < 2) // single elem
				return setMarginTop(line[0].$,0);
			
			
			
			for( var n=0; n < line.length; n++ ){
				var e = line[n], mtop = parseInt( (maxh - e.h)/2, 10);
				setMarginTop(e.$,mtop);
			}
		}
		
		setTimeout(function(){
			$(window).on('resize',function(delay){
				var timer=false, $all = $lines.children(':first-child');
				return function(){
					$t = $(this);
					if(timer !== false) clearTimeout(timer);
					timer = setTimeout(function(){
						timer = false;
						$all.each(function(){ vCenter( $(this), true ); });
					},delay);
				};
			}(opts.resize)).resize();
			
			$lines.find('img').each(function(){
				var $i = $(this); var $p = $i; do { $p = $p.parent(); } while(!$p.is($elems));
				$('<img/>').on('load',function(){ vCenter( $p, false); }).attr('src', $i.attr('src') );
			});
		},1);
		
		return $lines;
	};
})(jQuery);