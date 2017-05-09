import stache from 'can-stache';
import defaultAnimations from './animations';
import $ from 'jquery';
import './overrides/jquery-animate';
import isPlainObject from 'can-util/js/is-plain-object/';
import Zone from "can-zone";

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

	//animation is a function
	//				- expand to before, run, after
	if(typeof(animation) === 'function'){
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
 *   The values for each of the `before`, `run`, and `after` properties can be a string, object, or function
 *     - string (starts with '.') - assumed to be a class, and that class will be applied
 *     - string (doesn't start with '.') - assumed to be the alias of a mixed-in animation
 *     - object - assumed to be a css object and will be applied directly (no animation) for both `before` and `after`
 *       					and will be animated via jQuery.animate for `run`
 *     - function - will be executed in the proper secquence
 *
 */
canStacheAnimate.createHelperFromAnimation = function(animation){

	let before = canStacheAnimate.expandAnimationProp(animation.before),
			run = canStacheAnimate.expandAnimationProp(animation.run, true),
			after = canStacheAnimate.expandAnimationProp(animation.after);


	//by this time, `run` should be a function, 
	//  and `before` and `after` should each be either a function or null
	return function(vm,el,ev){

		let buildMethod = (method) => {
			return method(vm,el,ev);
		}

	  let beforeZone = () => {
	  			//before is not required
	  			if(!before){
	  				return true;
	  			}

			    if(typeof(before) !== 'function'){
			    	console.warn("Invalid animation property type (`before`). Animation property should be a string, a function, or an object.");
			    	return true;
			    }else{
			    	return buildMethod(before);
			    }
			  },
			  runZone = () => {
		      if(typeof(run) !== 'function'){
						console.warn("Invalid animation property type (`run`). Animation property should be a string, a function, or an object.");
						return true;
		      }else{
		      	return buildMethod(run);
		      }
			  },
			  afterZone = () => {
	  			//after is not required
	  			if(!after){
	  				return true;
	  			}

		      if(typeof(after) !== 'function'){
						console.warn("Invalid animation property type (`after`). Animation property should be a string, a function, or an object.");
						return true;
		      }else{
		      	return buildMethod(after);
		      }
			  };

	  return new Zone().run(beforeZone).then(({result}) => {
	    //allow canceling of further animations (`run`, and `after`)
	    if(result === false){
	    	//TODO: should we call stop on the element (`$(el).stop()`)?
	      return false;
	    }

	    return new Zone().run(runZone).then(({result}) => {
				//allow canceling of further animations (`after`)
	      if(result === false){
	        return false;
	      }

	      return new Zone().run(afterZone);
	      
	    });
	  });



	};
};


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
				$(el).animate(animationProp);
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
