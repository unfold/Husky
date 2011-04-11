(function($) {
	$.fn.touchScroll = function(options) {
		var settings = {
			friction: .9
		};

		$.extend(settings, options);
		
		return this.each(function() {
			var $container = $(this);
			$container.wrapInner($('<div />', { 'class': 'touchscroll-wrapper' }));
			var $content = $container.find('.touchscroll-wrapper')
				.css({
					'-webkit-transform': 'translate3d(0px, 0px, 0px)',
					'-webkit-transition-property': 'translate3d',
					'-webkit-transition-duration': '0s',
					'-webkit-transition-timing-function': 'ease-out'
			});
			
			var contentPosition = 	{ left: 0, top: 0 };
			var touchPosition = 	{ left: 0, top: 0 };
			var delta = 			{ left: 0, top: 0 };
			
			var throwInterval = null;
			
			var getTouchPosition = function(touch) {
				return {
					left: touch.clientX,
					top: touch.clientY
				};
			};
			
			var updateContentPosition = function() {
				$content.css('-webkit-transform', 'translate3d(' + (-contentPosition.left) + 'px, ' + (-contentPosition.top) + 'px, 0px)');
			}
			
			var touchstart = function(e) {
				if (event.touches.length == 1) {
					e.preventDefault();
					
					clearInterval(throwInterval);
					touchPosition = getTouchPosition(event.touches[0]);
				}
			};
			
			var touchend = function(e) {
				if(Math.abs(delta.left) > 0 && Math.abs(delta.top) > 0) {
					var momentum = {
						left: delta.left,
						top: delta.top
					};
					
					clearInterval(throwInterval);
					
					throwInterval = setInterval(function() {
						momentum = {
							left: momentum.left * settings.friction,
							top: momentum.top * settings.friction
						};
						
						if(Math.abs(momentum.left) + Math.abs(momentum.top) < .5) {
							clearInterval(throwInterval);
						}
						
						contentPosition = {
							left: contentPosition.left - momentum.left,
							top: contentPosition.top - momentum.top
						};
						
						updateContentPosition();
					}, 20);
				}
			};
			
			var touchmove = function(e) {
				if (event.touches.length == 1) {
					e.preventDefault();
					
					var newTouchPosition = getTouchPosition(event.touches[0]);
					
					delta = {
						left: newTouchPosition.left - touchPosition.left,
						top: newTouchPosition.top - touchPosition.top
					};
					
					contentPosition = {
						left: contentPosition.left - delta.left,
						top: contentPosition.top - delta.top
					};
					
					touchPosition = newTouchPosition;
					updateContentPosition();
				} else {
					delta = {
						left: 0,
						top: 0
					};
				}
			};
			
			$(this).bind('touchstart.sled', touchstart);
			$(this).bind('touchend.sled', touchend);
			$(this).bind('touchmove.sled', touchmove);
		});
	};
})(jQuery);