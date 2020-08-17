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
    GetFlowLikes: "GetFlowLikes",
    LikeFlowComment: "Like/comment",
    LikeFlow: "Like/Flow",
    UpdateProfileURL: "UpdateProfile",
    GetMultipleFlowURL: "GetMultipleFlow",
    GetMyUserInfosURL: "GetInfoUser",
    GetTimeline: "GetTimeline",
    GetUserProfil: "GetProfil",
    GetLikedFlows: "GetLikedFlows",
    GetSingle: "GetSingle",
    ActionFollowProfil: 'Follow',
    UpdateRegisterId: "UpdateRegisterId",
    GetFollowerOfUser: "GetFollowerOfUser",
    GetFollowingOfUser: "GetFollowingOfUser",
    AddStoryComment: "AddStoryComment",
    GetStoryComments: "GetStoryComment",
    AddStoryView: "AddStoryView",
    GetStoryView: "GetStoryView",
    SearchUser: "SearchUserForTabExplore",
    SearchUserForTabExplore: "SearchUserForTabExplore",
    SearchFlow: "SearchFlowForTabExplore",
    GetTop50: "GetTop50",
    AddNotificationToUser: "AddNotificationToUser",
    UpdateNotificationToView: "UpdateNotificationToView",
    GetNotificationOfUser: "GetNotificationOfUser",
    DeleteFlow: "DeleteFlow",
    DeleteComment: "DeleteComment",
    BlockUser: "BlockUser",
    UnBlockUser: "UnBlockUser",
    GetBlockedUsers: "GetBlockedUsers",
    AddReportFlow: "AddReportFlow"
};

