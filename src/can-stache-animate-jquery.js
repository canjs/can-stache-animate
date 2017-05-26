var $ = require('jquery');
var isPlainObject = require('can-util/js/is-plain-object/');
var canStacheAnimate = require('can-stache-animate');

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

	var animationProp = animation[prop];

	if(!animationProp){
		return null;
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

	return oldExpandAnimationProp.apply(this, arguments);
};

//set up default jquery duration
var oldSetDuration = canStacheAnimate.setDuration;
canStacheAnimate.setDuration = function(duration){
	oldSetDuration.apply(this, arguments);
	$.fx.speeds._default = duration;
};
//set up default duration
canStacheAnimate.setDuration(canStacheAnimate.duration);


//jquery defaults
var defaultJqueryAnimations = {};
[
	'slideDown', 
	'slideUp', 
	'slideToggle', 
	'fadeIn', 
	'fadeOut', 
	'fadeToggle'
].forEach(function(anim){
	defaultJqueryAnimations[anim] = function(el, ev, options) { 
		$(el)[anim](options.duration); 
	};
});
canStacheAnimate.registerAnimations(defaultJqueryAnimations);



module.exports = canStacheAnimate;
