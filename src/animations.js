var $ = require('jquery');

var animations = {
	shake: function(el, ev, options){
		let $el = $(el);
		return $el.animate({
			"margin-left":"-20px"
		}, options.duration).promise().then(function(){
			return $el.animate({
				"margin-left":"20px"
			}, options.duration).promise().then(function(){
				return $el.animate({
					"margin-left":"0px"
				}, options.duration).promise().then(function(){
					$el.css({
						"margin-left":""
					});
				});
			})
		})
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
	animations[anim] = function(el, ev, options) { 
		$(el)[anim](options.duration); 
	};
});


module.exports = animations
