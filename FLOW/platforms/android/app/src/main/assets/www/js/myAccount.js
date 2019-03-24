var nameMonCompte;
var bioMonCompte;
var mainView = app.addView('.view-main');
var FlowBandeau = 12;
var Follower = 305;
var Following = 250;
 
app.onPageInit('login-screen', function (page) {
    nameMonCompte = window.localStorage.getItem("user_name");
    bioMonCompte = window.localStorage.getItem("user_bio");
    if (bioMonCompte.length < 1) {
        bioMonCompte ="Hey, I'm using Flow";
    }

    $(".fflow-btn").css("display", "none");
    $("#fprofilPicture").css({"background-image":"url('"+ window.localStorage.getItem("user_profile_pic") +"')"});
    $("#fnameMonCompte").html(nameMonCompte);
    $("#ffLowBandeauChiffre").append(FlowBandeau);
    $("#ffollowersBandeauChiffre").append(Follower);
    $("#ffollowingBandeauChiffre").append(Following);
    $("#fbioMonCompte").append(bioMonCompte);

    $("#fgobackmonCompte").click(function(){
        mainView.back();
        $(".fflow-btn").css("display", "block");
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