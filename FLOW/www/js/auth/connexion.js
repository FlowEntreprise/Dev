// function Transport(socket, data, connexion) 
// {
//     if(typeof socket != 'object') {alert('error type of socket'+ typeof socket); return;}
//     this.socket = socket;
//     this.dataToSend = data;
//     this.TypeOfConnexion = connexion;
//     this.emit = function () 
//     {
//         socket.emit('Inscription',{
//         TypeOfConnexion:this.TypeOfConnexion,
//         DataToReceived:this.dataToSend
//         });
//     }
//     this.emit();
// }
// socket module node emit -> envoie des données (envoi de tab json)

if (window.cordova.platformId == "android") {
    $(".fgoogle_btn")[0].src = "../www/src/icons/google@3x.png";
} else {
    $(".fgoogle_btn")[0].src = "../www/src/icons/apple@3x.png";
}

$(".ftwitter_btn").on("click", function () {
    TWLogin();
});

$(".ffacebook_btn").on("click", function () {
    ConnectFB();
});
$(".fgoogle_btn").on("click", function () {
    console.log("google / apple clicked");
    if (window.cordova.platformId == "android") {
        google_conn();
    } else {
        signin_with_apple();
    }
});
$(".finsta_btn").on("click", function () {
    login_insta();
});
$("#fbuton_inscription").on("click", function () {
    alert("L'inscripton avec mail ou numero de téléphone n'est pas encore disponible dans cette version\nElle le sera très prochainement !");
});