function TWLogin() {
    $(".loading_connect").css({
        "opacity": "1",
        "pointer-events": "auto"
    });
    TwitterConnect.login(
        function (result) {
            GetInfos(result);
        },
        function (error) {
            $(".loading_connect").css({
                "opacity": "0",
                "pointer-events": "none"
            });
            // alert(error);
            console.log(error);
        }
    );
}

function GetInfos(data) {
    if (window.cordova.platformId == "ios") {
        let data = {
            user_id: data.id,
            token: data.authToken
        }
        console.log(data);
        ServerManager.TwitterShowUser(data);
        // TwitterConnect.showUser(
        //     function (result) {
        //         var txt = result.name + " --- " + result.screen_name + " --- " + result.profile_image_url + " --- " + result.description + "---" + result.id;
        //         //document.getElementById('infos').innerHTML = txt;
        //         //Transport(socket, result, "twitter");
        //         result.profile_image_url = result.profile_image_url.replace("_normal", "");
        //         // Socket.client.send('Inscription','Twitter',result); -- OLD
        //         ServerManager.Connect(apiTypes.Twitter, result);
        //         //alert(txt);
        //     },
        //     function (error) {
        //         $(".loading_connect").css({
        //             "opacity": "0",
        //             "pointer-events": "none"
        //         });
        //         console.log(error);
        //         // alert(error);
        //     }, {
        //         "include_entities": false
        //     },
        // );
    } else {
        TwitterConnect.showUser({
                "include_entities": false
            },
            function (result) {
                var txt = result.name + " --- " + result.screen_name + " --- " + result.profile_image_url + " --- " + result.description + "---" + result.id;
                //document.getElementById('infos').innerHTML = txt;
                //Transport(socket, result, "twitter");
                result.profile_image_url = result.profile_image_url.replace("_normal", "");
                // Socket.client.send('Inscription','Twitter',result); -- OLD
                ServerManager.Connect(apiTypes.Twitter, result);
                //alert(txt);
            },
            function (error) {
                $(".loading_connect").css({
                    "opacity": "0",
                    "pointer-events": "none"
                });
                console.log(error);
                // alert(error);
            },
        );
    }
}