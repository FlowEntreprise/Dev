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

$(".ftwitter_btn").on("click", function () {
    TWLogin();
});

$(".ffacebook_btn").on("click", function () {
    ConnectFB();
});
$(".fgoogle_btn").on("click", function () {
    console.log("google clicked");
    google_conn();
});
$(".finsta_btn").on("click", function () {
    login_insta();
});