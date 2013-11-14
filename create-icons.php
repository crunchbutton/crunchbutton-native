#!/usr/bin/env php
<?php

/**
 *
 * ios app icon and splash generator
 * built for phonegap, but will work for any app
 *
 * author: Devin Smith (http://devin.la)
 *
 */
 
 
$bgColor = '#f98f5c';
$icon = 'src/res/logo.png';

$images = [
	'icons' => [
		'itemsx' => [
			['size' => [29,29], 'name' => '29'],
			['size' => [40,40], 'name' => '40'],
			['size' => [50,50], 'name' => '50'],
			['size' => [57,57], 'name' => '57'],
			['size' => [114,114], 'name' => '57-2x'],
			['size' => [58,58], 'name' => '58'],
			['size' => [72,72], 'name' => '72'],
			['size' => [144,144], 'name' => '72-2x'],
			['size' => [76,76], 'name' => '76'],
			['size' => [80,80], 'name' => '80'],
			['size' => [100,100], 'name' => '100'],
			['size' => [120,120], 'name' => '120'],
			['size' => [152,152], 'name' => '152'],
			['size' => [1024,1024], 'name' => '1024']
		],
		'path' => 'src/res/icon/ios/',
		'copyPath' => 'platforms/ios/Crunchbutton/Resources/icons/', // secondary path if you are using phonegap with trailing
		'prefix' => 'icon-',
		'scale' => function($size) {
			return $size[0] * .65;
		}
	],
	'backgrounds' => [
		'items' => [
			['size' => [320,480], 'name' => 'Default', 'copyName' => 'Default~iphone'],
			['size' => [320,480], 'name' => 'screen-iphone-portrait', 'copyName' => 'Default~iphone'],  // for some reason phonegap needed 2 copies of this
			['size' => [480,320], 'name' => 'screen-iphone-landscape', 'copyName' => 'Default-Landscape~iphone'],
			['size' => [768,1024], 'name' => 'screen-ipad-portrait', 'copyName' => 'Default-Portrait~ipad'],
			['size' => [1024,768], 'name' => 'screen-ipad-landscape', 'copyName' => 'Default-Landscape~ipad'],
		],
		'path' => 'src/res/screen/ios/',
		'copyPath' => 'platforms/ios/Crunchbutton/Resources/splash/', // secondary path if you are using phonegap with trailing
		'scale' => function($size) {
			return (($size[0] + $size[1]) / 2) * .25;
		}
	],
	'backgrounds-retina' => [
		'items' => [
			['size' => [640,960], 'name' => 'screen-iphone-portrait-2x', 'copyName' => 'Default@2x~iphone'],
			['size' => [960,640], 'name' => 'screen-iphone-landscape-2x', 'copyName' => 'Default-Landscape@2x~iphone'],
			['size' => [639,1136], 'name' => 'screen-iphone-portrait-568h-2x', 'copyName' => 'Default-568h@2x~iphone'],
			['size' => [1536,2016], 'name' => 'screen-ipad-portrait-2x', 'copyName' => 'Default-Portrait@2x~ipad'],
			['size' => [2048,1536], 'name' => 'screen-ipad-landscape-2x', 'copyName' => 'Default-Landscape@2x~ipad']
		],
		'path' => 'src/res/screen/ios/',
		'copyPath' => 'platforms/ios/Crunchbutton/Resources/splash/', // secondary path if you are using phonegap with trailing
		'scale' => function($size) {
			return (($size[0] + $size[1]) / 2) * .2;
		}
	]
];

foreach ($images as $type) {
	if (!$type['items']) {
		continue;
	}

	foreach ($type['items'] as $item) {
		$cmd = "convert -define jpeg: '".$icon."' -thumbnail '".$type['scale']($item['size'])."x4000>' \
			-gravity center -crop ".$item['size'][0]."x".$item['size'][1]."+0+0\! \
			-background '".$bgColor."' -flatten ".$type['path'].$type['prefix'].$item['name'].".png";
		if ($type['copyPath']) {
			$cmd .= " && cp ".$type['path'].$type['prefix'].$item['name'].".png ".$type['copyPath']
				.($item['copyName'] ?
					$type['prefix'].$item['copyName'].".png" :
					$type['prefix'].$item['name'].".png");
		}
		exec ($cmd);
	}		
}
