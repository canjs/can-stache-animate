var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');
var domDispatch = require('can-util/dom/dispatch/dispatch');

canStacheAnimate.registerAnimations({
	customFadeIn:{
		before:function(el){
			domDispatch.apply(el, ["customfadeinbefore", [{test: "foo"}], false]);
			$(el).css({
				"display": "none",
				"opacity": 0
			});
		},
		run:function(el){
			domDispatch.apply(el, ["customfadeinrunning", [{test: "foo"}], false]);
			return $(el).show().animate({
				"opacity": 1
			}).promise();
		},
		after: function(el){
			$(el).css({
				"display": "",
				"opacity": ""
			});
			domDispatch.apply(el, ["customfadeincomplete", [{test: "foo"}], false]);
		}
	}
});

module.exports = canStacheAnimate;
