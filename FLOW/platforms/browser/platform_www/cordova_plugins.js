cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-android-permissions/www/permissions-dummy.js",
        "id": "cordova-plugin-android-permissions.Permissions",
        "pluginId": "cordova-plugin-android-permissions",
        "clobbers": [
            "cordova.plugins.permissions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/src/browser/StatusBarProxy.js",
        "id": "cordova-plugin-statusbar.StatusBarProxy",
        "pluginId": "cordova-plugin-statusbar",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-facebook4/www/facebook-browser.js",
        "id": "cordova-plugin-facebook4.FacebookConnectPluginBrowser",
        "pluginId": "cordova-plugin-facebook4",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "pluginId": "cordova-plugin-inappbrowser",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "pluginId": "cordova-plugin-camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/src/browser/CameraProxy.js",
        "id": "cordova-plugin-camera.CameraProxy",
        "pluginId": "cordova-plugin-camera",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-k-imagecropper/www/imagecropper.js",
        "id": "cordova-plugin-k-imagecropper.imagecropper",
        "pluginId": "cordova-plugin-k-imagecropper",
        "clobbers": [
            "window.plugins.k.imagecropper"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-push/www/push.js",
        "id": "phonegap-plugin-push.PushNotification",
        "pluginId": "phonegap-plugin-push",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-push/www/browser/push.js",
        "id": "phonegap-plugin-push.BrowserPush",
        "pluginId": "phonegap-plugin-push",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-fullscreen/www/AndroidFullScreen.js",
        "id": "cordova-plugin-fullscreen.AndroidFullScreen",
        "pluginId": "cordova-plugin-fullscreen",
        "clobbers": [
            "AndroidFullScreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/src/browser/network.js",
        "id": "cordova-plugin-network-information.NetworkInfoProxy",
        "pluginId": "cordova-plugin-network-information",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-insomnia/www/Insomnia.js",
        "id": "cordova-plugin-insomnia.Insomnia",
        "pluginId": "cordova-plugin-insomnia",
        "clobbers": [
            "window.plugins.insomnia"
        ]
    },
    {
        "file": "plugins/cordova-plugin-insomnia/src/browser/Insomnia.js",
        "id": "cordova-plugin-insomnia.InsomniaProxy",
        "pluginId": "cordova-plugin-insomnia",
        "merges": [
            "window.plugins.insomnia"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
        "id": "cordova-plugin-file.DirectoryEntry",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
        "id": "cordova-plugin-file.DirectoryReader",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Entry.js",
        "id": "cordova-plugin-file.Entry",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/File.js",
        "id": "cordova-plugin-file.File",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileEntry.js",
        "id": "cordova-plugin-file.FileEntry",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileError.js",
        "id": "cordova-plugin-file.FileError",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileReader.js",
        "id": "cordova-plugin-file.FileReader",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileSystem.js",
        "id": "cordova-plugin-file.FileSystem",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
        "id": "cordova-plugin-file.FileUploadOptions",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
        "id": "cordova-plugin-file.FileUploadResult",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileWriter.js",
        "id": "cordova-plugin-file.FileWriter",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Flags.js",
        "id": "cordova-plugin-file.Flags",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
        "id": "cordova-plugin-file.LocalFileSystem",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Metadata.js",
        "id": "cordova-plugin-file.Metadata",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
        "id": "cordova-plugin-file.ProgressEvent",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystems.js",
        "id": "cordova-plugin-file.fileSystems",
        "pluginId": "cordova-plugin-file"
    },
    {
        "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
        "id": "cordova-plugin-file.requestFileSystem",
        "pluginId": "cordova-plugin-file",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
        "id": "cordova-plugin-file.isChrome",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/browser/Preparing.js",
        "id": "cordova-plugin-file.Preparing",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/src/browser/FileProxy.js",
        "id": "cordova-plugin-file.browserFileProxy",
        "pluginId": "cordova-plugin-file",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
        "id": "cordova-plugin-file.fileSystemPaths",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "cordova"
        ],
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/browser/FileSystem.js",
        "id": "cordova-plugin-file.firefoxFileSystem",
        "pluginId": "cordova-plugin-file",
        "merges": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-media/www/MediaError.js",
        "id": "cordova-plugin-media.MediaError",
        "pluginId": "cordova-plugin-media",
        "clobbers": [
            "window.MediaError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-media/www/Media.js",
        "id": "cordova-plugin-media.Media",
        "pluginId": "cordova-plugin-media",
        "clobbers": [
            "window.Media"
        ]
    },
    {
        "file": "plugins/cordova-plugin-media/www/browser/Media.js",
        "id": "cordova-plugin-media.BrowserMedia",
        "pluginId": "cordova-plugin-media",
        "clobbers": [
            "window.Media"
        ]
    },
    {
        "file": "plugins/cordova-plugin-audioinput/www/audioInputCapture.js",
        "id": "cordova-plugin-audioinput.AudioInput",
        "pluginId": "cordova-plugin-audioinput",
        "clobbers": [
            "audioinput"
        ]
    },
    {
        "file": "plugins/cordova-plugin-audioinput/src/browser/AudioInputCaptureProxy.js",
        "id": "cordova-plugin-audioinput.AudioInputCaptureProxy",
        "pluginId": "cordova-plugin-audioinput",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/src/browser/SplashScreenProxy.js",
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "pluginId": "cordova-plugin-splashscreen",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-firebase-crashlytics/www/browser/crashlytics.js",
        "id": "cordova-plugin-firebase-crashlytics.FirebaseCrashlytics",
        "pluginId": "cordova-plugin-firebase-crashlytics",
        "clobbers": [
            "FirebaseCrashlytics"
        ]
    },
    {
        "file": "plugins/cordova-plugin-firebase-analytics/www/FirebaseAnalytics.js",
        "id": "cordova-plugin-firebase-analytics.FirebaseAnalytics",
        "pluginId": "cordova-plugin-firebase-analytics",
        "merges": [
            "cordova.plugins.firebase.analytics"
        ]
    },
    {
        "file": "plugins/cordova-twitter3-connect-plugin/www/TwitterConnect.js",
        "id": "cordova-twitter3-connect-plugin.TwitterConnect",
        "pluginId": "cordova-twitter3-connect-plugin",
        "clobbers": [
            "TwitterConnect"
        ]
    },
    {
        "file": "plugins/cordova-plugin-googleplus/www/GooglePlus.js",
        "id": "cordova-plugin-googleplus.GooglePlus",
        "pluginId": "cordova-plugin-googleplus",
        "clobbers": [
            "window.plugins.googleplus"
        ]
    },
    {
        "file": "plugins/cordova-plugin-googleplus/src/browser/GooglePlusProxy.js",
        "id": "cordova-plugin-googleplus.GooglePlusProxy",
        "pluginId": "cordova-plugin-googleplus",
        "clobbers": [
            "GooglePlus"
        ]
    },
    {
        "file": "plugins/cordova-plugin-vibration/src/browser/Vibration.js",
        "id": "cordova-plugin-vibration.Vibration",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator"
        ]
    },
    {
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "id": "cordova-plugin-vibration.notification",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator"]},
            {
        "file": "plugins/com.rjfun.cordova.httpd/www/CorHttpd.js",
        "id": "com.rjfun.cordova.httpd.CorHttpd",
        "pluginId": "com.rjfun.cordova.httpd",
        "clobbers": [
            "cordova.plugins.CorHttpd"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-android-permissions": "1.0.0",
    "cordova-plugin-browsersync": "0.1.7",
    "cordova-plugin-statusbar": "2.4.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova.plugins.diagnostic": "4.0.11",
    "cordova-plugin-facebook4": "4.2.1",
    "cordova-plugin-inappbrowser": "3.0.0",
    "cordova-plugin-camera": "4.0.3",
    "cordova-plugin-k-imagecropper": "1.2.0",
    "cordova-android-support-gradle-release": "2.1.0",
    "cordova-support-google-services": "1.3.1",
    "phonegap-plugin-multidex": "1.0.0",
    "phonegap-plugin-push": "2.2.3",
    "cordova-plugin-fullscreen": "1.1.0",
    "cordova-plugin-network-information": "2.0.1",
    "cordova-plugin-insomnia": "4.3.0",
    "cordova-plugin-file": "6.0.2",
    "cordova-plugin-media": "5.0.3",
    "cordova-plugin-audioinput": "1.0.2",
    "cordova-plugin-compat": "1.2.0",
    "cordova-plugin-splashscreen": "4.0.0",
    "cordova-plugin-firebase-crashlytics": "0.0.6",
    "cordova-support-android-plugin": "1.0.1",
    "cordova-plugin-firebase-analytics": "2.0.4",
    "cordova-twitter3-connect-plugin": "1.0.5",
    "cordova-plugin-googleplus": "8.1.1",
    "cordova-plugin-vibration": "3.1.1",
    "com.rjfun.cordova.httpd": "0.9.2"
}
// BOTTOM OF METADATA
});