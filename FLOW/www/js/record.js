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
    $$('.frecord-btn').addClass('frecord-btn-active');
    recording = true;
    console.log("start recording...");
    start_time = Date.now();
    UpdateRecordIndicator();
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
    $$('.frecord-btn').removeClass('fripple');
    setTimeout(function () {
        $$('.frecord-btn').addClass('fripple');
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