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