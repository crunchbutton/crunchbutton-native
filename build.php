#!/usr/bin/env php
<?php

/**
 * Downloads the latest assets from beta build
 * 
 * requires php, wget, gunzip
 *
 */


$server = 'http://beta.crunchr.co/';
$server = 'http://crunchbutton.localhost/';
$srcPath = './www/';
$path = './platforms/ios/www/';

echo "Cleaning assets...\n";
shell_exec('rm -Rf '.$path.'assets');

echo "Creating directories...\n";
shell_exec('cp -R '.$srcPath.'assets '.$path.'assets');


echo "Downloading assets bundle...\n";

$assets = json_decode(file_get_contents($server.'api/build'));
foreach ($assets as $asset) {
	$type = explode('/',$asset);
	$type = $type[0];
	
	switch ($type) {
		case 'view':
			shell_exec('wget -O - "'.$server.$asset.'" > "'.$path.$asset.'"');
			break;
		case 'audio':
		case 'images':
			shell_exec('wget -O - "'.$server.'assets/'.$asset.'" > "'.$path.'assets/'.$asset.'"');
			break;
		case 'js':
		case 'css':
			shell_exec('wget -O - --header="Accept-Encoding: gzip" "'.$server.'assets/'.$asset.'" | gunzip > "'.$path.'assets/'.$asset.'"');
			break;
	}
}

exit;


echo "Building body...\n";

$index = file_get_contents($path.'view/template.html');
$body = file_get_contents($server.'view/body.html');
$index = str_replace('<body></body>', '<body>'.$body.'</body>', $index);

file_put_contents($path.'index.html', $index);

echo "Build complete!\n\n";