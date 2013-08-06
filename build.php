#!/usr/bin/env php
<?php

/**
 * Downloads the latest assets from beta build
 * 
 * requires php, wget, gunzip
 *
 */


$server = 'http://beta.crunchr.co/';
$path = './platforms/ios/www/';

$bundles = array(
	'assets/js/bundle.js' => 'js/bundle.js',
	'assets/css/bundle.css' => 'css/bundle.css',
);

echo "Building bundles...\n";

foreach ($bundles as $src => $dst) {
	shell_exec('wget -O - --header="Accept-Encoding: gzip" "'.$server.$src.'" | gunzip > "'.$path.$dst.'"');
}

echo "Building views...\n";

$views = json_decode(file_get_contents($server.'api/views'));

foreach ($views as $file) {
	$v = file_get_contents($server.'view/'.$file.'.html');
	file_put_contents($path.'view/'.$file.'.html', $v);
}

echo "Building body...\n";

$index = file_get_contents($path.'view/template.html');
$body = file_get_contents($server.'view/body.html');
$index = str_replace('<body></body>', '<body>'.$body.'</body>', $index);

file_put_contents($path.'index.html', $index);

echo "Build complete!\n\n";