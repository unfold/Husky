(function($) {
	$.fn.touchScroll = function(options, boundaries) {
		var settings = {
			debug: false,
			threshold: 10,
			duration: 1.5,
			friction: 0.998
		};
		
		$.extend(settings, options);
		
		var getComputedValue = function(value) {
			return typeof(value) == 'function' ? value() : value;
		};
		
		return this.each(function() {
			var $container = $(this).wrapInner($('<div />', {'class': 'touchscroll-wrapper'}));
			var $content = $container.find('.touchscroll-wrapper').css({
				'-webkit-transition-property': 'translate3d',
				'-webkit-transition-timing-function': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)' // easeOutExpo
			});
			
			var delta = new WebKitCSSMatrix();
			var touchPosition = new WebKitCSSMatrix();
			var contentPosition = new WebKitCSSMatrix();
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
			
			var setTransitionDuration = function(duration) {
				$content.css('-webkit-transition-duration', duration + 's');
			}
			
			var updateContentPosition = function() {
				// Apply constraints
				//contentPosition.e = Math.min(Math.max(getComputedValue(contentBoundaries.left), contentPosition.e), getComputedValue(contentBoundaries.width));
				//contentPosition.f = Math.min(Math.max(getComputedValue(contentBoundaries.top), contentPosition.f), getComputedValue(contentBoundaries.height));
				
				$content.cssMatrix(contentPosition);
				
				// TODO: Debug
				if (settings.debug) {
					$('#content-position').val(contentPosition.e + ', ' + contentPosition.f);
					$('#touch-position').val(touchPosition.e + ', ' + touchPosition.f);
				}
			};
			
			var touchstart = function(e) {
				if (event.touches.length == 1) {
					e.preventDefault();
					
					contentPosition = $content.cssMatrix();
					
					var touch = event.touches[0];
					touchPosition.e = touch.clientX;
					touchPosition.f = touch.clientY;
					
					delta.e = 0;
					delta.f = 0;
					
					setTransitionDuration(0);
					updateContentPosition();
					
					// TODO: Debug
					if (settings.debug) {
						$('#momentum').removeClass('active');
					}
				}
			};
			
			var touchend = function(e) {
				if (Math.abs(delta.e) > settings.threshold || Math.abs(delta.f) > settings.threshold) {
					var momentum = new WebKitCSSMatrix(delta);
					momentum.e *= settings.friction;
					momentum.f *= settings.friction;
					
					contentPosition.e -= momentum.e * 10;
					contentPosition.f -= momentum.f * 10;
					
					setTransitionDuration(settings.duration);
					updateContentPosition();

					// TODO: Debug
					if (settings.debug) {
						$('#momentum').addClass('active').val(momentum.e + ', ' + momentum.f);
					}
				} else {
					setTransitionDuration(0);
				}
			};
			
			var touchmove = function(e) {
				if (event.touches.length == 1) {
					var touch = event.touches[0];
					delta.e = touchPosition.e - touch.clientX;
					delta.f = touchPosition.f - touch.clientY;

					touchPosition.e = touch.clientX;
					touchPosition.f = touch.clientY;
					
					contentPosition.e -= delta.e;
					contentPosition.f -= delta.f;
					
					updateContentPosition();
				} else {
					delta.e = 0;
					delta.f = 0;
				}
				
				// TODO: Debug
				if (settings.debug) {
					$('#delta').val(delta.e + ', ' + delta.f);
				}
			};
			
			$(this).bind('touchstart.touchScroll', touchstart);
			$(this).bind('touchend.touchScroll', touchend);
			$(this).bind('touchmove.touchScroll', touchmove);
		});
	};
	
	$.fn.cssMatrix = function(matrix) {
		if (matrix) {
			return this.css('-webkit-transform', matrix);
		}
		
		return new WebKitCSSMatrix(this.css('-webkit-transform'));
	};
})(jQuery);