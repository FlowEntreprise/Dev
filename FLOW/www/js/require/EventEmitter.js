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
    
    Flow(data){
        const DataSend = {
            Username : data.Username,
            Password : data.Password,
            Name : data.Name,
            LastName : data.LastName,
            Email : data.Email,
            Birth : data.Birth,       
        }
        return {Data : DataSend,Action : "Flow"};
        
    }
    
    Facebook(data){
        const DataSend = {
            Username : data.name,
            Fullname : data.name,
            Email : data.email,
            Birth : data.birthday,
            Link : data.picture.data.url,
            Token : data.id
        };
        return {Data : DataSend,Action : "Facebook"};
        
    }
    
    Google(data){
        const regex = /([a-zA-Z0-9]+\s+[a-zA-Z0-9]+) (\(+[a-zA-Z0-9]+\))/gm ;
        const parenthesis = /[\(\)]/gm ;
        const res = regex.exec(data.displayName);
        let Username,Fullname;

        if(res.length == 3){ Username = res[2];Fullname = res[1]; }
        else{ Username = data.displayName;Fullname = data.displayName; }

        Username = Username.replace(parenthesis,'');
        const DataSend = {
            Username : Username,
            Fullname : Fullname,
            Email : data.email,
            Link : data.imageUrl,
            Token : data.userId
        };
        return {Data : DataSend,Action : "Google"};
        
    }
    
    Twitter(data){
        const DataSend = {
            Username : data.name,
            Link : data.picture.profile_image_url,
            Biographie : data.description,
            Token : data.id
        };
        return {Data : DataSend,Action : "Twitter"};
        
    }
    
    Instagram(data){
        const DataSend = {
            Username : data.full_name,
            Fullname : data.full_name,
            Link : data.picture.profil_picture,
            Biographie : data.bio,
            Token : data.id
        };
        return {Data : DataSend,Action : "Instagram"};
    }
    
    
}
