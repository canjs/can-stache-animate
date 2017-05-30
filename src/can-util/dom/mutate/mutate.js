var domMutate = require("can-util/dom/mutate/mutate");
var domDispatchAsync = require("can-stache-animate/can-util/dom/dispatch-async/dispatch-async");
var CID = require("can-cid");
var makeArray = require("can-util/js/make-array/make-array");

var oldRemoveChild = domMutate.removeChild,
		dispatchedRemoveChild = {},
		defaultRemoveChildBehaviorCalled = {};

domMutate.removeChild = function(elem){
	var self = this,
			cid = CID(elem),
			numEventsDispatched = 0,

			//call the default behavior only once
			//all events dispatched have had a chance to pause or cancel the
			//default behavior
			callDefaultBehavior = function(){
				numEventsDispatched--;
				if(numEventsDispatched === 0 && !defaultRemoveChildBehaviorCalled[cid]){
					defaultRemoveChildBehaviorCalled[cid] = true;
					oldRemoveChild.call(self, elem);
				}
			};

	
	if(elem.getElementsByTagName && !dispatchedRemoveChild[cid]){
		//get a list of the children
		children = makeArray(elem.getElementsByTagName("*"));

		//the nubmer of events to dispatch is 
		//the number of children + two events (beforeremoved and beforedetached) for the root element
		numEventsDispatched = children.length + 2;

		//beforeremoved - simply call on the elem
		domDispatchAsync.call(elem,{
			type: "beforeremoved"
		}, [], false, callDefaultBehavior);
		

		//beforedetached - call on elem and elem's children
		domDispatchAsync.call(elem,{
			type: "beforedetached"
		}, [], false, callDefaultBehavior);
		dispatchedRemoveChild[cid] = true;

		for (var j = 0, child, childCid; (child = children[j]) !== undefined; j++) {
			// fire the event only if this hasn't already been fired on.
			childCid = CID(child);
			if(!dispatchedRemoveChild[childCid]) {
				domDispatchAsync.call(child,{
					type: "beforedetached"
				}, [], false, callDefaultBehavior);

				dispatchedRemoveChild[childCid] = true;
			}
		}
	}


};


//TODO:
// var oldReplaceChild = domMutate.replaceChild;
// domMutate.replaceChild = function(newChild, oldChild){
// 	var self = this;
// 	domDispatchAsync.call(oldChild,{
// 		type: "beforeremove"
// 	}, [], false, function(){
// 		oldReplaceChild.call(self, newChild, oldChild);
// 	});
// };
