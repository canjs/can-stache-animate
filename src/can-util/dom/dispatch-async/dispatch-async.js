'use strict';
var domEvents = require("can-util/dom/events/events");
var deepAssign = require("can-util/js/deep-assign/deep-assign");

/**
 * @module {function} can-stache-animate/can-util/dom/dispatch-async/dispatch-async dispatch-async
 * @parent can-stache-animate/can-util/dom
 * @signature `dispatchAsync.call(el, event, args, bubbles).then(defaultFunc)`
 *
 * Dispatch an asynchronous event on an element.
 * The event will have `.pause`, `.resume`, and `.cancel` methods
 *
 * @param {Object|String} event An object specifies options applied to this event.
 * @param {Array} [args] Arguments passed into this event.
 * @param {Boolean} [bubbles=true] Specifies whether this event should bubble (by default it will).
 *
 * @returns {Promise} The promise will resolve when the event's default functionality should run
 *
 */
module.exports = function(){
	var args = Array.prototype.slice.call(arguments),
		self = this;

	return new Promise(function(resolve){
		var runDefault = function(ev){
				ev.defaultRan = true;
				resolve();
			},
			ev = typeof(ev) === 'string' ? { type: args[0] } : args[0];

		//add async properties to the event
		ev = deepAssign(ev, {
			target: self,
			pauseCount: 0,
			defaultPrevented: false,
			defaultRan: false,
			pause: function(){
				ev.pauseCount++;
			},
			resume: function(){
				ev.pauseCount--;
				if(ev.pauseCount === 0 && !ev.defaultRan && !ev.defaultPrevented) {
					runDefault(ev);
				}
			},
			
			//TODO: can I use `preventDefault` instead of cancel?
			//Might require a change to can-util/dom/events/events.dispatch 
			//    - the `for(var prop in event)` loop
			cancel: function(){
				ev.defaultPrevented = true;
			}
		});

		//dispatch this event
		args[0] = ev;
		domEvents.dispatch.apply(self,args);

		//run default if not paused and not prevented
		if(ev.pauseCount === 0 && !ev.defaultPrevented) {
			runDefault(ev);
		}
	});
};
