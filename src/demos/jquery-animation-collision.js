import $ from 'jquery';
import canStacheAnimate from 'can-stache-animate';

canStacheAnimate.registerAnimations({
	hop:{

		//1
		before: function(vm, el, ev){
			$(el).animate({
				"margin-top":"-20px"
			}, 400);
		},
		//3
		run: function(vm,el,ev){
			$(el).animate({
				"margin-top":"0px"
			}, 400);
		}
	},

	dip:{
		//1
		before: function(vm, el, ev){
			$(el).animate({
				"margin-top":"20px"
			}, 2000);
		},
		//2
		run: function(vm,el,ev){
			$(el).animate({
				"margin-top":"0px"
			}, 2000);
		}
	},

	hop2:{
		run: function(vm,el,ev){
			$(el).animate({
				"margin-top":"-20px"
			}, 400, () => {
				$(el).animate({
					"margin-top":"0px"
				}, 400, () => {
					$(el).css({
						"margin-top":""
					});
				});
			});
		}
	},

	dip2:{
		run: function(vm,el,ev){
			$(el).animate({
				"margin-top":"20px"
			}, 2000, () => {
				$(el).animate({
					"margin-top":"0px"
				}, 2000, () => {
					$(el).css({
						"margin-top":""
					});
				});
			});
		}
	},

	//expectations with hop3, dip3
	/*
		hop3.before.pre
		dip3.before
		dip3.run.pre
		hop3.before.post
		hop3.run.pre
		hop3.run.post
		dip3.run.post
	*/

	hop3:{
		before: function(vm, el, ev){
			console.log("hop3.before.pre")
			setTimeout(() => {
				console.log("hop3.before.post")
			}, 400)
		},
		run: function(vm,el,ev){
			console.log("hop3.run.pre")
			setTimeout(() => {
				console.log("hop3.run.post")
			}, 400)
		}
	},

	dip3:{
		before: function(vm, el, ev){
			console.log("dip3.before")
		},
		run: function(vm,el,ev){
			console.log("dip3.run.pre")
			setTimeout(() => {
				console.log("dip3.run.post")
			}, 2000)
		}
	},


	hop4:{
		before: function(vm, el, ev){
			$(el).animate({
				"margin-top":"-20px"
			}, 400, () => {

			});
		},
		run: function(vm,el,ev){
			$(el).animate({
				"margin-top":"0px"
			}, 400, () => {
				
			});
		},
		after: function(vm,el,ev){
			$(el).css({
				"margin-top":""
			});
		}
	},

	dip4:{
		before: function(vm, el, ev){
			$(el).animate({
				"margin-top":"20px"
			}, 2000, () => {
				
			});
		},
		run: function(vm,el,ev){
			$(el).animate({
				"margin-top":"0px"
			}, 2000, () => {
				
			});
		},
		after: function(vm,el,ev){
			$(el).css({
				"margin-top":""
			});
		}
	},
});

export default canStacheAnimate;
