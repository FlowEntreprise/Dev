var record_was_hold = false;
var recording = false;
var record_time = 0;

var start_time;
var after_record_initialised = false;

var new_block;

var pictureSource;
var destinationType;

var image64;
var patternKey;
var blob;
// var blob64;

let options = {
    quality: 75,
    widthRatio: 1,
    heightRatio: 1,
    targetWidth: 600,
    targetHeight: 600
};

$$('.popup-record').on('popup:open', function () {
    $$('#flow_number_of_sec').text("00");
    if (!debug_record) {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }
    current_page = "record";
});
$$('.popup-story-record').on('popup:open', function () {
    $$('.story_flow_duration').text("00");
    current_page = "record-story";
});
$$('.fflow-btn').on('taphold', function () {
    console.log("Hold Record !");
    app.popup('.popup-record');
    $$('.frecord-btn').css({
        "display": "flex"
    });
    $(".record-shadow")[0].style.display = "block";
    record_was_hold = true;
    StartRecording();
});
$$('.frecord-btn').on('taphold', function () {
    if (!recording && !record_was_hold) {
        console.log("Hold Record !");
        record_was_hold = true;
        StartRecording();
    }
});
$$('.popup-record').on('popup:close', function () {
    $$('.frecord-btn').css({
        "display": "none"
    });
    $(".record-shadow")[0].style.display = "none";
    StopRecording();
    current_page = "home";
});

$$('.popup-record').on('popup:open', function () {
    $$('.frecord-btn').css({
        "display": "flex"
    });
    $(".record-shadow")[0].style.display = "block";
    if (record_was_hold) {
        $$('.frecord-btn').addClass('frecord-btn-active');
    }
});
$$('.popup-after-record').on('popup:open', function () {
    $(".fvalidate-after_btn.record")[0].style.pointerEvents = "auto";
    $(".fvalidate-after_btn.record")[0].setAttribute("style", "");
    $(".floading-spinner.loading-record-flow")[0].style.display = "none";
    current_page = "after-record";
});
$$('.popup-after-record').on('popup:close', function () {
    $(".fvalidate-after_btn.record")[0].style.pointerEvents = "auto";
    $(".fvalidate-after_btn.record")[0].setAttribute("style", "");
    $(".floading-spinner.loading-record-flow")[0].style.display = "none";
});

$$('.popup-after-story-record').on('popup:open', function () {
    $(".fvalidate-after_btn.story")[0].style.pointerEvents = "auto";
    $(".fvalidate-after_btn.story")[0].setAttribute("style", "");
    $(".floading-spinner.loading-story")[0].style.display = "none";
});
$$('.popup-after-story-record').on('popup:close', function () {
    $(".fvalidate-after_btn.story")[0].style.pointerEvents = "auto";
    $(".fvalidate-after_btn.story")[0].setAttribute("style", "");
    $(".floading-spinner.loading-story")[0].style.display = "none";
});


$$('.frecord-btn').on('click', function () {
    if (recording) {
        StopRecording();
    } else {
        StartRecording();
    }
});

$$('body').on('touchend', function () {
    if (recording && record_was_hold) {
        StopRecording();
    }
});

$$('.frestart-after_btn').on('touchend', function () {
    if (current_page == "after-record") {
        app.closeModal('.popup-after-record');
        app.popup('.popup-record');
    } else {
        closeStoryRecord();
        app.popup('.popup-story-record');
    }
});

$$('.fcancel-after_btn').on('touchend', function () {
    if (current_page == "after-record") {
        app.closeModal('.popup-after-record');
        current_page = "home";
    } else {
        app.closeModal('.popup-after-story-record');
        current_page = "home";
    }
});


