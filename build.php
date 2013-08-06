#!/usr/bin/env php
<?php

/**
 * Download and build local assets for phonegap
 * 
 * requires php, wget, gunzip
 *
 */


$server = 'http://beta.crunchr.co/';
$server = 'http://crunchbutton.localhost/';
$srcPath = './www/';
$path = './platforms/ios/www/';


// clean assets
echo "Cleaning assets...";
$cleanPaths = array(
	'/Users/arzynik/Sites/crunchbutton/cache/data/*',
	'/Users/arzynik/Sites/crunchbutton/cache/min/*',
	$path.'assets'
);
foreach ($cleanPaths as $p) {
	shell_exec('rm -Rf '.$p);
}
echo "complete.\n";


// create and copy template dirs
echo "Creating directories";
shell_exec('cp -R '.$srcPath.'assets '.$path.'assets');
echo "complete.\n";


// download assets from server
echo "Downloading assets bundle...\n";

function download($file, $usegzip = false) {
	global $server, $path;
	
	echo '	'.$file.'... ';
	$dir = $path.'assets/'.dirname($file);

	if (!file_exists($dir)) {
		mkdir($dir, 0755, true);
	}

	if ($usegzip) {
		shell_exec('wget -q -O - --header="Accept-Encoding: gzip" "'.$server.'assets/'.$file.'" | gunzip > "'.$path.'assets/'.$file.'"');
	} else {
		shell_exec('wget -q -O '.$path.'assets/'.$file.' "'.$server.'assets/'.$file.'"');
		// file_put_contents($path.'assets/'.$file, file_get_contents($server.$file));
	}
	echo "complete.\n";
}

$assets = json_decode(file_get_contents($server.'api/build'));
foreach ($assets as $asset) {
	$type = explode('/',$asset);
	$type = $type[0];
	
	switch ($type) {
		case 'view':
		case 'audio':
		case 'images':
			download($asset);
			break;

		case 'js':
		case 'css':
			download($asset, true);
			break;
	}
}

echo "Asset download complete.\n";


// fix root image paths for local files
echo "Fixing root paths...";
//shell_exec('for i in $(grep "assets" '.$path.'assets/css/* -R | cut -d ":" -f 1); do sed "s/assets/assets/gi" -i $i;');
echo " complete\n";

exit;


// create the index file
echo "Building body...\n";

$index = file_get_contents($path.'view/template.html');
$body = file_get_contents($server.'view/body.html');
$index = str_replace('<body></body>', '<body>'.$body.'</body>', $index);

file_put_contents($path.'index.html', $index);


// yay
echo "Build complete!\n\n";

