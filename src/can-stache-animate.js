import stache from 'can-stache';
import defaultAnimations from './animations';
import $ from 'jquery';
import isPlainObject from 'can-util/js/is-plain-object/';
import isPromiseLike from 'can-util/js/is-promise-like/';

//TODO: should this be part of can-stache-animate,
// or should we require that it is imported when needed?
import "can-util/dom/events/inserted/inserted"; 

var noop = () => {}; 
var canStacheAnimate = {};

canStacheAnimate.duration;
canStacheAnimate.animationsMaps = [];
canStacheAnimate.animations = {};

canStacheAnimate.registerAnimations = function(animationsMap){
	canStacheAnimate.animationsMaps.push(animationsMap);

	for(var key in animationsMap){
		if(animationsMap.hasOwnProperty(key)){
			canStacheAnimate.registerAnimation(key, animationsMap[key]);
		}
	}
};

/*
 * @prop key
 * the identifier for the animation
 *
 * @prop value
 * The animation - can be one of the following:
 *
 * a string - used to alias a mixed-in animation
 * 
 * a function - will be used as the animation's `run` method
 *
 * a promise - will be used as the animation's `run` promise
 *
 * an object - the object should have the following properties:
 *   before - Called prior to the `run` method
 *   run    - This method is required if an object is provided.   
 *   after  - Called after the `run` method
 *
 */
canStacheAnimate.registerAnimation = function(key, value){
	let animation = value;

	//animation is a string -> look up in existing animations
	if(typeof(animation) === 'string'){
		animation = canStacheAnimate.getAnimationFromString(animation);
	}

	//animation is a function or promiseLike
	//				- expand to before, run, after
	if(typeof(animation) === 'function' || isPromiseLike(animation)){
		animation = {
			before: null,
			run: animation,
			after: null
		};
	}

	//animation is object
	//				- assume before, run, after
	let animationIsObject = isPlainObject(animation),
			animationHasRunProperty = !!animation.run;

	if(animationIsObject && animationHasRunProperty){
		canStacheAnimate.animations[key] = canStacheAnimate.createHelperFromAnimation(animation);
	}else{

		//TODO: should we error instead of warn?
		if(!animationIsObject){
			console.warn("Invalid animation type for '" + key + "'. Animation should be a string, a function, or an object.");
		}else if(!animationHasRunProperty){
			console.warn("Invalid `animation.run` value for '" + key + "'. `animation.run` is required.");
		}
	}

}


/*
 * @prop animation
 * string value that represents an animation
 *
 * @prop animationsMap (optional)
 * If provided, it is used for additional lookups when `value` is a string
 */
canStacheAnimate.getAnimationFromString = function(animation){
	while(typeof(animation) === "string"){

		//if we find a registered animation, use that
		let finalAnimation = canStacheAnimate.animations[animation];
		if(finalAnimation){
			animation = finalAnimation;
			break;
		}

		//check the animationsMap for another value
		animation = canStacheAnimate.lookupAnimationInAnimationsMaps(animation);
	}
	return animation;
};


/*
 * @description
 * Look through all animation maps to see if the animation was given but not yet registered
 * 
 * @prop animation - should be a string
 */
canStacheAnimate.lookupAnimationInAnimationsMaps = function(animation){
	var returnVal;
	for(var i = 0; i < canStacheAnimate.animationsMaps.length; i++){
		let thisAnimation = canStacheAnimate.animationsMaps[i][animation];
		if(thisAnimation){
			returnVal = thisAnimation;
			break;
		}
	}
	return returnVal;

};

/*
 * @prop animation - {before, run, after}
 *   The values for each of the `before`, `run`, and `after` properties can be a string, object, a promise, or a function
 *     - string (starts with '.') - assumed to be a class, and that class will be applied
 *     - string (doesn't start with '.') - assumed to be the alias of a mixed-in animation
 *     - object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
 *       					and will be animated via jQuery.animate for `run`
 *     - function - will be executed in the proper sequence
 *		 - promise - will be executed in the proper sequence
 *
 */
