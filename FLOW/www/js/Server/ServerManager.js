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
	LikeResponse: "Like/response",
	UpdateProfileURL: "UpdateProfile",
	GetMultipleFlowURL: "GetMultipleFlow",
	GetMyUserInfosURL: "GetInfoUser",
	GetTimeline: "GetTimeline",
	GetUserProfil: "GetProfil",
	GetLikedFlows: "GetLikedFlows",
	GetSingle: "GetSingle",
	GetSingleComment: "GetSingleComment",
	GetSingleResponse: "GetSingleResponse",
	GetSingleResponseExtended: "GetSingleResponseExtended",
	ActionFollowProfil: "Follow",
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
	DeleteResponse: "DeleteResponse",
	BlockUser: "BlockUser",
	UnBlockUser: "UnBlockUser",
	GetBlockedUsers: "GetBlockedUsers",
	AddReportFlow: "AddReportFlow",
	AddCommentResponse: "AddCommentResponse",
	GetCommentResponse: "GetCommentResponse",
	GetCommentLikes: "GetCommentLikes",
	GetResponseLikes: "GetResponseLikes",
	GetVersionProtocol: "GetVersionProtocol",
	UpdateUserLastConnexion: "UpdateUserLastConnexion",
	AddViewFlow: "AddViewFlow",
	GetNewFlows: "GetNewFlows",
	GetRandomFlow: "GetRandomFlow",
	GetFlowDiscover: "GetFlowDiscover",
	GetFlowOfTheDay: "GetFlowOfTheDay",
	IsRegisterExist: "IsRegisterExist",
	ConexionForUserUnregistered: "ConexionForUserUnregistered"
};
var FirebaseEnvironment = ServerParams.ServerURL == "https://api.flowappweb.com/" ? "prod" : "dev";
const apiTypes = {
	Twitter: "twitter",
	Google: "google",
	Instagram: "instagram",
	Facebook: "facebook",
	Flow: "flow",
	Apple: "apple",
	Unregistered: "unregistered"
};

// Server Manager Class :
class ServerManagerClass {
	constructor() { }

