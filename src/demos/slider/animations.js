var $ = require('jquery');

var canStacheAnimate = require('can-stache-animate/can-stache-animate-greensock');
canStacheAnimate = require('can-stache-animate/can-stache-animate-jquery');

canStacheAnimate.registerAnimations({
	customFadeOut:{
		before: function(el, ev){
			ev.pause();
		},
		run:function(el){
			return $(el).fadeOut().promise();
		},
		after: function(el, ev){
			ev.resume();
		}
	},
	customSlideUp:{
		before: function(el, ev){
			ev.pause();
		},
		run:function(el){
			return $(el).slideUp().promise();
		},
		after: function(el, ev){
			ev.resume();
		}
	},
	maximize:{
		before: function(el,ev){
			if(!ev.target.maximized) return false;

			let $slides = $(el).closest(".slides"),
				startProps = {
					'top':$slides.offset().top,
					'left':$slides.offset().left,
					'width':$slides.width(),
					'height': $slides.height()
				};

			$slides
				.data("animateStartProps", startProps)
				.data("animateStartPosition", $slides.attr("position"))
				.css($.extend({},startProps,{
					'position':'absolute'
				}));
		},
		run: function(el,ev){
			let $slides = $(el).closest(".slides"),
				animateProps = {
					'top':0,
					'left':0,
					'width':"100%",
					'height':"100%"
				};
			return $slides.animate(animateProps).promise()
		}
	},
	minimize:{
		run: function(el,ev){
			if(ev.target.maximized) return false;

			let $slides = $(el),
					animateProps = $slides.data("animateStartProps");

			//remove data from element
			$slides.data("animateStartProps", null);
			return $slides.animate(animateProps).promise();
		},
		after: function(el,ev){
			let $slides = $(el),
					position = $slides.data("animateStartPosition");


			//remove data from element
			$slides.data("animateStartPosition", null);

			// set position
			$slides.css({
				'position':position
			});
		}
	}
});

module.exports = canStacheAnimate;
