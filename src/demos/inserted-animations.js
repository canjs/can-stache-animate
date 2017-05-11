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
			return $(el).show().animate({
				"opaicty": 1
			}).promise()
		},
		after: function(vm, el, ev){
			console.log("customFadeIn - after", arguments);
		}
	}
});

export default canStacheAnimate;
