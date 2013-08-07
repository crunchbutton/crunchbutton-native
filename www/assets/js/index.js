/**
 * phonegap specific code
 *
 **/

var now = new Date();
var _gmtServer = now.getUTCFullYear() + '/' + (now.getUTCMonth()+1) + '/' + now.getDate() + '/' + now.getUTCHours() + '/' + now.getUTCMinutes() + '/' + now.getUTCSeconds();

var CB = {
	init: function() {
		App.server = 'http://beta.crunchr.co/';
		App.service = App.server + 'api/';
		App.imgServer = 'http://i.crunchbutton.com/';

		$.getJSON(App.service + 'config/extended', function(r) {
			var extract = ['aliases','locations','facebookScope','communities','topCommunities'];
			for (var x in extract) {
				console.log(extract[x], r[extract[x]]);
				App[extract[x]] = r[extract[x]];
				r[extract[x]] = null;
			}
			App.init(r);
		});
	}
};

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

document.addEventListener('deviceready', function() {

	CB.init();

	window.plugins.tapToScroll.initListener();
	window.addEventListener('statusTap', function() {
		$('html, body').animate({scrollTop: 0}, 200);
		//smoothTop();
	});

	var status = function(res) {
		if (res.status === 'connected' && res.authResponse && res.authResponse.accessToken) {
			FB.api('/me', {fields: 'name' }, function(me) {
				// logged in
				console.log('ME',me);
			});
		}
	}
	
	FB.Event.subscribe('auth.statusChange', status);

	//FB.getLoginStatus(status);
	

	FB.init({
		appId: '***REMOVED***',
		//cookie: true,
		//xfbml: true,
		//oauth: true,
		nativeInterface: CDV.FB,
		useCachedDialogs: false
	});

	
}, false);



var smoothTop = function() {
	var pos = $(window).scrollTop();

	$('body').css({
		'margin-top': -pos + 'px',
		'overflow-y': 'scroll',
	});

	$(window).scrollTop(0);

	$('body').css({
		'transition': 'margin-top .2s cubic-bezier(0.35, 0.71, 0.59, 0.88)',
		'margin-top': '0'    	
	});

	$('body').on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
		$('body').css('transition', 'none');
	});
}



