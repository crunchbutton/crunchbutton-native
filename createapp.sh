#!/usr/bin/env sh

cordova create crunchbutton com.crunchbutton Crunchbutton
cd crunchbutton



cordova plugin add https://github.com/apache/cordova-plugin-geolocation
cordova plugin add https://github.com/apache/cordova-plugin-network-information
cordova plugin add https://github.com/apache/cordova-plugin-media
cordova plugin add https://github.com/apache/cordova-plugin-splashscreen
cordova plugin add https://github.com/apache/cordova-plugin-vibration
cordova plugin add https://github.com/apache/cordova-plugin-dialogs
cordova plugin add https://github.com/apache/cordova-plugin-device
cordova plugin add https://github.com/apache/cordova-plugin-inappbrowser
cordova plugin add https://github.com/apache/cordova-plugin-statusbar
cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard

#cordova plugin add https://github.com/Wizcorp/cordova-facebook-plugin --variable APP_ID="***REMOVED***" --variable APP_NAME="Crunchbutton"
cordova plugin add https://github.com/arzynik/cordova-plugin-applepay --variable STRIPE_PUBLISHABLE_KEY="***REMOVED***" --variable APPLE_PAY_MERCHANT="merchant.com.crunchbutton"
cordova plugin add https://github.com/jeduan/cordova-plugin-facebook4 --variable APP_ID="***REMOVED***" --variable APP_NAME="Crunchbutton"

#cordova plugin add https://github.com/arzynik/PushPlugin
###cordova plugin add https://github.com/cordova-build/PushPlugin
cordova plugin add https://github.com/cordova/cordova-plugin-push
cordova plugin add https://github.com/alignace/phonegap-appversion
#cordova plugin add https://github.com/crunchbutton/cordova-plugin-balanced
cordova plugin add https://github.com/ohh2ahh/AppAvailability
cordova plugin add https://github.com/EddyVerbruggen/cordova-plugin-ios-longpress-fix
cordova plugin add https://github.com/floatinghotpot/cordova-plugin-nativeaudio
cordova plugin add https://github.com/phonegap/phonegap-plugin-push

cordova build ios
