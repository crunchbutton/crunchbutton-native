#!/usr/bin/env php
<?php

$images = [
	'icons' => [
		'items' => [
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
			['size' => [152,152], 'name' => '152']
		],
		'path' => 'src/res/icon/ios/',
		'copyPath' => 'platforms/ios/Crunchbutton/Resources/icons',
		'prefix' => 'icon-',
		'scale' => function($size) {
			return $size[0] * .65;
		}
	],
	'backgrounds' => [],
	'backgrounds-retina' => []
];

foreach ($images as $type) {
	if (!$type['items']) {
		continue;
	}

	foreach ($type['items'] as $item) {
		exec ("convert -define jpeg: src/res/logo.png -thumbnail '".$type['scale']($item['size'])."x4000>' \
			-gravity center -crop ".$item['size'][0]."x".$item['size'][1]."+0+0\! \
			-background '#f98f5c' -flatten ".$type['path'].$type['prefix'].$item['name'].".png && \
			cp ".$type['path'].$type['prefix'].$item['name'].".png ".$type['copyPath']);
	}		
}
