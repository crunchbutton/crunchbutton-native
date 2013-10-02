

#import "VersionPlugin.h"
#import <Cordova/CDV.h>


@implementation VersionPlugin

- (void) version:(CDVInvokedUrlCommand*)command
{
    NSString* version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:version];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end


