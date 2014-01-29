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

var onSuccess = function(){console.log('1',arguments);};
var onError = function(){console.log('0',arguments);};

balanced = {

	init: function(){},

	card: {

		create: function( args, complete ) {

			navigator.balanced.tokenizeCard( 
				// Success
				function( response ){ 

					if( typeof( response ) == 'string' ){
						response = JSON.parse( response );
					}

					if (response.data && response.status) {
						// we have a balanced.js compatable response
						response.status = parseInt(response.status);

					} else {
						// format the response properly
						response = {
							status: response.uri ? 201 : (response.status_code || 666),
							data: response
						};
					}

					// callback
					complete( response );

				},
				// Error
				function( response ){ 
					console.log( response );
				},
				// Args
				[	
					args.card_number, 
					args.expiration_month, 
					args.expiration_year, 
					args.security_code || ''
				]
			);
		}
	}
};

var login = function() {
	FB.login(status, {scope: 'email'});
};

// if the app user isnt logged or this is the first time the app is loaded, hide the main stuff
if (!localStorage.loggedIn) {
	var els = document.getElementsByClassName('loggedout-hideable');
	for (var x in els) {
		//els[x].style.display = 'none';
	}

}


$(function() {
	document.addEventListener('deviceready', function() {
		// if they are logged in, they are going straight to the restaurant page
		if (localStorage.loggedIn) {
			navigator.splashscreen.hide();
		}
		// set a timeout for when ajax requests timeout
		
		//gamecenter.auth( onSuccess, onError );

		cordova.exec(function(response) {
			$.ajaxSetup({
				timeout: App.ajaxTimeout,
				data: {
					'_v': response
				}
			});
		}, null, 'VersionPlugin', 'version',[]);

		function orientationChanged (orientationEvent) {
			if (!App || !App.parallax.bg || !App.parallax.enabled) {
				return;
			}
		
			var beta = orientationEvent.beta;
			var gamma = orientationEvent.gamma;
			//get the rotation around the x and y axes from the orientation event
			
			if (window.orientation !== null) {
				//don't check for truthiness as window.orientation can be 0!
				var screenOrientation = window.orientation;
			
				if (screenOrientation === -90) {
					//rotated to the left 90 degrees
					beta = orientationEvent.gamma;
					gamma = -1 * orientationEvent.beta;
				}
		
				if (screenOrientation === 90) {
					beta = -1 * orientationEvent.gamma;
					gamma = orientationEvent.beta;
		
				}
			
				if (screenOrientation === 180) {
					beta = -1 * orientationEvent.beta;
					gamma = -1 * orientationEvent.gamma;
				}
			}
			
			var tanOfGamma = Math.tan(gamma*(Math.PI/180));
			var tanOfBeta = Math.tan((beta -45)*(Math.PI/180));
			//calculate the tan of the rotation around the X and Y axes
			//we treat beta = 45degrees as neutral
			//Math.tan takes radians, not degrees, as the argument
			
			var backgroundDistance = 50;
			//set the distance of the background from the foreground
			//the smaller, the 'closer' an object appears
			
			var xImagePosition = (-1 * tanOfGamma * backgroundDistance) + App.parallax.x;
			var yImagePosition = (-1 * tanOfBeta * backgroundDistance) + App.parallax.y;
			//calculate the distance to shift the background image horizontally
			
			//prevent wrap
			if (yImagePosition >= 0) {
				yImagePosition = 0;
			}
			if (xImagePosition >= 0) {
				xImagePosition = 0;
			}
			if (-xImagePosition > App.parallax.width * .65) {
				xImagePosition = App.parallax.width * .65;
			}
			if (-yImagePosition > App.parallax.height * .35) {
				yImagePosition = 0;
			}

			App.parallax.bg.style.backgroundPosition = xImagePosition + 'px ' + yImagePosition + 'px';
			//set the backgroundimage position to  xImagePosition yImagePosition
		}
		
		App.parallax.setupBackgroundImage = function(el) {

			App.parallax.bg = el;
		
			var imgURL = window.getComputedStyle(App.parallax.bg).backgroundImage ;
			//get the current background-image
				
			//bg image format is url(' + url + ') so we strip the url() bit
			imgURL = imgURL.replace(/"/g,'').replace(/url\(|\)$/ig, '');
			
			//now we make a new image element and set this as its source
			var theImage = new Image();
			theImage.src = imgURL;
			
			//we'll set an onload listener, so that when the image loads, we position the background image of the element
			theImage.onload = function() {
				var elRect = App.parallax.bg.getBoundingClientRect();
				App.parallax.width = this.width;
				App.parallax.height = this.height;
				App.parallax.x = -1 * (this.width - elRect.width)/2;
				App.parallax.y = -1 * (this.height - elRect.height)/2;
			}
		}
		
		window.addEventListener('deviceorientation', orientationChanged, false);


		App.server = 'http://beta.crunchr.co/';
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
		
		$(document).focus(function() {
			$('body').scrollTop(280-$('.snap-content-inner').scrollTop());
		}, '.location-address');

			var facebookInit = function(){
			// Verify if angular is already started
			if( angular && angular.element('html') && angular.element('html').injector() && angular.element('html').injector().get('FacebookService') ){
				var facebookService = angular.element('html').injector().get('FacebookService');
				FB.Event.subscribe('auth.statusChange', facebookService.processStatus);

				FB.init({
					appId: '330512547054803',
					//cookie: true,
					xfbml: true,
					//oauth: true,
					nativeInterface: CDV.FB,
					useCachedDialogs: false
				});

				FB.getLoginStatus(facebookService.processStatus);
			} else {
				setTimeout( function(){
					facebookInit();
				}, 1500 );
			}
		}
		facebookInit();

	}, true);
} );


if ( !window.console ){
	console = {};
}
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){};
console.debug = console.debug || function(){};