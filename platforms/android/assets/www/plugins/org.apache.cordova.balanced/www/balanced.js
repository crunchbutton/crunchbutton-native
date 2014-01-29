cordova.define("org.apache.cordova.balanced.balanced", function(require, exports, module) {var exec = require('cordova/exec');

module.exports = {
    tokenizeCard: function( success, error, args ) {
        exec( success, error, 'BalancedPlugin', 'tokenizeCard', args );
    },
};
});
