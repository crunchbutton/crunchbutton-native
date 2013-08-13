cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.core.dialogs/www/notification.js",
        "id": "org.apache.cordova.core.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.core.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.vibration/www/vibration.js",
        "id": "org.apache.cordova.core.vibration.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.geolocation/www/Coordinates.js",
        "id": "org.apache.cordova.core.geolocation.Coordinates",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.geolocation/www/PositionError.js",
        "id": "org.apache.cordova.core.geolocation.PositionError",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.geolocation/www/Position.js",
        "id": "org.apache.cordova.core.geolocation.Position",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.core.geolocation/www/geolocation.js",
        "id": "org.apache.cordova.core.geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    }
]
});