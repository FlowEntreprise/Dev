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
    check_seen();
    // Framework7
    RefreshExplore();

    refresh_notif();
    let loading_tl = document.createElement("div");
    loading_tl.className = "loading-spinner loading_tl";
    $(".list-block")[0].appendChild(loading_tl);
    loading_tl.style.marginTop = "60%";

    // analytics.logEvent("user_connection", {
    //     private_id: window.localStorage.getItem("user_private_id")
    // });
    $(".faccount")[0].style.backgroundImage = "url('')";
    setTimeout(function () {
        let data = {
            RegisterId: registrationId,
            LastOs: window.cordova.platformId,
            Private_id: window.localStorage.getItem("user_private_id"),
            full_name: window.localStorage.getItem("user_name"),
            profile_pic: window.localStorage.getItem("user_profile_pic"),
            user_id: window.localStorage.getItem("firebase_token")
        };
        ServerManager.UpdateRegisterId(data);
        let Email = window.localStorage.getItem("user_privateid") + "" + FirebaseEnvironment + "@flow.fr";
        /*firebase.auth().createUserWithEmailAndPassword(Email, window.localStorage.getItem("firebase_token")).then((user) => {
            ServerManager.AddUserToFirebase(data);
        }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
            if (error.code == "auth/email-already-in-use") {
                firebase.auth().signInWithEmailAndPassword(Email, window.localStorage.getItem("firebase_token")).then(user => {
                    ServerManager.AddUserToFirebase(data);
                });
            }
        });*/
        firebase.auth().signInWithEmailAndPassword(Email, window.localStorage.getItem("firebase_token")).then(user => {
            ServerManager.AddUserToFirebase(data);
        }).catch((error) => {
            console.log(error.code);
            console.log(error.message);
            if (error.code == "auth/user-not-found") {
                firebase.auth().createUserWithEmailAndPassword(Email, window.localStorage.getItem("firebase_token")).then(user => {
                    ServerManager.AddUserToFirebase(data);
                });
            }
        });

        $(".faccount")[0].style.backgroundImage = "url('" + window.localStorage.getItem("user_profile_pic") + "')";
    }, 200);
    ServerManager.GetVersionProtocol();
    ServerManager.UpdateUserLastConnexion();
    //$( "#fswipe_area" ).css({"pointer-events": "all"});
}

function DisconnectUser() {
    // console.log("user disconnected");
    firebase.database().ref(FirebaseEnvironment + "/users/" + window.localStorage.getItem("firebase_token") + "/chats").off();
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
    $(".fred_dot_toolbar_new_notif").css('display', 'none');
    pages_swiper.slideTo(1);
    $(".empty_tl")[0].style.display = "block";
    $(".list-block")[0].innerHTML = "";
    $(".fstory_list")[0].innerHTML = "<li><div class=\"fstory_block\" onclick=\"Popup('popup-connect', true, 60)\"><img src=\"src/icons/plus.png\" class=\"fstory_pic mystory_pic fnoshadow\" /><div class=\"unread_shadow\"></div><label class=\"fstory_user\">Ta story</label></div></li>";
    $(".faccount").css({
        "background-image": "url('src/icons/Account@3x.png')"
    });

    facebookConnectPlugin.logEvent("user_disconnect", {}, null, function () {
        //console.log("fb event success")
    }, function () {
        //console.log("fb event error")
    });

    window.localStorage.clear();
    window.localStorage.setItem("first_open", "false");
    if (window.cordova.platformId == "android") {
        window.plugins.googleplus.disconnect(
            function (info) {
                // console.log(info); // do something useful instead of alerting
            }
        );
    }
    facebookConnectPlugin.logout(function (success) {
        // console.log(success)
    }, function (error) {
        // console.log(error);
    })

    //$( "#fswipe_area" ).css({"pointer-events": "none"});
}

$('.fneed_connect').on('click', function () {
    if (!connected) {
        // app.popup('.popup-connect');
        Popup("popup-connect", true, 60);
        let time_in_last_screen = Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
        facebookConnectPlugin.logEvent("current_page", {
            page: current_page,
            duration: time_in_last_screen
        }, null, function () {
            // console.log("fb current_page event success")
        }, function () {
            // console.log("fb current_page error")
        });
        last_currentpage_timestamp = Math.floor(Date.now() / 1000);
        current_page = "connect-popup";

        // analytics.setCurrentScreen(current_page);

    }
});

function CheckIfConnected() {
    //console.log("checking if connected");
    user_token = window.localStorage.getItem("user_token") || null;
    //console.log(window.localStorage.getItem("user_token"));
    if (user_token != null) {
        ConnectUser();
    } else {
        DisconnectUser();
    }
}

function storeVariables(data) {
    // console.log(data);
    window.localStorage.setItem("user_name", data.FullName);
    window.localStorage.setItem("user_bio", data.Bio);
    window.localStorage.setItem("user_private_id", data.PrivateId);
    window.localStorage.setItem("user_token", data.TokenId);
    window.localStorage.setItem("firebase_token", data.FirebaseToken);

    const src = 'https://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.ProfilePicture.name + '?';
    const param = `${data.LinkBuilder.Params.hash}=${data.ProfilePicture.hash}&${data.LinkBuilder.Params.time}=${data.ProfilePicture.timestamp}`;
    // console.log(src + param);
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
    StatusBar.backgroundColorByHexString('#949494');
    StatusBar.styleLightContent();
});

document.getElementById("popup-connect").addEventListener("closed", function () {
    StatusBar.backgroundColorByHexString('#f7f7f8');
    StatusBar.styleDefault();
});

// $$('.popup-connect').on('popup:open', function () {
//     StatusBar.backgroundColorByHexString('#949494');
//     StatusBar.styleLightContent();    
// });

// $$('.popup-connect').on('popup:close', function () {
//     StatusBar.backgroundColorByHexString('#f7f7f8');
//     StatusBar.styleDefault();       