$$('.fvalidate-after_btn').on('touchend', function () {
    if (current_page == "after-record") {
        // app.closeModal('.popup-after-record');
        // current_page = "home";
        var data = {
            PrivatedId: window.localStorage.getItem("user_private_id"),
            Title: $(".finput_title").val(),
            Image: image64 ? image64 : patternKey,
            Description: $(".finput_description").val(),
            Tags: [],
            Sound: appState.blob64,
            Duration: record_time
        }
        console.log(data);
        // Socket.client.send("Flow", "AddFlow", data); --OLD
        // floading-spinner loading-record-flow
        $(".fvalidate-after_btn.record")[0].style.pointerEvents = "none";
        $(".fvalidate-after_btn.record")[0].setAttribute("style", "background: linear-gradient(to bottom, #1A84EF, #FF0054)");
        $(".floading-spinner.loading-record-flow")[0].style.display = "block";
        setTimeout(function () {
            ServerManager.AddFlow(data);
        }, 100);
        image64 = null;
        patternKey = null;
    } else {
        let storydata = {
            PrivatedId: window.localStorage.getItem("user_private_id"),
            Sound: appState.blob64,
            Duration: record_time,
            Color: last_story_color
        };
        console.log("Send story to server");
        $(".fvalidate-after_btn.story")[0].style.pointerEvents = "none";
        $(".fvalidate-after_btn.story")[0].setAttribute("style", "background: linear-gradient(to bottom, #1A84EF, #FF0054)");
        $(".floading-spinner.loading-story")[0].style.display = "block";

        setTimeout(function () {
            ServerManager.AddStory(storydata);
        }, 100);
    }
});

$$('.fcamera-after').on('click', function () {
    TakePhoto();
});
$$('.fgallery-after').on('click', function () {
    GetPhotoFromGallery();
});

function StartRecording() {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) && !debug_record) {
        //------------------ PERMISSIONS -------------------------------//
        var permissions = cordova.plugins.permissions;
        var list = [
            permissions.RECORD_AUDIO
            //permissions.WRITE_EXTERNAL_STORAGE
        ];

        function error() {
            alert('Record audio permission not given');
        }

        function success(status) {
            if (!status.hasPermission) error();
            else {
                setup();
                recording = true;
                console.log("start recording...");
                start_time = Date.now();
                UpdateRecordIndicator();

                if (current_page == "record" || current_page == "record-story") {
                    $$('.frecord-btn').addClass('frecord-btn-active');
                } else if (current_page == "story") {
                    $$('.fstory_addcomment_btn').addClass('active');
                    $(".comment_record_popup").css({
                        "opacity": "1",
                        "pointer-events": "auto"
                    });
                }
            }
        }

        permissions.hasPermission(permissions.RECORD_AUDIO, function (status) {
            if (status.hasPermission) {
                setup();
                if (current_page == "record" || current_page == "record-story") {
                    $$('.frecord-btn').addClass('frecord-btn-active');
                } else if (current_page == "story") {
                    $$('.fstory_addcomment_btn').addClass('active');
                    $(".comment_record_popup").css({
                        "opacity": "1",
                        "pointer-events": "auto"
                    });
                }
                recording = true;
                console.log("start recording...");
                start_time = Date.now();
                UpdateRecordIndicator();
            } else {
                permissions.requestPermissions(list, success, error);
            }
        });
    } else {
        setup();
        if (current_page == "record" || current_page == "record-story") {
            $$('.frecord-btn').addClass('frecord-btn-active');
        } else if (current_page == "story") {
            $$('.fstory_addcomment_btn').addClass('active');
            $(".comment_record_popup").css({
                "opacity": "1",
                "pointer-events": "auto"
            });
        }
        recording = true;
        console.log("start recording...");
        start_time = Date.now();
        UpdateRecordIndicator();
    }

}

function StopRecording() {
    //siriWave.stop();
    if (recording) {
        mediaRecorder.stop();
    }

    recording = false;
    record_was_hold = false;
    console.log("stop recording.");
    if (current_page == "record" || current_page == "record-story") {
        $$('.frecord-btn').removeClass('frecord-btn-active');
        $$('.frecord_indicator').css({
            "stroke-dasharray": "0 100"
        });
    } else if (current_page == "story") {
        $$('.fstory_addcomment_btn').removeClass('active');
        $$('.fstory_addcomment_btn')[0].style.display = "none";
        let value = 0;
        let css = "rgba(0, 0, 0, 0) conic-gradient(white 0deg, white " + value + "%, transparent 0deg, transparent 100%) repeat scroll 0% 0% / auto padding-box border-box";
        $(".fstory_addcomment_loading").css({
            "background": css
        });
        if (arguments[0] == "cancel") {
            console.log("recording canceled");
        } else {
            $(".validate_record_comment")[0].style.display = "block";
            $(".listen_record_comment")[0].style.display = "block";
        }
        // $(".comment_record_popup").css({"opacity": "1", "pointer-events": "none"});
    }
    //document.getElementById("Error1").innerText = "Record Audio Stop";
    //record.style.background = ""; 
    //record.style.color = "";
    //stop.disabled = true;
    //record.disabled = false;
}

