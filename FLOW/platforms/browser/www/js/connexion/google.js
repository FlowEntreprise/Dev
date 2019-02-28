$(".fgoogle_btn").on("click", function () {
    alert("google btn clicked");
    google_conn();
});

function google_conn(){
    window.plugins.googleplus.login(
        {
          'webClientId': '919976316439-cal4l9elcf5ip9m2eh7qt5bs67v2obrv.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function (obj) {
        //   alert(JSON.stringify(obj)); // do something useful instead of alerting
        var txt = obj.displayName + " --- " + obj.email + " --- " + obj.imageUrl + " --- " + obj.userId;
        //document.getElementById('infos').innerHTML = txt;
        //Transport(socket,obj,'google');
        alert(txt);
        },
        function (msg) {
          alert('error: ' + msg);
        }
    );
}
