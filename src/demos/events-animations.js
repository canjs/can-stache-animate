var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');

canStacheAnimate.registerAnimations({
	customFadeIn:{
		before:function(vm, el, ev){
			vm.dispatch("customfadeinbefore", [{test: "foo"}]);
			$(el).css({
				"display": "none",
				"opacity": 0
			});
		},
		run:function(vm, el, ev){
			vm.dispatch("customfadeinrunning", [{test: "foo"}]);
			return $(el).show().animate({
				"opacity": 1
			}).promise();
		},
		after: function(vm, el, ev){
			$(el).css({
				"display": "",
				"opacity": ""
			});
			vm.dispatch("customfadeincomplete", [{test: "foo"}]);
		}
	}
});

module.exports = canStacheAnimate;