function UpdateRecordIndicator() {
    record_time = (Date.now() - start_time) / 1000;
    if (current_page == "record") {
        $$('#flow_number_of_sec').text(format(Math.round(record_time)));
    } else if (current_page == "record-story") {
        $$('#flow_story_number_of_sec').text(format(Math.round(record_time)));
    }
    // $$('.frecord_indicator').css({
    //     "stroke-dasharray": Math.round(6.73 * record_time) + " 100"
    // });
    if (recording && record_time <= 15) {
        setTimeout(function () {
            if (recording) {
                let value = Math.round(6.73 * record_time);
                if (current_page == "record" || current_page == "record-story") {
                    $$('.frecord_indicator').css({
                        "stroke-dasharray": value + " 100"
                    });
                } else if (current_page == "story") {
                    let css = "rgba(0, 0, 0, 0) conic-gradient(white 0deg, white " + value + "%, transparent 0deg, transparent 100%) repeat scroll 0% 0% / auto padding-box border-box";
                    $(".fstory_addcomment_loading").css({
                        "background": css
                    });
                }
                UpdateRecordIndicator();
            }
        }, 100);
    } else {
        StopRecording();
    }
}

function CloseAfterRecord() {
    app.closeModal('.popup-after-record');
    current_page = "home";
}


function PlayRipple(element, className) {
    element.removeClass(className);
    setTimeout(function () {
        element.addClass(className);
    }, 10);
}

function format(number) {
    return (number < 10) ? '0' + number.toString() : number.toString();
}

$$('.frecord-btn').on('touchstart', function () {
    PlayRipple($$(this), 'fripple-record');
});

$$('.fflow-btn').on('touchstart', function () {
    PlayRipple($$(this), 'fripple-record');
});



//-------------------------------------------------------------//
var BitsPerSecondDefault = "12000";
var soundClips = document.querySelector('.sounds-record');
// var canvas2 = document.getElementById('siri_classic').children;
var chunks = [];
var mediaRecorder;

function setup() {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var constraints = {
            audio: true
        };

        chunks = [];

        var onSuccess = function (stream) {
            //siriWave.start();

            mediaRecorder = new MediaRecorder(stream, {
                audioBitsPerSecond: BitsPerSecondDefault
            });
            mediaRecorder.onstop = function (e) {
                Save(mediaRecorder);
            }

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }

            mediaRecorder.start();
            wave(stream);
        }

        var onError = function (err) {
            alert("error : recording failed.");
            alert(err);
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        alert("error : can't access media device");
    }
}
//-------------- SAVE ---------------------------//
var i = 1;

