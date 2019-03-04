"use_strict"

class EventEmitter{
    constructor(socket){
        this.socket = socket;
    }
    
    send(type,name,data,option = null){
        if(name === "socket") return;

        if(option === null) this.socket.emit( type,this[name](data) );
        else this.socket.emit( type,this[name](data,option) );
        
    }
    
    InscriptionFlow(data){
        DataSend = {
            Username : data.Username,
            Password : data.Password,
            Name : data.Name,
            LastName : data.LastName,
            Email : data.Email,
            Birth : data.Birth,       
        }
        return {Data : DataSend,Action : "Flow"};
        
    }
    
    InscriptionFacebook(data){
        DataSend = {
            Username : data.name,
            Fullname : data.name,
            Email : data.email,
            Birth : data.birthday,
            Link : data.picture.data.url,
            Token : data.id
        };
        return {Data : DataSend,Action : "Facebook"};
        
    }
    
    InscriptionGoogle(data){
        DataSend = {
            Username : data.displayName,
            Action : "Google",
            Fullname : data.displayName,
            Email : data.email,
            Link : data.picture.imageUrl,
            Token : data.userId
        };
        return {Data : DataSend,Action : "Google"};
        
    }
    
    InscriptionTwitter(data){
        DataSend = {
            Username : data.name,
            Action : "Twitter",
            Link : data.picture.profile_image_url,
            Biographie : data.description,
            Token : data.id
        };
        return {Data : DataSend,Action : "Twitter"};
        
    }
    
    InscriptionInstagram(data){
        DataSend = {
            Username : data.full_name,
            Action : "Instagram",
            Fullname : data.full_name,
            Link : data.picture.profil_picture,
            Biographie : data.bio,
            Token : data.id
        };
        return {Data : DataSend,Action : "Instagram"};
    }
    
    
}
