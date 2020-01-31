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
    LikeFlowComment: "Like/comment",
    LikeFlow: "Like/Flow",
    UpdateProfileURL: "UpdateProfile",
    GetMultipleFlowURL: "GetMultipleFlow",
    GetMyUserInfosURL: "GetInfoUser",
    GetTimeline: "GetTimeline",
    GetUserProfil: "GetProfil",
    GetSingle: "GetSingle",
    ActionFollowProfil: 'Follow',
    UpdateRegisterId : "UpdateRegisterId",
    GetFollowerOfUser : "GetFollowerOfUser",
    GetFollowingOfUser : "GetFollowingOfUser",
    AddStoryComment: "AddStoryComment",
    GetStoryComments: "GetStoryComment",
    AddStoryView: "AddStoryView",
    GetStoryView: "GetStoryView",
    AddNotificationToUser : "AddNotificationToUser",
    UpdateNotificationToView : "UpdateNotificationToView",
    GetNotificationOfUser : "GetNotificationOfUser"
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
                //console.log("Connection success : ");
                //console.log(response);
                storeVariables(response);
                ConnectUser();
            },
            error: function (response) {
                // console.log("Connection error : ");
                // console.log(response);
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
                // console.log('Flow added sucessfully : ');
                // console.log(response);
                // ServerManager.GetFlowById(response.ObjectId);
                TLCurrentIndex = 0;
                ServerManager.GetTimeline(0);
                CloseAfterRecord();
            },
            error: function (response) {
                // console.log("Flow adding error : ");
                // console.log(response);
                CloseAfterRecord();
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

        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetSingleFlowURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                // console.log("Flow sucessfully recovered from database :");
                // console.log(response);
                PopFlow(response.Data, response.LinkBuilder);
            },
            error: function (response) {
                // console.log("Flow recovering from database error : ");
                // console.log(response);
                pullToRefreshEnd();
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
                // console.log('Story added sucessfully : ');
                // console.log(response);
                closeStoryRecord();
                ServerManager.GetStory();
                //ServerManager.GetFlowById(response.ObjectId);
            },
            error: function (response) {
                // console.log("Story adding error : ");
                // console.log(response);
                closeStoryRecord();
            }
        });
    }

    GetStory() {
        let final_data = {
            Data: {},
            Action: "GetStory",
            TokenId: window.localStorage.getItem("user_token")
        };

        // console.log(final_data);
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

        // console.log(final_data);
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
                CloseStory();
            }
        });
    }

    AddFlowComment(data) {
        let final_data = {
            Data: data,
            Action: "AddFlowComment",
            TokenId: window.localStorage.getItem("user_token")
        };

        // console.log(final_data);
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
                // console.log("comment adding from database error : ");
                // console.log(response);
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

                get_all_comment(response, final_data.Data);
                // console.log("Comment sucessfully added to database :");
                // console.log(response);

            },
            error: function (response) {
                // console.log("comment adding from database error : ");
                // console.log(response);
            }
        });
    }

    LikeFlowComment(data, block) {
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

    LikeFlow(data, block) {
        let final_data = {
            Data: data,
            Action: "LikeFlow",
            TokenId: window.localStorage.getItem("user_token")
        };
        var current_bock = block;
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.LikeFlow,
            data: JSON.stringify(final_data),
            success: function (response) {

                //impression_coloring(this, 'like', block.fcomment_like, "comment");
                //color_like(current_bock, response.like === undefined ? false : true);
                console.log("Flow sucessfully liked");
                console.log(response);

            },
            error: function (response) {
                console.log("Flow liked database error : ");
                console.log(response);
            }
        });
    }

    GetMyFlow(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: data
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetMultipleFlowURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                ShowMyFlow(response);
            },
            error: function (response) {

            }
        });
    }

    GetUserFlow(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: data
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetMultipleFlowURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                ShowUserFlow(response);
            },
            error: function (response) {

            }
        });
    }

    GetMyUserInfoNumber(data) {
        let final_data = {
            Data: data
        };
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetMyUserInfosURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                ShowMyInfosUser(response);
            },
            error: function (response) {}
        });
    }

    getInfosUserNumber(data) {
        let final_data = {
            Data: data
        };
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetMyUserInfosURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("getInfosUserNumber");
                ShowInfosUserNumber(response);
            },
            error: function (response) {}
        });
    }

    GetUserInfo(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        console.log("final data = ");
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetUserProfil,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                ShowUserProfile(response);
            },
            error: function (response) {}
        });
    }

    GetFollowerOfUser(data) {
        let final_data = {
            
            TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.Index,
                PrivateId: data.PrivateId
            }
        };
        console.log("final data = " );
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFollowerOfUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                UpdateUsersList(response,data.follow_list);
            },
            error: function (response) {}
        });
    }

    GetFollowingOfUser(data) {
        let final_data = {
            
            TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.Index,
                PrivateId: data.PrivateId
            }
        };
        console.log("final data = " );
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFollowingOfUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                UpdateUsersList(response,data.follow_list);
            },
            error: function (response) {}
        });
    }

    ActionFollow(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.ActionFollowProfil,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                FollowResponse(response,data.type,data.block_user);
            },
            error: function (response) {}
        });
    }

    UpdateProfile(data) {
        let final_data = {
            Data: data,
            Action: "UpdateProfile",
            TokenId: window.localStorage.getItem("user_token")
        };
        // console.log(final_data.Data);

        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateProfileURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                // console.log('Flow update sucessfully: ');
                // console.log(response);
                UpdateProfile(final_data.Data.FullName, final_data.Data.Biography);
            },
            error: function (response) {
                // console.log("Flow update error : ");
                // console.log(response);
                // console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
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
                // ServerManager.GetFlowById(response.ObjectId);
                CloseAfterRecord();
            },
            error: function (response) {
                // console.log("Flow adding error : ");
                // console.log(response);
            }
        });
    }

    GetTimeline(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data
            }
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetTimeline,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log("success");
                console.log(response);
                UpdateTimeline(response);
            },
            error: function (response) {
                console.log("error");
                console.log(response);
                StopRefreshTL();
            }
        });
    }

    GetSingle(data) {
        let final_data = {

            Data: data,
            TokenId: window.localStorage.getItem("user_token")

        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetSingle,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                console.log("success dans la recuperation de flow unique");
                flow_specifique(response.Data, response.LinkBuilder);

            },
            error: function (response) {
                console.log(response);
                console.log("error dans la recuperation de flow unique");

            }
        });
    }

    UpdateRegisterId(data) {
        let final_data = {
            Data: data,
            Action: "RegisterId",
            TokenId: window.localStorage.getItem("user_token")
        };
        // console.log(final_data.Data);

        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateRegisterId,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log('registerId update sucessfully: ');
                console.log(response);

            },
            error: function (response) {
                console.log("registerId update error : ");
                console.log(response);
                // console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
            }
        });
    }

    AddNotificationToUser(data) {
        let final_data ={
            Data : data,            
            TokenId: window.localStorage.getItem("user_token")
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddNotificationToUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response); 
                console.log("notif added to bdd");
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    UpdateNotificationToView(data) {
        let final_data ={
            Data : data,            
            TokenId: window.localStorage.getItem("user_token")
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateNotificationToView,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                console.log("notif set to seen");                
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    GetNotificationOfUser(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetNotificationOfUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                
                UpdateNotificationList(response);                
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    Send_notif(data) {

        var data_notif_to_bdd ={
            TypeNotification : data.data.type,
            RegisterIdOfUserToNotify : data.to,
            Content : data.data.sender_info.comment_text,
            IdFlow : data.data.sender_info.IdFlow

        };
        $.ajax({

            type: "POST",
            url: "https://fcm.googleapis.com/fcm/send",
            headers: {
                Authorization: 'key=' + 'AAAASolkDdQ:APA91bGQTqtjxefUeH3JhJQXP30B6d6TgHYN239VGsaX3-0qpBEH7_Wy_9MLiVOlniHQ9gqZcHt3q76d5QGb3It-qUIJfo954NZBmz9INY765rMn8S40Cz-fw5zTeBfoQVnZSE3oW4oL'
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),
            
            success: function (response) {
/*
                TypeNotification : data.data.type
                RegisterIdOfUserToNotify : data.to
                Content : data.data.message
*/
                ServerManager.AddNotificationToUser(data_notif_to_bdd);
                console.log("Notif envoyé avec succes");
            },
            error: function (response) {
                console.log("La notif n'a pas été envoyé");
            }

        });


    }

    AddStoryComment(data) {
        let final_data = {
            Data: data,
            Action: "AddStoryComment",
            TokenId: window.localStorage.getItem("user_token")
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddStoryComment,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                story_comment_uploaded();
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    GetStoryComments(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.index,
                ObjectId: data.objectId
            }
        };
        console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetStoryComments,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                if (response.Data) {
                    loadStoryComments(response);
                }
                // UpdateTimeline(response);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    AddStoryView(data) {
        let final_data = {
            Data: data,
            Action: "AddStoryView",
            TokenId: window.localStorage.getItem("user_token")
        };
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddStoryView,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                // story_comment_uploaded();
            },
            error: function (response) {
                console.log(response);
            }
        });
    }

    GetStoryView(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.Index,
                ObjectId: data.ObjectId
            }
        };
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetStoryView,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                if (response.Data) {
                    loadStorySeen(response);
                }
                // loadStoryComments(response);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }
}

var ServerManager = new ServerManagerClass();