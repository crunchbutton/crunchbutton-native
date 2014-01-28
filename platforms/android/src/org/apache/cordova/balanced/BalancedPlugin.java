package org.apache.cordova.balanced;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.util.Log;

import com.balancedpayments.android.Balanced;
import com.balancedpayments.android.Card;

public class BalancedPlugin extends CordovaPlugin {

	private String marketplaceURI = "/v1/marketplaces/TEST-MP87deQgmIr46omxRRF4KGO";
	
    public BalancedPlugin() {}

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if ("tokenizeCard".equals(action)) {
        	String card_number = args.getString(0);
        	String expiration_month = args.getString(1);
        	String expiration_year = args.getString(2);
        	String security_code = args.getString(3);
        	
        	Log.d("BalancedPlugin", card_number);
        	Log.d("BalancedPlugin", expiration_month);
        	Log.d("BalancedPlugin", expiration_year);
        	Log.d("BalancedPlugin", security_code);
        	
        	this.tokenizeCard(card_number, expiration_month, expiration_year, security_code, callbackContext);

            return true;
        }
        return false;
    }
    
    private void tokenizeCard(String card_number, String expiration_month, String expiration_year, String security_code, CallbackContext callbackContext) {
        if (card_number != null && card_number.length() > 0 &&
        		expiration_month != null && expiration_month.length() > 0 &&
        				expiration_year != null && expiration_year.length() > 0 ) {
        	String response = "";
            
            try {
            	
            	Balanced balanced = new Balanced(marketplaceURI, getContext());
                Card card = new Card( card_number, Integer.parseInt(expiration_month), Integer.parseInt(expiration_year), security_code);
                Log.d("BalancedPlugin", card_number);
            	Log.d("BalancedPlugin", expiration_month);
            	Log.d("BalancedPlugin", expiration_year);
            	Log.d("BalancedPlugin", security_code);
            	response = balanced.tokenizeCard(card);
            	callbackContext.success( response );
            }
            catch (Exception e) {
            	callbackContext.error("Err 1");
            }

        } else {
        	callbackContext.error("Err 2");
        }
    }    
    
	private Context getContext() {
		return cordova.getActivity().getApplicationContext();
	}
}
