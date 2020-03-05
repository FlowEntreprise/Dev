cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-httpd.CorHttpd",
      "file": "plugins/cordova-plugin-httpd/www/CorHttpd.js",
      "pluginId": "cordova-plugin-httpd",
      "clobbers": [
        "cordova.plugins.CorHttpd"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-httpd": "0.9.3"
  };
});