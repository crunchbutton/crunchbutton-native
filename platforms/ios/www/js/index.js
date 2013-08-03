var CB = {
	server: 'http://beta.crunchr.co/',
	init: function() {
	
	LazyCache.init({
		debug: false,
		storeComplete: null
	});
	
$element.LazyCache({
						attr: 'data-image',
						lazy: true,
						css: {
							'background-position': 'center',
							'background-repeat': 'no-repeat',
							'background-size': 'cover'
						}
					});
	
	
		CB.version = localStorage.version;

		$.getJSON(CB.service + 'api/config', function(r) {
			CB.config = r;
			if (CB.version != CB.config.version) {
				// update all the assets
				getAssets(CB.buildApp);
			} else {
				CB.buildApp();
			}
		});
		
	},
	getAssets: function(cb) {
		$.when($.ajax(CB.server + 'assets/bundle.js?v=' + CB.config.version), $.ajax(CB.server + 'assets/bundle.css?v=' + CB.config.version)).then(function(){
			console.log(arguments);
			if (typeof cb === 'function') {
				cb();
			}
		});

	},
	buildApp: function() {
		alert('built');
	}
};

var TapToScroll = function() {
  
}

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
//location.href="http://beta.crunchr.co/";








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



