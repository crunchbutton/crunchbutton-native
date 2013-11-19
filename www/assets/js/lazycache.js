/**
 * LazyCache
 * 
 * Javascript Local Image Cache Library for PhoneGap and Cordova.
 * Attempts to load images from cache first. If the image doesnt
 * exist in cache, loads from url into cache, and updates the elements
 * src. Prevents preloading of images to avoid excess HTTP requests.
 *
 * By Devin Smith (devin.la)
 * https://github.com/arzynik/lazycache.js
 *
 *
 * Inspired by Christophe BENOIT's ImgCache
 * https://github.com/chrisben/imgcache.js
 * Thanks Chris!
 *
 * tiny-_SHA1
 * MIT License
 * http://code.google.com/p/tiny-_SHA1/
 * 
 */


var LazyCache = {
	// options to override before using the library (but after loading this script!)
	options: {
		debug: false,						/* write log (to console)? */
		localCacheFolder: 'LazyCache',		/* name of the cache folder */
		useDataURI: false,					/* true: src="data:..". false: src="filesystem:..". slow on larger images on mobile */
		chromeQuota: 10*1024*1024,			/* allocated cache space : here 10Mb */
		usePersistentCache: true,			/* false: use temporary cache storage */
		/* customLogger */					/* if function defined, will use this one to log events */
		sourceAttr: 'data-image-src',
		storeComplete: null
	},
	version: '0.6.0'
};

