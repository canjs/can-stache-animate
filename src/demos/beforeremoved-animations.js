var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');

canStacheAnimate.registerAnimations({
	customFadeOut:{
		before: function(el, ev){
			console.log("customFadeOut - before", arguments);

			if($(el).is(".cancel")){
				ev.cancel(); //cancel the event

				//return false to stop the remaining animation methods from running
				return false;
			}

			ev.pause();
		},
		run:function(el){
			console.log("customFadeOut - run", arguments);
			return $(el).fadeOut().promise();
		},
		after: function(el, ev){
			ev.resume();
			console.log("customFadeOut - after", arguments);
		}
	},
	customFadeOut2:{
		before: function(el, ev){
			console.log("customFadeOut2 - before", arguments);

			ev.pause();
			setTimeout(function(){
				ev.resume();
			}, 1000);
		},
		run:function(el){
			console.log("customFadeOut2 - run", arguments);
			return $(el).fadeOut().promise();
		},
	},
	customFadeOut3:{
		before: function(el, ev){
			console.log("customFadeOut3 - before", arguments);

			ev.pause();
			setTimeout(function(){
				ev.resume();
			}, 1500);
		},
		run:function(el){
			console.log("customFadeOut3 - run", arguments);
			return $(el).fadeOut().promise();
		},
	}

});

module.exports = canStacheAnimate;
