var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');

canStacheAnimate.registerAnimations({
	customFadeOut:{
		before: function(vm, el, ev){
			console.log("customFadeOut - before", arguments);

			if($(el).is(".cancel")){
				ev.cancel(); //cancel the event

				//return false to stop the remaining animation methods from running
				return false;
			}

			ev.pause();
		},
		run:function(vm, el, ev){
			console.log("customFadeOut - run", arguments);
			return $(el).fadeOut().promise()
		},
		after: function(vm, el, ev){
			ev.resume();
			console.log("customFadeOut - after", arguments);
		}
	}
});

module.exports = canStacheAnimate;
