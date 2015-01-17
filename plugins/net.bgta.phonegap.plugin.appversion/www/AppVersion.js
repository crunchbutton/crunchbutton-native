/*
 * Phonegap AppVersion Plugin Copyright (c) Raúl Romero García 2014 MIT Licensed
 */
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var getAppVersion = function(success, fail) {
    var dfr = null;
    if ((typeof success) === 'undefined' && window.jQuery) {
        dfr = jQuery.Deferred();
        success = dfr.resolve;
        fail = dfr.reject;
    }
    // 5th param is NOT optional. must be at least empty array
    exec(success, fail, "AppVersion", "getVersionNumber", []);
    return dfr;
};

module.exports = getAppVersion;