canStacheAnimate.createHelperFromAnimation = function(animation){

	let before = canStacheAnimate.expandAnimationProp(animation.before),
			run = canStacheAnimate.expandAnimationProp(animation.run, true),
			after = canStacheAnimate.expandAnimationProp(animation.after);

	//by this time, `run` should be a function or a promise, 
	//  and `before` and `after` should each be either a function, a promise, or null
	return function(vm,el,ev){
	  let $el = $(el),
	  		makePromise = (method, required, invalidTypeWarning) => {
	  			//check required
	  			if(!method && !required){
	  				return Promise.resolve(true);
	  			}

	  			//handle promise
	  			if(isPromiseLike(method)){
	  				return method;
	  			}

			    if(typeof(method) !== 'function'){
			    	console.warn(invalidTypeWarning);
	  				return Promise.resolve(true);
			    }else{
			    	let res = method(vm,el,ev);
			    	if(res === false){
			    		return Promise.reject(res);
			    	}

			    	//animations aren't required to return anything
			    	if(typeof(res) === 'undefined'){
			    		return Promise.resolve(true)
			    	}

	  				return res;
			    }
	  		},
	  		invalidTypeWarnings = function(){
	  			let warnings = {};
	  			["before", "run", "after"].forEach(type => {
	  				warnings[type] = "Invalid animation property type (`" + type + "`). Animation property should be a string, a function, or an object.";
	  			});
	  			return warnings;
	  		}(),
			  beforeError = () => {
		    	//TODO: allow developers to provide a stop method so that they can use their own logic
		    	$el.stop();
		    	return false;
			  },
			  runError = () => {
		    	//TODO: allow developers to provide a stop method so that they can use their own logic
		    	$el.stop();
		    	return false;
			  },
			  afterError = () => {
		    	//TODO: allow developers to provide a stop method so that they can use their own logic
		    	$el.stop();
		    	return false;
			  };

	  return makePromise(before, false, invalidTypeWarnings.before).then(function(){
	  	let result = arguments[0];
	    //allow canceling of further animations (`run`, and `after`)
	    if(result === false){
	      return beforeError();
	    }

	    return makePromise(run, true, invalidTypeWarnings.run).then(function(){
		  	let result = arguments[0];

				//allow canceling of further animations (`after`)
	      if(result === false){
		      return runError();
	      }

	      return makePromise(after, false, invalidTypeWarnings.after).then(function(){
			  	let result = arguments[0];
					//allow canceling of further animations (`after`)
		      if(result === false){
			      return afterError();
		      }
			  }, error => {
			  	return afterError();
			  });
		  }, error => {
		  	return runError();
		  });
	  }, error => {
	  	return beforeError();
	  });
	};
};

/*
 * takes el and all the jquery animate params and 
 * returns a promise
 *
 */
canStacheAnimate.makeAnimationPromiseJQuery = function(el, prop, speed, easing, callback){
		var args = [...arguments],
				$el = $(args.shift());

		return $el.animate.apply($el, args).promise();
}

/*
 * converts an animation property into a function
 * @prop animationProp
 * one of `before`, `run`, `after`
 * can be a string, object, or function
 *     - string (starts with '.') - assumed to be a class, and that class will be applied
 *     - string (doesn't start with '.') - assumed to be the alias of a registered animation
 *     - object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
 *       					and will be animated via jQuery.animate for `run`
 *     - function - will be executed in the proper secquence
 *
 * @returns function
 * 
 */
canStacheAnimate.expandAnimationProp = function(animationProp, animateWhenObject = false){

	if(!animationProp){
		return null;
	}

	//if starts with '.' - assumed to be a class, and that class will be applied
	if(typeof(animationProp) === 'string'){
		if(animationProp.substr(0,1) === '.'){
			return (vm,el,ev) => {
				$(el).addClass(animationProp.substr(1));
			}
		}

		//doesn't start with '.' - assumed to be the alias of a registered animation
		return canStacheAnimate.getAnimationFromString(animationProp);
	}

	//object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
	if(isPlainObject(animationProp)){
		if(animateWhenObject){
			return (vm,el,ev) => {
				return canStacheAnimate.makeAnimationPromiseJQuery(el, animationProp);
			}
		}else{
			return (vm,el,ev) => {
				$(el).css(animationProp);
			}
		}
	}

	//function - will be executed in the proper secquence
	if(typeof(animationProp) === 'function'){
		return (vm,el,ev) => {
			return animationProp(vm,el,ev);
		}
	}

	console.warn("Invalid animation property type. Animation property should be a string, a function, or an object.");
};

canStacheAnimate.setDuration = function(duration){
	canStacheAnimate.duration = duration;
	$.fx.speeds._default = duration;
}

canStacheAnimate.setDuration(400);
canStacheAnimate.registerAnimations(defaultAnimations);

export default canStacheAnimate;
