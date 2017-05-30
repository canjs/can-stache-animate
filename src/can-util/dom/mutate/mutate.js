var domMutate = require("can-util/dom/mutate/mutate");
var domDispatchAsync = require("can-stache-animate/can-util/dom/dispatch-async/dispatch-async");

var oldRemoveChild = domMutate.removeChild;
domMutate.removeChild = function(child){
	var self = this;
	domDispatchAsync.call(child,{
		type: "beforeremove"
	}, [], false, function(){
		oldRemoveChild.call(self, child);
	});
};
