var $ = require('jquery');
var isPlainObject = require('can-util/js/is-plain-object/');
var canStacheAnimate = require('can-stache-animate');
var defaultJqueryAnimations = require('./default-animations-jquery');

/*
 * adds some jquery functionality to animation properties
 * @prop animation
 * The full animation object
 *
 * Adds functionality so that each of the animation properties can an object:
 *     - object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
 *                and will be animated via jQuery.animate for `run`
 * 
 * @prop prop
 * the property on the animation
 *
 * @returns function
 * 
 */
var oldExpandAnimationProp = canStacheAnimate.expandAnimationProp;
canStacheAnimate.expandAnimationProp = function(animation, prop){
	var animationProp = oldExpandAnimationProp.apply(this, arguments);

	if(!animationProp){
		return animationProp;
	}

	//object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
	if(isPlainObject(animationProp)){
		if(prop === 'run'){
			return function(el, ev, options){
				return $(el).animate(animationProp, options.duration).promise();
			};
		}else{
			return function(el){ 
				$(el).css(animationProp);
			};
		}
	}

	return animationProp;
};

//set up default jquery duration
var oldSetDuration = canStacheAnimate.setDuration;
canStacheAnimate.setDuration = function(duration){
	oldSetDuration.apply(this, arguments);
	$.fx.speeds._default = duration;
};
//set up default duration
canStacheAnimate.setDuration(canStacheAnimate.duration);
canStacheAnimate.registerAnimations(defaultJqueryAnimations);



module.exports = canStacheAnimate;
