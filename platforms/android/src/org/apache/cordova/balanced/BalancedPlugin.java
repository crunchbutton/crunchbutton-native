package org.apache.cordova.balanced;

import java.util.Map;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

import com.balancedpayments.android.Balanced;
import com.balancedpayments.android.Card;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class BalancedPlugin extends CordovaPlugin {

	private static String TAG = "BalancedPlugin";
	//	beta	
//	private String marketplaceURI = "/1.1/marketplaces/TEST-MP6kDcB0F9VsdCGOwYMicIz";
	
	//	live
	private String marketplaceURI = "/1.1/marketplaces/MP2BldrjHz0NLH3st95JbeR0";
	
	public BalancedPlugin() {}

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    	Log.v(TAG, "execute: " + action);
        if ("tokenizeCard".equals(action)) {
        	String card_number = args.getString(0);
        	String expiration_month = args.getString(1);
        	String expiration_year = args.getString(2);
        	String security_code = args.getString(3);        	
        	this.tokenizeCard(card_number, expiration_month, expiration_year, security_code, callbackContext);
            return true;
        }
        return false;
    }
    
    private void tokenizeCard(String card_number, String expiration_month, String expiration_year, String security_code, CallbackContext callbackContext) {
    	Log.v(TAG, "execute: tokenizeCard");
        if (card_number != null && card_number.length() > 0 &&
         		expiration_month != null && expiration_month.length() > 0 &&
         				expiration_year != null && expiration_year.length() > 0 ) {
        	Map<String, Object> response = null;
            
         	Card card = new Card( card_number, Integer.parseInt(expiration_month), Integer.parseInt(expiration_year) );
         	if( card.isValid() ){
         		try {
         			Balanced balanced = new Balanced(cordova.getActivity().getApplicationContext());
         			response = balanced.createCard(card_number, Integer.parseInt(expiration_month), Integer.parseInt(expiration_year));
         			Log.v(TAG, "execute: tokenizeCard: " + response.toString());
         			int status = (Integer) response.get("status_code");
         			// Success
         			if( status == 201 ){
    		        	Map<String, Object> cardResponse = (Map<String, Object>) ((ArrayList)response.get("cards")).get(0);
    		        	StringBuilder json = new StringBuilder(100);
    		        	json.append("{\"id\":\"").append( (String) cardResponse.get("id") ).append( "\"," )
    		        		.append("\"uri\":\"").append( (String) cardResponse.get("href") ).append( "\"," )
    		        		.append("\"status_code\":\"201\"," )
    		                .append("\"last_four\":\"").append( (String) card_number.substring(12) ).append( "\"," )
    		                .append("\"card_type\":\"").append( card.getType().toString() ).append( "\"," )
    		                .append("\"month\":\"").append( expiration_month.toString() ).append( "\"," )
    		                .append("\"year\":\"").append( expiration_year.toString() ).append( "\"" )
    		                .append("}");
    		        	
    		        	Log.v(TAG, "execute: response: " + json.toString());
    	             	callbackContext.success( json.toString() );	
         			} else {
         				callbackContext.success( "{\"status_code\":\"666\"}" );
         			}
                 }
                 catch (Exception e) {
                	 Log.v(TAG, "Exceptions: " + e.getMessage());
                	 callbackContext.error( "{\"status_code\":\"409\"}" );
                 }

         	} else {
         		// Error 402 = Unable to authorize
         		callbackContext.error( "{\"status_code\":\"402\"}" );
         	}

         } else {
        	 // Error 400 = Missing fields
        	 callbackContext.error( "{\"status_code\":\"400\"}" );
         }
     }      

}
