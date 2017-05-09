import QUnit from 'steal-qunit';
import plugin from './can-stache-animate';

QUnit.module('can-stache-animate');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-stache-animate plugin');
});
