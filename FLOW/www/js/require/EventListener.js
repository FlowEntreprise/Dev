"use_strict"

class EventListener {
    constructor(socket){
        this.socket = socket;
        
        this.AddListener("Inscription",this.Inscription);
        this.AddListener("Connexion",this.Connexion);
        this.AddListener("connect_error",this.ConnectionError);
        this.AddListener("Error-Custom",this.ErrorCustom);
        this.AddListener("Error",this.Error);
    }

    AddListener(name,func){
        if(name === "AddListener") return;
        this.socket.on(name,func);
    }

    ConnectionError(err){
        console.error('connection error');
    }

    Inscription(data){
        alert('Inscription');
        alert(JSON.stringify(data));
        ConnectUser();
    }

    Error(err){
        console.log('error');
        alert(JSON.stringify(err));
    }

    ErrorCustom(err){
        console.log('custom_error');
        alert(JSON.stringify(err));
    }

    Connexion(data){
        alert('Connexion');
        alert(JSON.stringify(data));
        ConnectUser(); 
    }
}