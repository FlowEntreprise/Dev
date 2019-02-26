var nameMonCompte = "Vanessa";
var bioMonCompte ="Hey, I'm using Flow";
var mainView = app.addView('.view-main');
 
app.onPageInit('login-screen', function (page) {
    $(".fflow-btn").css("display", "none");
    $("#fprofilPicture").css({"background-image":"url('src/pictures/girl1.jpg')"});
    $("#fMonCompteSpace").append(nameMonCompte);
    $("#fgobackmonCompte").click(function(){
        mainView.back();
        $(".fflow-btn").css("display", "block");
    });
}); 

