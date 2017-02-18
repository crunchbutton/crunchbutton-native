## Crunchbutton Native

Crunchbutton native was originally created using pretty old version of PhoneGap, and has since been converted to a recent version of Cordova. It uses Ionic only for resource generation.

There are versions of both iOS and Android stores.

---

#### Install

```bash
npm install -g cordova ionic
cordova platform add ios
cordova platform add android
ionic resources
```


#### Notes

Note that newer versions of Cordova require cocoapods installed. There is a pod required for the push plugin which will error out if you do not have cocoapods properly configured.