// Settings
FacebookInAppBrowser.settings.appId = '502054883649562';
FacebookInAppBrowser.settings.redirectUrl = 'http://example.com';
FacebookInAppBrowser.settings.permissions = 'email';
//FacebookInAppBrowser.settings.permissions = 'name';


// Optional
FacebookInAppBrowser.settings.timeoutDuration = 7500;

// Login(accessToken will be stored trough localStorage in 'accessToken');
FacebookInAppBrowser.login({
    send: function () {
        console.log('login opened');
    },
    success: function (access_token) {
        console.log('done, access token: ' + access_token);
    },
    denied: function () {
        console.log('user denied');
    },
    timeout: function () {
        console.log('a timeout has occurred, probably a bad internet connection');
    },
    complete: function (access_token) {
        console.log('window closed');
        if (access_token) {
            console.log(access_token);
        } else {
            console.log('no access token');
        }
    },
    userInfo: function (userInfo) {
        if (userInfo) {
            console.log(JSON.stringify(userInfo));
        } else {
            console.log('no user info');
        }
    }
});


// Same logic of callbacks
FacebookInAppBrowser.getInfo(function (response) {
    if (response) {
        var name = response.name,
            id = response.id,
            gender = response.gender;

        // check the response object to see all available data like email, first name, last name, etc
        console.log(JSON.stringify(response));
    }
});

FacebookInAppBrowser.getPermissions(function (permissions) {
    if (permissions) {
        console.log(permissions.publish_actions, permissions);
    }
});

// Logout
FacebookInAppBrowser.logout(function () {
    alert('bye');
});

function ConnectFB() {
    facebookConnectPlugin.login(["public_profile", "user_birthday", "email"], fbLoginSuccess,
        function loginError(error) {
            alert("error : " + error);
        });
}

function fbLoginSuccess(info) {
    var _userid = info.authResponse.userID;
    facebookConnectPlugin.api(_userid + "/?fields=id,email,birthday,name,picture.type(large)", null,
        function onSuccess(result) {
            console.log("Result: ", result);
            //alert("success : "+result);
            //alert(result.email + " "+result.birthday);
            
           //document.getElementById("infos").innerHTML = JSON.stringify(result);
           //Transport(socket, result, "facebook");
            alert(result.name +" "+ result.email + " " + result.birthday + " " + result.picture.data.url + " " + result.id);
        },
        function onError(error) {
            //alert("error : "+error);
            console.error("Failed: ", error);
            //alert(result.email + " "+result.birthday);
            document.getElementById("infos").innerHTML = "results : " + result.email + " " + result.birthday +" "+result.name + " "+ result.profile_pic+ " "+ result.id;
        });
}

