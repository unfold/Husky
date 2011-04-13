(function($) {
	$.fn.touchScroll = function(options) {
		var settings = {
			friction: 0.9
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
			
			var contentPosition =   { left: 0, top: 0 };
			var touchPosition =     { left: 0, top: 0 };
			var delta =             { left: 0, top: 0 };
			
			var throwInterval = null;
			
			var getTouchPosition = function(touch) {
				return {
					left: touch.clientX,
					top: touch.clientY
				};
			};
			
			var updateContentPosition = function() {
				$content.css('-webkit-transform', 'translate3d(' + (-contentPosition.left) + 'px, ' + (-contentPosition.top) + 'px, 0px)');
				
				// TODO: Debug
				$('#content-position').val(contentPosition.left.toFixed(2) + ', ' + contentPosition.top.toFixed(2));
				$('#touch-position').val(touchPosition.left.toFixed(2) + ', ' + touchPosition.top.toFixed(2));
			};
			
			var touchstart = function(e) {
				if (event.touches.length == 1) {
					e.preventDefault();
					
					clearInterval(throwInterval);
					touchPosition = getTouchPosition(event.touches[0]);
					
					delta = {
						left: 0,
						top: 0
					};
					
					// TODO: Debug
					$('#momentum').removeClass('active');
				}
			};
			
			var touchend = function(e) {
				if(Math.abs(delta.left) > 0 || Math.abs(delta.top) > 0) {
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
						
						$('#momentum').val(momentum.left.toFixed(2) + ', ' + momentum.top.toFixed(2));
						
						if(Math.abs(momentum.left) + Math.abs(momentum.top) < 0.5) {
							clearInterval(throwInterval);

							// TODO: Debug
							$('#momentum').removeClass('active');
						}
						
						contentPosition = {
							left: contentPosition.left - momentum.left,
							top: contentPosition.top - momentum.top
						};
						
						updateContentPosition();
					}, 20);
					
					// TODO: Debug
					$('#momentum').addClass('active');
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
				
				// TODO: Debug
				$('#delta').val(delta.left.toFixed(2) + ', ' + delta.top.toFixed(2));
			};
			
			$(this).bind('touchstart.touchScroll', touchstart);
			$(this).bind('touchend.touchScroll', touchend);
			$(this).bind('touchmove.touchScroll', touchmove);
		});
	};
})(jQuery);