/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
    material: true
});

var connected = false;
var canShowNavbar = true;
DisconnectUser();

$("#tab1").load("pages/home.html");
$("#tab2").load("pages/explore.html");
$("#tab3").load("pages/messages.html");
$("#tab4").load("pages/notifications.html");

$$('#tab1').on('tab:show', function () {
    app.showNavbar($('.navbar'));
    canShowNavbar = true;
});

$$('#tab2').on('tab:show', function () {
    app.showNavbar($('.navbar'));
    canShowNavbar = true;
});

$$('#tab3').on('tab:show', function () {
    app.hideNavbar($('.navbar'));
    canShowNavbar = false;

});

$$('#tab4').on('tab:show', function () {
    app.hideNavbar($('.navbar'));
    canShowNavbar = false;

});

var userConnected = false;
var ptrContent = $$('.pull-to-refresh-content');

// Add 'refresh' listener on it
ptrContent.on('ptr:refresh', function (e) {
    // Emulate 2s loading
    console.log("refreshing...")
    setTimeout(function () {
        // When loading done, we need to reset it
        console.log("refreshed !");
        $("#ptr_arrow").css("opacity", "0");
        app.pullToRefreshDone();
        ConnectUser();
    }, 1000);
});

ptrContent.on('ptr:pullstart', function (e) {
    console.log("pull start");
    $("#ptr_arrow").css("opacity", "1");

});

ptrContent.on('ptr:pullend', function (e) {
    console.log("pull end");
    $("#ptr_arrow").css("opacity", "0");
});

function ConnectUser() {
    console.log("user connected");
    connected = true;
    $(".fneed_connect").css({
        "display": "none"
    });
    //$( "#fswipe_area" ).css({"pointer-events": "all"});
}

function DisconnectUser() {
    console.log("user disconnected");
    connected = false;
    $(".fneed_connect").css({
        "display": "block"
    });
    app.showTab("#tab1");
    //$( "#fswipe_area" ).css({"pointer-events": "none"});
}

$$('.fneed_connect').on('click', function () {
    if (!connected) {
        app.popup('.popup-connect');
    }
});

$$('#tab2').on('tab:show', function () {
    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            app.popup('.popup-connect');
        }, 100);
        //app.popup('.popup-connect');
    }
});
$$('#tab3').on('tab:show', function () {
    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            app.popup('.popup-connect');
        }, 100);
        //app.popup('.popup-connect');
    }
});
$$('#tab4').on('tab:show', function () {
    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            app.popup('.popup-connect');
        }, 100);
        //app.popup('.popup-connect');
    }
});