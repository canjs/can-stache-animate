/*can-stache-animate@0.0.0#can-stache-animate*/
var defaultAnimations = require('./animations.js');
var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
var isPromiseLike = require('can-util/js/is-promise-like/is-promise-like');
require('can-util/dom/events/inserted/inserted');
require('can-util/dom/events/removed/removed');
require('./can-util/dom/mutate/mutate.js');
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