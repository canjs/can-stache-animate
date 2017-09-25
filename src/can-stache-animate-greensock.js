var TweenMax = require('gsap');
var isPlainObject = require('can-util/js/is-plain-object/');
var canStacheAnimate = require('can-stache-animate');
var defaultGreensockAnimations = require('can-stache-animate/default-animations-greensock');

/*
 * adds some TweenMax functionality to animation properties
 * @prop animation
 * The full animation object
 *
 * Adds functionality so that each of the animation properties can an object:
 *     - object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
 *                and will be animated via TweenMax for `run`
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

		return function(el, ev, options){
				let duration = options.duration;
				if(prop === 'before' || prop === 'after'){
					duration = 0;
				}
				if(prop === 'before'){
					ev && ev.pause && ev.pause();
				}

				return canStacheAnimate.tweenMaxToPromise(el, duration, animationProp).then(() => {
					if(prop === 'after'){
						ev && ev.resume && ev.resume();
					}
				});
		};
	}

	return animationProp;
};

canStacheAnimate._tweenMaxPromise = function(el, duration, animationProp, stagger=false, staggerInterval=100){
	return new Promise((resolve)=>{
		duration = canStacheAnimate.getTweenMaxDuration(duration);

		let old_onComplete = animationProp.onComplete,
				tweenmax_method = (stagger) ? 'staggerTo' : 'to';

		animationProp.onComplete = function(){
			resolve();
			if(typeof(old_onComplete) === 'function'){
				old_onComplete.apply(this, arguments)
			}
		};


		TweenMax[tweenmax_method](el, duration, animationProp);
	})
};
canStacheAnimate.tweenMaxToPromise = function(el, duration, animationProp){
	return canStacheAnimate._tweenMaxPromise(el, duration, animationProp);
};
canStacheAnimate.tweenMaxStaggerToPromise = function(el, duration, animationProp, staggerInterval){
	return canStacheAnimate._tweenMaxPromise(el, duration, animationProp, true, staggerInterval);
};

canStacheAnimate.getTweenMaxDuration = function(durationInMs){
	if(typeof(durationInMs) === 'undefined'){
		durationInMs = canStacheAnimate.duration;
	}
	return durationInMs / 1000;
}


canStacheAnimate.registerAnimations(defaultGreensockAnimations);



module.exports = canStacheAnimate;
