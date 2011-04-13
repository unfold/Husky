(function($) {
	$.fn.touchScroll = function(options, boundaries) {
		var settings = {
			friction: 0.9
		};

		$.extend(settings, options);
		
		var Point = function(left, top) {
			this.left = left || 0;
			this.top = top || 0;
		};
		
		Point.prototype.clone = function() {
			return new Point(this.left, this.top);
		};

		Point.prototype.subtract = function(point) {
			return new Point(this.left - point.left, this.top - point.top);
		};

		Point.prototype.toString = function(precision) {
			return this.left.toFixed(precision || 2) + ', ' + this.top.toFixed(precision || 2);
		};
		
		var getComputedValue = function(value) {
			return typeof(value) == 'function' ? value() : value;
		};

		var getTouchPosition = function(touch) {
			return new Point(touch.clientX, touch.clientY);
		};
		
		return this.each(function() {
			var $container = $(this).wrapInner($('<div />', { 'class': 'touchscroll-wrapper' }));
			var $content = $container.find('.touchscroll-wrapper')
				.css({
					'-webkit-transform': 'translate3d(0px, 0px, 0px)',
					'-webkit-transition-property': 'translate3d',
					'-webkit-transition-duration': '0s',
					'-webkit-transition-timing-function': 'ease-out'
			});
			
			var contentPosition = new Point();
			var contentBoundaries = $.extend({
				left: 0,
				top: 0,
				width: function() {
					return $content.width() - $(window).width();
				},
				height: function() {
					return $content.height() - $(window).height();
				}
			}, boundaries);
			var touchPosition = new Point();
			var delta = new Point();

			var throwInterval = null;
			
			var updateContentPosition = function() {
				contentPosition.left = Math.min(Math.max(getComputedValue(contentBoundaries.left), contentPosition.left), getComputedValue(contentBoundaries.width));
				contentPosition.top = Math.min(Math.max(getComputedValue(contentBoundaries.top), contentPosition.top), getComputedValue(contentBoundaries.height));
				
				$content.css('-webkit-transform', 'translate3d(' + (-contentPosition.left) + 'px, ' + (-contentPosition.top) + 'px, 0px)');
				
				// TODO: Debug
				$('#content-position').val(contentPosition);
				$('#touch-position').val(touchPosition);
			};
			
			var touchstart = function(e) {
				$('#touches').val('t: ' + event.touches.length + ', c: ' + event.changedTouches.length + ', ta: ' + event.targetTouches.length);
				if (event.touches.length == 1) {
					e.preventDefault();
					
					clearInterval(throwInterval);
					
					touchPosition = getTouchPosition(event.touches[0]);
					delta = new Point();
					
					// TODO: Debug
					$('#momentum').removeClass('active');
				}
			};
			
			var touchend = function(e) {
				$('#touches').val('t: ' + event.touches.length + ', c: ' + event.changedTouches.length + ', ta: ' + event.targetTouches.length);
				
				if(Math.abs(delta.left) > 0 || Math.abs(delta.top) > 0) {
					var momentum = delta.clone();
					
					clearInterval(throwInterval);
					
					throwInterval = setInterval(function() {
						momentum = new Point(momentum.left * settings.friction, momentum.top * settings.friction);
						
						$('#momentum').val(momentum);
						
						if(Math.abs(momentum.left) + Math.abs(momentum.top) < 0.5) {
							clearInterval(throwInterval);

							// TODO: Debug
							$('#momentum').removeClass('active');
						}
						
						contentPosition = contentPosition.subtract(momentum);
						
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
					
					delta = newTouchPosition.subtract(touchPosition);
					contentPosition = contentPosition.subtract(delta);
					touchPosition = newTouchPosition;
					
					updateContentPosition();
				} else {
					delta = new Point();
				}
				
				// TODO: Debug
				$('#delta').val(delta);
			};
			
			$(this).bind('touchstart.touchScroll', touchstart);
			$(this).bind('touchend.touchScroll', touchend);
			$(this).bind('touchmove.touchScroll', touchmove);
		});
	};
})(jQuery);