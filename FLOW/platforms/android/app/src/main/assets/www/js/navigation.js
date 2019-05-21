var canShowNavbar = true;
var explore_tabs_initialised = false;

$("#tab1").load("pages/home.html");
$("#tab2").load("pages/explore.html");
$("#tab3").load("pages/messages.html");
$("#tab4").load("pages/notifications.html");

$$('#tab1').on('tab:show', function () {
    $(".navbar").css({"display": "block"});
    app.showNavbar($('.navbar'));
    canShowNavbar = true;

    $(".fhome-bar").css({
        "display": "block"
    });
    $(".fexplore-bar").css({
        "display": "none"
    });
});

$$('#tab2').on('tab:show', function () {
    $(".navbar").css({"display": "block"});
    app.showNavbar($('.navbar'));
    canShowNavbar = true;

    // if (!connected) {
    //     setTimeout(function () {
    //         app.showTab("#tab1");
    //         app.popup('.popup-connect');
    //     }, 100);
    //     //app.popup('.popup-connect');
    // } else {
    //     $(".fhome-bar").css({
    //         "display": "none"
    //     });
    //     $(".fexplore-bar").css({
    //         "display": "block"
    //     });
    //     if (!explore_tabs_initialised) {

    //         var mySwiper3 = app.swiper('.swiper-3', {
    //             pagination: '.swiper-3 .swiper-pagination',
    //             spaceBetween: 0,
    //             slidesPerView: 3
    //         });

    //         mySwiper3.on('slideChangeStart', function () {
    //             var target = "#" + $(".swiper-slide-next").attr("target");
    //             app.showTab(target);
    //         });
    //         explore_tabs_initialised = true;

    //     }

    // }

    $(".fhome-bar").css({
        "display": "none"
    });
    $(".fexplore-bar").css({
        "display": "block"
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

        // var mySwiper4 = app.swiper('.swiper-4', {
        //     pagination: '.swiper-4 .swiper-pagination',
        //     spaceBetween: 0,
        //     slidesPerView: 3
        // });

        // mySwiper4.on('slideChangeStart', function () {
        //     var target = "#" + $(".swiper-slide-next").attr("target");
        //     app.showTab(target);
        // });
        explore_tabs_initialised = true;
    }


});

$$('#tab3').on('tab:show', function () {
    $(".navbar").css({"display": "none"});
    app.hideNavbar($('.navbar'));
    canShowNavbar = false;

    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            app.popup('.popup-connect');
        }, 100);
    }

});

$$('#tab4').on('tab:show', function () {
    $(".navbar").css({"display": "none"});
    app.hideNavbar($('.navbar'));
    canShowNavbar = false;

    if (!connected) {
        setTimeout(function () {
            app.showTab("#tab1");
            app.popup('.popup-connect');
        }, 100);
    }

});


$$('.fnav-btn').on('touchstart', function () {
    if (!$$(this).hasClass("fflow-btn")) {
        PlayNavRipple($$(this));
    }
});

function PlayNavRipple(element) {
    element.removeClass('fripple');
    setTimeout(function () {
        element.addClass('fripple');
    }, 10);
}

document.addEventListener("backbutton", onBackKeyDown, false);
var current_page = "home";

function onBackKeyDown() {
    //alert(current_page);
    // Handle the back button
    if (current_page == "record") {
        app.closeModal('.popup-record');
        current_page = "home";
    }
    else if (current_page == "record-story") {
        app.closeModal('.popup-story-record');
        current_page = "home";    
    }
    else if (current_page == "connect-popup") {
        app.closeModal('.popup-connect');
        current_page = "home";
    }
    else if (current_page == "after-record") {
        app.closeModal('.popup-after-record');
        app.popup('.popup-record');
        current_page = "record";
    }
    else if (current_page == "story") {
        CloseStory();
    }
    else if (current_page == "home") {
        navigator.app.exitApp();
    }
}