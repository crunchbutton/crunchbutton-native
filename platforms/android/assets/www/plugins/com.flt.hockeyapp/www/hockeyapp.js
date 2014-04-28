cordova.define("com.flt.hockeyapp.HockeyAppPlugin", function(require, exports, module) {var exec = require('cordova/exec');

module.exports = {
    init: function( success, error, args ) {
        cordova.exec( success, error, 'HockeyAppPlugin', 'init', args );
    },
    getFeedback: function( success, error ) {
        cordova.exec( success, error, 'HockeyAppPlugin', 'getFeedback', [] );
    },
};
});