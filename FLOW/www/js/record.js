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
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
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
    } else {
        setup();
        $$('.frecord-btn').addClass('frecord-btn-active');
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
    $$('.frecord-btn').removeClass('frecord-btn-active');
    recording = false;
    record_was_hold = false;
    console.log("stop recording.");
    $$('.frecord_indicator').css({
        "stroke-dasharray": "0 100"
    });
    //document.getElementById("Error1").innerText = "Record Audio Stop";
    //record.style.background = "";
    //record.style.color = "";
    //stop.disabled = true;
    //record.disabled = false;
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
var soundClips = document.querySelector('.sounds-record');
// var canvas2 = document.getElementById('siri_classic').children;
var chunks = [];
var mediaRecorder;

function setup() {

    if (navigator.mediaDevices) {
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
    var recordName = "myflow_" + i;
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
    i++;


    deleteButton.onclick = function (e) {
        evtTgt = e.target;
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

// ---------------------------------------------------------------------- //
var siriWave = new SiriWave({
    container: document.getElementById('wave-container'),
    width: 300,
    height: 300,
    style: "ios",
    color: "1A84EF",
    cover: true,
    lerpSpeed: 1
});
siriWave.start();
siriWave.speed = 0;
siriWave.amplitude = 0;

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
        if (recording) {
            siriWave.amplitude = smoothVolume * 0.02;
            siriWave.speed = 0.2;
        } else {
            siriWave.amplitude = 0;
            siriWave.speed = 0;
        }
        // siriWave.speed = smoothVolume*0.004;
    }
}