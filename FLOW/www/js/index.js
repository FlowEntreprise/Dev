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

    }
};

app.initialize();

var $$ = Dom7;

var app = new Framework7({
    showBarsOnPageScrollEnd: false,
    material: false,
    tapHold: true, //enable tap hold events
});




