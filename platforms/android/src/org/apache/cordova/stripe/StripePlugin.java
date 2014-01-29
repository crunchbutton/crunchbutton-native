package org.apache.cordova.stripe;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.stripe.android.Stripe;
import com.stripe.android.TokenCallback;
import com.stripe.android.model.Card;
import com.stripe.android.model.Token;
import com.stripe.exception.AuthenticationException;

public class StripePlugin extends CordovaPlugin {

	private String stripe_key = "pk_0BKVfM5Xxd4RmvUjzUhQxeUpKUMZx";
	
    public StripePlugin() {}

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
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
    
    private void tokenizeCard(String card_number, String expiration_month, String expiration_year, String security_code, final CallbackContext callbackContext) {
        if (card_number != null && card_number.length() > 0 &&
         		expiration_month != null && expiration_month.length() > 0 &&
         				expiration_year != null && expiration_year.length() > 0 ) {

         	final Card card = new Card( card_number, Integer.valueOf(expiration_month), Integer.valueOf(expiration_year), security_code);
         	
         	if( card.validateNumber() ){
         		try {
					Stripe stripe = new Stripe( stripe_key );
					stripe.createToken(
						    card,
						    new TokenCallback() {
						        public void onSuccess(Token token) {
						        	StringBuilder response = new StringBuilder(100);
						        	response.append("{\"id\":\"").append( token.getId() ).append( "\"," )
						        			.append("\"card\":").append( "{" )
						        				.append("\"id\":\"").append( token.getId() ).append( "\"," )
						                  		.append("\"uri\":\"").append( token.getId() ).append( "\"," )
						                  		.append("\"last4\":\"").append( card.getLast4() ).append( "\"," )
						                  		.append("\"type\":\"").append( card.getType() ).append( "\"," )
						                  		.append("\"exp_month\":\"").append( card.getExpMonth() ).append( "\"," )
						                  		.append("\"exp_year\":\"").append( card.getExpYear() ).append( "\"" )
						                  	.append("}")
						                  .append("}");
					             	callbackContext.success( response.toString() );
						        }
						        public void onError(Exception error) {
						        	callbackContext.error("Token error");
						        }
						    }
						);
					
				} catch (AuthenticationException e) {
					callbackContext.error( "unknow_error" );
					e.printStackTrace();
				}
         	} else {
         		String error_code = "";
         		if( !card.validateNumber() ) {
         			error_code = "incorrect_number";
         		} else if ( card.validateExpMonth() ){
         			error_code = "invalid_expiry_month";
         		} else if ( card.validateExpYear() ){
         			error_code = "invalid_expiry_year";
         		} else if ( card.validateExpiryDate() ){
         			error_code = "expired_card";
         		} 
         		callbackContext.error( error_code );
         	}
         } else {
         	callbackContext.error( "unknow_error" );
         }
     }      

}
