var canShowNavbar = true;
var explore_tabs_initialised = false;
var in_comments = false;
var in_likes = false;
var in_specifique = false;
var in_options = false;
var in_editprofile = false;
$("#tab1").load("pages/home.html");
$("#tab2").load("pages/explore.html");
$("#tab3").load("pages/messages.html");
$("#tab4").load("pages/notifications.html");

$(".navbar").css({
    "display": "block",
    "height": "calc(19 * var(--custom-vh))"
});
// $("#popup-myaccount").find(".popup_content").load("pages/myAccount.html");

$$('#tab1').on('tab:show', function () {
    $(".navbar").css({
        "display": "block",
        "height": "calc(19 * var(--custom-vh))"
    });
    app.showNavbar($('.navbar'));
    canShowNavbar = true;
    current_page = "home";

    $(".fhome-bar").css({
        "display": "block"
    });
    $(".fexplore-bar").css({
        "display": "none"
    });
    $(".fnotifications-bar").css({
        "display": "none"
    });
    stopAllBlocksAudio();
});

$$('#tab2').on('tab:show', function () {
    $(".navbar").css({
        "display": "block",
        "height": "calc(19 * var(--custom-vh))"
    });
    app.showNavbar($('.navbar'));
    canShowNavbar = true;
    current_page = "explore";

    $(".fhome-bar").css({
        "display": "none"
    });
    $(".fexplore-bar").css({
        "display": "block"
    });
    $(".fnotifications-bar").css({
        "display": "none"
    });
    if (!explore_tabs_initialised) {

        var mySwiper3 = app.swiper('.swiper-3', {
            pagination: '.swiper-3 .swiper-pagination',
            spaceBetween: 0,
            slidesPerView: 3
        });

        mySwiper3.on('slideChangeStart', function () {
            var target = "#" + $(".swiper-slide-next").attr("target");
            app.showTab(target);
        });

        explore_tabs_initialised = true;
    }

    stopAllBlocksAudio();
});

$$('#tab3').on('tab:show', function () {
    $(".navbar").css({
        "display": "none"
    });
    app.hideNavbar($('.navbar'));
    canShowNavbar = false;
    current_page = "messages";

    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            Popup("popup-connect", true, 45);
        }, 100);
    }

    stopAllBlocksAudio();
});

$$('#tab4').on('tab:show', function () {
    if (window.cordova.platformId == "android") {
        $(".navbar").css({
            "display": "block",
            "height": "calc(8 * var(--custom-vh))"
        });
    } else {
        $(".navbar").css({
            "display": "block",
            "height": "calc(8 * var(--custom-vh) + 15px)"
        });
    }
    app.showNavbar($('.navbar'));
    canShowNavbar = true;
    current_page = "home";

    $(".fhome-bar").css({
        "display": "none"
    });
    $(".fexplore-bar").css({
        "display": "none"
    });
    $(".fnotifications-bar").css({
        "display": "block"
    });
    canShowNavbar = true;
    current_page = "notifications";

    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            Popup("popup-connect", true, 45);
        }, 100);
    }

    stopAllBlocksAudio();

});


$$('.fnav-btn').on('touchstart', function () {
    if (!$$(this).hasClass("fflow-btn")) {
        PlayNavRipple($$(this));
    }
});

function PlayNavRipple(element) {
    // element.removeClass('fripple');
    // setTimeout(function () {
    //     element.addClass('fripple');
    // }, 10);
}

document.addEventListener("backbutton", onBackKeyDown, false);
var current_page = "home";

function onBackKeyDown() {
    //alert(current_page);
    // Handle the back button
    if (in_options) {
        Popup("popup-option", false);
        in_options = false;
    } else if (in_comments) {
        Popup("popup-comment", false);
        in_comments = false;
    } else if (in_likes) {
        Popup("popup-likes", false);
        in_likes = false;
    } else if (in_specifique) {
        Popup("popup-specifique", false);
        in_specifique = false;
    } else if (in_editprofile) {
        closeEditProfile();
        in_editprofile = false;
    } else if (searching) {
        back_search();
    } else if (current_page == "record") {
        // app.closeModal('.popup-record');
        Popup("popup-record", false);
        if (recording) {
            console.log("stop recording");
            stopCapture(false);
        }
        current_page = "home";
    } else if (current_page == "record-story") {
        // app.closeModal('.popup-story-record');
        Popup("popup-story-record", false);
        if (recording) {
            console.log("stop recording");
            stopCapture(false);
        }
        current_page = "home";
    } else if (current_page == "connect-popup") {
        // app.closeModal('.popup-connect');
        Popup("popup-connect", false);
        current_page = "home";
    } else if (current_page == "after-record") {
        // app.closeModal('.popup-after-record');
        // app.popup('.popup-record');
        Popup("popup-after-record", false);
        Popup("popup-record", true);
        current_page = "record";
        stopAllBlocksAudio();
    } else if (current_page == "after-story-record") {
        // app.closeModal('.popup-after-story-record');
        Popup("popup-after-story-record", false);
        // app.popup('.popup-story-record');
        Popup("popup-story-record", true);
        current_page = "record-story";
        stopAllBlocksAudio();
    } else if (current_page == "story") {
        previousStory(0);
        // CloseStory();
    } else if (current_page == "my-account") {
        Popup("popup-myaccount", false);
        current_page = "home";
        stopAllBlocksAudio();
        $(".fflow-btn").css("display", "block");
        $(".flow-btn-shadow").css("display", "block");
        $(".fflow-btn").css("z-index", "1");
        $(".flow-btn-shadow").css("z-index", "0");
    } else if (current_page == "account") {
        Popup("popup-account", false);
        current_page = "home";
        stopAllBlocksAudio();
        $(".fflow-btn").css("display", "block");
        $(".flow-btn-shadow").css("display", "block");
        $(".fflow-btn").css("z-index", "1");
        $(".flow-btn-shadow").css("z-index", "0");
    } else if (current_page == "home") {
        navigator.app.exitApp();
        stopAllBlocksAudio();
    }

    analytics.setCurrentScreen(current_page);
}