import $ from 'jquery';
import canStacheAnimate from 'can-stache-animate';

canStacheAnimate.setDuration(600);
canStacheAnimate.registerAnimations({
	nodShakeBlueNod:{
		before: "nod",
		run: "shakeItUpBlue",
		after: "nod"
	},

	//I want to be able to specify duration for this specific animation
	//so that I can use another animation and modify it
	nodShakeBlueNodFast:{
		duration: 100, //TODO: this doesn't work
		run: "nodShakeBlueNod"
	}
});

export default canStacheAnimate;
