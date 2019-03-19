function TWLogin() {
    TwitterConnect.login(
        function (result) {
            GetInfos();
        },
        function (error) {
            alert(error);
        }
    );
}

function GetInfos() {
    TwitterConnect.showUser(
        function (result) {
            var txt = result.name + " --- " + result.screen_name + " --- " + result.profile_image_url + " --- " + result.description + "---" + result.id;
            //document.getElementById('infos').innerHTML = txt;
            //Transport(socket, result, "twitter");
            Socket.client.send('Inscription','Twitter',result);
            //alert(txt);
        },
        function (error) {
            alert("error 2");
        }
    );
}