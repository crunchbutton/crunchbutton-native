var exec = require('cordova/exec');

module.exports = {
    tokenizeCard: function( success, error, args ) {
        exec( success, error, 'BalancedPlugin', 'tokenizeCard', args );
    },
};
