# Crunchbutton Native

Crunchbutton native was originally created in early 2012 using a pretty old version of PhoneGap, and has since been converted to a recent version of Cordova. Many of its features were created long before Ionic was released. It uses Ionic only for resource generation. Much of its code could be simplified using now existing Ionic or ngCordova libraries.

There are Crunchbutton versions in both iOS and Android stores.

This repository is mostly for educational purposes. Though the complete source of this app works just fine!

---

## Install

```sh
npm install -g cordova ionic
cordova platform add ios
cordova platform add android
ionic resources
```

---

## Build

In order to build that app, we need to build against specific version of web so that it can download all the necessary assets. The **build.php** contains all the information and paths about that you will need. The build target is used to download code and assets, and bundle them with the app. This way there is no need to have any external http requests other than our rest.

```sh
./build.php dev
```
or
```sh
./build.php live
```

---

## Release
For iOS, use xcode for your releases. For Android, you can use the **release_android.sh** script. You will need to create an android keystore in the **cert** directory.

```sh
./release_android.sh
```

---

## Notes

Note that newer versions of Cordova require cocoapods installed. There is a pod required for the push plugin which will error out if you do not have cocoapods properly configured.