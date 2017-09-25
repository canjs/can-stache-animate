var TweenMax = require('gsap');

//default animations
module.exports = {

	"slideLeftIn":{
		before:{
			"x":-100,
			"opacity":0,
			"display":"block"
		},
		run:{
			"x":0,
			"opacity":1
		},
		after: {
			"transform":undefined,
			"opacity":undefined
		}
	},
	"slideRightIn":{
		before:{
			"x":100,
			"opacity":0,
			"display":"block"
		},
		run:{
			"x":0,
			"opacity":1
		},
		after: {
			"transform":undefined,
			"opacity":undefined
		}
	},

	"slideIn":"slideLeftIn",
	"slideLeftOut":{
		before:{
			"x":0,
			"opacity":1
		},
		run:{
			"x":-100,
			"opacity":0,
			"display":"block"
		},
		after: {
			"transform":undefined,
			"opacity":undefined
		}
	},
	"slideRightOut":{
		before:{
			"x":0,
			"opacity":1
		},
		run:{
			"x":100,
			"opacity":0,
			"display":"block"
		},
		after: {
			"transform":undefined,
			"opacity":undefined
		}
	},
	slideOut: "slideLeftOut",


	"zoomIn":{
		before: {
			"scale":.5,
			"opacity":0,
			"display":"block"
		},
		run:{
			"scale": 1,
			"opacity":1
		},
		after: {
			"transform":undefined,
			"opacity":undefined
		}
	},
	"zoomInBack":"zoomIn",
	"zoomInFront":{
		before: {
			"scale":1.5,
			"opacity":0,
			"display":"block"
		},
		run:{
			"scale": 1,
			"opacity":1
		},
		after: {
			"transform":undefined,
			"opacity":undefined
		}
	},
	"zoomOut":{
		before: {
			"scale":1,
			"opacity":1,
			"display":"block"
		},
		run:{
			"scale": 0.5,
			"opacity":0
		},
		after: {
			"transform":undefined,
			"opacity":undefined,
			"display":"none"
		}
	},
	"zoomOutBack":"zoomOut",
	"zoomOutFront":{
		before: {
			"scale":1,
			"opacity":1
		},
		run:{
			"scale": 1.5,
			"opacity":0
		},
		after: {
			"transform":undefined,
			"opacity":undefined,
			"display":"none"
		}
	},

	"slideDownInStagger":{
		before: function(el,ev,options){
			return new Promise((resolve)=>{
				TweenMax.to(el,0,{
					"display":"block",
					"opacity":0
				});
				TweenMax.to(el.children, 0, {
						"y":-30,
						"opacity":0,
						"display":"block",
						"onComplete":() => {
							resolve();
						}
				});
			});
		},
		run: function(el,ev,options){
			let numChildren = el.children.length,
					staggerInterval = (!numChildren) ? 0 : options.duration*.001/numChildren;
			return new Promise((resolve)=>{
				TweenMax.to(el,options.duration*.001,{
					"opacity":1,
					"onComplete": () => {
						TweenMax.staggerTo(el.children, options.duration*.001, {
								"y":0,
								"opacity":1,
								"onComplete":() => {
									resolve();
								}
						}, staggerInterval);
					}
				});
			});
		},
		after: function(el,ev,options){
			return new Promise((resolve)=>{
				TweenMax.to(el,0,{
					"opacity":undefined
				});
				TweenMax.to(el.children, 0, {
						"onComplete":() => {
							resolve();
						}
				});
			});
		}
	},
	"slideLeftInStagger":{
		before: function(el,ev,options){
			return new Promise((resolve)=>{
				TweenMax.to(el,0,{
					"display":"block",
					"opacity":0
				});
				TweenMax.to(el.children, 0, {
						"x":-30,
						"opacity":0,
						"display":"block",
						"onComplete":() => {
							resolve();
						}
				});
			});
		},
		run: function(el,ev,options){
			let numChildren = el.children.length,
					staggerInterval = (!numChildren) ? 0 : options.duration*.001/numChildren;
			return new Promise((resolve)=>{
				TweenMax.to(el,options.duration*.001,{
					"opacity":1,
					"onComplete": () => {
						TweenMax.staggerTo(el.children, options.duration*.001, {
								"x":0,
								"opacity":1,
								"onComplete":() => {
									resolve();
								}
						}, staggerInterval);
					}
				});
			});
		},
		after: function(el,ev,options){
			return new Promise((resolve)=>{
				TweenMax.to(el,0,{
					"opacity":undefined
				});
				TweenMax.to(el.children, 0, {
						"onComplete":() => {
							resolve();
						}
				});
			});
		}
	},
};
