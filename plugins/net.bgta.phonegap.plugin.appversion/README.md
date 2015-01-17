Phonegap AppVersion Plugin
============================

PhoneGap 3 plugin to get Application Version.

Usage
=====

Add plugin to your project:

    cordova plugin add https://github.com/bgta/net.bgta.phonegap.appversion.git

Add the following to your config.xml to use version 1.0.0 of this plugin (recommended):

    <gap:plugin name="net.bgta.phonegap.plugins.appversion" version="1.0.0" />
	
You can also omit the version tag to always use the most recent version of this plugin. Note that this will result in your app being automatically updated with new versions of this plugin as they are released, and may result in unexpected behaviour.

You can install manually specifing an alternate URL:

    phonegap local plugin add https://github.com/bgta/net.bgta.phonegap.appversion.git

Get the Application Version:

    getAppVersion(function(version) {
        console.log('Native App Version: ' + version);
    });
