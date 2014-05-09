cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/Coordinates.js",
        "id": "org.apache.cordova.geolocation.Coordinates",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/PositionError.js",
        "id": "org.apache.cordova.geolocation.PositionError",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/Position.js",
        "id": "org.apache.cordova.geolocation.Position",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.geolocation/www/geolocation.js",
        "id": "org.apache.cordova.geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/gamecenter/www/gamecenter.js",
        "id": "gamecenter.GameCenter",
        "clobbers": [
            "gamecenter"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.balanced/www/balanced.js",
        "id": "org.apache.cordova.balanced.balanced",
        "merges": [
            "navigator.balanced"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.stripe/www/stripe.js",
        "id": "org.apache.cordova.stripe.stripe",
        "merges": [
            "navigator.stripe"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.chariotsolutions.cordova.plugin.keyboard_toolbar_remover/www/keyboard_toolbar_remover.js",
        "id": "com.chariotsolutions.cordova.plugin.keyboard_toolbar_remover.KeyboardToolbarRemover",
        "clobbers": [
            "toolbar"
        ]
    },
    {
        "file": "plugins/com.flt.hockeyapp/www/hockeyapp.js",
        "id": "com.flt.hockeyapp.HockeyAppPlugin",
        "merges": [
            "navigator.hockeyapp"
        ]
    },
    {
        "file": "plugins/com.ankamagames.plugins.sysinfo/www/Sysinfo.js",
        "id": "com.ankamagames.plugins.sysinfo.Sysinfo",
        "merges": [
            "navigator.Sysinfo"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.dialogs": "0.2.3",
    "org.apache.cordova.geolocation": "0.3.3",
    "org.apache.cordova.network-information": "0.2.4",
    "org.apache.cordova.splashscreen": "0.2.4",
    "org.apache.cordova.vibration": "0.3.4",
    "org.apache.cordova.inappbrowser": "0.2.4",
    "gamecenter": "0.2.0",
    "com.phonegap.plugins.facebookconnect": "0.4.0",
    "org.apache.cordova.balanced": "0.1.0",
    "org.apache.cordova.stripe": "0.1.0",
    "org.apache.cordova.device": "0.2.8",
    "com.chariotsolutions.cordova.plugin.keyboard_toolbar_remover": "0.0.2",
    "com.ankamagames.plugins.sysinfo": "0.0.2"
}
// BOTTOM OF METADATA
});