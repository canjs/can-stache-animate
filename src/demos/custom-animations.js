var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');

canStacheAnimate.setDuration(600);
canStacheAnimate.registerAnimations({
	//animations can be a string alias to another animation
	shakeItUp: "shake",

	//object with css for `before` and `after`
	//and alias (string) as `run`
	// sets background to blue, runs the shake animation, then resets background
	shakeItUpBlue: {
		//before can be an object which will be treated as a css object
		before:{
			"background-color": "blue"
		},

		//run can be an alias to an existing registered animation
		run: "shakeItUp",

		//after can be an object which will be treated as a css object
		after:{
			"background-color": ""
		}
	},

	//animation can be a fully defined object with before, run, and after
	//all being functions
	nod:{
		before: function(vm, el, ev){
			return $(el).animate({
				"margin-top":"-20px"
			}).promise();
		},
		run: function(vm,el,ev){
			return $(el).animate({
				"margin-top":"20px"
			}).promise();
		},
		after: function(vm,el,ev){
			return $(el).animate({
				"margin-top":"0px"
			}).promise();
		}
	},

	//before, run, and after can all be aliases to other registered animations
	nodShakeNod:{
		before: "nod",
		run: "shake",
		after: "nod"
	},

	//I want to be able to specify duration for this specific animation
	//so that I can use another animation and modify it
	nodFast:{
		duration: 100, //TODO: this doesn't work
		run: "nod"
	}
});

module.exports = canStacheAnimate;
