var $ = require('jquery');

var animations = {
	shake: function(vm, el, ev){
		let $el = $(el);
		return $el.animate({
			"margin-left":"-20px"
		}).promise().then(function(){
			return $el.animate({
				"margin-left":"20px"
			}).promise().then(function(){
				return $el.animate({
					"margin-left":"0px"
				}).promise().then(function(){
					$el.css({
						"margin-left":""
					});
				});
			})
		}).promise()
	}
};

//jquery defaults
[
	'slideDown', 
	'slideUp', 
	'slideToggle', 
	'fadeIn', 
	'fadeOut', 
	'fadeToggle'
].forEach(function(anim){
	animations[anim] = function(vm, el, ev) { 
		$(el)[anim](); 
	};
});


module.exports = animations
