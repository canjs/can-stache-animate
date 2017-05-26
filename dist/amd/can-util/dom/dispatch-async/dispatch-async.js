/*can-stache-animate@0.0.0#can-util/dom/dispatch-async/dispatch-async*/
define(function (require, exports, module) {
    'use strict';
    var domEvents = require('can-util/dom/events');
    var deepAssign = require('can-util/js/deep-assign');
    module.exports = function () {
        var args = Array.prototype.slice.call(arguments), self = this;
        return new Promise(function (resolve) {
            var runDefault = function (ev) {
                    ev.defaultRan = true;
                    resolve();
                }, ev = typeof ev === 'string' ? { type: args[0] } : args[0];
            ev = deepAssign(ev, {
                target: self,
                pauseCount: 0,
                defaultPrevented: false,
                defaultRan: false,
                pause: function () {
                    ev.pauseCount++;
                },
                resume: function () {
                    ev.pauseCount--;
                    if (ev.pauseCount === 0 && !ev.defaultRan && !ev.defaultPrevented) {
                        runDefault(ev);
                    }
                },
                cancel: function () {
                    ev.defaultPrevented = true;
                }
            });
            args[0] = ev;
            domEvents.dispatch.apply(self, args);
            if (ev.pauseCount === 0 && !ev.defaultPrevented) {
                runDefault(ev);
            }
        });
    };
});