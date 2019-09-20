cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-android-permissions.Permissions",
      "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
      "pluginId": "cordova-plugin-android-permissions",
      "clobbers": [
        "cordova.plugins.permissions"
      ]
    },
    {
      "id": "cordova-plugin-audioinput.AudioInput",
      "file": "plugins/cordova-plugin-audioinput/www/audioInputCapture.js",
      "pluginId": "cordova-plugin-audioinput",
      "clobbers": [
        "audioinput"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-android-support-gradle-release": "2.1.0",
    "cordova-plugin-android-permissions": "1.0.0",
    "cordova-plugin-audioinput": "1.0.2",
    "cordova-plugin-browsersync": "0.1.7"
  };
});