function TWLogin() {
    $(".loading_connect").css({
        "opacity": "1",
        "pointer-events": "auto"
    });
    TwitterConnect.login(
        function (result) {
            GetInfos();
        },
        function (error) {
            $(".loading_connect").css({
                "opacity": "0",
                "pointer-events": "none"
            });
            alert(error);
        }
    );
}

function GetInfos() {
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
            alert(error);
        }
    );
}