//DisconnectUser();
var connected = false;
var user_token;
CheckIfConnected();

function ConnectUser(data) {
    console.log("user connected");
    connected = true;
    $(".fneed_connect").css({
        "display": "none"
    });
    window.localStorage.setItem("user_token", data.TokenId);
    window.localStorage.setItem("user_profile_pic", data.Image);
    $(".faccount").css({"background-image": "url('"+ window.localStorage.getItem("user_profile_pic") +"')"});
    app.closeModal('.popup-connect');
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
        current_page = "connect-popup";
    }
});

function CheckIfConnected() {
    user_token = window.localStorage.getItem("user_token") || null;
    console.log(window.localStorage.getItem("user_token"));
    if (user_token != null) {
        ConnectUser();
    }
    else {
        DisconnectUser();
    }
}