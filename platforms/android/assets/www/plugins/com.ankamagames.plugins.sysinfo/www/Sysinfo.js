cordova.define("com.ankamagames.plugins.sysinfo.Sysinfo", function(require, exports, module) {var exec = require('cordova/exec');
  module.exports = {
      getInfo: function( success ) {
          exec( success, function(){ console.log( 'Sysinfo.error' ) }, 'Sysinfo', 'getInfo', [] );
      },
  };
} );