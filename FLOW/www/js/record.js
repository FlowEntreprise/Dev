$$('.fflow-btn').on('taphold', function () {
    console.log("Hold Record !");
    app.popup('.popup-record');
    $$('.frecord-btn').css({
        "display": "block"
    });
});

$$('.popup-record').on('popup:close', function () {
    console.log("close popup record");
    $$('.frecord-btn').css({
        "display": "none"
    });
});