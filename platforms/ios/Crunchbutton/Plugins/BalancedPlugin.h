
#import "balanced/Balanced.h"

#import <Cordova/CDV.h>

@interface BalancedPlugin : CDVPlugin
- (void)tokenizeCard:(CDVInvokedUrlCommand*)command;

@end
