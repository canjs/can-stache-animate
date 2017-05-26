var $ = require('jquery');
var canStacheAnimate = require('can-stache-animate');

canStacheAnimate.registerAnimations({
	//hop cancels further animations
	hop:{
		before: function(el, ev, options){
			return $(el).animate({
				"margin-top":"-20px"
			}, 400).promise().then(function(){
				return false;
			});
		},
		run: function(el, ev, options){
			return $(el).animate({
				"margin-top":"0px"
			}, 400).promise();
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
