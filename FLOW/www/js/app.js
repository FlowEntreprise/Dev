var pages_swiper;
var myaccount_swiper;
var account_swiper;
var explore_swiper;
var canRegisterPTR = true;
var home_ptr;
var top50_ptr;
var recents_ptr;
var notifs_ptr;
var main_topbar;

// Setup all elements
function setupApp() {

    //initialize tabs content
    $(".home_tab").load("pages/home.html", function () {
        home_tab_loaded();
        initMainTopbar(document.querySelector(".home_parent"));
    });

    $(".explore_tab").load("pages/explore.html", function () {
        explore_tab_loaded();
        initMainTopbar(document.querySelector(".top50"));
        initMainTopbar(document.querySelector(".recents"));
        setupFDJ();
        // initialize explore swiper
        // explore_swiper = new Swiper('.explore_tabs');
    });

    $(".messages_tab").load("pages/messages.html", function () {
        messages_tab_loaded();
    });

    $(".notifications_tab").load("pages/notifications.html", function () {
        notifications_tab_loaded();
    });

    // initialize pages_swiper
    pages_swiper = new Swiper('.main_pages');
    pages_swiper.on("slideChange", pageHasChanged);
    pages_swiper.on("sliderMove", function () {
        canRegisterPTR = false
    });
    pages_swiper.on("touchEnd", function () {
        canRegisterPTR = true
    });

    // initialize myaccount_swiper
    myaccount_swiper = new Swiper('.ftabsMonCompte');
    // initialize account_swiper
    account_swiper = new Swiper('.ftabsAccount');

    // initialize new features popup
    console.log
    if (window.localStorage.getItem("new_features_version") != AppVersion.version) {

        // Exception pour cette version : pas de popup nouveautés :
        $(".fred_dot_toolbar_fdj").css("display", "none");
        $(".fred_dot_toolbar_explore").css("display", "none");
        $("#div_new_features").css("display", "block");
        $("#div_new_features_background").css("display", "block");
        $("#border_close_div_new_features")[0].innerHTML = "5 secondes";
        setTimeout(function () {
            $("#border_close_div_new_features")[0].innerHTML = "4 secondes";
        }, 3000);
        setTimeout(function () {
            $("#border_close_div_new_features")[0].innerHTML = "3 secondes";
        }, 4000);
        setTimeout(function () {
            $("#border_close_div_new_features")[0].innerHTML = "2 secondes";
        }, 5000);
        setTimeout(function () {
            $("#border_close_div_new_features")[0].innerHTML = "1 seconde";
        }, 6000);
        setTimeout(function () {
            $("#border_close_div_new_features")[0].innerHTML = "C'est parti !";
            $("#close_div_new_features").css({
                "opacity": "1",
                "pointer-events": "auto"
            });
        }, 7000);

        // Discornect user if needed 
        setTimeout(function () {
            DisconnectUser();
        }, 500);
    } else {
        $(".fred_dot_toolbar_fdj").css("display", "none");
        $(".fred_dot_toolbar_explore").css("display", "none");
    }
}
//initialize hide on scroll main_topbar
function initMainTopbar(scroll_parent) {

    main_topbar = document.querySelector(".main_topbar");
    // let home_parent = document.querySelector(".home_parent");
    let prevScrollpos = 0;
    let scrollOffset = 20; // higher => lower scroll sensivity, lower => higher scroll sensivity
    scroll_parent.onscroll = function () {
        let currentScrollPos = scroll_parent.scrollTop;
        if (currentScrollPos <= 100) {
            main_topbar.style.top = "0";
        } else {
            if (prevScrollpos > currentScrollPos + scrollOffset) {
                showTopBar(main_topbar);
                prevScrollpos = currentScrollPos;
            } else if (prevScrollpos + scrollOffset < currentScrollPos) {
                hideTopBar(main_topbar);
                prevScrollpos = currentScrollPos;
            }
        }
    }

}

function showTopBar(element) {
    if (element) element.style.transform = "translate3d(0, 0, 0)"
}

function hideTopBar(element) {
    let pos_y = "-" + element.clientHeight + "px";
    if (element) element.style.transform = "translate3d(0, " + pos_y + ", 0)"
}

// when pages_swiper changed
function pageHasChanged() {
    let current_page_index = pages_swiper.activeIndex;
    console.log(current_page_index);
    let home_btn = $(".home_btn");
    let explore_btn = $(".explore_btn");
    let messages_btn = $(".messages_btn");
    let notifications_btn = $(".notifications_btn");
    if (current_page_index == 0) {
        home_btn.addClass("active");
        explore_btn.removeClass("active");
        messages_btn.removeClass("active");
        notifications_btn.removeClass("active");
        inHome();
    } else if (current_page_index == 1) {
        home_btn.removeClass("active");
        explore_btn.addClass("active");
        messages_btn.removeClass("active");
        notifications_btn.removeClass("active");
        inExplore();
    } else if (current_page_index == 2) {
        home_btn.removeClass("active");
        explore_btn.removeClass("active");
        messages_btn.addClass("active");
        notifications_btn.removeClass("active");
        inMessages();
    } else if (current_page_index == 3) {
        home_btn.removeClass("active");
        explore_btn.removeClass("active");
        messages_btn.removeClass("active");
        notifications_btn.addClass("active");
        inNotifications();
    }
}