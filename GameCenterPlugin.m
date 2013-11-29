//
//  GameCenterPlugin.m
//  Detonate
//
//  Created by Marco Piccardo on 04/02/11.
//  Copyright 2011 Eurotraining Engineering. All rights reserved.
//

#import "GameCenterPlugin.h"
#import "Cordova/CDV.h"
#import "Cordova/CDVViewController.h"

@interface GameCenterPlugin ()
@property (nonatomic, retain) GKLeaderboardViewController *leaderboardController;
@property (nonatomic, retain) GKAchievementViewController *achievementsController;
@end

@implementation GameCenterPlugin

- (void)dealloc
{
    self.leaderboardController = nil;
    self.achievementsController = nil;
    
//    [super dealloc];
}

- (void)authenticateLocalPlayer:(CDVInvokedUrlCommand*)command
{
    // __weak to avoid retain cycle
    __weak GKLocalPlayer *localPlayer = [GKLocalPlayer localPlayer];
    
    localPlayer.authenticateHandler = ^(UIViewController *viewController, NSError *error) {
        CDVPluginResult* pluginResult = nil;
        if (viewController != nil)
        {
            // Login required
            [self.viewController presentViewController:viewController animated:YES completion:nil];
        }
        else
        {
            if (localPlayer.isAuthenticated)
            {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
            else if (error != nil)
            {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
            }
            else
            {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
            }
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    };
}

- (void)reportScore:(CDVInvokedUrlCommand*)command
{
    if (!!! [GKLocalPlayer localPlayer].authenticated ) {
        NSLog(@"GKLocalPlayer is not authenticated");
        return;
    }

    NSString *leaderboardId = (NSString*) [command.arguments objectAtIndex:0];
    int64_t score = [[command.arguments objectAtIndex:1] integerValue];
    
    __block CDVPluginResult* pluginResult = nil;
    
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0)
    {
        NSLog(@"ios7");
        
        GKScore *scoreSubmitter = [[GKScore alloc] initWithLeaderboardIdentifier: leaderboardId];
        scoreSubmitter.value = score;
        scoreSubmitter.context = 0;
        
        [GKScore reportScores:@[scoreSubmitter] withCompletionHandler:^(NSError *error) {
                    NSLog(@"response");
            if (error)
            {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
            }
            else {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }];
    }
    else
    {
        GKScore *scoreSubmitter = [[GKScore alloc] initWithCategory:leaderboardId];
        scoreSubmitter.value = score;
        
        [scoreSubmitter reportScoreWithCompletionHandler:^(NSError *error) {
            if (error)
            {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
            }
            else {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }];
    }
    [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    /*

    GKScore *scoreReporter = [[GKScore alloc] initWithCategory:category];
    scoreReporter.value = score;

    [scoreReporter reportScoreWithCompletionHandler:^(NSError *error) {
        if (!error)
        {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            [self writeJavascript: [pluginResult toSuccessCallbackString:command.callbackId]];
        } else {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
            [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
        }
    }];
     */
}

- (void)showLeaderboard:(CDVInvokedUrlCommand*)command
{
    if ( self.leaderboardController == nil ) {
        self.leaderboardController = [[GKLeaderboardViewController alloc] init];
        self.leaderboardController.leaderboardDelegate = self;
    }

    self.leaderboardController.category = (NSString*) [command.arguments objectAtIndex:0];
    CDVViewController* cont = (CDVViewController*)[super viewController];
    [cont presentViewController:self.leaderboardController animated:YES completion:^{
        [self.webView stringByEvaluatingJavaScriptFromString:@"window.gameCenter._viewDidShow()"];
    }];
}

- (void)showAchievements:(CDVInvokedUrlCommand*)command
{
    if ( self.achievementsController == nil ) {
        self.achievementsController = [[GKAchievementViewController alloc] init];
        self.achievementsController.achievementDelegate = self;
    }

    CDVViewController* cont = (CDVViewController*)[super viewController];
    [cont presentViewController:self.achievementsController animated:YES completion:^{
        [self.webView stringByEvaluatingJavaScriptFromString:@"window.gameCenter._viewDidShow()"];
    }];
}

- (void)leaderboardViewControllerDidFinish:(GKLeaderboardViewController *)viewController
{
    CDVViewController* cont = (CDVViewController*)[super viewController];
    [cont dismissModalViewControllerAnimated:YES];
    [self.webView stringByEvaluatingJavaScriptFromString:@"window.gameCenter._viewDidHide()"];
}

- (void)achievementViewControllerDidFinish:(GKAchievementViewController *)viewController
{
    CDVViewController* cont = (CDVViewController*)[super viewController];
    [cont dismissModalViewControllerAnimated:YES];
    [self.webView stringByEvaluatingJavaScriptFromString:@"window.gameCenter._viewDidHide()"];
}

- (void)reportAchievementIdentifier:(CDVInvokedUrlCommand*)command
{
    NSString *identifier = (NSString*) [command.arguments objectAtIndex:0];
    float percent = [[command.arguments objectAtIndex:1] floatValue];

    GKAchievement *achievement = [[GKAchievement alloc] initWithIdentifier: identifier];
    if (achievement)
    {
        achievement.percentComplete = percent;
        [achievement reportAchievementWithCompletionHandler:^(NSError *error) {
            if (!error)
            {
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                [self writeJavascript: [pluginResult toSuccessCallbackString:command.callbackId]];
            } else {
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
                [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
            }
        }];
    } else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Failed to alloc GKAchievement"];
        [self writeJavascript: [pluginResult toErrorCallbackString:command.callbackId]];
    }
}

@end
