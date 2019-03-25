var nameMonCompte;
var bioMonCompte;
var mainView = app.addView('.view-main');
var FlowBandeau = 12;
var Follower = 305;
var Following = 250;
var privateID = "@alexis_98";
 
app.onPageInit('login-screen', function (page) {
    console.log("init");
    //nameMonCompte = window.localStorage.getItem("user_name");
    nameMonCompte = "Alexis";
    bioMonCompte = window.localStorage.getItem("user_bio") || "";
    if (bioMonCompte.length < 1) {
        bioMonCompte ="Hey, I'm using Flow";
    }
    $(".fflow-btn").css("display", "none");
    $("#fprofilPicture").css({"background-image":"url('"+ window.localStorage.getItem("user_profile_pic") +"')"});
    $("#fnameMonCompte").html(nameMonCompte);
    $("#privateID").html(privateID);
    $("#ffLowBandeauChiffre").append(FlowBandeau);
    $("#ffollowersBandeauChiffre").append(Follower);
    $("#ffollowingBandeauChiffre").append(Following);
    $("#fbioMonCompte").append(bioMonCompte);

    $("#fgobackmonCompte").click(function(){
        mainView.back();
        $(".fflow-btn").css("display", "block");
    });
    
    setTimeout(function() {
        console.log("salut salut");   
        $("#fnavbar").removeClass("navbar-hidden");
    }, 50);


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


