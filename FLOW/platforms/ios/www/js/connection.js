//DisconnectUser();
var connected = false;
var user_token;
// CheckIfConnected();

function ConnectUser() {
    console.log("user connected");
    connected = true;
    // $(".empty_tl")[0].style.display = "none";
    $(".fneed_connect").css({
        "display": "none"
    });
    $(".faccount").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    $(".mystory_pic")[0].src = window.localStorage.getItem("user_profile_pic");
    // app.closeModal('.popup-connect');
    Popup("popup-connect", false);
    $(".loading_connect").css({
        "opacity": "0",
        "pointer-events": "none"
    });
    ServerManager.GetStory();
    ServerManager.GetTimeline(0);
    let data_notification = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        Index: 0
    };
    ServerManager.GetNotificationOfUser(data_notification);
    check_seen();
    let loading_tl = document.createElement("div");
    loading_tl.className = "loading-spinner loading_tl";
    $(".list-block")[0].appendChild(loading_tl);
    loading_tl.style.marginTop = "60%";

    // analytics.logEvent("user_connection", {
    //     private_id: window.localStorage.getItem("user_private_id")
    // });

    setTimeout(function () {
        let data = {
            RegisterId: registrationId,
            LastOs: window.cordova.platformId
        };
        ServerManager.UpdateRegisterId(data);
    }, 100);

    //$( "#fswipe_area" ).css({"pointer-events": "all"});
}

function DisconnectUser() {
    console.log("user disconnected");
    let data = {
        RegisterId: null,
        LastOs: window.cordova.platformId
    };
    ServerManager.UpdateRegisterId(data);
    connected = false;
    $(".fneed_connect").css({
        "display": "block"
    });
    Popup("popup-myaccount", false);
    app.showTab("#tab2");
    $(".empty_tl")[0].style.display = "block";
    $(".list-block")[0].innerHTML = "";
    $(".fstory_list")[0].innerHTML = "<li><div class=\"fstory_block\" onclick=\"Popup('popup-connect', true, 45)\"><img src=\"src/icons/plus.png\" class=\"fstory_pic mystory_pic fnoshadow\" /><div class=\"unread_shadow\"></div><label class=\"fstory_user\">Ta story</label></div></li>";
    $(".faccount").css({
        "background-image": "url('src/icons/Account@3x.png')"
    });
    if (window.cordova.platformId == "android") {
        analytics.logEvent("user_disconnection", {
            private_id: window.localStorage.getItem("user_private_id")
        });
    }
    window.localStorage.clear();
    //$( "#fswipe_area" ).css({"pointer-events": "none"});
}

$$('.fneed_connect').on('click', function () {
    if (!connected) {
        // app.popup('.popup-connect');
        Popup("popup-connect", true, 45);
        current_page = "connect-popup";
        if (window.cordova.platformId == "android") {
            analytics.setCurrentScreen(current_page);
        }
    }
});

function CheckIfConnected() {
    console.log("checking if connected");
    user_token = window.localStorage.getItem("user_token") || null;
    console.log(window.localStorage.getItem("user_token"));
    if (user_token != null) {
        ConnectUser();
    } else {
        DisconnectUser();
    }
}

function storeVariables(data) {
    window.localStorage.setItem("user_name", data.FullName);
    window.localStorage.setItem("user_bio", data.Bio);
    window.localStorage.setItem("user_private_id", data.PrivateId);
    window.localStorage.setItem("user_token", data.TokenId);

    const src = 'https://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.ProfilePicture.name + '?';
    const param = `${data.LinkBuilder.Params.hash}=${data.ProfilePicture.hash}&${data.LinkBuilder.Params.time}=${data.ProfilePicture.timestamp}`;
    console.log(src + param);
    let link_built = src + param;
    window.localStorage.setItem("user_profile_pic", link_built);
    $(".faccount").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    $(".mystory_pic")[0].src = window.localStorage.getItem("user_profile_pic");

}

function getBase64Image(imgUrl, callback) {

    var img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    img.onload = function () {

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

document.getElementById("popup-connect").addEventListener("opened", function () {
    if (window.cordova.platformId == "android") {
        StatusBar.backgroundColorByHexString('#949494');
        StatusBar.styleLightContent();
    }
});

document.getElementById("popup-connect").addEventListener("closed", function () {
    if (window.cordova.platformId == "android") {
        StatusBar.backgroundColorByHexString('#f7f7f8');
        StatusBar.styleDefault();
    }
});

// $$('.popup-connect').on('popup:open', function () {
//     StatusBar.backgroundColorByHexString('#949494');
//     StatusBar.styleLightContent();    
// });

// $$('.popup-connect').on('popup:close', function () {
//     StatusBar.backgroundColorByHexString('#f7f7f8');
//     StatusBar.styleDefault();       