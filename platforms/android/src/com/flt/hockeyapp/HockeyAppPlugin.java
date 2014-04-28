package com.flt.hockeyapp;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

import net.hockeyapp.android.CrashManager;
import net.hockeyapp.android.FeedbackManager;
import net.hockeyapp.android.UpdateManager;

/**
 * Plugin for interacting with the net.hockeyapp.android classes and services.
 * 
 * @author Lewis Westbury
 */
public class HockeyAppPlugin extends CordovaPlugin {
	private static String TAG = "HockeyAppPlugin";

	// configuration
	public static String APP_ID = null;
	public static boolean CHECK_CRASHES = false;
	public static boolean CHECK_UPDATES = false;

	/**
	 * Actions the HockeyAppPlugin can parse.
	 */
	public enum DefinedAction {
		init, // initializes HockeyApp with APP_ID, CHECK_CRASHES, CHECK_UPDATES
		getFeedback, // triggers the Feedback activity
	};

	/**
	 * Called from the javascript component of this plugin with an action.
	 */
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {

		Log.v(TAG, "Action received: " + action);

		try {
			DefinedAction definedAction = DefinedAction.valueOf(action);
			PluginResult result = null;

			switch (definedAction) {
			case init:
				result = init(args);
				break;

			case getFeedback:
				getFeedback();
				callbackContext.success();
				break;
			}

			result.setKeepCallback(false);
			callbackContext.sendPluginResult(result);
			return true;

		} catch (Exception e) {
			Log.e(TAG, "Exception during execution: " + e.getMessage());
			callbackContext.error(e.getMessage());
			return false;
		}
	}

	/**
	 * Initializes HockeyApp.
	 * <ul>
	 * <li>Retrieves the APP_ID for future actions.</li>
	 * <li>Checks for crashes and checks for updates as specified.</li>
	 * </ul>
	 * 
	 * @param args
	 *            a JSONArray of arguments: [ APP_ID, CHECK_CRASHES,
	 *            CHECK_UPDATES ]
	 * @throws JSONException
	 *             if the arguments could not be read
	 */
	private PluginResult init(JSONArray args) throws JSONException {
		APP_ID = args.getString(0);
		CHECK_CRASHES = args.getBoolean(1);
		CHECK_UPDATES = args.getBoolean(2);

		if (CHECK_CRASHES) {
			CrashManager.register(cordova.getActivity(), APP_ID);
		}
		if (CHECK_UPDATES) {
			UpdateManager.register(cordova.getActivity(), APP_ID);
		}

		return new PluginResult(PluginResult.Status.OK);
	}

	/**
	 * Opens the Feedback activity to allow HockeyApp users to offer feedback.
	 * 
	 * @throws UnsupportedOperationException
	 *             if the APP_ID is not initialized.
	 */
	private void getFeedback() throws UnsupportedOperationException {
		if (APP_ID == null) {
			throw new UnsupportedOperationException(
					"HockeyApp not yet initialised - unable to launch feedback.");
		}

		FeedbackManager.register(cordova.getActivity(), APP_ID);
		FeedbackManager.showFeedbackActivity(cordova.getActivity());
	}

}