var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');
var domDispatch = require('can-util/dom/dispatch/dispatch');

canStacheAnimate.registerAnimations({
	customFadeIn:{
		before:function(el, ev, options){
			domDispatch.apply(el, ["customfadeinbefore", [{test: "foo"}], false]);
			$(el).css({
				"display": "none",
				"opacity": 0
			});
		},
		run:function(el, ev, options){
			domDispatch.apply(el, ["customfadeinrunning", [{test: "foo"}], false]);
			return $(el).show().animate({
				"opacity": 1
			}).promise();
		},
		after: function(el, ev, options){
			$(el).css({
				"display": "",
				"opacity": ""
			});
			domDispatch.apply(el, ["customfadeincomplete", [{test: "foo"}], false]);
		}
	}
});

module.exports = canStacheAnimate;
