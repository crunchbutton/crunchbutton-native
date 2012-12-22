var App = {
	loc: {}
}, Template = {};

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
	App.db = window.openDatabase('crunchbutton', '1.0', 'Preferences', 1000000);
	App.db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id unique, data)');
	});

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
		idAttribute: 'permalink',
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
				el: '#body'
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
			window.scrollTo(0, 1);

			this.$el.html(this.template());
//			$('#body').html();
			//$('#page header').hide();
			//menuEnabled = false;
		},
		events: {
			'click .eat': 'eatClick',
			'blur input': 'scrollTop'
		},
		scrollTop: function() {
			window.scrollTo(0, 1);
		},
		eatClick: function(e) {
			App.setLocation(function() {
				App.getRestaurants(function() {
					App.router.navigate('/restaurants', {trigger: true});
				});
			});
		},
		initialize: function (args) {
			this.template = _.template(Template.home);
		}
	});

	var RestaurantsView = Backbone.View.extend({
		render : function() {
			var self = this;
			window.scrollTo(0, 1);
			
			this.$el.css('height', '');

			this.$el[0].addEventListener('webkitTransitionEnd', function(e) {
				$('#body').css({
					height: self.$el[0].scrollHeight
				});
			}, false);

			this.$el.html(this.template({
				restaurants: App.restaurants
			}));
			//$('#page header').show();
			//menuEnabled = true;
		},
		events: {
			'click .restaurant': 'restaurantClick',
		},
		restaurantClick: function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			var permalink = $(e.currentTarget).attr('data-permalink');
			
			App.router.navigate('/restaurant/' + permalink, {trigger: true});
			return;


			return false;
			
		},
		initialize: function (args) {
			this.template = _.template(Template.restaurants);
		}
	});
	
	var RestaurantView = Backbone.View.extend({
		render : function() {
			var self = this;
			window.scrollTo(0, 1);

			this.$el.html(this.template({
				restaurant: App.restaurant
			}));
		},
		initialize: function (args) {
			this.template = _.template(Template.restaurant);
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
			'restaurant/:permalink': 'getRestaurant',
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
	
	App.router.on('route:getRestaurant', function(actions) {
		var rest = new Restaurant({permalink: arguments[0]});
		rest.fetch({
			success: function (rest) {
				App.restaurant = rest;
				App.navigator.pushView(RestaurantView);
			}
		});
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

		$.when($.get('view/root.html'), $.get('view/home.html'), $.get('view/restaurants.html'), $.get('view/restaurant.html')).done(function() {
			Template.root = arguments[0][0];
			Template.home = arguments[1][0];
			Template.restaurants = arguments[2][0];
			Template.restaurant = arguments[3][0];

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
	});
	
	App.getRestaurants = function() {
	
		if (arguments.length == 2) {
			var filters = arguments[0];
			var complete = arguments[1];
		} else {
			var complete = arguments[0];	
		}
	
		$.getJSON(server + 'restaurants', {lat: App.loc.lat, lon: App.loc.lon}, function(res, status) {
			for (var x in res.restaurants) {
				var rest = new Restaurant(res.restaurants[x]);
				rest.save();
			}
			App.restaurants = res.restaurants;
			complete();
	
		}).error(function(e) {
			alert('Sorry! We could not retrieve restaurant list. Are you connected to the internet?')
		})
	};

});

App.setLocation = function(complete) {
	var geocoder = new google.maps.Geocoder();
	var forceLoc = null;

	switch ($('input[name="input-where"]').val().toLowerCase()) {
		case 'yale':
		case 'new haven':
			forceLoc = '41.310598, -72.927933';
			break;
		case 'harvard':
		case 'cambridge':
		case 'the game':
		case 'hahvahd':
		case 'boston':
		case 'somerville':
			forceLoc = '42.376173, -71.115757';
			break;
		case 'dc':
		case 'gwu':
		case 'gw':
		case 'george washington':
		case 'george washington university':
		case 'the district':
		case 'district of columbia':
		case 'foggy bottom':
		case 'georgetown':
		case 'gu':
		case 'georgetown university':
			forceLoc = '38.8900, -77.0300';
			break;
	}
	
	geocoder.geocode({'address': forceLoc || $('input[name="input-where"]').val()}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			App.loc.lat = results[0].geometry.location.lat();
			App.loc.lon = results[0].geometry.location.lng();
			App.loc.address = results[0].formatted_address;
			App.loc.entered = $('input[name="input-where"]').val();

			complete();
		} else {
			$('input[name="input-where"]').val('').attr('placeholder','Oops! We couldn\'t find that address!');
		}
	});
};