const apiTypes = {
    Twitter: 'twitter',
    Google: 'google',
    Instagram: 'instagram',
    Facebook: 'facebook',
    Flow: 'flow',
    Apple: 'apple'
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
                    // Birth: data.birthday,
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
            case apiTypes.Apple:
                DataSend = {
                    Username: data.username,
                    Fullname: data.full_name,
                    Link: data.profile_picture,
                    Biographie: data.bio,
                    Token: data.id
                };
                final_data = {
                    Data: DataSend,
                    Action: "Apple"
                };
                break;
            default:
                //console.log("Error in parameters sent to Connect() in ServerManager.");
        }
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.ConnexionURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                //// console.log("Connection success : ");
                //// console.log(response);
                storeVariables(response);
                ConnectUser();
            },
            error: function (response) {
                //// console.log("Connection error : ");
                //// console.log(response);
            }
        });
    }

    TwitterShowUser(data) {

        // var auth = {
        //     //
        //     // Update with your auth tokens.
        //     //
        //     consumerKey: "YOUR_CONSUMER_KEY",
        //     consumerSecret: "YOUR_CONSUMER_SECRET",
        //     accessToken: "YOUR_TOKEN",
        //     // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
        //     // You wouldn't actually want to expose your access token secret like this in a real application.
        //     accessTokenSecret: "YOUR_TOKEN_SECRET",
        //     serviceProvider: {
        //         signatureMethod: "HMAC-SHA1"
        //     }
        // };

        // var terms = 'food';
        // var near = 'San+Francisco';

        // var accessor = {
        //     consumerSecret: auth.consumerSecret,
        //     tokenSecret: auth.accessTokenSecret
        // };

        // parameters = [];
        // parameters.push(['term', terms]);
        // parameters.push(['location', near]);
        // parameters.push(['callback', 'cb']);
        // parameters.push(['oauth_consumer_key', auth.consumerKey]);
        // parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        // parameters.push(['oauth_token', auth.accessToken]);
        // parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        // var message = {
        //     'action': 'http://api.yelp.com/v2/search',
        //     'method': 'GET',
        //     'parameters': parameters
        // };

        // OAuth.setTimestampAndNonce(message);
        // OAuth.SignatureMethod.sign(message, accessor);

        // var parameterMap = OAuth.getParameterMap(message.parameters);
        // parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
        // console.log(parameterMap);

        // $.ajax({
        //     'url': message.action,
        //     'data': parameterMap,
        //     'cache': true,
        //     'dataType': 'jsonp',
        //     'jsonpCallback': 'cb',
        //     'success': function (data, textStats, XMLHttpRequest) {
        //         console.log(data);
        //         var output = prettyPrint(data);
        //         $("body").append(output);
        //     }
        // });

        ////////////////////////////////////
        var settings = {
            "url": "https://api.twitter.com/1.1/users/show.json?user_id=960333428",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "OAuth oauth_consumer_key=\"JwyvPlw7GcOvE8pXmRvqTyZL3\",oauth_token=\"960333428-EF9gwRa1usCDYQ6GBPVGgVduAFLdRyZHLZCixF7S\",oauth_signature_method=\"HMAC-SHA1\",oauth_timestamp=\"1597676530\",oauth_nonce=\"XhVLLyWWcsA\",oauth_version=\"1.0\",oauth_signature=\"JJLiWdDkjC%2BhnjPegsSk9UkxU%2BU%3D\"",
                "Cookie": "personalization_id=\"v1_A+UCZ1kvLIM8Y8NnXlCvAQ==\"; guest_id=v1%3A159762354176648958; lang=en"
            },
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            let txt = response.name + " --- " + response.screen_name + " --- " + response.profile_image_url + " --- " + response.description + "---" + response.id;
            console.log(txt);
            response.profile_image_url = response.profile_image_url.replace("_normal", "");
            ServerManager.Connect(apiTypes.Twitter, response);
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
                //// console.log('Flow added sucessfully : ');
                //// console.log(response);
                // ServerManager.GetFlowById(response.ObjectId);
                TLCurrentIndex = 0;
                ServerManager.GetTimeline(0);
                CloseAfterRecord();
            },
            error: function (response) {
                //// console.log("Flow adding error : ");
                //// console.log(response);
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

        //// console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetSingleFlowURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                //// console.log("Flow sucessfully recovered from database :");
                //// console.log(response);
                PopFlow(response.Data, response.LinkBuilder);
            },
            error: function (response) {
                //// console.log("Flow recovering from database error : ");
                //// console.log(response);
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
                //// console.log('Story added sucessfully : ');
                //// console.log(response);
                closeStoryRecord();
                ServerManager.GetStory();
                //ServerManager.GetFlowById(response.ObjectId);
            },
            error: function (response) {
                //// console.log("Story adding error : ");
                //// console.log(response);
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

        //// console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetStoryURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("Story sucessfully recovered from database :");
                //console.log(response);
                UpdateStoryDataFromServer(response);
                //PopFlow(response);
            },
            error: function (response) {
                //console.log("Story recovering from database error : ");
                //console.log(response);
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

        //// console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetUserStoryURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("User story sucessfully recovered from database :");
                //console.log(response);
                GetStoryForUserFromServer(response);
                //PopFlow(response);
            },
            error: function (response) {
                //console.log("User story recovering from database error : ");
                //console.log(response);
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

        //// console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddFlowComment,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("response tu connais : " + response + "");
                var obj = final_data.Data;
                obj.IdComment = response.IdComment;
                send_comment_to_server(obj);

            },
            error: function (response) {
                //// console.log("comment adding from database error : ");
                //// console.log(response);
            }
        });
    }

    GetFlowComment(data) {
        let final_data = {
            Data: data,
            Action: "GetFlowComment",
            TokenId: window.localStorage.getItem("user_token")
        };

        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFlowComment,
            data: JSON.stringify(final_data),
            success: function (response) {

                get_all_comment(response, final_data.Data);
                //// console.log("Comment sucessfully added to database :");
                //// console.log(response);

            },
            error: function (response) {
                //// console.log("comment adding from database error : ");
                //// console.log(response);
            }
        });
    }

    GetFlowLikes(data) {
        let final_data = {
            Data: data,
            Action: "GetFlowLikes",
            TokenId: window.localStorage.getItem("user_token")
        };

        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFlowLikes,
            data: JSON.stringify(final_data),
            success: function (response) {

                get_all_likes(response, final_data.Data);
                //// console.log("Comment sucessfully added to database :");
                //console.log(response);

            },
            error: function (response) {
                //// console.log("comment adding from database error : ");
                //console.log(response);
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
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.LikeFlowComment,
            data: JSON.stringify(final_data),
            success: function (response) {

                //impression_coloring(this, 'like', block.fcomment_like, "comment");
                color_like(current_bock, response.like === undefined ? false : true);
                //console.log("Comment sucessfully liked to database :");
                //console.log(response);

            },
            error: function (response) {
                //console.log("comment liked database error : ");
                //console.log(response);
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
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.LikeFlow,
            data: JSON.stringify(final_data),
            success: function (response) {

                //impression_coloring(this, 'like', block.fcomment_like, "comment");
                //color_like(current_bock, response.like === undefined ? false : true);
                //console.log("Flow sucessfully liked");
                //console.log(response);

            },
            error: function (response) {
                //console.log("Flow liked database error : ");
                //console.log(response);
            }
        });
    }

    GetMyFlow(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: data
        };
        //// console.log(final_data);
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

    GetLikedFlows(data, mine) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: data
        };
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetLikedFlows,
            data: JSON.stringify(final_data),
            success: function (response) {
                if (connected == true) {
                    liked_flow_get_block_and_blocked_users(response, mine);
                } else {
                    if (mine) {
                        ShowMyLikedFlows(response);
                    } else {
                        ShowLikedFlows(response);
                    }
                }
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
        //// console.log(final_data);
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
                //console.log(response);
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
                //console.log("on recup le getInfosUserNumber");
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
        //console.log("final data = ");
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetUserProfil,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("on recup le profil");
                if (response == "ERROR GET PROFIL") {
                    // alert("Utilisateur introuvable");
                    navigator.notification.alert("Utilisateur introuvable", alertDismissed, "Information");
                } else {

                    ShowUserProfile(response);
                }
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
        //console.log("final data = ");
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFollowerOfUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("nombre de follower thomas ");
                //console.log(response);
                UpdateFollowersList(response, data.follow_list);
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
        //console.log("final data = ");
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetFollowingOfUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                if (data.follow_list == true) {
                    UpdateIdentificationList(response, data.follow_list);
                } else {
                    UpdatefollowingsList(response, data.follow_list);
                }
            },
            error: function (response) {}
        });
    }

    ActionFollow(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.ActionFollowProfil,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                // let myApp = new Framework7();
                // myApp.pullToRefreshTrigger(ptrContent);
                RefreshTL();
                FollowResponse(response, data.type, data.block_user);

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
        //// console.log(final_data.Data);

        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateProfileURL,
            data: JSON.stringify(final_data),
            success: function (response) {
                //// console.log('Flow update sucessfully: ');
                //// console.log(response);
                UpdateProfile(final_data.Data.FullName, final_data.Data.Biography);
            },
            error: function (response) {
                //// console.log("Flow update error : ");
                //// console.log(response);
                //// console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
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
                //console.log('Flow added sucessfully : ');
                //console.log(response);
                // ServerManager.GetFlowById(response.ObjectId);
                CloseAfterRecord();
            },
            error: function (response) {
                //// console.log("Flow adding error : ");
                //// console.log(response);
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
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetTimeline,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("success");
                //console.log(response);
                timeline_get_block_and_blocked_users(response);
            },
            error: function (response) {
                //console.log("error");
                //console.log(response);
                StopRefreshTL();
            }
        });
    }

    GetSingle(data, show_comment) {
        let final_data = {

            Data: data,
            TokenId: window.localStorage.getItem("user_token")

        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetSingle,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                //console.log("success dans la recuperation de flow unique");
                if (response == "ERROR GET FLOW") {
                    // alert("Ce flow n'est plus disponible");
                    navigator.notification.alert("Ce flow n'est plus disponible", alertDismissed, "Information");
                    return;
                }
                flow_specifique(response.Data, response.LinkBuilder, show_comment);

            },
            error: function (response) {
                //console.log(response);
                //console.log("error dans la recuperation de flow unique");

            }
        });
    }

    DeleteFlow(data, element) {
        let final_data = {

            Data: data,
            TokenId: window.localStorage.getItem("user_token")

        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.DeleteFlow,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                delete_flow_from_html(element);
                //console.log("Flow supprimé avec succes");

            },
            error: function (response) {
                //console.log(response);
                //console.log("error dans la supression de flow ");

            }
        });
    }

    DeleteComment(data, element) {
        let final_data = {

            Data: data,
            TokenId: window.localStorage.getItem("user_token")

        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.DeleteComment,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                delete_comment_from_html(element);
                //console.log("Commentaire supprimé avec succes");

            },
            error: function (response) {
                //console.log(response);
                //console.log("error dans la supression de commentaire");

            }
        });
    }

    UpdateRegisterId(data) {
        let final_data = {
            Data: data,
            Action: "RegisterId",
            TokenId: window.localStorage.getItem("user_token")
        };
        //// console.log(final_data.Data);

        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateRegisterId,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log('registerId update sucessfully: ');
                //console.log(response);

            },
            error: function (response) {
                //console.log("registerId update error : ");
                //console.log(response);
                //// console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
            }
        });
    }

    AddNotificationToUser(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddNotificationToUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                //console.log("notif added to bdd");
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }


    SearchUserForTabExplore(data) {
        let final_data = {
            Data: {
                Index: data.Index,
                Search: data.Search,
                Nb: data.Nb
            },
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.SearchUserForTabExplore,
            data: JSON.stringify(final_data),
            success: function (response) {
                console.log(response);
                //console.log("recherche de users");
                get_users_with_follow(response.Data);
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    UpdateNotificationToView(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UpdateNotificationToView,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                //console.log("notif set to seen");
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    GetNotificationOfUser(data) {
        let final_data = {
            Data: data,
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetNotificationOfUser,
            data: JSON.stringify(final_data),
            success: function (response) {

                UpdateNotificationList(response);
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    APNS_token_to_FCM_token(data) {

        $.ajax({

            type: "POST",
            url: " https://iid.googleapis.com/iid/v1:batchImport",
            headers: {
                Authorization: 'key=' + 'AAAASolkDdQ:APA91bGQTqtjxefUeH3JhJQXP30B6d6TgHYN239VGsaX3-0qpBEH7_Wy_9MLiVOlniHQ9gqZcHt3q76d5QGb3It-qUIJfo954NZBmz9INY765rMn8S40Cz-fw5zTeBfoQVnZSE3oW4oL'
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),

            success: function (response) {
                console.info("reponse du apns to fcm");
                console.info(response);
                registrationId = response.results[0].registration_token;
                /*let data = {
                    RegisterId: registrationId,
                    LastOs: window.cordova.platformId
                };
                ServerManager.UpdateRegisterId(data);*/
                console.log(registrationId);

            },
            error: function (response) {

            }

        });


    }

    Send_notif(data) {
        var data_notif_to_bdd;
        if (data.notification) {
            data_notif_to_bdd = {
                TypeNotification: data.notification.type,
                RegisterIdOfUserToNotify: data.to,
                Content: data.notification.sender_info.comment_text,
                IdFlow: data.notification.sender_info.IdFlow

            };
        } else {

            data_notif_to_bdd = {
                TypeNotification: data.data.type,
                RegisterIdOfUserToNotify: data.to,
                Content: data.data.sender_info.comment_text,
                IdFlow: data.data.sender_info.IdFlow
            };
        }
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
                //console.log("Notif envoyé avec succes");
            },
            error: function (response) {
                //console.log("La notif n'a pas été envoyé");
            }

        });


    }

    AddStoryComment(data) {
        let final_data = {
            Data: data,
            Action: "AddStoryComment",
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddStoryComment,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                story_comment_uploaded();
            },
            error: function (response) {
                //console.log(response);
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
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetStoryComments,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                if (response.Data) {
                    loadStoryComments(response);
                }
            },
            error: function (response) {
                //console.log(response);
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
                //console.log(response);
                // story_comment_uploaded();
            },
            error: function (response) {
                //console.log(response);
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
                //console.log(response);
                if (response.Data) {
                    loadStorySeen(response);
                }
                // loadStoryComments(response);
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    BlockUser(data) {
        let final_data = {
            Data: {
                PrivateId: data.additionalData.privateId
            },
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.BlockUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                RefreshTL();
                RefreshExplore();
                in_app_notif(data);
            },
            error: function (response) {

                //console.log(response);
            }
        });
    }

    UnBlockUser(data) {
        let final_data = {
            Data: {
                PrivateId: data.additionalData.privateId
            },
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.UnBlockUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                RefreshTL();
                RefreshExplore();
                in_app_notif(data);
            },
            error: function (response) {

                //console.log(response);
            }
        });
    }

    GetBlockedUsers(data, action, mine) {
        let final_data = {
            Data: {},
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetBlockedUsers,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("liste des utilisateurs bloqués");
                //console.log(response);
                if (action == "go_to_acount") {
                    user_block_management(response.Data, data);
                }
                if (action == "timeline") {
                    UpdateTimeline(data, response);
                }
                if (action == "explore") {
                    UpdateTop50(data, response);
                }
                if (action == "liked_flow") {
                    if (mine) {
                        ShowMyLikedFlows(data, response);
                    } else {
                        ShowLikedFlows(data, response);
                    }
                }
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    AddReportFlow(data) {
        let final_data = {
            Data: {
                ObjectId: data.additionalData.ObjectId
            },
            TokenId: window.localStorage.getItem("user_token")
        };
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.AddReportFlow,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log("le flow a bien été report");
                in_app_notif(data);
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    SearchUser(data) {
        let final_data = {
            // TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.Index,
                Search: data.Search
            }
        };
        let tokken = window.localStorage.getItem("user_token");
        if (tokken && tokken.length > 0) {
            final_data.TokenId = tokken;
        }
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.SearchUser,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                SpawnUserSearch(response);
            },
            error: function (response) {

                //console.log(response);
            }
        });
    }

    SearchFlow(data) {
        let final_data = {
            // TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.Index,
                Search: data.Search
            }
        };
        let tokken = window.localStorage.getItem("user_token");
        if (tokken && tokken.length > 0) {
            final_data.TokenId = tokken;
        }
        //console.log(final_data);
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.SearchFlow,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                SpawnFlowSearch(response);
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }

    GetTop50(data) {
        let final_data = {
            TokenId: window.localStorage.getItem("user_token"),
            Data: {
                Index: data.Index,
            }
        }
        $.ajax({
            type: "POST",
            url: ServerParams.ServerURL + ServerParams.GetTop50,
            data: JSON.stringify(final_data),
            success: function (response) {
                //console.log(response);
                if (connected) {
                    explore_get_block_and_blocked_users(response);
                } else {
                    //console.log("faut afficher le top50 maintenant");
                    UpdateTop50(response);
                }
            },
            error: function (response) {
                //console.log(response);
            }
        });
    }
}

var ServerManager = new ServerManagerClass();