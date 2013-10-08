

#import "BalancedPlugin.h"
#import <Cordova/CDV.h>


@implementation BalancedPlugin

- (void) tokenizeCard:(CDVInvokedUrlCommand*)command
{
	NSString* balancedId = @"/v1/marketplaces/TEST-MP87deQgmIr46omxRRF4KGO";
	NSString* num = [command argumentAtIndex:0];
	NSString* expmonth = [command argumentAtIndex:1];
    NSString* expyear = [command argumentAtIndex:2];
    NSString* cvv = @"";

	BPCard *card = [[BPCard alloc] initWithNumber:num expirationMonth:expmonth.intValue expirationYear:expyear.intValue securityCode:cvv];
	Balanced *balanced = [[Balanced alloc] initWithMarketplaceURI:balancedId];
	
	[balanced tokenizeCard:card onSuccess:^(NSDictionary *responseParams) {
		// success
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:responseParams];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	} onError:^(NSError *error) {
		// failure
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

@end


