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
        this.socket.io.on(name,func);
    }

    ConnectionError(err){
        console.clear();
        console.error(err);
    }

    Inscription(data){
        alert(JSON.stringify(data));
    }

    Error(err){
        alert(JSON.stringify(data));
    }

    ErrorCustom(err){
        alert(JSON.stringify(data));
    }

    Connexion(data){
        alert(JSON.stringify(data));
    }
}