(function($) {

	/**
	 * PRIVATE METHODS
	 */


	/**
	 * parse url pieces
	 */
	var _URI = function(str) {
	    if (!str) str = "";
	    // Based on the regex in RFC2396 Appendix B.
	    var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
	    var result = str.match(parser);
	    this.scheme    = result[1] || null;
	    this.authority = result[2] || null;
	    this.path      = result[3] || null;
	    this.query     = result[4] || null;
	    this.fragment  = result[5] || null;
	};


	/**
	 * detect cordova / phonegap
	 */
	var _is_cordova = function() {
		return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
	};


	/**
	 * custom logger. level: 1=INFO, 2=WARNING, 3=ERROR
	 */ 
	var _logging = function(str, level) {
		if (LazyCache.options.debug) {
			if (LazyCache.options.customLogger)
				LazyCache.options.customLogger(str, level);
			else {
				if (level == 1) str = 'INFO: ' + str;
				if (level == 2) str = 'WARN: ' + str;
				if (level == 3) str = 'ERROR: ' + str;
				console.log(str);
			}
		}
	};


	/**
	 * returns lower cased filename from full URI
	 */
	var _URIGetFileName = function(fullpath) {
		if (!fullpath)
			return;
		//TODO: there must be a better way here.. (url encoded strings fail)
		var idx = fullpath.lastIndexOf("/");
		if (!idx)
			return;
		return fullpath.substr(idx + 1).toLowerCase();
	};


	/**
	 * @UNUSED: returns lower cased path from full URI
	 */
	var _URIGetPath = function(str) {
		if (!str)
			return;
		var uri = _URI(str);
		return uri.path.toLowerCase();
	};


	/**
	 * returns extension from filename (without leading '.')
	 */
	var _FileGetExtension = function(filename) {
		if (!filename)
			return '';
		filename = filename.split('?')[0];
		var ext = filename.split('.').pop();
		// make sure it's a realistic file extension - for images no more than 4 characters long (.jpeg)
		if (!ext || ext.length > 4)
			return '';
		return ext;
	};


	/**
	 * tinysha
	 */
	var _SHA1 = function(s){function U(a,b,c){while(0<c--)a.push(b)}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i++){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j++){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))))}


	/**
	 * if no local_root set, set relative path
	 */
	var _getCachedFilePath = function(img_src, local_root) {
		var hash= _SHA1(img_src);
		var ext = _FileGetExtension(_URIGetFileName(img_src));
		var filename = hash + (ext ? ('.' + ext) : '');
		return (local_root ? local_root + '/' : '') + filename;
	};


	/**
	 * create cache directory
	 */
	var _createCacheDir = function(callback) {
		if (!LazyCache.filesystem)
			return;

		var _fail = function(error) {
			_logging('Failed to get/create local cache directory: ' + error.code, 3);
		};
		var _getDirSuccess = function(dirEntry) {
			LazyCache.dirEntry = dirEntry;
			_logging('Local cache folder opened: ' + dirEntry.fullPath, 1);
			if (callback) callback();
		};
		LazyCache.filesystem.root.getDirectory(LazyCache.options.localCacheFolder, {create: true, exclusive: false}, _getDirSuccess, _fail);	
	};


	/**
	 * wrap phonegap and chromes filetransfer object
	 */
	var _FileTransferWrapper = function(filesystem) {
		if (_is_cordova()) {
			this.fileTransfer = new FileTransfer();
		}
		this.filesystem = filesystem;
	};
	_FileTransferWrapper.prototype.download = function(uri, localPath, success_callback, error_callback) {
		// PHONEGAP
		if (this.fileTransfer) return this.fileTransfer.download(uri, localPath, success_callback, error_callback);

		var filesystem = this.filesystem;

		// CHROME - browsers
		var xhr = new XMLHttpRequest();
		xhr.open('GET', uri, true);
		xhr.responseType = 'blob';
		xhr.onload = function(event){
			if (xhr.response && (xhr.status == 200 || xhr.status == 0)) {
				filesystem.root.getFile(localPath, { create:true }, function(fileEntry) {
					fileEntry.createWriter(function(writer){

						writer.onerror = error_callback;
						writer.onwriteend = function() { success_callback(fileEntry);  };
						writer.write(xhr.response, error_callback);

					}, error_callback);
				}, error_callback);
			} else {
				//TODO: error_callback(error)
				_logging('Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3);
			}
		};
		xhr.onerror = function() {
			_logging('XHR error - Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3);
		};
		xhr.send();
	};


	/**
	 * toURL for html5, toURI for cordova...
	 */
	var _getFileEntryURL = function(entry) {
		return entry.toURL ? entry.toURL() : entry.toURI();
	}


	/**
	 * get the image source
	 */
	LazyCache._getSrc = function() {
		var src = false;
		var el = (arguments[0] && arguments[0].el) || this;

		if (arguments[0] && arguments[0].attr) {
			// use the provided attr
			src = $(el).attr(arguments[0].attr);

		} else if ($(el).attr(LazyCache.options.sourceAttr)) {
			// try using default attr
			src = $(el).attr(LazyCache.options.sourceAttr);

		} else if (el.tagName == 'IMAGE') {
			// use src
			src = $(el).attr('src');

		} else {
			// assume its a background image
			var regexp = /\((.+)\)/
			src = regexp.exec($(el).css('background-image'))[1];
		}

		return src;
	};


	/**
	 * set the image source
	 */
	LazyCache._setSrc = function(params) {
		var el = params.el || this;

		if (!params.src) {
			return el;
		}

		if (el.tagName == 'IMAGE') {
			// set src
			$(el).attr('src', params.src);

		} else {
			// set its a background image
			$(el).css('background-image', 'url(' + params.src + ')');
			if (params.css) {
				$(el).css(params.css);
			}
		}

		return el;
	};
	

	/**
	 * make sure we have our setup
	 */
	LazyCache._sanityCheck = function() {
		if (!LazyCache.filesystem || !LazyCache.dirEntry) {
			return false;
		} else {
			return true;
		}
	};


	/**
	 * check the cache for a file and return it
	 */
	LazyCache._checkCache = function(src, success, fail) {
	
		var filename = _URIGetFileName(src);
		var path = _getCachedFilePath(src, LazyCache.dirEntry.fullPath);

		// android specific pathing
		if (_is_cordova() && device.platform && device.platform.indexOf('Android') == 0 && path.indexOf('file://') == 0) {
			path = path.substr(7);
		}

		// try to get the file entry: if it fails, there's no such file in the cache
		LazyCache.filesystem.root.getFile(path, { create: false }, function(res) {
			success(res, path);
		}, function(res) {
			fail(res, path);
		});
	};



	/**
	 * PUBLIC METHODS
	 */

	/**
	 * open local filesystem for reading and writing
	 */
	LazyCache.init = function() {
		if (typeof arguments[0] == 'object') {
			var options = arguments[0];
			LazyCache.options = $.extend(LazyCache.options, options);
			var index = 1;
		} else {
			var index = 0;
		}

		var
			success_callback = arguments[index],
			error_callback = arguments[index+1]

		LazyCache.init_callback = success_callback;

		var _gotFS = function(filesystem) {
			_logging('LocalFileSystem opened', 1);

			// store filesystem handle
			LazyCache.filesystem = filesystem;

			_createCacheDir(LazyCache.init_callback);
		};
		var _fail = function(error) {
			_logging('Failed to initialise LocalFileSystem ' + error.code, 3);
			if (error_callback) error_callback();
		};
		if (_is_cordova()) {
			// PHONEGAP
			var persistence = (LazyCache.options.usePersistentCache ? LocalFileSystem.PERSISTENT : LocalFileSystem.TEMPORARY);
			window.requestFileSystem(persistence, 0, _gotFS, _fail);
		} else {
			//CHROME
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
			window.storageInfo = window.storageInfo || window.webkitStorageInfo;
			if (!window.storageInfo) {
				_logging('Your browser does not support the html5 File API', 2);
				if (error_callback) error_callback();
				return;
			}
			// request space for storage
			var quota_size = LazyCache.options.chromeQuota;
			var persistence = (LazyCache.options.usePersistentCache ? window.storageInfo.PERSISTENT : window.storageInfo.TEMPORARY);
			window.storageInfo.requestQuota(
				persistence, 
				quota_size,
				function() { /* success*/ window.requestFileSystem(persistence, quota_size, _gotFS, _fail);  },
				function(error) { /* error*/ _logging('Failed to request quota: ' + error.code, 3); if (error_callback) error_callback(); }
			);
		}
	};


	/**
	 * set the image source or background of a provided item
	 */
	LazyCache.set = function(params) {
		var el = params.el || this;

		params._success = params.success || null;

		params.success = function(src) {
			LazyCache._setSrc.call(el, {
				src: src,
				css: params.css
			});
			if (typeof params._success === 'function') {
				params._success.call(el, src);
			}
		};
		LazyCache.get.call(el, params);
	};


	/**
	 * get the new image source value for a resource
	 */
	LazyCache.get = function(params) {
		var el = params.el || this;
		var src = params.src || LazyCache._getSrc.call(el, params || null);
		var lazy = params.lazy == 'undefined' ? true : params.lazy;
		
		var useEntry = function(entry) {
			if (LazyCache.options.useDataURI) {
				// use URI

				var _success = function(file) {
					var reader = new FileReader();
					reader.onloadend = function(e) {
						var base64content = e.target.result;

						if (!base64content) {

							_logging('File in cache ' + src + ' is empty', 2);
							if (typeof params.fail === 'function') {
								params.fail.call(el, src);
							}

						} else {

							_logging('File ' + src + ' loaded from cache', 1);
							if (typeof params.success === 'function') {
								params.success.call(el, base64content);
							}						
						}

					};
					reader.readAsDataURL(file);
				};

				var _fail = function(error) {
					_logging('Failed to read file ' + error.code, 3);
					if (fail_callback) fail_callback($img);
				};

				entry.file(_success, _fail);

			} else {
				// use filesystem link

				var new_url = _getFileEntryURL(entry);
				_logging('File ' + src + ' loaded from cache', 1);
				_logging('Cache File ' + new_url + ' loaded from cache', 1);


				// if it is cached, only show the cached value
				if (typeof params.success === 'function') {
					params.success.call(el, new_url);
				}

			}
		};

		var success = function(entry) {
			useEntry(entry);
		};

		// if file does not exist in cache, cache it now!
		var fail = function(e) {
			_logging('File ' + src + ' not in cache', 1);

			// if its not cached, download the image, and still use the cached value
			var _success = function(entry, path) {
				console.log('SUCCESS CACHING', src, path);
				useEntry(entry);
			};
			
			var _fail = function(error) {
				console.log('FAILED CACHING', src, error);
				if (typeof params.fail === 'function') {
					params.fail.call(el, src);
				}
			};
			LazyCache.cacheFile(src, _success, _fail);

		};

		LazyCache._checkCache(src, success, fail);

	};


	/**
	 *  write / overwrite image into local cache
	 */
	LazyCache.cacheFile = function(img_src, success_callback, fail_callback) {

		if (!LazyCache._sanityCheck() || !img_src)
			return;

		var filePath = _getCachedFilePath(img_src, LazyCache.dirEntry.fullPath);

		var fileTransfer = new _FileTransferWrapper(LazyCache.filesystem);
		fileTransfer.download(
			img_src,
			filePath,
			function(entry) {
				_logging('Download complete: ' + entry.fullPath, 1);

				// iOS: the file should not be backed up in iCloud
				// cordova 1.8+
				if (entry.setMetadata) {
					entry.setMetadata(
						function() {
							/* success*/
							_logging('com.apple.MobileBackup metadata set', 1);
						},
						function() {
							/* failure */
							_logging('com.apple.MobileBackup metadata could not be set', 2);
						},
						{ 'com.apple.MobileBackup': 1 } // 1=NO backup oddly enough..
					);
				}
				if (typeof storeComplete === 'function') {
					storeComplete.call(this, entry, img_src, filePath, LazyCache.dirEntry.fullPath);
				}
				if (success_callback) success_callback(entry, filePath);
			},
			function(error) {
				if (error.source) _logging('Download error source: ' + error.source, 3);
				if (error.target) _logging('Download error target: ' + error.target, 3);
				_logging('Download error code: ' + error.code, 3);
				if (fail_callback) fail_callback(error);
			}
		);
	};


	/**
	 * checks if a copy of the file has already been cached
	 */
	LazyCache.isCached = function(src, complete) {
		if (!LazyCache._sanityCheck()) {
			return;
		}

		LazyCache._checkCache(src, function(res, path) {
			complete(true, path);
		}, function() {
			complete(false, path);
		});

		var ret = function(exists) {
			complete(exists, path);
		};
	};


	/**
	 * force an update from the server
	 */
	LazyCache.update = function() {
		var el = params.el || this;

	};


	/**
	 * clears the cache
	 */
	LazyCache.clear = function(success_callback, error_callback) {
		if (!LazyCache.filesystem || !LazyCache.dirEntry) {
			_logging('LazyCache not loaded yet!', 2);
			return;
		}

		// delete cache dir completely
		LazyCache.dirEntry.removeRecursively(
			function(parent) {
				_logging('Local cache cleared', 1);
				// recreate the cache dir now
				_createCacheDir(success_callback);
			},
			function(error) { 
				_logging('Failed to remove directory or its contents: ' + error.code, 3);
				if (error_callback) error_callback();
			}
		);
	};


	LazyCache._cached = [];


})(window.jQuery || window.Zepto);


// jquery plugin
if (window.jQuery) {
	(function($){
		$.fn.LazyCache = function(params) {
			this.each(function() {
				LazyCache.set.call(this, params);
			});
			return this;
		};
	})(jQuery);
}