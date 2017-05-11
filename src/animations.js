import $ from 'jquery';

var animations = {
	shake: function(vm, el, ev){
		let $el = $(el);
		$el.animate({
			"margin-left":"-20px"
		},() => {
			$el.animate({
				"margin-left":"20px"
			}, () => {
				$el.animate({
					"margin-left":"0px"
				}, () => {
					$el.css({
						"margin-left":""
					})
				})
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
].forEach(anim => {
	animations[anim] = (vm, el, ev) => $(el)[anim]();
});


export default animations;
