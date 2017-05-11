import $ from 'jquery';
import canStacheAnimate from 'can-stache-animate';

canStacheAnimate.registerAnimations({
	customFadeIn:{
		before:function(vm, el, ev){
			console.log("customFadeIn - before", arguments);
			$(el).css({
				"display": "none",
				"opacity": 0
			})
		},
		run:function(vm, el, ev){
			console.log("customFadeIn - run", arguments);
			$(el).show().animate({
				"opaicty": 1
			})
		},
		after: function(vm, el, ev){
			console.log("customFadeIn - after", arguments);
		}
	}
});

export default canStacheAnimate;
