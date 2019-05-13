//DisconnectUser();
var connected = false;
var user_token;
CheckIfConnected();

function ConnectUser() {
    console.log("user connected");
    connected = true;
    $(".fneed_connect").css({
        "display": "none"
    });
    $(".faccount").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
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
    } else {
        DisconnectUser();
    }
}

function storeVariables(data) {
    window.localStorage.setItem("user_name", data.Fullname);
    window.localStorage.setItem("user_bio", data.Biographie);
    window.localStorage.setItem("user_private_id", data.PrivateId);
    window.localStorage.setItem("user_token", data.TokenId);

    const src = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.Image.name + '?';
    const param = `${data.LinkBuilder.Params.hash}=${data.Image.hash}&${data.LinkBuilder.Params.time}=${data.Image.timestamp}`;
    console.log(src + param);
    getBase64Image((src + param), function (base64) {
        window.localStorage.setItem("user_profile_pic", base64);
        $(".faccount").css({
            "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
        });
        console.log(base64);
    });
}

function getBase64Image(imgUrl, callback) {

    var img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    img.onload = function(){

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      callback(dataURL); // the base64 string

    };

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

}