function Save(mediaRecorder) {
    //var recordName = prompt("Name For your record", "Flow_v" + i);
    // var recordName = "myflow_" + i;
    // var recordContainer = document.createElement('article');
    // var recordLabel = document.createElement('p');
    // var audio = document.createElement('audio');
    // var deleteButton = document.createElement('button');
    // recordContainer.classList.add('record');
    // audio.setAttribute('controls', "");
    // deleteButton.textContent = "Delete";
    // deleteButton.className = "delete";

    // if (recordName === null) {
    //     recordLabel.textContent = "Flow";
    // } else {
    //     recordLabel.textContent = recordName;
    // }
    blob = new Blob(chunks, {
        'type': 'audio/opus; codecs=opus'
    });
    // recordLabel.textContent += " Size : " + precisionRound(blob.size / 1024, 2) + "Ko | rec with " + mediaRecorder.audioBitsPerSecond + " Kbps";
    // //socket.emit('AddFlow', blob);
    // recordContainer.appendChild(audio);
    // recordContainer.appendChild(recordLabel);
    // recordContainer.appendChild(deleteButton);
    // soundClips.appendChild(recordContainer);

    // audio.controls = true;

    chunks = [];

    var audioURL = window.URL.createObjectURL(blob);
    // audio.src = audioURL;
    // i++;


    // deleteButton.onclick = function (e) {
    //     evtTgt = e.target;
    //     evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    // }
    console.log("current page : " + current_page);
    if (current_page == "record") {

        app.closeModal('.popup-record');
        app.popup('.popup-after-record');
        if (!after_record_initialised) {
            var mySwiper4 = app.swiper('.swiper-4', {
                pagination: '.swiper-4 .swiper-pagination',
                spaceBetween: 0,
                slidesPerView: 3
            });

            mySwiper4.on('slideChangeStart', function () {
                var target = "#" + $(".swiper-slide-next").attr("target");
                app.showTab(target);
            });
            after_record_initialised = true;
            current_page = "after-record";
            console.log("after record");
        }
        $(".after-record-block-container").html("");
        let block_params = {
            parent_element: $(".after-record-block-container"),
            afterblock: true,
            audioURL: audioURL,
            duration: record_time,
            patternKey: null,
            imageURL: null,
            title: "",
            description: "",
            pseudo: window.localStorage.getItem("user_name"),
            account_imageURL: window.localStorage.getItem("user_profile_pic")
        };
        new_block = new block(block_params);
        // $(".frandom-color-btn").on("click", function() {new_block.randomColorGradient()});
        patternKey = new_block.patternKey;
        appState.patternKey = patternKey;
        appState.recordTime = record_time;
        appState.blob = blob;
        appState.flow_title = $(".finput_title").val();
        appState.flow_description = $(".finput_description").val();
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            //blob64 = reader.result;
            appState.blob64 = reader.result.replace("data:audio/opus; codecs=opus;base64,", "");
            console.log(appState.blob64);
        }

        setTimeout(() => {
            new_block.finput_title.focus();
        }, 500);
    } else if (current_page == "record-story") {
        app.closeModal('.popup-story-record');
        app.popup('.popup-after-story-record');
        $(".after-story-record-block-container").html("");
        let block_params = {
            parent_element: $(".after-story-record-block-container"),
            afterblock: true,
            audioURL: audioURL,
            duration: record_time,
            patternKey: null,
            imageURL: null,
            title: "",
            description: "",
            pseudo: window.localStorage.getItem("user_name"),
            account_imageURL: window.localStorage.getItem("user_profile_pic"),
            storyAfterBlock: true
        };
        new_block = new block(block_params);
        patternKey = new_block.patternKey;
        appState.patternKey = patternKey;
        appState.recordTime = record_time;
        appState.blob = blob;
        appState.flow_title = $(".finput_title").val();
        appState.flow_description = $(".finput_description").val();
        current_page = "after-story-record";
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            //blob64 = reader.result;
            appState.blob64 = reader.result.replace("data:audio/opus; codecs=opus;base64,", "");
            console.log(appState.blob64);
        }

        setTimeout(() => {
            new_block.finput_title.focus();
        }, 500);
    } else if (current_page == "story") {
        playing_recorded_com = false;
        recorded_com = new Audio(audioURL);
        recorded_com.currentTime = 0;
        $(".play_record_comment")[0].style.backgroundImage = "url('src/icons/play.png')";
        recorded_com.onended = function () {
            recorded_com.pause();
            $(".play_record_comment")[0].style.backgroundImage = "url('src/icons/play.png')";
            playing_recorded_com = false;
        }
    }
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

//------------------ PERMISSIONS -------------------------------//

// var list = [
//     permissions.CAMERA,
//     permissions.RECORD_AUDIO
//   ];

//   permissions.hasPermission(list, callback, null);

//   function error() {
//     console.warn('Record audio permission not given');
//   }

//   function success( status ) {
//     if( !status.hasPermission ) {

//       permissions.requestPermissions(
//         list,
//         function(status) {
//           if( !status.hasPermission ) error();
//         },
//         error);
//     }
//   }

