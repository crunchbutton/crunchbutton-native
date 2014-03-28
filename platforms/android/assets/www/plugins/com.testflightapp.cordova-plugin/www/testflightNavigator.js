cordova.define("com.testflightapp.cordova-plugin.TestFlight", 
	function(require, exports, module) {var exec = require('cordova/exec');

module.exports = {
    takeOff: function( success, error, appToken ) {
        exec(success, error, 'TestFlightSDK', "takeOff", [ appToken ]);
    },
	};
});