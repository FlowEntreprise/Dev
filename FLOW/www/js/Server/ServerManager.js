//Global variables used for Server Management :
const ServerParams = {
    ServerURL: "https://api.flowappweb.com/",
    ConnexionURL: "ConnexionFromApi",
    AddFlowURL: "AddFlow",
    GetSingleFlowURL: "GetSingle",
    AddStoryURL: "AddStory",
    GetStoryURL: "GetStory",
    GetUserStoryURL: "GetUserStory",
    AddFlowComment: "AddFlowComment",
    GetFlowComment: "GetFlowComment",
    LikeFlowComment : "Like/comment"
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

    AddFlow(data) {
        let final_data = {
            Data: data,
            Action: "AddFlow",
            TokenId: window.localStorage.getItem("user_token")
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
            Action: "GetSingle",
            TokenId: window.localStorage.getItem("user_token")
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

    AddStory(data) {
        let final_data = {
            Data: data,
            Action: "AddStory",
            TokenId: window.localStorage.getItem("user_token")
        };

        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddStoryURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log('Story added sucessfully : ');
                console.log(response);
                //ServerManager.GetFlowById(response.ObjectId);
            },
            error: function (response) {
                console.log("Story adding error : ");
                console.log(response);
            }
        });
    }

    GetStory() {
        let final_data = {
            Data: {},
            Action: "GetStory",
            TokenId: window.localStorage.getItem("user_token")
        };

        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetStoryURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("Story sucessfully recovered from database :");
                console.log(response);
                UpdateStoryDataFromServer(response);
                //PopFlow(response);
            },
            error: function (response) {
                console.log("Story recovering from database error : ");
                console.log(response);
            }
        });
    }

    GetUserStory(private_id) {
        let final_data = {
            Data: {
                PrivateId: private_id
            },
            Action: "GetUserStory",
            TokenId: window.localStorage.getItem("user_token")
        };

        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetUserStoryURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("User story sucessfully recovered from database :");
                console.log(response);
                GetStoryForUserFromServer(response);
                //PopFlow(response);
            },
            error: function (response) {
                console.log("User story recovering from database error : ");
                console.log(response);
            }
        });
    }

    AddFlowComment(data) {
        let final_data = {
            Data: data,
            Action: "AddFlowComment",
            TokenId: window.localStorage.getItem("user_token")
        };

        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddFlowComment,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("response tu connais : " + response + "");
                var obj = final_data.Data;
                obj.IdComment = response.IdComment;
                send_comment_to_server(obj);

            },
            error: function (response) {
                console.log("comment adding from database error : ");
                console.log(response);
            }
        });
    }

    GetFlowComment(data) {
        let final_data = {
            Data: data,
            Action: "GetFlowComment",
            TokenId: window.localStorage.getItem("user_token")
        };

        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFlowComment,
            data: JSON.stringify(final_data),
            success: function (response) {

                get_all_comment(response);
                console.log("Comment sucessfully added to database :");
                console.log(response);

            },
            error: function (response) {
                console.log("comment adding from database error : ");
                console.log(response);
            }
        });
    }

    LikeFlowComment(data,block) {
        let final_data = {
            Data: data,
            Action: "LikeFlowComment",
            TokenId: window.localStorage.getItem("user_token")
        };
        var current_bock = block;
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.LikeFlowComment,
            data: JSON.stringify(final_data),
            success: function (response) {

                //impression_coloring(this, 'like', block.fcomment_like, "comment");
                color_like(current_bock, response.like === undefined ? false : true);
                console.log("Comment sucessfully liked to database :");
                console.log(response);

            },
            error: function (response) {
                console.log("comment liked database error : ");
                console.log(response);
            }
        });
    }


}

var ServerManager = new ServerManagerClass();