var connected = true;
var canShowNavbar = true;
var explore_tabs_initialised = false;

$("#tab1").load("pages/home.html");
$("#tab2").load("pages/explore.html");
$("#tab3").load("pages/messages.html");
$("#tab4").load("pages/notifications.html");

$$('#tab1').on('tab:show', function () {
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
        explore_tabs_initialised = true;
    }


});

$$('#tab3').on('tab:show', function () {
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