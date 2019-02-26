var nameMonCompte = "Vanessa";
var mainView = app.addView('.view-main');
 
app.onPageInit('login-screen', function (page) {
    $(".fflow-btn").css("display", "none");
    $("#fprofilPicture").css({"background-image":"url('../src/pictures/girl2.jpg')"});
    $("#fnameMonCompte").append(nameMonCompte);
    $("#fgobackmonCompte").click(function(){
        mainView.back();
        $(".fflow-btn").css("display", "block");
    });
}); 

