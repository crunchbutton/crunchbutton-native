/**
 * phonegap specific code
 *
 **/

var now = new Date();
var _gmtServer = now.getUTCFullYear() + '/' + (now.getUTCMonth()+1) + '/' + now.getUTCDate() + '/' + now.getUTCHours() + '/' + now.getUTCMinutes() + '/' + now.getUTCSeconds();

var TapToScroll = function() {
	
};

TapToScroll.prototype.initListener = function() {
	cordova.exec(null, null, 'TapToScroll', 'initListener',[]);
};

if (!window.plugins) {
	window.plugins = {};
}
if (!window.plugins.tapToScroll) {
	window.plugins.tapToScroll = new TapToScroll();
}

balanced = {
	card: {
		create: function(args, complete) {
			cordova.exec(function(response) {
				complete({
					status: response.status_code,
					data: response
				});
			}, function() {
				complete({
					status: 999
				});
			}, 'BalancedPlugin', 'tokenizeCard',[args.card_number, args.expiration_month, args.expiration_year, args.security_code || '']);
		}
	}
};

var login = function() {
	FB.login(status, {scope: 'email'});
};


$(function() {
	document.addEventListener('deviceready', function() {
		// this is only here so we can not get a double permission request
		navigator.geolocation.getCurrentPosition(function (position) {
			console.debug('got users position', position);
		});

		// do the ios7 style 3d tilt thing on the location page
		window.addEventListener('deviceorientation', function(eventData) {
			try {
				if (App.rootScope.navigation.page == 'location') {
					var yTilt = Math.round((-eventData.beta + 90) * (40/180) - 40);
					var xTilt = Math.round((-eventData.gamma + 90) * (20/180) - 20);
					var bgOffset = 0;
				
					if (xTilt > 0) {
						xTilt = -xTilt;
					} else if (xTilt < -40) {
						xTilt = -(xTilt + 80);
					}
				
					var backgroundPositionValue = (xTilt*3.2) + 'px ' + ((yTilt*2) + bgOffset) + "px";
					$('.bg').css('background-position', backgroundPositionValue);
				}
			} catch (e) {}
		}, false);


		App.server = 'https://crunchbutton.com/';
		App.service = App.server + 'api/';
		App.imgServer = 'http://i.crunchbutton.com/';
	
		// @todo: add fail handler
		App.request(App.service + 'config/extended', function(r) {
			var extract = ['aliases','locations','facebookScope','communities','topCommunities'];
			for (var x in extract) {
				App[extract[x]] = r[extract[x]];
				r[extract[x]] = null;
			}
			App._remoteConfig = true;
			App.init(r);
		}, function() {
			App._remoteConfig = false;
			App.init({});
		});

		// top tap scroller
		window.plugins.tapToScroll.initListener();
		window.addEventListener('statusTap', function() {
			$('html, body, .snap-content-inner').animate({scrollTop: 0}, 200, $.easing.easeInOutQuart ? 'easeInOutQuart' : null);
		});
	
		setTimeout(function(){
			var facebookService = angular.element('html').injector().get('FacebookService');
			FB.Event.subscribe('auth.statusChange', facebookService.processStatus);
	
			FB.init({
				appId: '***REMOVED***',
				//cookie: true,
				xfbml: true,
				//oauth: true,
				nativeInterface: CDV.FB,
				useCachedDialogs: false
			});
			
			FB.getLoginStatus(facebookService.processStatus);

		}, 1000);
	}, true);
});