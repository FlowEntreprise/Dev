var record_was_hold = false;
var recording = false;
var record_time = 0;

var start_time;

$$('.fflow-btn').on('taphold', function () {
    console.log("Hold Record !");
    app.popup('.popup-record');
    $$('.frecord-btn').css({
        "display": "flex"
    });
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
    StopRecording();
});

$$('.popup-record').on('popup:open', function () {
    $$('.frecord-btn').css({
        "display": "flex"
    });
    if (record_was_hold) {
        $$('.frecord-btn').addClass('frecord-btn-active');
    }
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

function StartRecording() {
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
            $$('.frecord-btn').addClass('frecord-btn-active');
            recording = true;
            console.log("start recording...");
            start_time = Date.now();
            UpdateRecordIndicator();
        }
    }

    permissions.hasPermission(permissions.RECORD_AUDIO, function (status) {
        if (status.hasPermission) {
            setup();
            $$('.frecord-btn').addClass('frecord-btn-active');
            recording = true;
            console.log("start recording...");
            start_time = Date.now();
            UpdateRecordIndicator();
        } else {
            permissions.requestPermissions(list, success, error);
        }
    });

}

function StopRecording() {
    $$('.frecord-btn').removeClass('frecord-btn-active');
    recording = false;
    record_was_hold = false;
    console.log("stop recording.");
    $$('.frecord_indicator').css({
        "stroke-dasharray": "0 100"
    });
}

function UpdateRecordIndicator() {
    record_time = (Date.now() - start_time) / 1000;
    $$('#flow_number_of_sec').text(format(Math.round(record_time)));
    // $$('.frecord_indicator').css({
    //     "stroke-dasharray": Math.round(6.73 * record_time) + " 100"
    // });
    if (recording && record_time <= 15) {
        setTimeout(function () {
            if (recording) {
                $$('.frecord_indicator').css({
                    "stroke-dasharray": Math.round(6.73 * record_time) + " 100"
                });
                UpdateRecordIndicator();
            }
        }, 100);
    } else {
        StopRecording();
    }
}

function PlayRipple() {
    $$('.frecord-btn').removeClass('fripple-record');
    setTimeout(function () {
        $$('.frecord-btn').addClass('fripple-record');
    }, 10);
}

function format(number) {
    return (number < 10) ? '0' + number.toString() : number.toString();
}

$$('.frecord-btn').on('touchstart', function () {
    PlayRipple();
});

$$('.fflow-btn').on('touchstart', function () {
    PlayRipple();
});


//-------------------------------------------------------------//
var BitsPerSecondDefault = "12000";
var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('.sounds-record');
var canvas = document.querySelector('.player');
// var canvas2 = document.getElementById('siri_classic').children;
var mainSection = document.querySelector('.main-controls');
var box = document.getElementById('box');
// var time = document.getElementById('timer');
var changeBitsRate = document.querySelector('.changeBitsRate');
var chunks = [];
function setup() {

    if (navigator.mediaDevices) {
        //Definition de constante//

        var constraints = {
            audio: true
        };
        
        chunks = [];

        // change and define bits/rate //
        var onSuccess = function (stream) {
            mediaRecorder = new MediaRecorder(stream, {
                audioBitsPerSecond: BitsPerSecondDefault
            });
            changeBitsRate.onclick = function () {
                var BitsPerSecond = prompt("Choose your Bits rate", BitsPerSecondDefault);
                if (BitsPerSecond !== null) {
                    BitsPerSecondDefault = BitsPerSecond;
                }
                changeBitsRate.textContent = BitsPerSecondDefault + " Kbps";
                mediaRecorder = new MediaRecorder(stream, {
                    audioBitsPerSecond: BitsPerSecondDefault
                });
                mediaRecorder.onstop = function (e) {
                    Save(mediaRecorder);
                }
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                }
            }
            mediaRecorder.audioBitsPerSecond = "10000";
            // var timer = new Timer();
            // wave(stream);

            //Record In Progress//
            record.onclick = function () {
                // timer.start();
                mediaRecorder.start();
                document.getElementById("Error1").innerText = "Record Audio in progress";
                record.style.background = "red";
                stop.disabled = false;
                record.disabled = true;
            }
            // Record Stop//
            stop.onclick = function () {
                // timer.stop();
                mediaRecorder.stop();
                document.getElementById("Error1").innerText = "Record Audio Stop";
                record.style.background = "";
                record.style.color = "";
                stop.disabled = true;
                record.disabled = false;
            }
            // timer.addEventListener('secondsUpdated',function(e){
            //     time.textContent = timer.getTimeValues().toString();
            // })
            //When MediaRecorder Stop//
            mediaRecorder.onstop = function (e) {
                Save(mediaRecorder);
            }

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }
        }

        var onError = function (err) {
            document.getElementById("Error1").innerText = "The flollowing error occured: " + err;
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        document.getElementById("Error1").innerText = "Can't acces Media devices";
    }
}
//-------------- SAVE ---------------------------//
var i = 1;

function Save(mediaRecorder) {
    var recordName = prompt("Name For your record", "Flow_v" + i);
    var recordContainer = document.createElement('article');
    var recordLabel = document.createElement('p');
    var audio = document.createElement('audio');
    var deleteButton = document.createElement('button');
    recordContainer.classList.add('record');
    audio.setAttribute('controls', "");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    if (recordName === null) {
        recordLabel.textContent = "Flow";
    } else {
        recordLabel.textContent = recordName;
    }
    var blob = new Blob(chunks, {
        'type': 'audio/opus; codecs=opus'
    });
    recordLabel.textContent += " Size : " + precisionRound(blob.size / 1024, 2) + "Ko | rec with " + mediaRecorder.audioBitsPerSecond + " Kbps";
    //socket.emit('AddFlow', blob);
    recordContainer.appendChild(audio);
    recordContainer.appendChild(recordLabel);
    recordContainer.appendChild(deleteButton);
    soundClips.appendChild(recordContainer);

    audio.controls = true;

    chunks = [];

    var audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;
    document.getElementById("Error1").innerText = "Record Audio Save as " + recordName;
    i++;


    deleteButton.onclick = function (e) {
        evtTgt = e.target;
        document.getElementById("Error1").innerText = "Delete record audio " + evtTgt.parentNode.children[1].innerText;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
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