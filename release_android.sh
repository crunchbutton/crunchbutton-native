#!/usr/bin/env sh
cordova build android --release
rm -f platforms/android/ant-build/Crunchbutton.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
-keystore cert/android/crunchbutton.keystore \
-storepass yummiest \
platforms/android/ant-build/CordovaApp-release-unsigned.apk \
crunchbutton
~/android/sdk/build-tools/19.1.0/zipalign -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk platforms/android/ant-build/Crunchbutton.apk
open platforms/android/ant-build/