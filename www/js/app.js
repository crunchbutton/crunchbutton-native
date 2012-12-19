var App = {}, Template = {};

if (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 ) {
	// phonegap
	var server = 'http://dev.crunchr.co/api/';
} else {
	// regular
	var server = '/api/';
}

var imageServer = 'http://i.crunchr.co/';

var menuEnabled = true;

var initMain = function() {

	var body   	= document.body
  	, viewport   = document.querySelectorAll('#viewport')[0]
  	, menu   	= document.querySelectorAll('#menu')[0]
  	, page   	= document.querySelectorAll('#page')[0]
  	, closeMask  = document.querySelectorAll('#close-mask')[0]
  	, trigger	= page.querySelectorAll('.trigger')[0];

	var transitionEnd = whichTransitionEvent();

	trigger.addEventListener('click', function() {
		if (hasClass(body, 'menu-open')) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	closeMask.addEventListener('click', function(event) {
		event.preventDefault();
		closeMenu();
	});

	closeMask.addEventListener('touchmove', function(event) {
		event.preventDefault();
	});
	
	page.addEventListener('touchmove', function(event) {
		console.log(event)
	});

	if (('ontouchend' in window)) {
		var startX, startY, moveX, moveY,
			matrix, m41 = 0,
			shouldOpenMenu = false, shouldCloseMenu = false,
			menuOpen = false, menuOpening = false, menuClosing = false;

		page.addEventListener('touchstart', function(event) {
			if (!menuEnabled) return;

			startX = event.touches[0].pageX;
			startY = event.touches[0].pageY;

			shouldOpenMenu = false;
			shouldCloseMenu = false;

			matrix = new WebKitCSSMatrix(page.style.webkitTransform)
			m41 = matrix['m41'];
		});

		page.addEventListener('touchmove', function(event) {
			if (!menuEnabled) return;

			var moveX  	= event.changedTouches[0].pageX
  			, moveY  	= event.changedTouches[0].pageY
  			, distanceX  = moveX - startX
  			, distanceY  = moveY - startY
  			, movedLeft  = distanceX < 0
  			, movedRight = distanceX > 5
  			, movedVert  = Math.abs(distanceY) > 15;

			if (!movedVert) {

				if (!menuOpen && movedRight || menuOpen && movedLeft) {
					event.preventDefault();
					addClass(body, 'menu-moving');
					page.style.webkitTransform = 'translate3d(' + (distanceX + m41) + 'px, 0 , 0)';	
				}

				if (!menuOpen && movedRight) {
					shouldOpenMenu = (Math.abs(distanceX) > (body.clientWidth / 2.5));
					shouldCloseMenu = !shouldOpenMenu;
				}

				if (menuOpen && movedLeft) {
					shouldCloseMenu = (Math.abs(distanceX) > (body.clientWidth / 4));
					shouldOpenMenu = !shouldCloseMenu;
				}
			}
		});

		page.addEventListener('touchend', function(event) {
			if (!menuEnabled) return;

			if (shouldOpenMenu) {
				openMenu();
			} 

			if (shouldCloseMenu) {
				closeMenu();
			}   	
		});
	}

	setTimeout(function() {
		window.scrollTo(0, 0);
	}, 100);

	function openMenu() {
		// set height of the scrollable area to window innerHeight
		menu.style.height = window.innerHeight + 'px';

		page.style.webkitTransform = 'translate3d(260px, 0 , 0)';

		menuOpening = true;

		addClass(body, 'menu-opening');

		page.addEventListener(transitionEnd, function() {
			menuOpen = true;
			menuOpening = false;

			addClass(body, 'menu-open');
			removeClass(body, 'menu-opening');
			removeClass(body, 'menu-moving');

			this.removeEventListener(transitionEnd, arguments.callee, false);
		});
	}

	function closeMenu() {
		page.style.webkitTransform = 'translate3d(0, 0 , 0)';
					
		menuClosing = true;
		
		addClass(body, 'menu-closing');

		page.addEventListener(transitionEnd, function() {
			menuOpen = false;
			menuClosing = false;

			removeClass(body, 'menu-open');
			removeClass(body, 'menu-closing');
			removeClass(body, 'menu-moving');

			this.removeEventListener(transitionEnd, arguments.callee, false);
		});
	}

	function hasClass(el, className) {
		className = " " + className + " ";
		return (el.nodeType === 1 && (" " + el.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1);
	}

	function addClass(el, className) {
		if (!hasClass(el, className)) {
			el.className += (el.className ? ' ' : '') + className;
		}
	}

	function removeClass(el, className) {
		if (hasClass(el, className)) {
			el.className = el.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
		}
	}

	function whichTransitionEvent() {
		var t, el = document.createElement('fakeelement');
		var transitions = {
				'transition':'transitionEnd',
				'OTransition':'oTransitionEnd',
				'MSTransition':'msTransitionEnd',
				'MozTransition':'transitionend',
				'WebkitTransition':'webkitTransitionEnd'
			};

		for (t in transitions) {
			if( el.style[t] !== undefined ) {
				return transitions[t];
			}
		}
	}

};


$(function() {
	/*
	$('.nav-news').live('click', function() {
		App.router.navigate('/news', true);
	});
	*/

	var User = Backbone.Model.extend({
		idAttribute: 'id_user',
		urlRoot: server + 'user',
		party: function() {
			return CreatureCollection.filter({team: 1});
		},
		creatures: function() {
			return this._creatures;
		}
	});

	var Restaurant = Backbone.Model.extend({
		idAttribute: 'id_restaurant',
		localStorage: new Backbone.LocalStorage('Restaurant')
	});

	var RestaurantCollection = Backbone.Collection.extend({
		model: Restaurant,
		localStorage: new Backbone.LocalStorage('RestaurantCollection')
	});

	var MainView = Backbone.View.extend({
		el: $('body'),
		subviews:null,
		subviewsNavigator:null,
		render: function () {

			this.el.innerHTML = this.template();
			initMain();

			App.navigator = new BackStack.StackNavigator({
				el: '#page'
			});
			//App.navigator.defaultPushTransition = new BackStack.NoEffect();
			Backbone.history.start({pushState: true});

		},
		initialize: function (args) {
			this.template = _.template(Template.root);
		}
	});
	
	var HomeView = Backbone.View.extend({
		render:function (er) {
			this.$el.html(this.template());
//			$('#body').html();
			//$('#page header').hide();
			//menuEnabled = false;

			$('.eat').live('click',function() {
				App.router.navigate('/restaurants', {trigger: true});
			});

			$('input').bind('blur', function(e) {
				window.scrollTo(0, 1);
			});

			$(window).bind('resize', function(e) {
				//window.scrollTo(0, 1);
			});

			$('#page').css('overflow','hidden');
		},
		events: {
			'blur input': 'scrollTop'
		},
		scrollTop: function() {
			window.scrollTo(0, 1);
		},
		eatClick: function(e) {
			App.router.navigate('/restaurants', {trigger: true});
		},
		initialize: function (args) {
			this.template = _.template(Template.home);
		}
	});

	var RestaurantsView = Backbone.View.extend({
		render : function() {
			this.$el.html(this.template());
			//$('#page header').show();
			//menuEnabled = true;
		},
		initialize: function (args) {
			this.template = _.template(Template.restaurants);
		}
	});
	
	/*
	var ErrorView = Backbone.View.extend({
		el: $('body'),
		render:function (er) {
			this.el.innerHTML  = this.template({
				error: er
			});
		},
		initialize: function (args) {
			this.template = _.template($('#error-template').html());
		}
	});

	var UpdateView = Backbone.View.extend({
		className: 'update content',
		el: $('body'),
		render : function() {
			this.el.innerHTML = this.template();

			var $topLoader = $('#updateLoader').percentageLoader({
				width: 256,
				height: 256,
				controllable: true,
				progress: 0,
				onProgressUpdate: function(val) {
					$topLoader.setValue(Math.round(val * 100.0));
				}
			});

			this.loader = $topLoader;

		},
		initialize: function (args) {
			this.template = _.template($('#update-template').html());
		}
	});
	*/



	var AppRouter = Backbone.Router.extend({
		routes: {
			'community/:id': 'getEvent',
			'forceupdate': 'getUpdate',
			'restaurants': 'getRestaurants',
			'*actions': 'defaultRoute',
		}
	});
	
	App.router = new AppRouter;
		App.router.on('route:defaultRoute', function(actions) {
		App.navigator.pushView(HomeView);
	});
	
	App.router.on('route:getRestaurants', function(actions) {
		App.navigator.pushView(RestaurantsView);
	});

	var AppInit = function(res) {
		localStorage.setItem('version', res.version);

		var user = res.user;
		/*
		if (res.restaurants) {
			var restaurants = res.restaurants;

			for (var x in restaurants) {
				var restaurant = new Restaurant(restaurants[x]);
				restaurant.save();
			}
		}

		App.user = new User(user);
		*/
		// download all the templates to mem
		var tpl = ['root','home','restaurants'];
		var requests = [];

		$.when($.get('view/root.html'), $.get('view/home.html'), $.get('view/restaurants.html')).done(function() {
			Template.root = arguments[0][0];
			Template.home = arguments[1][0];
			Template.restaurants = arguments[2][0];

			var main = new MainView;
			main.render();
		});
		


	};

	var AppUpdate = function(res) {
		return AppInit(res);
		/*
		var update = new UpdateView;
		update.render();

		var updateProgress = function (evt) {
			if (evt.lengthComputable) {
				var percentComplete = (evt.loaded / evt.total)*100;
				update.loader.setProgress(percentComplete);
				update.loader.setValue(Math.floor(evt.loaded / 1024 / 1024) + 'MB');
			}
		}
		var req = new XMLHttpRequest();
		req.onprogress = updateProgress;
		req.open('GET', server + 'update?version=' + res.version, true);
		req.onreadystatechange = function (e) {
			if (req.readyState == 4) {
				AppInit(res);
			}
		};
		req.send();
		*/
	};

	$.getJSON(server + 'config', function(res, status) {
		if (status == 'success') {
			var currentVersion = localStorage.getItem('version');
			if (currentVersion != res.version) {
				// need to update
				AppUpdate(res);
			} else {
				AppInit(res);
			}
		}
	}).error(function() {
		var main = new ErrorView;
		main.render('The server is currently down. Sorry!');
	})
});


// http://i.crunchr.co/53x53/wings-over-prov.jpg?crop=1