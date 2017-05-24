var QUnit = require('steal-qunit');
var plugin = require('./can-stache-animate');

QUnit.module('can-stache-animate');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-stache-animate plugin');
});
