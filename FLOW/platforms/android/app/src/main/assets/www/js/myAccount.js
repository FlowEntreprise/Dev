var nameMonCompte;
var bioMonCompte;
var mainView = app.addView('.view-main');
var FlowBandeau = 12;
var Follower = 305;
var Following = 250;
var privateID = "@alexis_98";

app.onPageInit('login-screen', function (page) {

    for (var i = 0; i < 10; i++) {
        var new_block = new block($("#MyActivity"), false, null, 89);
        all_blocks.push(new_block);
    }

    console.log("init");
    //nameMonCompte = window.localStorage.getItem("user_name");
    nameMonCompte = "Alexis";
    bioMonCompte = window.localStorage.getItem("user_bio") || "";
    if (bioMonCompte.length < 1) {
        bioMonCompte = "Hey, I'm using Flow";
    }
    $(".fflow-btn").css("display", "none");
    $("#fprofilPicture").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    $("#fnameMonCompte").html(nameMonCompte);
    $("#privateID").html(privateID);
    $("#ffLowBandeauChiffre").append(FlowBandeau);
    $("#ffollowersBandeauChiffre").append(Follower);
    $("#ffollowingBandeauChiffre").append(Following);
    $("#fbioMonCompte").append(bioMonCompte);

    $("#fgobackmonCompte").click(function () {
        mainView.back();
        $(".fflow-btn").css("display", "block");
    });

    var position = $(".scrollMyAccunt").scrollTop();
    var boolScrollTop = true;
    $(".scrollMyAccunt").scroll(function () {
        var scroll = $(".scrollMyAccunt").scrollTop();
        if (scroll > position) {
            if (event.cancelable) {
                event.preventDefault();
                console.log(test);
                // swiping = true;
            } else {
                event.preventDefault();
                event.stopPropagation();
                $("scrollEvent").remove(".swiper-wrapper");
                $("#accountBannerScroll").css("transform", "translate3d(0vw, -30vh, 0vh)");
                // $(".fnavMonCompte").css("top", "-6vh");
                if (boolScrollTop) {
                    $(".fnavMonCompte").removeClass("fnavMonCompteTransitionDown");
                    $(".fnavMonCompte").addClass("fnavMonCompteTransitionTop");
                    $(".ftabsMonCompte").css("transition-duration", "0.4s");
                    $(".fnavMonCompte").css("transform", "translate3d(0vw, -21vh, 0vh)");
                    $(".ftabsMonCompte").css("transform", "translate3d(0vw, -24vh, 0vh)");
                    boolScrollTop = false;
                }
                // $(".ftabsMonCompte").css("top", "8vh");
                $("#MyActivity").removeClass("fblockMonComptePadding");
                $("scrollEvent").addClass(".swiper-wrapper");
                // $("#AccountTabSize.style").attr("top", "5vh");
            }
        } else {
            if (event.cancelable) {
                event.preventDefault();
                console.log(test);
                // swiping = true;
            } else {
                if (scroll < 100) {
                    event.preventDefault();
                    event.stopPropagation();
                    // $(".fnavMonCompte").css("top", "-6vh");
                    if (boolScrollTop == false) {
                        $("scrollEvent").remove(".swiper-wrapper");
                        $("#accountBannerScroll").css("transition-duration", "0.2s");
                        $("#accountBannerScroll").css("transform", "translate3d(0vw, 0vh, 0vh)");
                        $(".fnavMonCompte").removeClass("fnavMonCompteTransitionTop");
                        $(".fnavMonCompte").addClass("fnavMonCompteTransitionDown");
                        $(".ftabsMonCompte").css("transition-duration", "0.2s");
                        $(".scrollMyAccunt").scrollTop("10");
                        var scrollTest = $(".scrollMyAccunt").scrollTop();
                        console.log(scrollTest);
                        $(".fnavMonCompte").css("transform", "translate3d(0vw, 7vh, 0vh)");
                        $(".ftabsMonCompte").css("transform", "translate3d(0vw, 2vh, 0vh)");
                        boolScrollTop = true;
                        $("#MyActivity").addClass("fblockMonComptePadding");
                        $("scrollEvent").addClass(".swiper-wrapper");
                    }
                    // $(".ftabsMonCompte").css("top", "8vh");
                   
                    // $("#AccountTabSize.style").attr("top", "5vh");
                }

            }
        }
        position = scroll;
    });


    // $("#fLikes").click(function(){
    //     $("#fLikes").css("color", "#1A84EF");
    //     $("#fMyActivity").css("color", "#92ABB2");
    //     $("#funderlineMyActivity").css("display", "none");
    //     $("#funderlineLike").css("display", "block");
    // });

    // $("#fMyActivity").click(function(){
    //     $("#fMyActivity").css("color", "#1A84EF");
    //     $("#fLikes").css("color", "#92ABB2");
    //     $("#funderlineMyActivity").css("display", "block");
    //     $("#funderlineLike").css("display", "none");
    // });
});