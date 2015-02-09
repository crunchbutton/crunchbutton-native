#!/usr/bin/env sh

phonegap create crunchbutton com.crunchbutton Crunchbutton
cd crunchbutton



phonegap plugin add https://github.com/apache/cordova-plugin-geolocation
phonegap plugin add https://github.com/apache/cordova-plugin-network-information
phonegap plugin add https://github.com/apache/cordova-plugin-media
phonegap plugin add https://github.com/apache/cordova-plugin-splashscreen
phonegap plugin add https://github.com/apache/cordova-plugin-vibration
phonegap plugin add https://github.com/apache/cordova-plugin-dialogs
phonegap plugin add https://github.com/apache/cordova-plugin-device
phonegap plugin add https://github.com/apache/cordova-plugin-inappbrowser
phonegap plugin add https://github.com/apache/cordova-plugin-statusbar
phonegap plugin add https://github.com/driftyco/ionic-plugins-keyboard

#phonegap plugin add https://github.com/Wizcorp/phonegap-facebook-plugin --variable APP_ID="***REMOVED***" --variable APP_NAME="Crunchbutton"

phonegap plugin add https://github.com/arzynik/PushPlugin
###phonegap plugin add https://github.com/phonegap-build/PushPlugin
phonegap plugin add https://github.com/bgta/net.bgta.phonegap.appversion
#phonegap plugin add https://github.com/crunchbutton/cordova-plugin-balanced

phonegap build ios
