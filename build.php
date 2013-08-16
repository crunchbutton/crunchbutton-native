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
$srcPath = './src/';
//$path = './www/';
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
// delete all js that isnt the generated plugins file
shell_exec("rm -rf $(ls ".$path."*.js|grep -v 'cordova_plugins.js')");


echo "complete.\n";


// create and copy template dirs
echo "Creating directories";
shell_exec('cp -R '.$srcPath.'assets '.$path.'assets && mv '.$path.'assets/js/* '.$path);
echo "complete.\n";


// download assets from server
echo "Downloading assets bundle...\n";

function download($file, $dst = null, $usegzip = false) {
	global $server, $path;
	
	echo '	'.$file.'... ';
	$parts = pathinfo($path.'assets/'.$file);
	$dstpath = $dst !== null ? $path.$dst.$parts['basename'] : $path.'assets/'.$file;

	if (!file_exists($parts['dirname'])) {
		mkdir($parts['dirname'], 0755, true);
	}

	if ($usegzip) {
		shell_exec('wget -q -O - --header="Accept-Encoding: gzip" "'.$server.'assets/'.$file.'" | gunzip > "'.$dstpath.'"');
	} else {
		shell_exec('wget -q -O '.$dstpath.' "'.$server.'assets/'.$file.'"');
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
			$content .= '<script type="text/ng-template" id="assets/'.$asset.'">'.file_get_contents($server.$asset).'</script>';
			break;

		case 'audio':
		case 'images':
		case 'fonts':
			download($asset);
			break;

		case 'js':
			download($asset, '', true);
			break;

		case 'css':
			download($asset, null, true);
			break;
	}
}

echo "Asset download complete.\n";


// create the index file
echo "Building body...\n";

$index = file_get_contents($path.'assets/view/template.html');
$body = file_get_contents($server.'view/body.html');
$index = str_replace('<body></body>', '<body>'.$body.'</body>', $index);
$index = str_replace('<templates></templates>', $content, $index);

file_put_contents($path.'index.html', $index);


// yay
echo "\033[32mBuild complete!\033[37m
";
