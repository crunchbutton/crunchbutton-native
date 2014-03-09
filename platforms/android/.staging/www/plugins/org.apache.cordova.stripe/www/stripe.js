cordova.define("org.apache.cordova.stripe.stripe", function(require, exports, module) {var exec = require('cordova/exec');

module.exports = {
    tokenizeCard: function( success, error, args ) {
        exec( success, error, 'StripePlugin', 'tokenizeCard', args );
    },
};
});
