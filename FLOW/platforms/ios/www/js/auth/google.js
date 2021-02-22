function google_conn() {
  $(".loading_connect").css({
    "opacity": "1",
    "pointer-events": "auto"
  });
  window.plugins.googleplus.login({
      'webClientId': '320132615636-8f4u2k95equ8nd8v6mvhaod4qm73j3fq.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': false // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    },
    function (obj) {
      //   alert(JSON.stringify(obj)); // do something useful instead of alerting
      // var txt = obj.displayName + " --- " + obj.email + " --- " + obj.imageUrl + " --- " + obj.userId;

      // Socket.client.send('Inscription','Google',obj); -- OLD
      let img_big = obj.imageUrl.split("cp=s")[0] + "cp=s500";
      console.log(obj);
      onsubmit.imageUrl = img.big;
      ServerManager.Connect(apiTypes.Google, obj);
      //document.getElementById('infos').innerHTML = txt;
      //Transport(socket,obj,'google');
      //alert(txt);
    },
    function (msg) {

      $(".loading_connect").css({
        "opacity": "0",
        "pointer-events": "none"
      });
      console.log(msg);
      // alert('error: ' + msg);
    }
  );
}