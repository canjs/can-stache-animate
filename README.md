# can-stache-animate

[![Build Status](https://travis-ci.org/canjs/can-stache-animate.png?branch=master)](https://travis-ci.org/canjs/can-stache-animate)

Animations for can-stache

## Basic Usage

In your stache template, use `can-import` to pull `can-stache-animate` into the template.
Then bind to a property or event, and provide the desired animation.
```
<can-import from="can-stache-animate" {^value}="*animationsModule" />
<div (. shake)="*animationsModule.default.animations.shake"></div>
```
_**Note:** The `*` syntax is necessary to use the `can-import` tag to pull a value into the scope._

_**Note:** The `animationsModule` is the module itself, so we need to use `animationsModule.default` to get the `canStacheAnimate` objet._

## Use your own animations

To create your own custom animations, create a file (we'll call it `custom-animations.js`),
and import `can-stache-animate`.  Use the `registerAnimation` and `registerAnimations` methods to register your animations.

```js
import $ from 'jquery';
import canStacheAnimate from 'can-stache-animate';

//sets the global duration
canStacheAnimate.setDuration(600);

//register single animation
canStacheAnimate.registerAnimation("myCustomAnimation",function(vm, el, ev){
	$.animate({
		/* ... */	
	});
});

/* OR */

//register multiple animations
canStacheAnimate.registerAnimations({
	myCustomAnimation:function(vm, el, ev){
		$.animate({
			/* ... */	
		});
	},
	/* ...other animations... */
});

export default canStacheAnimate;

```

Then import your custom file instead of `can-stache-animate`.
```
<can-import from="my-project/custom-animations" {^value}="*animationsModule" />
<div (. shake)="*animationsModule.default.animations.myCustomAnimation"></div>
```


## Anatomy of an animation

Animations can be a `string`, a `function`, or an `object`.  Let's take a look at how the different types work.

### Object
If an animation is an object, it is expected to have the properties:

#### Object.run - function - required
The `run` method is the core animation method and is required.

#### Object.before - function - optional
The `before` method is called prior to the `run` method and is optional.  It is typically used to 'set the stage' for the animation – setting the `position` or `z-index` css properties of a parent element, for example.

#### Object.after - function - optional
The `after` method is called when the `run` method has completed and is optional.  It is typically revert any changes that were made during `before` or `run` so that the element can be back to its "ground state"

#### Each of these methods receives the following parameters:

##### `context` - the context where the animation is being used

##### `element` - the element on which the animation is being used

##### `event` - the event that triggered the animation

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
	 $el.animate({
	 	"left":"-100px"
	 }, function(){
	 	$el.animate({
	 		"left":"100px"
	 	}, function(){
	 		$el.animate({
	 			"left": "0px"
	 		})
	 	})
	 })
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

_**Note:** When adding animations to the `before`, `run`, `after` methods, there is no need to us an `onComplete` (or similar) callback function.  This is because these methods are wrapped in `can-zone`._


### Function
If an animation is a function, it is the same as providing that function as an object's `run` property and providing `null` to the `before` and `after` properties.

Example:
```js
canStacheAnimate.registerAnimation("myCustomAnimation",function(vm, el, ev){
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

## Animation events
Sometimes it is useful to know when an animation has started or finished a particular phase.  We can accomplish this easily with events.

Example:
Register an custom animation, and dispatch events on the scope:
```js
canStacheAnimate.registerAnimation("myCustomAnimation", {
	before: function(vm, el, ev){
		vm.dispatch("mycustomanimationbefore")
		$(el).hide().css({
			"opacity": 0
		})
	},
	run: function(vm, el, ev){
		vm.dispatch("mycustomanimationrunning")
		$(el).show().animate({
			"opacity": 0
		})
	},
	after: function(vm, el, ev){
		vm.dispatch("mycustomanimationcomplete")
	}
});
```

Listen for those events via stache:
```
<div
 (. animate)="*animationsModule.default.animations.myCustomAnimation"
 (. mycustomanimationbefore)="handleAnimationBefore"
 (. mycustomanimationrunning)="handleAnimationRunning"
 (. mycustomanimationcomplete)="handleAnimationComplete"
  />
```

Then simply listen from within the scope or viewmodel:
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

_**Note:** `dispatch()` takes a second parameter (see [canEvent.dispatch](https://canjs.com/doc/can-event.dispatch.html)), which is an array of arguments that will be provided as additional parameters in the event hanlder (eg: `vm.dispatch("customevent", [{a: "foo"}, {b: "bar"}])` and `handleCustomEvent(vm, el, ev, a, b){ /* a === {a: "foo"} && b === {b: "bar"} */`) _
