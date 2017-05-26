/*can-stache-animate@0.0.0#can-util/dom/mutate/mutate*/
var domMutate = require('can-util/dom/mutate/mutate');
var domDispatchAsync = require('../dispatch-async/dispatch-async.js');
var oldRemoveChild = domMutate.removeChild;
domMutate.removeChild = function (child) {
    var self = this;
    domDispatchAsync.call(child, { type: 'beforeremove' }, [], false).then(function () {
        oldRemoveChild.call(self, child);
    });
};