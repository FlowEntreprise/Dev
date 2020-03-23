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
$("#fbuton_inscription").on("click", function () {
    alert("L'inscripton avec mail ou numero de téléphone n'est pas encore disponible dans cette version\nElle le sera très prochainement !");
});