var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        // //------------------ PERMISSIONS -------------------------------//
        // var permissions = cordova.plugins.permissions;
        // var list = [
        //     permissions.RECORD_AUDIO,
        //     permissions.WRITE_EXTERNAL_STORAGE
        // ];

        // function error() {
        //     alert('Record audio permission not given');
        // }

        // function success(status) {
        //     if (!status.hasPermission) error();
        // }

        // permissions.hasPermission(permissions.RECORD_AUDIO, function (status) {
        //     if (status.hasPermission) {
        //         //alert("Yes :D ");
        //     } else {
        //         permissions.requestPermissions(list, success, error);
        //     }
        // });
    }
};

app.initialize();

var $$ = Dom7;

var app = new Framework7({
    showBarsOnPageScrollEnd: false,
    material: false,
    tapHold: true, //enable tap hold events
}); 