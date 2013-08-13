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

var login = function() {
	FB.login(status, {scope: 'email'});
};


$(function() {
	document.addEventListener('deviceready', function() {
		navigator.geolocation.getCurrentPosition(function(){
			console.log(arguments);
		});
	
		window.addEventListener('deviceorientation', function(eventData) {
			var yTilt = Math.round((-eventData.beta + 90) * (40/180) - 40);
			var xTilt = Math.round((-eventData.gamma + 90) * (20/180) - 20);
		
			if (xTilt > 0) {
				xTilt = -xTilt;
			} else if (xTilt < -40) {
				xTilt = -(xTilt + 80);
			}
		
			var backgroundPositionValue = (xTilt*3.2) + 'px ' + (yTilt*2) + "px";
			$('.bg').css('background-position', backgroundPositionValue);
		}, false);


		App.server = 'http://beta.crunchr.co/';
		App.service = App.server + 'api/';
		App.imgServer = 'http://i.crunchbutton.com/';
	
		// @todo: add fail handler
		$.getJSON(App.service + 'config/extended', function(r) {
			var extract = ['aliases','locations','facebookScope','communities','topCommunities'];
			for (var x in extract) {
				App[extract[x]] = r[extract[x]];
				r[extract[x]] = null;
			}
			App.init(r);
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
				appId: '411729638889643',
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