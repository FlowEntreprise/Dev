
"use_strict";

class SocketManager {
    constructor(host){

        if(this.isAlreadyDefine === undefined){

            this.isAlreadyDefine = true;

            this.socket = io.connect(host);

            this.ListenManager = new EventListener(this.socket);

            this.client = new EventEmitter(this.socket);
        }
        return this;
    }

}