// ---------------------------------------------------------------------- //
var siriWave = new SiriWaveRecord({
    container: document.getElementById('wave-container'),
    width: 300,
    height: 300,
    style: "ios",
    color: "1A84EF",
    cover: true,
    lerpSpeed: 1,
    story: false
});
siriWave.start();
siriWave.speed = 0;
siriWave.amplitude = 0;

var siriWaveStory = new SiriWaveRecord({
    container: $(".story-record-wave")[0],
    width: 300,
    height: 300,
    style: "ios",
    color: "1A84EF",
    cover: true,
    lerpSpeed: 1,
    story: false
});
siriWaveStory.start();
siriWaveStory.speed = 0;
siriWaveStory.amplitude = 0;

////////////////////////////////////////////////////////////////

function Lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}
var smoothVolume = 0;

function wave(stream) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function () {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;
        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += (array[i]);
        }

        var average = values / length;
        // smoothVolume = Lerp(smoothVolume,average,0.25);
        smoothVolume = average;
        if (current_page == "record") {
            if (recording) {
                siriWave.amplitude = (smoothVolume * 0.02) + 0.1;
                siriWave.speed = 0.2;
            } else {
                siriWave.amplitude = 0;
                siriWave.speed = 0;
            }
        } else {
            if (recording) {
                siriWaveStory.amplitude = (smoothVolume * 0.02) + 0.1;
                siriWaveStory.speed = 0.2;
            } else {
                siriWaveStory.amplitude = 0;
                siriWaveStory.speed = 0;
            }
        }
        // siriWave.speed = smoothVolume*0.004;
    }
}

function TakePhoto() {
    console.log("take photo");
    var permissions = cordova.plugins.permissions;
    var list = [
        permissions.CAMERA
        //permissions.WRITE_EXTERNAL_STORAGE
    ];

    function error() {
        alert('Camera permission not given');
    }

    function success(status) {
        if (!status.hasPermission) error();
        else {
            //alert("success");
            capturePhoto();
        }
    }

    permissions.hasPermission(permissions.CAMERA, function (status) {
        if (status.hasPermission) {
            //alert("success");
            capturePhoto();
        } else {
            permissions.requestPermissions(list, success, error);
        }
    });
}

function GetPhotoFromGallery() {
    console.log("get photo from gallery");
    var permissions = cordova.plugins.permissions;
    var list = [
        permissions.READ_EXTERNAL_STORAGE
    ];

    function error() {
        alert('Gallery permission not given');
    }

    function success(status) {
        if (!status.hasPermission) error();
        else {
            //alert("success");
            getPhoto();
        }
    }

    permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
        if (status.hasPermission) {
            //alert("success");
            getPhoto();
        } else {
            permissions.requestPermissions(list, success, error);
        }
    });
}

function onPhotoDataSuccess(imageData) {
    var options = {
        url: imageData, // required.
        ratio: "6/4", // required. (here you can define your custom ration) "1/1" for square images
        title: "Crop image", // optional. android only. (here you can put title of image cropper activity) default: Image Cropper
        autoZoomEnabled: true // optional. android only. for iOS its always true (if it is true then cropper will automatically adjust the view) default: true
    };

    appState.takingPicture = false;
    appState.imageUri = imageData;

    window.plugins.k.imagecropper.open(options, function (data) {
        // its return an object with the cropped image cached url, cropped width & height, you need to manually delete the image from the application cache.
        console.log(data);
        //$scope.croppedImage = data;
        new_block.ftop_part.style.backgroundImage = "url('" + data.imgPath + "')";
        toDataUrl(data.imgPath, function (b64) {
            image64 = b64;
        });
    }, function (error) {
        console.log(error);
    });
    //new_block.ftop_part.style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')";
}

function capturePhoto() {

    appState.takingPicture = true;

    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 75,
        allowEdit: false,
        destinationType: destinationType.FILE_URI,
    });
}

function getPhoto() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 75,
        allowEdit: false,
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.SAVEDPHOTOALBUM,
    });
}

function onFail(message) {
    appState.takingPicture = false;
    alert('Failed because: ' + message);
}

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function closeStoryRecord() {
    app.closeModal('.popup-after-story-record');
    current_page = "home";
    console.log("close story record");
}