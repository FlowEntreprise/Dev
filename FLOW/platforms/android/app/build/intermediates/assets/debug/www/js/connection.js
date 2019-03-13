/*DisconnectUser();*/
ConnectUser();

function ConnectUser() {
    console.log("user connected");
    connected = true;
    $(".fneed_connect").css({
        "display": "none"
    });
    //$( "#fswipe_area" ).css({"pointer-events": "all"});
}

function DisconnectUser() {
    console.log("user disconnected");
    connected = false;
    $(".fneed_connect").css({
        "display": "block"
    });
    app.showTab("#tab1");
    //$( "#fswipe_area" ).css({"pointer-events": "none"});
}

$$('.fneed_connect').on('click', function () {
    if (!connected) {
        app.popup('.popup-connect');
        
    }
    console.log("vicfou");
});