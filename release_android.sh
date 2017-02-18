#!/usr/bin/env sh
cordova build android --release
rm -f platforms/android/build/outputs/apk/Crunchbutton.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
-keystore cert/android/crunchbutton.keystore \
-storepass yummiest \
platforms/android/build/outputs/apk/android-release-unsigned.apk \
crunchbutton
~/android/sdk/build-tools/19.1.0/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/Crunchbutton.apk
open platforms/android/build/outputs/apk/
