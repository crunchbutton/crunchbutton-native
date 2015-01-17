#import "AppVersion.h"
@implementation AppVersion

@synthesize callbackID;

-(void)getVersionNumber:(CDVInvokedUrlCommand*)command
{
    self.callbackID = command.callbackId;
    NSString * appVersionString = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
	
	[self successWithMessage: appVersionString toID: self.callbackID];    
}
-(void)successWithMessage:(NSString *)message toID:(NSString *)callbackID
{
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];

    [self writeJavascript:[commandResult toSuccessCallbackString:callbackID]];
}
@end
