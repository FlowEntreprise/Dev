var appState = {
    takingPicture: true,
    imageUri: "",
    needRestore: false,
    blob: null,
    blob64: "",
    patternKey: "",
    recordTime: 0,
    flow_title: "",
    flow_description: ""
};

var crashlytics;
var analytics;
var push;
var httpd = null;
var worker;

var registrationId;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);

    },
    onDeviceReady: function () {
        setTimeout(function () {
            navigator.splashscreen.hide();
            // StatusBar.backgroundColorByHexString("#f7f7f8");
        }, 500);

        this.receivedEvent('deviceready');
    },
    onPause: function () {

        console.log("pause");
        stopAllStoriesAudio();
        stopAllBlocksAudio();

        // if (appState.takingPicture || appState.imageUri) {
        //     window.localStorage.setItem("app_state", JSON.stringify(appState));
        //     console.log("app state saved");
        // }

    },
    onResume: function (event) {
        // console.log("resume");

        // var storedState = window.localStorage.getItem("app_state");

        // if (storedState) {
        //     appState = JSON.parse(storedState);
        // }

        // console.log(appState);
        // console.log(event);
        // console.log(event.pendingResult);

        // // Check to see if we need to restore an image we took
        // if (!appState.takingPicture && appState.imageUri) {
        //     console.log("restore picture...");
        //     console.log(appState.imageUri);

        //     //appState.imageUri = event.pendingResult.result;
        //     appState.needRestore = false;
        // }
        // // Now we can check if there is a plugin result in the event object.
        // // This requires cordova-android 5.1.0+
        // else if (appState.takingPicture && event.pendingResult) {
        //     console.log("status : " + event.pendingResult.pluginStatus);
        //     // Figure out whether or not the plugin call was successful and call
        //     // the relevant callback. For the camera plugin, "OK" means a
        //     // successful result and all other statuses mean error
        //     if (event.pendingResult.pluginStatus === "OK") {
        //         // The camera plugin places the same result in the resume object
        //         // as it passes to the success callback passed to getPicture(),
        //         // thus we can pass it to the same callback. Other plugins may
        //         // return something else. Consult the documentation for
        //         // whatever plugin you are using to learn how to interpret the
        //         // result field
        //         console.log("restoring picture");
        //         console.log(event.pendingResult.result);

        //         appState.imageUri = event.pendingResult.result;
        //         appState.needRestore = true;
        //     } else {
        //         console.log("restore picture fail");
        //         console.log(event.pendingResult.result);
        //         onFail(event.pendingResult.result);
        //     }
        // }
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        document.addEventListener("offline", function () {
            offline();
        }, false);
        document.addEventListener("online", function () {
            online();
        }, false);

        // On remet ça plus tard dans ios
        // crashlytics = FirebaseCrashlytics.initialise();
        // crashlytics.logException("my caught exception");

        // analytics = cordova.plugins.firebase.analytics;
        // analytics.setCurrentScreen(current_page);

        httpd = (cordova && cordova.plugins && cordova.plugins.CorHttpd) ? cordova.plugins.CorHttpd : null;

        httpd.startServer({
            'www_root': 'js/worker/',
            'port': 8080,
            'localhost_only': true
        }, function (url) {
            // if server is up, it will return the url of http://<server ip>:port/
            // the ip is the active network connection
            // if no wifi or no cell, "127.0.0.1" will be returned.
            console.log("server is started: " + url);
            // createWorker();
        }, function (error) {
            console.log("failed to start server: " + error);
        });

        cordova.plugins.backgroundMode.enable(); //To Enable

        var push = PushNotification.init({
            android: {}
        });

        push.on('registration', function (data) {
            // data.registrationId
            console.log(data.registrationId);
            registrationId = data.registrationId;

        });

        push.on('notification', function (data) {
            /*le false correspond au notification recu lorque l'app est en background en gros quand tu reçois une notif mais que t'es
            pas dans l'application */
            if (data.additionalData.foreground == false) {

                $(".flow_specifique_container").html("");
                let data_flow = {
                    IdFlow: data.additionalData.sender_info.IdFlow
                };
                ServerManager.GetSingle(data_flow);
                Popup("popup-specifique", true);
                if (data.additionalData.type == "send_comment" || data.additionalData.type == "like_comment") {
                    display_all_comments(data);
                }
            }
            let data_notification = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: 0
            };
            NotificationListCurrentIndex = 0;
            ServerManager.GetNotificationOfUser(data_notification);
            //pop_notif_block(data);

        });

        push.on('error', function (e) {
            console.log(e.message);
        });

        CheckIfConnected();
    }


};

app.initialize();

var $$ = Dom7;

var app = new Framework7({
    showBarsOnPageScrollEnd: false,
    material: false,
    tapHold: true,
    input: {
        scrollIntoViewOnFocus: true,
        scrollIntoViewCentered: true,
    } //enable tap hold events
});

var storage = window.localStorage;

/*************************************** */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {
        type: contentType
    });
    return blob;
}

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key));
};

// Replace default alert by Sweet Alert
window.alert = function (txt) {
    swal(txt);
};

function offline() {
    console.log("you are offline");
    pullToRefreshEnd();
}

function online() {
    console.log("you are online");
    ServerManager.GetStory();
}


/*
J'ai remove ça du config.xml juste pour save ça qq part : 
<preference name="AndroidLaunchMode" value="singleInstance" />
<preference name="KeepRunning" value="true" />
*/