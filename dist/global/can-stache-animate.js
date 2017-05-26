/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-stache-animate@0.0.0#animations*/
define('can-stache-animate/animations', function (require, exports, module) {
    var $ = require('jquery');
    var animations = {
        shake: function (el, ev, options) {
            let $el = $(el);
            return $el.animate({ 'margin-left': '-20px' }, options.duration).promise().then(function () {
                return $el.animate({ 'margin-left': '20px' }, options.duration).promise().then(function () {
                    return $el.animate({ 'margin-left': '0px' }, options.duration).promise().then(function () {
                        $el.css({ 'margin-left': '' });
                    });
                });
            });
        }
    };
    module.exports = animations;
});
/*can-stache-animate@0.0.0#can-util/dom/dispatch-async/dispatch-async*/
define('can-stache-animate/can-util/dom/dispatch-async/dispatch-async', function (require, exports, module) {
    'use strict';
    var domEvents = require('can-util/dom/events/events');
    var deepAssign = require('can-util/js/deep-assign/deep-assign');
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
/*can-stache-animate@0.0.0#can-util/dom/mutate/mutate*/
define('can-stache-animate/can-util/dom/mutate/mutate', function (require, exports, module) {
    var domMutate = require('can-util/dom/mutate/mutate');
    var domDispatchAsync = require('can-stache-animate/can-util/dom/dispatch-async/dispatch-async');
    var oldRemoveChild = domMutate.removeChild;
    domMutate.removeChild = function (child) {
        var self = this;
        domDispatchAsync.call(child, { type: 'beforeremove' }, [], false).then(function () {
            oldRemoveChild.call(self, child);
        });
    };
});
/*can-stache-animate@0.0.0#can-stache-animate*/
define('can-stache-animate', function (require, exports, module) {
    var defaultAnimations = require('can-stache-animate/animations');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    var isPromiseLike = require('can-util/js/is-promise-like/is-promise-like');
    require('can-util/dom/events/inserted/inserted');
    require('can-util/dom/events/removed/removed');
    require('can-stache-animate/can-util/dom/mutate/mutate');
    var canStacheAnimate = {};
    canStacheAnimate.duration = 400;
    canStacheAnimate.animationsMaps = [];
    canStacheAnimate.animations = {};
    canStacheAnimate.registerAnimations = function (animationsMap) {
        this.animationsMaps.push(animationsMap);
        for (var key in animationsMap) {
            if (animationsMap.hasOwnProperty(key)) {
                this.registerAnimation(key, animationsMap[key]);
            }
        }
    };
    canStacheAnimate.registerAnimation = function (key, value) {
        var animation = this.expandAnimation(value), animationIsObject = isPlainObject(animation), animationHasRunProperty = !!animation.run;
        if (animationIsObject && animationHasRunProperty) {
            this.animations[key] = this.createHelperFromAnimation(animation);
        } else {
            if (!animationIsObject) {
                console.warn('Invalid animation type for \'' + key + '\'. Animation should be a string, a function, or an object.');
            } else if (!animationHasRunProperty) {
                console.warn('Invalid `animation.run` value for \'' + key + '\'. `animation.run` is required.');
            }
        }
    };
    canStacheAnimate.expandAnimation = function (value) {
        var animation = value;
        if (typeof animation === 'string') {
            animation = this.getAnimationFromString(animation);
        }
        if (typeof animation === 'function' || isPromiseLike(animation)) {
            animation = {
                before: null,
                run: animation,
                after: null
            };
        }
        return animation;
    };
    canStacheAnimate.getAnimationFromString = function (animation) {
        while (typeof animation === 'string') {
            var finalAnimation = this.animations[animation];
            if (finalAnimation) {
                animation = finalAnimation;
                break;
            }
            animation = this.lookupAnimationInAnimationsMaps(animation);
        }
        return animation;
    };
    canStacheAnimate.lookupAnimationInAnimationsMaps = function (animation) {
        var returnVal, thisAnimation;
        for (var i = 0; i < this.animationsMaps.length; i++) {
            thisAnimation = this.animationsMaps[i][animation];
            if (thisAnimation) {
                returnVal = thisAnimation;
                break;
            }
        }
        return returnVal;
    };
    canStacheAnimate.createHelperFromAnimation = function (animation) {
        var self = this, before = this.expandAnimationProp(animation, 'before'), run = this.expandAnimationProp(animation, 'run'), after = this.expandAnimationProp(animation, 'after'), stop = this.expandAnimationProp(animation, 'stop');
        return function (ctx, el, ev) {
            var callMethod = function (method) {
                    if (ev && ev.canStacheAnimate) {
                        return method(ctx, el, ev);
                    }
                    return method(el, ev, self.getOptions(el, ev, animation));
                }, makePromise = function (method, required, invalidTypeWarning) {
                    if (!method && !required) {
                        return Promise.resolve(true);
                    }
                    if (isPromiseLike(method)) {
                        return method;
                    }
                    if (typeof method !== 'function') {
                        console.warn(invalidTypeWarning);
                        return Promise.resolve(true);
                    } else {
                        var res = callMethod(method);
                        if (res === false) {
                            return Promise.reject(res);
                        }
                        if (typeof res === 'undefined') {
                            return Promise.resolve(true);
                        }
                        return res;
                    }
                }, invalidTypeWarnings = function () {
                    var warnings = {};
                    [
                        'before',
                        'run',
                        'after'
                    ].forEach(function (type) {
                        warnings[type] = 'Invalid animation property type (`' + type + '`). Animation property should be a string, a function, or an object.';
                    });
                    return warnings;
                }(), isStopped = false, callStop = function () {
                    isStopped = true;
                    if (typeof stop !== 'function') {
                        return false;
                    }
                    callMethod(stop);
                    return false;
                };
            return makePromise(before, false, invalidTypeWarnings.before).then(function () {
                var result = arguments[0];
                if (result === false || isStopped) {
                    return callStop('before');
                }
                return makePromise(run, true, invalidTypeWarnings.run).then(function () {
                    var result = arguments[0];
                    if (result === false || isStopped) {
                        return callStop('run');
                    }
                    return makePromise(after, false, invalidTypeWarnings.after).then(function () {
                        var result = arguments[0];
                        if (result === false || isStopped) {
                            return callStop('after');
                        }
                    }, function () {
                        return callStop('after');
                    });
                }, function () {
                    return callStop('run');
                });
            }, function () {
                return callStop('before');
            });
        };
    };
    canStacheAnimate.expandAnimationProp = function (animation, prop) {
        var animationProp = animation[prop];
        if (!animationProp) {
            return null;
        }
        if (typeof animationProp === 'string') {
            return this.getAnimationFromString(animationProp);
        }
        if (typeof animationProp === 'function') {
            return animationProp;
        }
        console.warn('Invalid animation property type. Animation property should be a string or a function.');
        return null;
    };
    canStacheAnimate.getOptions = function (el, ev, animation) {
        var duration = typeof animation.duration !== 'undefined' ? animation.duration : this.duration, opts = {
                duration: duration,
                canStacheAnimate: this,
                animation: animation
            };
        return opts;
    };
    canStacheAnimate.setDuration = function (duration) {
        this.duration = duration;
    };
    canStacheAnimate.registerAnimations(defaultAnimations);
    module.exports = canStacheAnimate;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();