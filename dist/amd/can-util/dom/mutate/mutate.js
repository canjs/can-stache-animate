/*can-stache-animate@0.0.0#can-util/dom/mutate/mutate*/
define(function (require, exports, module) {
    var domMutate = require('can-util/dom/mutate');
    var domDispatchAsync = require('../dispatch-async/dispatch-async');
    var oldRemoveChild = domMutate.removeChild;
    domMutate.removeChild = function (child) {
        var self = this;
        domDispatchAsync.call(child, { type: 'beforeremove' }, [], false).then(function () {
            oldRemoveChild.call(self, child);
        });
    };
});