var defaultJqueryAnimations = {};
[
	'slideDown', 
	'slideUp', 
	'slideToggle', 
	'fadeIn', 
	'fadeOut', 
	'fadeToggle'
].forEach(function(anim){
	defaultJqueryAnimations[anim] = function(el, ev, options) { 
		$(el)[anim](options.duration); 
	};
});

module.exports = defaultJqueryAnimations;