import $ from 'jquery';

export default {

	//animations can be a string alias to another animation
	shake: "shakeItUp",

	//animations can be a simple function
	shakeItUp: function(vm, el, ev){
		let $el = $(el);
		$el.animate({
			"margin-left":"-20px"
		},() => {
			$el.animate({
				"margin-left":"20px"
			}, () => {
				$el.animate({
					"margin-left":"0px"
				}, () => {
					$el.css({
						"margin-left":""
					})
				})
			})
		})
	},

	//object with css for `before` and `after`
	//and alias (string) as `run`
	// sets background to blue, runs the shake animation, then resets background
	shakeItUpBlue: {
		//before can be an object which will be treated as a css object
		before:{
			"background-color": "blue"
		},

		//run can be an alias to an existing registered animation
		run: "shake",

		//after can be an object which will be treated as a css object
		after:{
			"background-color": ""
		}
	},

	//animation can be a fully defined object with before, run, and after
	//all being functions
	nod:{
		before: function(vm, el, ev){
			let $el = $(el);
			$el.animate({
				"margin-top":"-20px"
			});
		},
		run: function(vm,el,ev, animationOptions){
			let $el = $(el);
			$el.animate({
				"margin-top":"20px"
			});
		},
		after: function(vm,el,ev, animationOptions){
			let $el = $(el);
			$el.animate({
				"margin-top":"0px"
			});
		}
	},

	//before, run, and after can all be aliases to other registered animations
	shakeBlueThenNodThenShake:{
		before: "shakeItUpBlue",
		run: "nod",
		after: "shake"
	}
};
