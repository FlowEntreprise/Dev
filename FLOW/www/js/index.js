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

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },
    onPause: function () {
        // Here, we check to see if we are in the middle of taking a picture. If
        // so, we want to save our state so that we can properly retrieve the
        // plugin result in onResume(). We also save if we have already fetched
        // an image URI
        console.log("pause");
        stopAllStoriesAudio();
        stopAllBlocksAudio();

        if (appState.takingPicture || appState.imageUri) {
            window.localStorage.setItem("app_state", JSON.stringify(appState));
            console.log("app state saved");
        }

        if (cordova.platformId == 'android') {
            //ResetStatusBar();
        }

        if (mediaRecorder.state == "recording") {
            mediaRecorder.stop();
            console.log("stopped media recorder");
        }
        for (let i = 0; i < microphone.mediaStream.getTracks().length; i++) {
            microphone.mediaStream.getTracks()[i].stop();
        }

        // if (cordova.platformId == 'android') {
        //     StatusBar.show();
        //     StatusBar.overlaysWebView(true);
        //     StatusBar.backgroundColorByHexString('#00000000');
        //     StatusBar.styleDefault();
        // }
    },
    onResume: function (event) {
        console.log("resume");
        if (cordova.platformId == 'android') {
            //ResetStatusBar();
        }
        // Here we check for stored state and restore it if necessary. In your
        // application, it's up to you to keep track of where any pending plugin
        // results are coming from (i.e. what part of your code made the call)
        // and what arguments you provided to the plugin if relevant
        var storedState = window.localStorage.getItem("app_state");

        if (storedState) {
            appState = JSON.parse(storedState);
        }

        console.log(appState);
        console.log(event);
        console.log(event.pendingResult);

        // Check to see if we need to restore an image we took
        if (!appState.takingPicture && appState.imageUri) {
            console.log("restore picture...");
            console.log(appState.imageUri);

            //appState.imageUri = event.pendingResult.result;
            appState.needRestore = false;
        }
        // Now we can check if there is a plugin result in the event object.
        // This requires cordova-android 5.1.0+
        else if (appState.takingPicture && event.pendingResult) {
            console.log("status : " + event.pendingResult.pluginStatus);
            // Figure out whether or not the plugin call was successful and call
            // the relevant callback. For the camera plugin, "OK" means a
            // successful result and all other statuses mean error
            if (event.pendingResult.pluginStatus === "OK") {
                // The camera plugin places the same result in the resume object
                // as it passes to the success callback passed to getPicture(),
                // thus we can pass it to the same callback. Other plugins may
                // return something else. Consult the documentation for
                // whatever plugin you are using to learn how to interpret the
                // result field
                console.log("restoring picture");
                console.log(event.pendingResult.result);

                appState.imageUri = event.pendingResult.result;
                appState.needRestore = true;
            } else {
                console.log("restore picture fail");
                console.log(event.pendingResult.result);
                onFail(event.pendingResult.result);
            }
        }
    },








    // Update DOM on a Received Event
    receivedEvent: function (id) {
        document.addEventListener("offline", function(){ offline();  }, false);
        document.addEventListener("online", function(){ online(); }, false);  

        if (cordova.platformId == 'android') {
            // ResetStatusBar();
            // statusBar.overlaysWebView(true);
        }

        // if (AndroidFullScreen) {
        //     // Extend your app underneath the status bar (Android 4.4+ only)
        //     AndroidFullScreen.showUnderStatusBar();

        //     // Extend your app underneath the system UI (Android 4.4+ only)
        //     AndroidFullScreen.showUnderSystemUI();

        //     // Hide system UI and keep it hidden (Android 4.4+ only)
        //     AndroidFullScreen.immersiveMode();
        // }

        if (appState.needRestore) {

            /////////////// NO NEED SINCE ALEXIS FIXED THE PROBLEM ON HIS PHONE
            // pictureSource = navigator.camera.PictureSourceType;
            // destinationType = navigator.camera.DestinationType;
            // app.popup('.popup-after-record');
            // if (!after_record_initialised) {
            //     var mySwiper4 = app.swiper('.swiper-4', {
            //         pagination: '.swiper-4 .swiper-pagination',
            //         spaceBetween: 0,
            //         slidesPerView: 3
            //     });

            //     mySwiper4.on('slideChangeStart', function () {
            //         var target = "#" + $(".swiper-slide-next").attr("target");
            //         app.showTab(target);
            //     });
            //     after_record_initialised = true;
            //     current_page = "after-record";
            // }
            // $(".after-record-block-container").html("");
            // console.log(appState);
            // var myblob = b64toBlob(appState.blob64, "audio/opus");
            // var myblobUrl = URL.createObjectURL(myblob);
            // //console.log(appState.blob); 
            // //var binaryData = [];
            // //binaryData.push(appState.blob);
            // //var myaudioURL = window.URL.createObjectURL(new Blob(binaryData, {'type': 'audio/opus; codecs=opus'}))
            // console.log("generated audio url : " + myblobUrl);
            // let block_params = {
            //     parent_element: $(".after-record-block-container"),
            //     afterblock: true,
            //     audioURL: myblobUrl,
            //     duration: appState.recordTime,
            //     patternKey: appState.patternKey,
            //     imageURL: null,
            //     title: "",
            //     description: "",
            //     pseudo: window.localStorage.getItem("user_name"),
            //     account_imageURL: window.localStorage.getItem("user_profile_pic")
            // };
            // new_block = new block(block_params);
            // patternKey = new_block.patternKey;
            // // setTimeout(() => {
            // //     new_block.finput_title.focus();
            // // }, 500);
            // $(".finput_title").val(appState.flow_title);
            // $(".finput_description").val(appState.flow_description);

            // ///////////////

            // onPhotoDataSuccess(appState.imageUri);
            // appState.needRestore = false;
        }




        var push = PushNotification.init({
            android: {}
        });

        push.on('registration', function (data) {
            // data.registrationId
            console.log(data.registrationId);
        });

        push.on('notification', function (data) {
            alert("Title:" + data.title + " Message:" + data.message);
        });

        push.on('error', function (e) {
            console.log(e.message)
        });
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
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}

function offline() {
    console.log("you are offline");
    pullToRefreshEnd();
    // if (current_page == "story") {
    //     CloseStory();
    // }
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