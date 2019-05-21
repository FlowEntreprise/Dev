//Global variables used for Server Management :
const ServerParams = {
    ServerURL: "https://api.flowappweb.com/",
    ConnexionURL: "ConnexionFromApi",
    AddFlowURL: "AddFlow",
    UpdateProfileURL: "UpdateProfile",
    GetSingleFlowURL: "GetSingle",
    GetMultipleFlowURL: "GetMultipleFlow"
};
const apiTypes = {
    Twitter: 'twitter',
    Google: 'google',
    Instagram: 'instagram',
    Facebook: 'facebook',
    Flow: 'flow'
};


// Server Manager Class :
class ServerManagerClass {
    constructor() {}

    /* Placez toutes les fonctions faisant des appels au Serveur et à la BDD ici
     * Ne pas hésiter à créer de nouvelles fonctions pour chaque actions 
     * et reprendre la syntaxe des fonctions existantes.
     */

    Connect(api, data) {
        let final_data;
        let DataSend;
        switch (api) {
            case apiTypes.Flow:
                DataSend = {
                    Username: data.Username,
                    Password: data.Password,
                    Name: data.Name,
                    LastName: data.LastName,
                    Email: data.Email,
                    Birth: data.Birth,
                };
                final_data = {
                    Data: DataSend,
                    Action: "Flow"
                };
                break;
            case apiTypes.Facebook:
                DataSend = {
                    Username: data.name,
                    Fullname: data.name,
                    Email: data.email,
                    Birth: data.birthday,
                    Link: data.picture.data.url,
                    Token: data.id
                };
                final_data = {
                    Data: DataSend,
                    Action: "Facebook"
                };
                break;
            case apiTypes.Google:
                const regex = /([a-zA-Z0-9]+\s+[a-zA-Z0-9]+) (\(+[a-zA-Z0-9]+\))/gm;
                const parenthesis = /[\(\)]/gm;
                const res = regex.exec(data.displayName);
                let Username, Fullname;

                if (res != null && res.length == 3) {
                    Username = res[2];
                    Fullname = res[1];
                } else {
                    Username = data.displayName;
                    Fullname = data.displayName;
                }

                Username = Username.replace(parenthesis, '');
                DataSend = {
                    Username: Username,
                    Fullname: Fullname,
                    Email: data.email,
                    Link: data.imageUrl,
                    Token: data.userId
                };
                final_data = {
                    Data: DataSend,
                    Action: "Google"
                };
                break;
            case apiTypes.Twitter:
                DataSend = {
                    Username: data.name,
                    Fullname: data.name,
                    Link: data.profile_image_url,
                    Biographie: data.description,
                    Token: String(data.id)
                };
                final_data = {
                    Data: DataSend,
                    Action: "Twitter"
                };
                break;
            case apiTypes.Instagram:
                DataSend = {
                    Username: data.full_name,
                    Fullname: data.full_name,
                    Link: data.profile_picture,
                    Biographie: data.bio,
                    Token: data.id
                };
                final_data = {
                    Data: DataSend,
                    Action: "Instagram"
                };
                break;
            default:
                console.log("Error in parameters sent to Connect() in ServerManager.");
        }
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.ConnexionURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("Connection success : ");
                console.log(response);
                storeVariables(response);
                ConnectUser();
            },
            error: function (response) {
                console.log("Connection error : ");
                console.log(response);
            }
        });
    }

    UpdateProfile(data) {
        let final_data = {
            Data: data,
            Action: "UpdateProfile",
            TokenId : window.localStorage.getItem("user_token")
        };
        console.log(final_data.Data);
        
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateProfileURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log('Flow update sucessfully: ');
                console.log(response);
                UpdateProfile(final_data.Data.FullName, final_data.Data.Biography);
            },
            error: function (response) {
                console.log("Flow update error : ");
                console.log(response);
                console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
            }
        });
    }

    AddFlow(data) {
        let final_data = {
            Data: data,
            Action: "AddFlow",
            TokenId : window.localStorage.getItem("user_token")
        };

        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddFlowURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log('Flow added sucessfully : ');
                console.log(response);
                ServerManager.GetFlowById(response.ObjectId);
            },
            error: function (response) {
                console.log("Flow adding error : ");
                console.log(response);
            }
        });
    }

    GetFlowById(id) {
        let final_data = {
            Data: {
                IdFlow: id
            },
            Action: "GetSingle"
        };

        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetSingleFlowURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("Flow sucessfully recovered from database :");
                console.log(response);
                PopFlow(response);
            },
            error: function (response) {
                console.log("Flow recovering from database error : ");
                console.log(response);
            }
        });
    }

    GetMyFlow(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: data              
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetMultipleFlowURL,
            data: JSON.stringify(final_data),
            success: function(response){
                ShowMyFlow(response);
            },
            error: function (response) {

            }
        });
    }
}

var ServerManager = new ServerManagerClass();