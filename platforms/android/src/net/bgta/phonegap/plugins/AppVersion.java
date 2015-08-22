package net.bgta.phonegap.plugins;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.PackageManager;

public class AppVersion extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callback) {
        try {
            PackageManager packageManager = this.cordova.getActivity().getPackageManager();
            String version = packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0).versionName;
            callback.sendPluginResult(new PluginResult(PluginResult.Status.OK, version));
            return true;
        } catch (NameNotFoundException e) {
            callback.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, ""));
            return false;
        }
    }

}