	/* Placez toutes les fonctions faisant des appels au Serveur et à la BDD ici
	 * Ne pas hésiter à créer de nouvelles fonctions pour chaque actions
	 * et reprendre la syntaxe des fonctions existantes.
	 */
	Connect(api, data) {
		let final_data;
		let DataSend;
		switch (api) {
			case apiTypes.Unregistered:
				DataSend = {
					RegisterId: registrationId,
					LastOs: window.cordova.platformId
				};
				final_data = {
					Data: DataSend,
					Action: "Unregistered",
				};
				break;
			case apiTypes.Flow:
				DataSend = {
					Username: data.Username,
					Password: data.Password,
					Name: data.Name,
					LastName: data.LastName,
					Email: data.Email,
					Birth: data.Birth,
				};
				if (registrationId) {
					DataSend.RegisterId = registrationId;
					DataSend.LastOs = window.cordova.platformId;
				}
				final_data = {
					Data: DataSend,
					Action: "Flow",
				};
				break;
			case apiTypes.Facebook:
				DataSend = {
					Username: data.name,
					Fullname: data.name,
					Email: data.email,
					// Birth: data.birthday,
					Link: data.picture.data.url,
					Token: data.id,
				};
				if (registrationId) {
					DataSend.RegisterId = registrationId;
					DataSend.LastOs = window.cordova.platformId;
				}
				final_data = {
					Data: DataSend,
					Action: "Facebook",
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

				Username = Username.replace(parenthesis, "");
				DataSend = {
					Username: Username,
					Fullname: Fullname,
					Email: data.email,
					Link: data.imageUrl,
					Token: data.userId,
				};
				if (registrationId) {
					DataSend.RegisterId = registrationId;
					DataSend.LastOs = window.cordova.platformId;
				}
				final_data = {
					Data: DataSend,
					Action: "Google",
				};
				break;
			case apiTypes.Twitter:
				DataSend = {
					Username: data.name,
					Fullname: data.name,
					Link: data.profile_image_url,
					Biographie: data.description,
					Token: String(data.id),
				};
				if (registrationId) {
					DataSend.RegisterId = registrationId;
					DataSend.LastOs = window.cordova.platformId;
				}
				final_data = {
					Data: DataSend,
					Action: "Twitter",
				};
				break;
			case apiTypes.Instagram:
				DataSend = {
					Username: data.full_name,
					Fullname: data.full_name,
					Link: data.profile_picture,
					Biographie: data.bio,
					Token: data.id,
				};
				final_data = {
					Data: DataSend,
					Action: "Instagram",
				};
				break;
			case apiTypes.Apple:
				DataSend = {
					Username: data.username,
					Fullname: data.full_name,
					Link: data.profile_picture,
					Biographie: data.bio,
					Token: data.id,
				};
				if (registrationId) {
					DataSend.RegisterId = registrationId;
					DataSend.LastOs = window.cordova.platformId;
				}
				final_data = {
					Data: DataSend,
					Action: "Apple",
				};
				break;
			default:
			////console.log("Error in parameters sent to Connect() in ServerManager.");
		}
		console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.ConnexionURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				//// //console.log("Connection success : ");
				console.log(response);
				if (response && response.PrivateId) {
					storeVariables(response);
					ConnectUser(response);
				} else {
					window.localStorage.setItem("unregistered_user_token", response.TokenId);
				}
			},
			error: function (response) {
				console.log("Connection error : ");
				console.log(response);
			},
		});
	}

	TwitterShowUser(data) {
		let oauth = OAuth({
			consumer: {
				key: "JwyvPlw7GcOvE8pXmRvqTyZL3",
				secret: "6KXFOoLHqUIMwB74yNDcT0gK7WmvoK5wGLYwId4JsV185UIQQT",
			},
			signature_method: "HMAC-SHA1",
			hash_function(base_string, key) {
				return CryptoJS.HmacSHA1(base_string, key).toString(
					CryptoJS.enc.Base64
				);
			},
		});

		let request_data = {
			url: "https://api.twitter.com/1.1/users/show.json?user_id=" + data.user_id,
			method: "GET",
			// data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
		};

		let token = {
			key: "960333428-EF9gwRa1usCDYQ6GBPVGgVduAFLdRyZHLZCixF7S",
			secret: "1hjDDMhkNV58mcoSrKD8p4pE1UJtySyG4aZ5Snh8THCch",
		};

		$.ajax({
			url: request_data.url,
			type: request_data.method,
			// data: request_data.data,
			headers: oauth.toHeader(oauth.authorize(request_data, token)),
		}).done(function (response) {
			//console.log(response);
			let txt =
				response.name +
				" --- " +
				response.screen_name +
				" --- " +
				response.profile_image_url +
				" --- " +
				response.description +
				"---" +
				response.id;
			//console.log(txt);
			response.profile_image_url = response.profile_image_url.replace(
				"_normal",
				""
			);
			ServerManager.Connect(apiTypes.Twitter, response);
		});
		////////////////////////////////////
		// var settings = {
		//     "url": "https://api.twitter.com/1.1/users/show.json?user_id=960333428",
		//     "method": "GET",
		//     "timeout": 0,
		//     "headers": {
		//         "Authorization": "OAuth oauth_consumer_key=\"JwyvPlw7GcOvE8pXmRvqTyZL3\",oauth_token=\"960333428-EF9gwRa1usCDYQ6GBPVGgVduAFLdRyZHLZCixF7S\",oauth_signature_method=\"HMAC-SHA1\",oauth_timestamp=\"1597676530\",oauth_nonce=\"XhVLLyWWcsA\",oauth_version=\"1.0\",oauth_signature=\"JJLiWdDkjC%2BhnjPegsSk9UkxU%2BU%3D\"",
		//         "Cookie": "personalization_id=\"v1_A+UCZ1kvLIM8Y8NnXlCvAQ==\"; guest_id=v1%3A159762354176648958; lang=en"
		//     },
		// };

		// $.ajax(settings).done(function (response) {
		//     //console.log(response);
		//     let txt = response.name + " --- " + response.screen_name + " --- " + response.profile_image_url + " --- " + response.description + "---" + response.id;
		//     //console.log(txt);
		//     response.profile_image_url = response.profile_image_url.replace("_normal", "");
		//     ServerManager.Connect(apiTypes.Twitter, response);
		// });
	}

	AddFlow(data, all_tagged_users) {
		let final_data = {
			Data: data,
			Action: "AddFlow",
			TokenId: window.localStorage.getItem("user_token"),
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddFlowURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log("Flow added sucessfully : ");
				//console.log(response);
				// ServerManager.GetFlowById(response.ObjectId);
				clean_all_tagged_users(
					all_tagged_users,
					response.ObjectId,
					data.Description
				); // clean et envoi les notifs
				TLCurrentIndex = 0;
				ServerManager.GetTimeline(0);
				CloseAfterRecord();
			},
			error: function (response) {
				//console.log("Flow adding error : ");
				//console.log(response);
				CloseAfterRecord();
			},
		});
	}

	GetVersionProtocol() {
		let final_data = {
			Data: {},
			Action: "GetVersionProtocol",
			TokenId: window.localStorage.getItem("user_token"),
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetVersionProtocol,
			data: JSON.stringify(final_data),
			success: function (response) {
				check_app_version(response.Data);
			},
			error: function (response) { },
		});
	}

	UpdateUserLastConnexion() {
		let final_data = {
			Data: {},
			Action: "UpdateUserLastConnexion",
			TokenId: window.localStorage.getItem("user_token"),
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UpdateUserLastConnexion,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log("User last connexion updated");
			},
			error: function (response) { },
		});
	}

	GetFlowById(id) {
		let final_data = {
			Data: {
				IdFlow: id,
			},
			Action: "GetSingle",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleFlowURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				//// //console.log("Flow sucessfully recovered from database :");
				//// //console.log(response);
				// PopFlow(response.Data, response.LinkBuilder); rmTL
			},
			error: function (response) {
				//// //console.log("Flow recovering from database error : ");
				//// //console.log(response);
				pullToRefreshEnd();
			},
		});
	}

	AddStory(data) {
		let final_data = {
			Data: data,
			Action: "AddStory",
			TokenId: window.localStorage.getItem("user_token"),
		};

		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddStoryURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				//// //console.log('Story added sucessfully : ');
				//// //console.log(response);
				closeStoryRecord();
				ServerManager.GetStory();
				//ServerManager.GetFlowById(response.ObjectId);
			},
			error: function (response) {
				//// //console.log("Story adding error : ");
				//// //console.log(response);
				closeStoryRecord();
			},
		});
	}

	GetStory() {
		let final_data = {
			Data: {},
			Action: "GetStory",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetStoryURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("Story sucessfully recovered from database :");
				////console.log(response);
				UpdateStoryDataFromServer(response);
				//PopFlow(response);
			},
			error: function (response) {
				////console.log("Story recovering from database error : ");
				////console.log(response);
			},
		});
	}

	GetUserStory(private_id) {
		let final_data = {
			Data: {
				PrivateId: private_id,
			},
			Action: "GetUserStory",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetUserStoryURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("User story sucessfully recovered from database :");
				////console.log(response);
				GetStoryForUserFromServer(response);
				//PopFlow(response);
			},
			error: function (response) {
				////console.log("User story recovering from database error : ");
				////console.log(response);
				CloseStory();
			},
		});
	}

	AddFlowComment(data) {
		let final_data = {
			Data: data,
			Action: "AddFlowComment",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddFlowComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("response tu connais : " + response + "");
				var obj = final_data.Data;
				obj.IdComment = response.IdComment;
				send_comment_to_server(obj);
			},
			error: function (response) {
				//// //console.log("comment adding from database error : ");
				//// //console.log(response);
			},
		});
	}

	AddCommentResponse(data) {
		let final_data = {
			Data: data,
			Action: "AddCommentResponse",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddCommentResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("response tu connais : " + response + "");
				var obj = final_data.Data;
				obj.IdResponse = response.IdResponse;
				send_response_to_server(obj);
				it_is_a_response = false;
			},
			error: function (response) {
				//// //console.log("comment adding from database error : ");
				//// //console.log(response);
			},
		});
	}

	GetFlowComment(data) {
		let final_data = {
			Data: data,
			Action: "GetFlowComment",
			TokenId: window.localStorage.getItem("user_token"),
		};

		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFlowComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				//get_all_comment(response, final_data.Data);
				UpdateCommentList(response, final_data.Data);
				//// //console.log("Comment sucessfully added to database :");
				//// //console.log(response);
			},
			error: function (response) {
				//// //console.log("comment adding from database error : ");
				//// //console.log(response);
			},
		});
	}

	GetCommentResponse(data, data_response_unique) {
		let final_data = {
			Data: data,
			Action: "GetCommentResponse",
			TokenId: window.localStorage.getItem("user_token"),
		};

		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetCommentResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				//get_all_comment(response, final_data.Data);
				display_response(response, data_response_unique);
				//console.log("Les reponses de commentaires sont :");
			},
			error: function (response) {
				//console.log("Impossible de recuperer les reponses de commentaires");
				//// //console.log(response);
			},
		});
	}

	GetFlowLikes(data) {
		let final_data = {
			Data: data,
			Action: "GetFlowLikes",
			TokenId: window.localStorage.getItem("user_token"),
		};

		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFlowLikes,
			data: JSON.stringify(final_data),
			success: function (response) {
				get_all_likes(response, final_data.Data);
				//// //console.log("Comment sucessfully added to database :");
				////console.log(response);
			},
			error: function (response) {
				//// //console.log("comment adding from database error : ");
				////console.log(response);
			},
		});
	}

	GetCommentLikes(data) {
		let final_data = {
			Data: data,
			Action: "GetCommentLikes",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetCommentLikes,
			data: JSON.stringify(final_data),
			success: function (response) {
				get_all_likes(response, final_data.Data);
				//console.log(response);
			},
			error: function (response) {
				//console.log(response);
			},
		});
	}

	GetResponseLikes(data) {
		let final_data = {
			Data: data,
			Action: "GetCommentLikes",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetResponseLikes,
			data: JSON.stringify(final_data),
			success: function (response) {
				get_all_likes(response, final_data.Data);
				//console.log(response);
			},
			error: function (response) {
				//console.log(response);
			},
		});
	}

	LikeFlowComment(data, block) {
		let final_data = {
			Data: data,
			Action: "LikeFlowComment",
			TokenId: window.localStorage.getItem("user_token"),
		};
		let current_block = block;
		current_block.current_flow_block = current_comment_block;
		current_block.IdComment = block.ObjectId;
		/*la ligne du dessus pour simplifier l'envoi des notifs sans trop redev
	meme si ça parrait pas super coherant*/
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.LikeFlowComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				//impression_coloring(this, 'like', block.fcomment_like, "comment");
				color_like(current_block, response.like === undefined ? false : true);
				////console.log("Comment sucessfully liked to database :");
				////console.log(response);
			},
			error: function (response) {
				////console.log("comment liked database error : ");
				////console.log(response);
			},
		});
	}

	LikeResponse(data, block) {
		let final_data = {
			Data: data,
			Action: "LikeResponse",
			TokenId: window.localStorage.getItem("user_token"),
		};
		let current_block = block;
		current_block.current_flow_block = current_response_block;
		current_block.Idresponse = block.ObjectId;
		/*la ligne du dessus pour simplifier l'envoi des notifs sans trop redev
	meme si ça parrait pas super coherant*/
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.LikeResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				//impression_coloring(this, 'like', block.fcomment_like, "comment");
				color_like(
					current_response_block,
					response.like === undefined ? false : true
				);
				////console.log("Comment sucessfully liked to database :");
				////console.log(response);
			},
			error: function (response) {
				////console.log("comment liked database error : ");
				////console.log(response);
			},
		});
	}

	LikeFlow(data, block) {
		let final_data = {
			Data: data,
			Action: "LikeFlow",
			TokenId: window.localStorage.getItem("user_token"),
		};
		var current_block = block;
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.LikeFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				//impression_coloring(this, 'like', block.fcomment_like, "comment");
				//color_like(current_block, response.like === undefined ? false : true);
				//console.log("Flow sucessfully liked");
				////console.log(response);
			},
			error: function (response) {
				////console.log("Flow liked database error : ");
				////console.log(response);
			},
		});
	}

	GetMyFlow(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: data,
		};
		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetMultipleFlowURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				ShowMyFlow(response);
			},
			error: function (response) { },
		});
	}

	GetLikedFlows(data, mine) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: data,
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
			error: function (response) { },
		});
	}

	GetUserFlow(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: data,
		};
		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetMultipleFlowURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				ShowUserFlow(response);
			},
			error: function (response) { },
		});
	}

	GetMyUserInfoNumber(data) {
		let final_data = {
			Data: data,
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetMyUserInfosURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				ShowMyInfosUser(response);
			},
			error: function (response) { },
		});
	}

	getInfosUserNumber(data) {
		let final_data = {
			Data: data,
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetMyUserInfosURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("on recup le getInfosUserNumber");
				ShowInfosUserNumber(response);
			},
			error: function (response) { },
		});
	}

	GetUserInfo(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log("final data = ");
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetUserProfil,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("on recup le profil");
				if (typeof response == "string") {
					// alert("Utilisateur introuvable");
					navigator.notification.alert(
						"Utilisateur introuvable",
						alertDismissed,
						"Information"
					);
				} else {
					ShowUserProfile(response);
				}
			},
			error: function (response) { },
		});
	}

	GetFollowerOfUser(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
				PrivateId: data.PrivateId,
			},
		};
		////console.log("final data = ");
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFollowerOfUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("nombre de follower thomas ");
				////console.log(response);
				UpdateFollowersList(response, data.follow_list);
			},
			error: function (response) { },
		});
	}

	GetFollowingOfUser(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
				PrivateId: data.PrivateId,
			},
		};
		////console.log("final data = ");
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFollowingOfUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);

				if (data.follow_list == "CreateConversation" && response.length != 0) {
					DisplayFollowingsPopupCreateConversation(response, data.follow_list);
				}
				if (data.follow_list == true) {
					UpdateIdentificationList(response, data.follow_list);
				}
				if (data.follow_list == false) {
					UpdatefollowingsList(response, data.follow_list);
				}
			},
			error: function (response) { },
		});
	}

	ActionFollow(data, callback) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.ActionFollowProfil,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				// let myApp = new Framework7();
				// myApp.pullToRefreshTrigger(ptrContent);
				callback(response, data);
			},
			error: function (response) { },
		});
	}

	UpdateProfile(data) {
		let final_data = {
			Data: data,
			Action: "UpdateProfile",
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		//// //console.log(final_data.Data);

		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UpdateProfileURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				//// //console.log('Flow update sucessfully: ');
				//console.log(response);
				UpdateProfile(
					final_data.Data.FullName,
					final_data.Data.Biography,
					final_data.Data.Image
				);
			},
			error: function (response) {
				//// //console.log("Flow update error : ");
				//console.log(response);
				//// //console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
			},
		});
	}

	GetTimeline(data) {
		// console.log(data);
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data,
			},
		};
		//console.log(final_data);
		//console.log("Get timeline index : " + data);
		let start = Date.now();
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetTimeline,
			data: JSON.stringify(final_data),
			success: function (response) {
				let end = Date.now();
				let elapsed_time = end - start;
				// console.log("elapsed time : " + elapsed_time);
				////console.log("success");
				//console.log(response);
				timeline_get_block_and_blocked_users(response);
			},
			error: function (response) {
				////console.log("error");
				////console.log(response);
				StopRefreshTL();
			},
		});
	}

	GetSingle(data, show_comment, type, data_specifique, all_data) {
		// data d'un commentaire ou d'une reponse
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingle,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				////console.log("success dans la recuperation de flow unique");
				if (typeof response == "string") {
					navigator.notification.alert(
						"Ce flow n'est plus disponible",
						alertDismissed,
						"Information"
					);
					return;
				}
				flow_specifique(
					response.Data,
					show_comment,
					type,
					data_specifique,
					all_data
				);
			},
			error: function (response) {
				////console.log(response);
				////console.log("error dans la recuperation de flow unique");
			},
		});
	}

	GetSingleComment(data, type, data_response, data_position) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				////console.log("success dans la recuperation de flow unique");
				if (typeof response == "string") {
					navigator.notification.alert(
						"Ce commentaire n'est plus disponible",
						alertDismissed,
						"Information"
					);
					return;
				}
				if (type == "response") {
					comment_specifique(response, type, data_response, data_position);
				} else {
					flow_for_comment_specifique("comment", response);
				}
			},
			error: function (response) {
				////console.log(response);
				////console.log("error dans la recuperation de flow unique");
			},
		});
	}

	GetSingleResponse(data, data_position) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				////console.log("success dans la recuperation de flow unique");
				if (typeof response == "string") {
					navigator.notification.alert(
						"Cette réponse n'est plus disponible",
						alertDismissed,
						"Information"
					);
					return;
				} else {
					flow_and_comment_for_response_specifique(response, data_position);
				}
			},
			error: function (response) {
				////console.log(response);
				////console.log("error dans la recuperation de flow unique");
			},
		});
	}

	GetSingleResponseExtended(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleResponseExtended,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				////console.log("success dans la recuperation de flow unique");
				if (typeof response == "string") {
					navigator.notification.alert(
						"Cette réponse n'est plus disponible",
						alertDismissed,
						"Information"
					);
					return;
				} else {
					flow_and_comment_for_response_specifique(response);
				}
			},
			error: function (response) {
				////console.log(response);
				////console.log("error dans la recuperation de flow unique");
			},
		});
	}

	DeleteFlow(data, element) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.DeleteFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				delete_flow_from_html(element);
				////console.log("Flow supprimé avec succes");
			},
			error: function (response) {
				////console.log(response);
				////console.log("error dans la supression de flow ");
			},
		});
	}

	DeleteComment(data, element) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.DeleteComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				delete_comment_from_html(element);
				//console.log("Commentaire supprimé avec succes");
			},
			error: function (response) {
				////console.log(response);
				////console.log("error dans la supression de commentaire");
			},
		});
	}

	DeleteResponse(data, element) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.DeleteResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				delete_response_from_html(element);
				//console.log("reponse supprimé avec succes");
			},
			error: function (response) {
				////console.log(response);
				//console.log("error dans la supression de la reponse");
			},
		});
	}

	UpdateRegisterId(data) {
		let final_data = {
			Data: data,
			Action: "RegisterId",
			TokenId: window.localStorage.getItem("user_token"),
		};
		//// //console.log(final_data.Data);

		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UpdateRegisterId,
			data: JSON.stringify(final_data),
			success: function (response) {
				// //console.log('registerId update sucessfully: ');
				// //console.log(response);
			},
			error: function (response) {
				////console.log("registerId update error : ");
				////console.log(response);
				//// //console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
			},
		});
	}


	IsRegisterExist(data) {
		let final_data = {
			Data: data,
			Action: "IsRegisterExist"
		};
		//// //console.log(final_data.Data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.IsRegisterExist,
			data: JSON.stringify(final_data),
			success: function (response) {
				console.log("La reponse du IsRegisterExist est : ");
				console.log(response);
				if (response.Data == false) {
					ServerManager.Connect('unregistered', {});
				}
			},
			error: function (response) {
				////console.log("registerId update error : ");
				////console.log(response);
				//// //console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
			},
		});
	}


	AddNotificationToUser(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddNotificationToUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				//console.log("notif added to bdd");
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	SearchUserForTabExplore(data) {
		let final_data = {
			Data: {
				Index: data.Index,
				Search: data.Search,
				Nb: data.Nb,
			},
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.SearchUserForTabExplore,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				////console.log("recherche de users");
				get_users_with_follow(response.Data);
				if (data.CreateConversation == true) {
					DisplayFollowingsPopupCreateConversation(response.Data, "CreateConversation");
				}
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	UpdateNotificationToView(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token")
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UpdateNotificationToView,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				////console.log("notif set to seen");
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	GetNotificationOfUser(data, set_to_seen) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetNotificationOfUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				UpdateNotificationList(response, set_to_seen);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	APNS_token_to_FCM_token(data) {
		$.ajax({
			type: "POST",
			url: " https://iid.googleapis.com/iid/v1:batchImport",
			headers: {
				Authorization: "key=" +
					"AAAASolkDdQ:APA91bGQTqtjxefUeH3JhJQXP30B6d6TgHYN239VGsaX3-0qpBEH7_Wy_9MLiVOlniHQ9gqZcHt3q76d5QGb3It-qUIJfo954NZBmz9INY765rMn8S40Cz-fw5zTeBfoQVnZSE3oW4oL",
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
				//console.log(registrationId);
			},
			error: function (response) { },
		});
	}

	Send_notif(data) {
		var data_notif_to_bdd;
		if (data.notification) {
			//ios
			data_notif_to_bdd = {
				TypeNotification: data.notification.type,
				RegisterIdOfUserToNotify: data.to,
				Content: data.notification.sender_info.comment_text,
				IdFlow: data.notification.sender_info.IdFlow,
			};
			if (
				data.notification.type == "send_comment" ||
				data.notification.type == "like_comment"
			) {
				data_notif_to_bdd.IdFlow = data.notification.sender_info.Id_comment;
			}
			if (
				data.notification.type == "send_response" ||
				data.notification.type == "like_response"
			) {
				data_notif_to_bdd.IdFlow = data.notification.sender_info.Id_response;
			}
		} else {
			data_notif_to_bdd = {
				// android
				TypeNotification: data.data.type,
				RegisterIdOfUserToNotify: data.to,
				Content: data.data.sender_info.comment_text,
				IdFlow: data.data.sender_info.IdFlow,
			};
			if (
				data.data.type == "send_comment" ||
				data.data.type == "like_comment"
			) {
				data_notif_to_bdd.IdFlow = data.data.sender_info.Id_comment;
			}
			if (
				data.data.type == "send_response" ||
				data.data.type == "like_response"
			) {
				data_notif_to_bdd.IdFlow = data.data.sender_info.Id_response;
			}
		}
		$.ajax({
			type: "POST",
			url: "https://fcm.googleapis.com/fcm/send",
			headers: {
				Authorization: "key=" +
					"AAAASolkDdQ:APA91bGQTqtjxefUeH3JhJQXP30B6d6TgHYN239VGsaX3-0qpBEH7_Wy_9MLiVOlniHQ9gqZcHt3q76d5QGb3It-qUIJfo954NZBmz9INY765rMn8S40Cz-fw5zTeBfoQVnZSE3oW4oL",
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
				if (data.notification && data.notification.type != 'send_message' || data.data && data.data.type != 'send_message') {

					ServerManager.AddNotificationToUser(data_notif_to_bdd);
				}
				//console.log("Notif envoyé avec succes");
			},
			error: function (response) {
				////console.log("La notif n'a pas été envoyé");
			},
		});
	}

	AddStoryComment(data) {
		let final_data = {
			Data: data,
			Action: "AddStoryComment",
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddStoryComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				story_comment_uploaded();
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	GetStoryComments(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.index,
				ObjectId: data.objectId,
			},
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetStoryComments,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				if (response.Data) {
					loadStoryComments(response);
				}
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	AddStoryView(data) {
		let final_data = {
			Data: data,
			Action: "AddStoryView",
			TokenId: window.localStorage.getItem("user_token"),
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddStoryView,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				// story_comment_uploaded();
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	GetStoryView(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
				ObjectId: data.ObjectId,
			},
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetStoryView,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				if (response.Data) {
					loadStorySeen(response);
				}
				// loadStoryComments(response);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	BlockUser(data) {
		let final_data = {
			Data: {
				PrivateId: data.additionalData.privateId,
			},
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.BlockUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				RefreshTL();
				// RefreshExplore();
				in_app_notif(data);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	UnBlockUser(data) {
		let final_data = {
			Data: {
				PrivateId: data.additionalData.privateId,
			},
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UnBlockUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				RefreshTL();
				// RefreshExplore();
				in_app_notif(data);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	GetBlockedUsers(data, action, mine) {
		let final_data = {
			Data: {},
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetBlockedUsers,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("liste des utilisateurs bloqués");
				////console.log(response);
				if (action == "go_to_acount") {
					user_block_management(response.Data, data);
				}
				if (action == "timeline") {
					UpdateTimeline(data, response);
				}
				if (action == "explore") {
					UpdateTop50(data, response);
				}
				if (action == "recents") {
					UpdateRecents(data, response);
				}
				if (action == "liked_flow") {
					if (mine) {
						ShowMyLikedFlows(data, response);
					} else {
						ShowLikedFlows(data, response);
					}
				}
				if (action == "dm") {
					check_if_user_is_blocked(response.Data);
				}
			},
			error: function (response) {
				////console.log(response);
			}
		});
	}

	AddReportFlow(data) {
		let final_data = {
			Data: {
				ObjectId: data.additionalData.ObjectId,
			},
			TokenId: window.localStorage.getItem("user_token"),
		};
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddReportFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log("le flow a bien été report");
				in_app_notif(data);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	SearchUser(data) {
		let final_data = {
			// TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
				Search: data.Search,
			},
		};
		let tokken = window.localStorage.getItem("user_token");
		if (tokken && tokken.length > 0) {
			final_data.TokenId = tokken;
		}
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.SearchUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				SpawnUserSearch(response);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	SearchFlow(data) {
		let final_data = {
			// TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
				Search: data.Search,
			},
		};
		let tokken = window.localStorage.getItem("user_token");
		if (tokken && tokken.length > 0) {
			final_data.TokenId = tokken;
		}
		////console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.SearchFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				////console.log(response);
				SpawnFlowSearch(response);
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	GetTop50(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
			},
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetTop50,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				if (connected) {
					explore_get_block_and_blocked_users(response);
				} else {
					////console.log("faut afficher le top50 maintenant");
					UpdateTop50(response);
				}
			},
			error: function (response) {
				////console.log(response);
			},
		});
	}

	AddViewFlow(data) {
		let final_data = {
			Data: {
				ObjectId: data,
			}
		};
		if (window.localStorage.getItem("user_token")) {
			final_data.TokenId = window.localStorage.getItem("user_token");
		} else {
			final_data.TokenId = registrationId;
		}

		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddViewFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
			},
			error: function (response) {
				//console.log(response);
			},
		});
	}

	GetNewFlows(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data.Index,
			},
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetNewFlows,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				if (connected) {
					recents_get_block_and_blocked_users(response.Data);
				} else {
					////console.log("faut afficher le top50 maintenant");
					UpdateRecents(response.Data);
				}
			},
			error: function (response) {
				//console.log(response);
			},
		});
	}

	GetRandomFlow(excluded, discover, numberOfFlows) {
		if (!numberOfFlows) numberOfFlows = 1;
		let final_data = {
			Data: {
				FlowsExcluded: excluded,
				NumberOfFlows: numberOfFlows
			},
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetRandomFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				showRandomFlow(response, discover);
			},
			error: function (response) {
				//console.log(response);
				pullToRefreshEnd();
			},
		});
	}

	GetFlowDiscover(index, numberOfFlows) {
		if (!numberOfFlows) numberOfFlows = 1;
		let final_data = {
			Data: {
				// Index: index,
				Pull: numberOfFlows
			},
			TokenId: window.localStorage.getItem("user_token") ? window.localStorage.getItem("user_token") : registrationId
		};

		console.log(final_data);
		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFlowDiscover,
			data: JSON.stringify(final_data),
			success: function (response) {
				console.log(response);
				showRandomFlow(response, true);
			},
			error: function (response) {
				//console.log(response);
				pullToRefreshEnd();
			},
		});
	}

	GetFDJ() {
		let final_data = {
			Data: {
				FlowsExcluded: [],
			},
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// //console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFlowOfTheDay,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				showFDJ(response);
			},
			error: function (response) {
				//console.log(response);
				pullToRefreshEnd();
			},
		});
	}

	CheckFirstChat(data, no_text) // check si on doit crée une nouvelle conversation
	{ // no_text si le premier message n'est pas un text
		firebase.database().ref(FirebaseEnvironment + '/chats/' + data.chat_id + '/' + window.localStorage.getItem("firebase_token")).once('value').then(function (snapshot) {
			/* permet de lire une valeur une seule fois là c'est pour voir si c'est le premier msg envoyé
			pour creer une conversation plutot que just send un msg*/
			//console.log("valeur recuperé de la bdd firebase : ");
			//console.log(snapshot.val());
			if (snapshot.val() == null) // si c'est le premier msg de la conversation
			{
				first_chat = true;
				current_block_chat = {};
				current_block_chat.chat_id = data.chat_id;
				current_block_chat.members = {};
				current_block_chat.members.id = data.user_id;
				current_block_chat.block_chat_member_private_id = data.private_id;
				setup_popup_message(data);
			} else {
				// on crée juste un nouveau message

				first_chat = false;
				setup_popup_message(data, true);
			}


		});
	}

	AddMessage(data) { // ajoute les msg à la bdd firebase
		console.log(data);
		let data_message = {
			"sender_id": window.localStorage.getItem("firebase_token"),
			"sender_private_id": window.localStorage.getItem("user_private_id"),
			"sender_full_name": window.localStorage.getItem("user_name"),
			"message": data.message ? data.message : "",
			"seen_by": {
				[window.localStorage.getItem("firebase_token")]: true
			},
			"image": data.image ? data.image : "",
			"audio": data.audio ? data.audio : "",
			"time": Date.now()
		};
		let db_message = firebase.database().ref(FirebaseEnvironment + '/messages/' + data.chat_id);
		db_message.push().set(data_message).then(() => {
			db_message.limitToLast(1).once('value').then((snapshot) => {
				console.log(snapshot.val());
				data_message.message_id = Object.keys(snapshot.val())[0];

			}).then(() => {
				firebase.database().ref(FirebaseEnvironment + '/chats/' + data.chat_id + "/last_message/").update(data_message).then(() => {
					firebase.database().ref(FirebaseEnvironment).update({
						['/users/' + current_block_chat.members.id + '/chats/' + [data.chat_id] + "/time"]: data_message.time,
						['/users/' + window.localStorage.getItem("firebase_token") + '/chats/' + [data.chat_id] + "/time"]: data_message.time
					}, (error) => {
						if (error) {
							// The write failed...
						} else {
							// Data saved successfully!
						}
					});
				}).then(() => {
					let userRef = firebase.database().ref(FirebaseEnvironment + '/users/' + current_block_chat.members.id + '/registration_id');
					userRef.once('value').then((snapshot) => {
						if (snapshot.val() != null) {
							current_block_chat.members.registration_id = snapshot.val();
							let data_notif_message = {
								message: data.message,
								chat_id: current_block_chat.chat_id,
								recipient_info: current_block_chat.members
							};
							send_notif_to_user(data_notif_message, "send_message");
						}
					});
				});
			});
		});
	}

	AddChat(data, is_text) {
		// no_text si le premier message n'est pas un text
		let time = Date.now();
		firebase.database().ref(FirebaseEnvironment + '/chats/' + data.chat_id).update({
			"title": "titre du groupe si c'est un groupe",
			"photo": "lien_photo",
			"creation_date": time,
			"creator": "",
			"last_message": "",
			[data.user_id]: true,
			"is_groupe_chat": data.is_groupe_chat,
			[window.localStorage.getItem("firebase_token")]: true
		}).then(function (dataSnapshot) {
			firebase.database().ref(FirebaseEnvironment).update({
				['/members/' + data.chat_id]: {
					[data.user_id]: true,
					[window.localStorage.getItem("firebase_token")]: true
				},
				['/users/' + data.user_id + '/chats/' + data.chat_id]: {
					time: time,
					search_key: (window.localStorage.getItem("user_name")).toLowerCase()
				},
				['/users/' + window.localStorage.getItem("firebase_token") + '/chats/' + data.chat_id]: {
					time: time,
					search_key: (data.fullname).toLowerCase()
				}
			}).then(function () {
				first_chat = false;
				if (is_text == true) {
					ServerManager.AddMessage(data);
				}
				live_chat(data);
			});
		});
	}

	GetFirebaseUserProfile(data, callback, chat_id) {

		if (data) {
			let data_chat = data;
			data_chat.chat_id = chat_id;
			data = Object.keys(data);

			for (let i = 0; i < data.length; i++) {
				if (data[i].length == 32 && data[i] != window.localStorage.getItem("firebase_token")) {
					let ref_members = firebase.database().ref(FirebaseEnvironment + "/users/" + data[i]);
					ref_members.once('value').then(function (profile_snapshot) {
						if (profile_snapshot.val() != null) {
							$("#" + chat_id + "").remove();
							let data_block_chat = {
								chat_data: data_chat,
								members_data: profile_snapshot.val()
							};
							data_block_chat.members_data.id = profile_snapshot.key;

							if (all_block_chat.length) {

								all_block_chat.forEach(function (item, index) {

									if (item && item.chat_id === chat_id) {
										$("#" + chat_id + "").remove();
										all_block_chat.splice(index, 1);
									}

								});
							}
							all_block_chat.push(pop_block_chat(data_block_chat));
							check_block_chat_seen();

						}
					});

				}

			}

		}

	}

	NewChatListener(callback) {
		firebase.database().ref(FirebaseEnvironment + "/users/" + window.localStorage.getItem("firebase_token") + "/chats")
			.on("value", function (snapshot) {
				//console.log(" NewChatListener was called");
				let clean_chat_list = {}; // object qui va etre rempli de façon {chat_id : time}
				$(".loading_chat_list").remove();
				if (snapshot.val() == null) {
					console.log(" IL N Y A AUCUNE CONVERSATION");
					// $(".no_conversation_yet")[0].style.display = "block";
					no_conv = true;
				} else {
					no_conv = false;
					// $(".no_conversation_yet")[0].style.display = "none";

					delete snapshot.val()[window.localStorage.getItem("firebase_token")];
					Object.entries(snapshot.val()).forEach(item => {
						clean_chat_list[item[0]] = item[1].time;
					});

					let ordered_chat = Object.fromEntries(
						Object.entries(clean_chat_list).sort(([, a], [, b]) => a - b)
					);

					let different_chat = difference(previous_chat_list, clean_chat_list);
					if (different_chat != -1) {
						ordered_chat = {
							[different_chat]: ordered_chat[different_chat]
						};
					}
					nb_block_chat_to_pop = Object.keys(ordered_chat).length;
					previous_chat_list = clean_chat_list;
					Object.keys(ordered_chat).forEach(chat_id => {
						firebase.database().ref(FirebaseEnvironment + "/chats/" + chat_id)
							.once("value").then(chat_snapshot => {
								let chat_data = chat_snapshot.val();
								firebase.database().ref(FirebaseEnvironment + "/messages/" + chat_id + "/" + chat_data.last_message.message_id)
									.once("value").then(message_snapshot => {
										if (message_snapshot.val() != null) {
											let data_message = message_snapshot.val();
											chat_data.last_message = data_message;
										}
									}).then(function () {
										ServerManager.GetFirebaseUserProfile(chat_data, callback, chat_id);
									});
							});
					});

				}

			});
	}

	AddUserToFirebase(data) {
		firebase.database().ref(FirebaseEnvironment + '/users/' + data.user_id).update({
			"name": data.full_name,
			"private_id": data.Private_id,
			"profile_pic": data.profile_pic,
			"registration_id": registrationId,
			"LastOs": data.LastOs,
			"time": Date.now()
			//["chats/" + window.localStorage.getItem("firebase_token") + "/time"]: Date.now()
		});
		ServerManager.NewChatListener(pop_block_chat);
	}

	SetMessageToSeen(data) {

		if (data.message_id) {
			firebase.database().ref(FirebaseEnvironment).update({
				['/messages/' + data.chat_id + '/' + data.message_id + '/seen_by/' + window.localStorage.getItem("firebase_token")]: true,
				['/chats/' + data.chat_id + '/last_message/seen_by/' + window.localStorage.getItem("firebase_token")]: true
			});
		}

	}

	DeleteChat(data) {
		firebase.database().ref(FirebaseEnvironment + "/chats/" + data.chat_id).child(window.localStorage.getItem("firebase_token")).remove();
		firebase.database().ref(FirebaseEnvironment + "/members/" + data.chat_id).child(window.localStorage.getItem("firebase_token")).remove();
		firebase.database().ref(FirebaseEnvironment + "/users/" + window.localStorage.getItem("firebase_token") + "/chats").child(data.chat_id).remove();
		$("#" + data.chat_id + "").remove();
	}

	Delete_text_message(data) // En vrai c'est un update vu qu'on le supprime jamais vraiment le msg
	{
		firebase.database().ref(FirebaseEnvironment + "/messages/" + data.chat_id + "/" + data.message_id).update({
			["deleted"]: true
		}).then(function () {
			create_deleted_message(data.message_id);
		});
	}

	Delete_media_from_firebase(data) {
		let desertRef = firebase.storage().ref().child(data.path);
		desertRef.delete().then(() => {
			firebase.database().ref(FirebaseEnvironment + "/messages/" + data.chat_id + "/" + data.message_id).update({
				["deleted"]: true
			}).then(function () {
				create_deleted_message(data.message_id);
			});

		}).catch((error) => {
			console.log(error.message);
		});
	}

	SearchChat(data) {
		data = data.toLowerCase();
		firebase.database().ref(FirebaseEnvironment + "/users/" + window.localStorage.getItem("firebase_token") + "/chats")
			.orderByChild('search_key').startAt(data).endAt(data + "\uf8ff")
			.once("value").then(search_snapshot => {
				$("#block_chat_contrainer").html("");
				Object.keys(search_snapshot.val()).forEach(chat_id => {
					firebase.database().ref(FirebaseEnvironment + "/chats/" + chat_id)
						.once("value").then(chat_snapshot => {
							ServerManager.GetFirebaseUserProfile(chat_snapshot.val(), pop_block_chat, chat_id);
						});
				});

			});
	}

	UploadImageToFirebase(data) {
		let ImgRef = firebase.storage().ref(FirebaseEnvironment + "/" + data.chat_id + "/images/" + data.name.toString());

		let uploadTask = ImgRef.putString(data.content, 'data_url');

		uploadTask.then(function (snapshot) {
			console.log('Uploaded a data_url string!');
			$("#UploadProgressBar").css({
				"display": "none"
			});
			console.log(snapshot);
			ImgRef.getDownloadURL().then(function (url) {
				console.log(url);
				let DataMessage = {
					image: url,
					chat_id: data.chat_id,
					message: "(photo)",
					audio: ""
				};
				ServerManager.AddMessage(DataMessage);
			});
		});

		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function (snapshot) {
				let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
				console.log('IMG Upload is ' + progress + '% done');
				UpdateProgressBar(progress);
			});

	}

	UploadAudioToFirebase(data) {

		console.log(data);
		let storageRef = firebase.storage().ref(FirebaseEnvironment + "/" + data.chat_id + "/audio/" + data.name.toString());
		let time = Date.now();
		let metadata = {
			//contentType: 'audio/mp3',
			customMetadata: {
				"senderId": window.localStorage.getItem("firebase_token"),
				"memberId": data.user_id, // id de l'interlocuteur
				"memberLastOs": data.LastOs,
				"memberRegistrationId": data.registrationId,
				"memberprofilePic": data.profilePic,
				"senderPrivateId": window.localStorage.getItem("user_private_id"),
				"senderFullName": window.localStorage.getItem("user_name"),
				"chatId": data.chat_id,
				"message": data.message ? data.message : "(Message vocal)",
				"image": data.image ? data.image : "",
				"audio": data.audio ? data.audio : "",
				"Environnement": FirebaseEnvironment,
				"lastOs": data.lastOs,
				"registrationId": data.registrationId,
				"audio_duration": data.audio_duration,
				"progress_key": time
			}
		};

		let voiceRef = storageRef.putString(data.content, firebase.storage.StringFormat.DATA_URL, metadata);
		voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
			let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			console.log('AUDIO Upload is ' + progress + '% done');
			let vocal_id = metadata.customMetadata.progress_key + metadata.customMetadata.chatId;
			if (progress > 5) {
				UpdateProgressBar(progress - 5, vocal_id);
			}
		}, (e) => {
			reject(e);
			console.log(JSON.stringify(e, null, 2));
		}, () => {
			let downloadURL = voiceRef.snapshot.downloadURL;
			console.log(downloadURL);
		});

	}

}


var ServerManager = new ServerManagerClass();