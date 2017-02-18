#!/usr/bin/php
<?php
/**
 * This script just download and copy the stuff to the platform/android/assets folder
 * it does not run the cordova build
 *
 */

include 'config.php';

$weinre = false;
// weinre
$serverIP = '192.168.0.13';

$live = true;

$curpath = getcwd();
if (preg_match('/platforms\/android/',$curpath)) {
	$ap = '../../';
}
$server = 'http://seven.dev/';
$srcPath = $ap.'./www_source/';
$path = $ap.'./platforms/android/assets/www/';


// clean assets
echo "Cleaning assets...";
$cleanPaths = array(
	'~/Dev/crunch/app/cache/data/*',
	'~/Dev/crunch/app/cache/min/*',
	// '/Users/arzynik/Sites/crunchbutton/cache/data/*',
	// '/Users/arzynik/Sites/crunchbutton/cache/min/*',
	$path.'assets'
);
foreach ($cleanPaths as $p) {
	shell_exec('rm -Rf '.$p);
}
// delete all js that isnt the generated plugins file
shell_exec("rm -rf $(ls ".$path."*.js|grep -v 'cordova_plugins.js')");

echo "complete.\n";


// create and copy template dirs
echo "Creating directories...";
shell_exec('cp -R '.$srcPath.'assets '.$path.'assets && mv '.$path.'assets/js/* '.$path);
echo "complete.\n";

// delete unused/iphone files
echo "Deleting files...";
$_remove_js = [ 'cordova.js', 'phonegap.js' ];
foreach( $_remove_js as $js ){
	shell_exec("rm -rf $path/$js");
}
echo "complete.\n";

// rename files
echo "Renaming files...";
$_rename = [ [ 'from' => 'cordova.3.1.0-android.js', 'to' => 'cordova.js' ] ];
foreach( $_rename as $key => $value ){
	$from = $value[ 'from' ];
	$to = $value[ 'to' ];
	shell_exec("mv $path/$from $path/$to");
}
echo "complete.\n";

// download assets from server
echo "Downloading assets bundle...\n";

function download($file, $dst = null, $usegzip = false) {
	global $server, $path, $curpath;

	$parts = pathinfo($path.'assets/'.$file);
	$dstpath = $dst !== null ? $path.$dst.$parts['basename'] : $path.'assets/'.$file;

	echo '	'.$file.'... ';

	if (!file_exists($parts['dirname'])) {
		mkdir($parts['dirname'], 0755, true);
	}

	if ($usegzip) {
		shell_exec('/usr/local/bin/wget -q -O - --header="Accept-Encoding: gzip" "'.$server.'assets/'.$file.($live ? '?__live=1' : '').'" | gunzip > "'.$dstpath.'"');
	} else {
		shell_exec('/usr/local/bin/wget -q -O '.$dstpath.' "'.$server.'assets/'.$file.($live ? '?__live=1' : '').'"');
		// file_put_contents($path.'assets/'.$file, file_get_contents($server.$file));
	}
	echo "complete.\n";
}

$assets = json_decode(file_get_contents($server.'api/build'.($live ? '?__live=1' : '')));
$config = json_decode(file_get_contents($server.'api/build/config'.($live ? '?__live=1' : '')));

foreach ($assets as $asset) {
	$type = explode('/',$asset);
	$type = $type[0];

	switch ($type) {
		case 'view':
			$content .= '<script type="text/ng-template" id="assets/'.$asset.'">'.file_get_contents($server.'assets/'.$asset).'</script>';
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
$index = file_get_contents($path.'assets/view/template_android.html');
$body = file_get_contents($server.'assets/view/body.html'.($live ? '?__live=1' : ''));
$index = str_replace('<body></body>', '<body bgcolor="#fffef8" class="ios7 no-init">'.$body.'</body>', $index);
$index = str_replace('<templates></templates>', $content, $index);

if( $weinre ){
	$weinreURL = '<script src="http://' . $serverIP . ':8080/target/target-script-min.js#anonymous"></script>';
	$index = str_replace( '<!--weinre-->', $weinreURL, $index );
} else {
	$index = str_replace( '<!--weinre-->', '', $index );
}

file_put_contents($path.'index.html', $index);


// add facebook to index js
echo "Building index js...\n";
$index = file_get_contents($path.'index.js');
if( $live ){
	$index = str_replace('FACEBOOK_APP_IP', 'ID', $index);
} else {
	$index = str_replace('FACEBOOK_APP_IP', $config->facebook, $index);
}
$index = str_replace('IPHONE_NATIVE_VERSION',  IPHONE_NATIVE_VERSION, $index);
$index = str_replace('ANDROID_NATIVE_VERSION',  ANDROID_NATIVE_VERSION, $index);
$index = str_replace('APP_SERVER_URL', $live ? 'https://crunchbutton.com/' : 'http://beta.crunchr.co/', $index);
file_put_contents($path.'index.js', $index);

date_default_timezone_set( 'UTC' );

// yay
echo "\033[32m".($live ? 'LIVE' : 'BETA')." build complete! " . date( 'Y-m-d H:i:s' ) . " (UTC) \033[37m
";