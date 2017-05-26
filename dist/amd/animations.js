/*can-stache-animate@0.0.0#animations*/
define(function (require, exports, module) {
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