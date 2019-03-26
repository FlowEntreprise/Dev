"use_strict"

class EventListener {
    constructor(socket) {
        this.socket = socket;

        this.AddListener("Inscription", this.Inscription);
        this.AddListener("Connexion", this.Connexion);
        this.AddListener("connect_error", this.ConnectionError);
        this.AddListener("Error-Custom", this.ErrorCustom);
        this.AddListener("Error", this.Error);
        this.AddListener("Flow-Added", this.FlowAdded);
        this.AddListener("Flow-Get", this.FlowGet);
    }

    AddListener(name, func) {
        if (name === "AddListener") return;
        this.socket.on(name, func);
    }

    ConnectionError(err) {
        console.error('connection error');
    }

    Inscription(data) {
        console.log('Inscription');
        console.log(data);
        storeVariables(data);
        ConnectUser();
    }

    Error(err) {
        console.log('error');
        console.log(JSON.stringify(err));
    }

    ErrorCustom(err) {
        console.log('custom_error');
        console.log(JSON.stringify(err));
    }

    Connexion(data) {
        console.log('Connexion');
        console.log(data);
        storeVariables(data);
        ConnectUser();
    }

    FlowAdded(data) {
        console.log('Flow added');
        console.log(data);
        // window.localStorage.setItem("user_token", data.TokenId);
        // window.localStorage.setItem("user_profile_pic", data.Image);
        // ConnectUser();
    }

    FlowGet(data) {
        PopFlow(data);
        console.log("Get Flow");
        console.log(data);
    }
}