var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');

canStacheAnimate.registerAnimations({
	//hop cancels further animations
	hop:{
		duration: 1000,
		before: function(el, ev, options){
			return new Promise(function(resolve, reject){
				$(el).animate({
					"margin-top":"-20px"
				}, options.duration).promise().then(function(){
					resolve();
				});

				//cancel the animation before it's done
				//this should trigger the `stop` method to run
				setTimeout(function(){
					$(window).one('click', function(){
						reject();
					});
				}, 0);
			});
		},
		run: function(el, ev, options){
			return $(el).animate({
				"margin-top":"0px"
			}, 400).promise();
		},
		stop: function(el, ev, options){
			$(el).stop().animate({
				"margin-top": 0
			}, options.duration);
		}
	},

	dip:{
    before: function(el, ev, options){
      return $(el).animate({
          "margin-top":"20px"
      }, 2000).promise();
    },
    run: function(el, ev, options){
      return $(el).animate({
          "margin-top":"0px"
      }, 2000).promise();
    }
	},

	//hop2 & dip2 use only a function
	hop2:function(el, ev, options){
		var $el = $(el);
		return $el.animate({
			"margin-top":"-20px"
		}, 400).promise().then(function(){
			return $el.animate({
				"margin-top":"0px"
			}, 400).promise().then(function(){
				$(el).css({
					"margin-top":""
				});
			});
		});
	},

	dip2: function(el, ev, options){
		var $el = $(el);
		return $el.animate({
			"margin-top":"20px"
		}, 2000).promise().then(function(){
			return $el.animate({
				"margin-top":"0px"
			}, 2000).promise().then(function(){
				$el.css({
					"margin-top":""
				});
			});
		});
	},

	//hop3 & dip3 use jQuery's $.fn.animate().promise()
	hop3:{
		before: function(el, ev, options){
			return $(el).animate({
				"margin-top":"-20px"
			}, 400).promise();
		},
		run: function(el, ev, options){
			return $(el).animate({
				"margin-top":"0px"
			}, 400).promise();
		}
	},

	dip3:{
    before: function(el, ev, options){
      return $(el).animate({
          "margin-top":"20px"
      }, 2000).promise();
    },
    run: function(el, ev, options){
        console.log('c');
        return $(el).animate({
            "margin-top":"0px"
        }, 2000).promise();
    }
	}
});

module.exports = canStacheAnimate;
