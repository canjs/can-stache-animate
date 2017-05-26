var QUnit = require('steal-qunit');
var canStacheAnimate = require('./can-stache-animate');

QUnit.module('can-stache-animate');

QUnit.test('canStacheAnimate has default animations', function(){
  QUnit.ok(Object.keys(canStacheAnimate.animations).length, "Has default animations");
});
