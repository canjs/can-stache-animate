# can-stache-animate

[![Build Status](https://travis-ci.org/canjs/can-stache-animate.png?branch=master)](https://travis-ci.org/canjs/can-stache-animate)

Animations for can-stache

## Basic Usage

In your stache template, use `can-import` to pull `can-stache-animate` into the template.
Then bind to a property or event, and provide the desired animation.
```
<can-import from="can-stache-animate" {^value.animations}="*animations" />
<div (. shake)="*animations.shake"></div>
```
_**Note:** The `*` syntax is necessary to use the `can-import` tag to pull a value into the scope._

_**Note:** Use `{^value.animations}` to get the animations object, and set that to a variable (`*animations`) in the scope._


## Use your own animations

To create your own custom animations, create a file (we'll call it `custom-animations.js`),
and import `can-stache-animate`.  Use the `registerAnimation` and `registerAnimations` methods to register your animations.

```js
import $ from 'jquery';
import canStacheAnimate from 'can-stache-animate';

//sets the global duration
canStacheAnimate.setDuration(600);

//register single animation
canStacheAnimate.registerAnimation("myCustomAnimation",function(el, ev, options){
	$(el).animate({
		/* ... */	
	});
});

/* OR */

//register multiple animations
canStacheAnimate.registerAnimations({
	myCustomAnimation:function(el, ev, options){
		$(el).animate({
			/* ... */	
		});
	},
	/* ...other animations... */
});

export default canStacheAnimate;

```

Then import your custom file instead of `can-stache-animate`.
```
<can-import from="my-project/custom-animations" {^value.animations}="*animations" />
<div (. shake)="*animations.myCustomAnimation"></div>
```


## Anatomy of an animation

Animations can be a `string`, a `function`, or an `object`.  Let's take a look at how the different types work.

### `Object`
If an animation is an object, it is expected to have the properties:

#### `Object.run` - function - required
The `run` method is the core animation method and is required.

#### `Object.before` - function - optional
The `before` method is called prior to the `run` method.  It is typically used to 'set the stage' for the animation – setting the `position` or `z-index` css properties of a parent element, for example.

#### `Object.after` - function - optional
The `after` method is called when the `run` method has completed.  It is typically used to clean up any css properties or state from the element that were only needed for the animation itself and are no longer needed - resetting the `position` or `z-index` css properties of a parent element, for example.

#### Each of these methods receives the following parameters:

##### `element` - the element on which the animation is being used

##### `event` - the event that triggered the animation

##### `options` - a set of options such as `duration`

#### If any of these methods contain asynchronous functionalty, they should return a `Promise`.

Example:
```js
canStacheAnimate.registerAnimation("myCustomShakeAnimation",{
	before: function(vm, el, ev){
		var $el = $(el);
		$el.parent().css({
			"position":"relative"
		})
		$el.css({
			"position":"absolute"
		})
	},
	run: function(vm, el, ev){
	 var $el = $(el);
	 return $el.animate({
	 	"left":"-100px"
	 }).promise().then(function(){
	 	return $el.animate({
	 		"left":"100px"
	 	}).promise().then(function(){
	 		return $el.animate({
	 			"left": "0px"
	 		}).promise();
	 	})
	 }).promise()
	},
	after: function(vm, el, ev){
		var $el = $(el);
		$el.parent().css({
			"position":""
		})
		$el.css({
			"position":""
		})
	}
});
```

_**Note:** Returning false from either the `before` or `run` methods will stop further animations from being executed._

_**Note:** When adding animations to the `before`, `run`, `after` methods, there is no need to us an `onComplete` (or similar) callback function.  Simply return a `Promise`, ans resolve it when any async functionality has completed._

_**Note:** For jQuery animations, you can simply use the [`.promise()` method](http://api.jquery.com/animate/#callbacks)._


#### `Object.stop` - function - optional
The `stop` method is called when any one of the `before`, `run`, or `after` methods returns either `false` or a `Promise` that rejects.  It is used to revert any changes that were made during the animation so that the element can be set back to its "ground state".

Example:
```js
	canStacheAnimate.registerAnimation("myCustomHopAnimation",{
		duration: 1000,
		before: function(el, ev, options){
			return new Promise(function(resolve, reject){
				$(el).animate({
					"margin-top":"-20px"
				}, options.duration).promise().then(function(){
					resolve();
				});

				//when there is a click in the window,
				//reject this promise which will cause
				//the stop method to be called
				$(window).one('click', function(){
					reject();
				});
			});
		},
		run: function(el, ev, options){
			return $(el).animate({
				"margin-top":"0px"
			}, 400).promise();
		},
		stop: function(el, ev, options){
			$(el).stop().animate({
				"margin-top": 0
			}, options.duration);
		}
	});
```

### Function
If an animation is a function, it is the same as providing that function as an object's `run` property and providing `null` to the `before` and `after` properties.

Example:
```js
canStacheAnimate.registerAnimation("myCustomAnimation",function(el, ev, options){
	$(el).animate({
		"opacity": 0.5
	})
});
```

### String
If an animation is a string, it is simply set up as an alias to an animation that has already been registered.  

Example:
```js
canStacheAnimate.registerAnimation("myCustomAnimation":"fadeIn");
```
_**Note:** "Already registered animations" include the out-of-the-box animations provided by `can-stache-animate`._

### Strings as animation steps
In addition to a registered animation value being a string identifier of another animation, `before`, `run`, and `after` animation properties can be string identifiers of other animations as well.  This is useful to chain animations together or provide modifications to things like duration for an existing animation.

```js
canStacheAnimate.registerAnimations({

	"customFadeIn": function(el, ev, options){
		return $(el).animate({
			opacity: 0.8
		}, options.duration).promise();
	},
	"customFadeOut": function(el, ev, options){
		return $(el).animate({
			opacity: 0.2
		}, options.duration).promise();
	},

	"customPulse":{
		before: "customFadeOut",
		run: "customFadeIn"
	},

	"customPulseFast":{
		duration: 100,
		run: "customPulse"
	}
});
```

## Animation events
Sometimes it is useful to know when an animation has started or finished a particular phase.  We can accomplish this easily with [can-util/dom/dispatch](https://canjs.com/doc/can-util/dom/dispatch/dispatch.html).

Example:
Register an custom animation, and dispatch events on the element:
```js
var domDispatch = require('can-util/dom/dispatch/dispatch');
canStacheAnimate.registerAnimation("myCustomAnimation", {
	before: function(el, ev, options){
	  domDispatch.apply(el, ["mycustomanimationbefore", [{test: "foo"}], false]);
		$(el).hide().css({
			"opacity": 0
		})
	},
	run: function(el, ev, options){
		domDispatch.apply(el, ["mycustomanimationrunning", [{test: "foo"}], false]);
		$(el).show().animate({
			"opacity": 0
		})
	},
	after: function(el, ev, options){
		domDispatch.apply(el, ["mycustomanimationcomplete", [{test: "foo"}], false]);
	}
});
```

Listen for those events via stache:
```
<div
 (. animate)="*animationsModule.default.animations.myCustomAnimation"
 ($mycustomanimationbefore)="handleAnimationBefore"
 ($mycustomanimationrunning)="handleAnimationRunning"
 ($mycustomanimationcomplete)="handleAnimationComplete"
  />
```

Then handle the events from within the scope or viewmodel:
```js
DefineMap.extend({
	handleAnimationBefore(vm, el, ev){
		console.log("handleAnimationBefore");
	},
	handleAnimationRunning(vm, el, ev){
		console.log("handleAnimationRunning");
	},
	handleAnimationComplete(vm, el, ev){
		console.log("handleAnimationAfter");
	}
})
```


## Special event handling

Some events require additional setup.


### `$inserted`

When importing animations with `can-import`, elements' `$inserted` events will fire before the imported animations make it into the scope.

Wait for the animations to be in the scope before rendering the elements like this:
```
<can-import from="can-stache-animate" {^value.animations}="*animations" />
{{#*animations}}
	<div style="display:none;" ($inserted)="*animations.fadeIn" />
{{/*animations}}
```
_**Note:** Set the element's style initially to `display:none;` because the `*animations.fadeIn` helper expects the element to not be displayed._


### `$beforeremoved`
It is sometimes useful to perform an animation on an element prior to its being removed from the DOM.  `can-stache-animate` provides a `$beforeremoved` event that can be used to accomplish this.  Here's how it works:

#### dispatch-async
The `$beforeremoved` event is an async event which means that it has some additional methods that can be used during the event's lifetime.  

The most important of these methods are:

##### `event.pause()`
Delay the execution of the event's default behavior until `event.resume()` is called.  In the case above, pausing the `$beforeremoved` event would delay execution of the `$remove` event.

##### `event.resume()`
Continue executing the event's default behavior

##### `event.cancel()`
Prevent the event's default behavior similar to `.preventDefault()` in standard events.

#### Writing the animation for `$beforeremoved`
Here is an example of how to use the async event to write a `beforeremoved` animation:

```js
canStacheAnimate.registerAnimation('customFadeOut', {
	before: function(el, ev, options){

		// cancel the event under specified circumstances
		if($(el).is(".cancel")){
			ev.cancel();

			// return false to stop the remaining animation methods from running 
			// (`run` and `after`)
			return false;
		}

		// the event wasn't cancelled, pause it until our animation is done
		ev.pause();
	},

	run: function(el, ev, options){
		return $(el).fadeOut().promise()
	},

	after: function(el, ev, options){
		// the animation has completed, so we can continue with the default behavior
		ev.resume();
	}
});
```

#### Use Stache for adding/removing elements

For example, conditionally render an element based on a scope property:
```
{{#if showElement}}
	<div ($beforeremoved)="*animations.customFadeOut" />
{{/if}}
```

## can-stache-animate-jquery
`can-stache-animate` provides a jQuery extension for a bit of extra functionality.  It adds the ability to provide an object for each of the `before`, `run`, and `after` methods of an animation.

### Providing an object
Provide an object to an animation property, and it will be treated as a css object.  For `before` and `after`, `$.fn.css` will be used, and for `run`, `$.fn.animate` will be used.

Example:
```js
var canStacheAnimate = require('can-stache-animate/can-stache-animate-jquery');
canStacheAnimate.registerAnimation('blueRed', {

	//background will be set to blue via $.fn.css
	before:{
		"background-color": "blue"
	},

	//blue will be animated to red
	run: {
		"background-color": "red"
	},
	after:{
		"background-color": ""
	}
})
```
