//Global variables used for Server Management :
const ServerParams = {
	ServerURL: "https://api-test.flowappweb.com/",
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
	GetFlowOfTheDay: "GetFlowOfTheDay"
};
const FirebaseEnvironment = ServerParams.ServerURL == "https://api.flowappweb.com/" ? "prod" : "dev";
const apiTypes = {
	Twitter: "twitter",
	Google: "google",
	Instagram: "instagram",
	Facebook: "facebook",
	Flow: "flow",
	Apple: "apple",
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
				final_data = {
					Data: DataSend,
					Action: "Apple",
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
			console.log(response);
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
			console.log(txt);
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
		//     console.log(response);
		//     let txt = response.name + " --- " + response.screen_name + " --- " + response.profile_image_url + " --- " + response.description + "---" + response.id;
		//     console.log(txt);
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
				console.log("Flow added sucessfully : ");
				console.log(response);
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
				console.log("Flow adding error : ");
				console.log(response);
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
				console.log("User last connexion updated");
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
			},
		});
	}

	GetStory() {
		let final_data = {
			Data: {},
			Action: "GetStory",
			TokenId: window.localStorage.getItem("user_token"),
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
			},
		});
	}

	AddFlowComment(data) {
		let final_data = {
			Data: data,
			Action: "AddFlowComment",
			TokenId: window.localStorage.getItem("user_token"),
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
			},
		});
	}

	AddCommentResponse(data) {
		let final_data = {
			Data: data,
			Action: "AddCommentResponse",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddCommentResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log("response tu connais : " + response + "");
				var obj = final_data.Data;
				obj.IdResponse = response.IdResponse;
				send_response_to_server(obj);
				it_is_a_response = false;
			},
			error: function (response) {
				//// console.log("comment adding from database error : ");
				//// console.log(response);
			},
		});
	}

	GetFlowComment(data) {
		let final_data = {
			Data: data,
			Action: "GetFlowComment",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFlowComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				//get_all_comment(response, final_data.Data);
				UpdateCommentList(response, final_data.Data);
				//// console.log("Comment sucessfully added to database :");
				//// console.log(response);
			},
			error: function (response) {
				//// console.log("comment adding from database error : ");
				//// console.log(response);
			},
		});
	}

	GetCommentResponse(data, data_response_unique) {
		let final_data = {
			Data: data,
			Action: "GetCommentResponse",
			TokenId: window.localStorage.getItem("user_token"),
		};

		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetCommentResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				//get_all_comment(response, final_data.Data);
				display_response(response, data_response_unique);
				console.log("Les reponses de commentaires sont :");
			},
			error: function (response) {
				console.log("Impossible de recuperer les reponses de commentaires");
				//// console.log(response);
			},
		});
	}

	GetFlowLikes(data) {
		let final_data = {
			Data: data,
			Action: "GetFlowLikes",
			TokenId: window.localStorage.getItem("user_token"),
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
			},
		});
	}

	GetCommentLikes(data) {
		let final_data = {
			Data: data,
			Action: "GetCommentLikes",
			TokenId: window.localStorage.getItem("user_token"),
		};

		console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetCommentLikes,
			data: JSON.stringify(final_data),
			success: function (response) {
				get_all_likes(response, final_data.Data);
				console.log(response);
			},
			error: function (response) {
				console.log(response);
			},
		});
	}

	GetResponseLikes(data) {
		let final_data = {
			Data: data,
			Action: "GetCommentLikes",
			TokenId: window.localStorage.getItem("user_token"),
		};

		console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetResponseLikes,
			data: JSON.stringify(final_data),
			success: function (response) {
				get_all_likes(response, final_data.Data);
				console.log(response);
			},
			error: function (response) {
				console.log(response);
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
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.LikeFlowComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				//impression_coloring(this, 'like', block.fcomment_like, "comment");
				color_like(current_block, response.like === undefined ? false : true);
				//console.log("Comment sucessfully liked to database :");
				//console.log(response);
			},
			error: function (response) {
				//console.log("comment liked database error : ");
				//console.log(response);
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
		//console.log(final_data);
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
				//console.log("Comment sucessfully liked to database :");
				//console.log(response);
			},
			error: function (response) {
				//console.log("comment liked database error : ");
				//console.log(response);
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
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.LikeFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				//impression_coloring(this, 'like', block.fcomment_like, "comment");
				//color_like(current_block, response.like === undefined ? false : true);
				console.log("Flow sucessfully liked");
				//console.log(response);
			},
			error: function (response) {
				//console.log("Flow liked database error : ");
				//console.log(response);
			},
		});
	}

	GetMyFlow(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: data,
		};
		//// console.log(final_data);
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
		//// console.log(final_data);
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
				//console.log("on recup le getInfosUserNumber");
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
		//console.log("final data = ");
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetUserProfil,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log("on recup le profil");
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
			error: function (response) { },
		});
	}

	ActionFollow(data, callback) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
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
		console.log(final_data);
		//// console.log(final_data.Data);

		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UpdateProfileURL,
			data: JSON.stringify(final_data),
			success: function (response) {
				//// console.log('Flow update sucessfully: ');
				console.log(response);
				UpdateProfile(
					final_data.Data.FullName,
					final_data.Data.Biography,
					final_data.Data.Image
				);
			},
			error: function (response) {
				//// console.log("Flow update error : ");
				console.log(response);
				//// console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
			},
		});
	}

	GetTimeline(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				Index: data,
			},
		};
		console.log(final_data);
		console.log("Get timeline index : " + data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetTimeline,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log("success");
				console.log(response);
				timeline_get_block_and_blocked_users(response);
			},
			error: function (response) {
				//console.log("error");
				//console.log(response);
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
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingle,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				//console.log("success dans la recuperation de flow unique");
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
				//console.log(response);
				//console.log("error dans la recuperation de flow unique");
			},
		});
	}

	GetSingleComment(data, type, data_response, data_position) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				//console.log("success dans la recuperation de flow unique");
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
				//console.log(response);
				//console.log("error dans la recuperation de flow unique");
			},
		});
	}

	GetSingleResponse(data, data_position) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				//console.log("success dans la recuperation de flow unique");
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
				//console.log(response);
				//console.log("error dans la recuperation de flow unique");
			},
		});
	}

	GetSingleResponseExtended(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetSingleResponseExtended,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				//console.log("success dans la recuperation de flow unique");
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
				//console.log(response);
				//console.log("error dans la recuperation de flow unique");
			},
		});
	}

	DeleteFlow(data, element) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
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
			},
		});
	}

	DeleteComment(data, element) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.DeleteComment,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				delete_comment_from_html(element);
				console.log("Commentaire supprimé avec succes");
			},
			error: function (response) {
				//console.log(response);
				//console.log("error dans la supression de commentaire");
			},
		});
	}

	DeleteResponse(data, element) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.DeleteResponse,
			data: JSON.stringify(final_data),
			success: function (response) {
				delete_response_from_html(element);
				console.log("reponse supprimé avec succes");
			},
			error: function (response) {
				//console.log(response);
				console.log("error dans la supression de la reponse");
			},
		});
	}

	UpdateRegisterId(data) {
		let final_data = {
			Data: data,
			Action: "RegisterId",
			TokenId: window.localStorage.getItem("user_token"),
		};
		//// console.log(final_data.Data);

		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.UpdateRegisterId,
			data: JSON.stringify(final_data),
			success: function (response) {
				// console.log('registerId update sucessfully: ');
				// console.log(response);
			},
			error: function (response) {
				//console.log("registerId update error : ");
				//console.log(response);
				//// console.log(ServerParams.ServerURL + ServerParams.UpdateProfileURL);
			},
		});
	}

	AddNotificationToUser(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddNotificationToUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				//console.log(response);
				console.log("notif added to bdd");
			},
			error: function (response) {
				//console.log(response);
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
			},
		});
	}

	UpdateNotificationToView(data) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
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
			},
		});
	}

	GetNotificationOfUser(data, set_to_seen) {
		let final_data = {
			Data: data,
			TokenId: window.localStorage.getItem("user_token"),
		};
		//console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetNotificationOfUser,
			data: JSON.stringify(final_data),
			success: function (response) {
				UpdateNotificationList(response, set_to_seen);
			},
			error: function (response) {
				//console.log(response);
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
				console.log(registrationId);
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
				ServerManager.AddNotificationToUser(data_notif_to_bdd);
				console.log("Notif envoyé avec succes");
			},
			error: function (response) {
				//console.log("La notif n'a pas été envoyé");
			},
		});
	}

	AddStoryComment(data) {
		let final_data = {
			Data: data,
			Action: "AddStoryComment",
			TokenId: window.localStorage.getItem("user_token"),
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
				//console.log(response);
				// story_comment_uploaded();
			},
			error: function (response) {
				//console.log(response);
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
				//console.log(response);
				if (response.Data) {
					loadStorySeen(response);
				}
				// loadStoryComments(response);
			},
			error: function (response) {
				//console.log(response);
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
			},
		});
	}

	GetBlockedUsers(data, action, mine) {
		let final_data = {
			Data: {},
			TokenId: window.localStorage.getItem("user_token"),
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
			},
			error: function (response) {
				//console.log(response);
			},
		});
	}

	AddReportFlow(data) {
		let final_data = {
			Data: {
				ObjectId: data.additionalData.ObjectId,
			},
			TokenId: window.localStorage.getItem("user_token"),
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
				console.log(response);
				if (connected) {
					explore_get_block_and_blocked_users(response);
				} else {
					//console.log("faut afficher le top50 maintenant");
					UpdateTop50(response);
				}
			},
			error: function (response) {
				//console.log(response);
			},
		});
	}

	AddViewFlow(data) {
		let final_data = {
			TokenId: window.localStorage.getItem("user_token"),
			Data: {
				ObjectId: data,
			},
		};
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.AddViewFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				console.log(response);
			},
			error: function (response) {
				console.log(response);
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
				console.log(response);
				if (connected) {
					recents_get_block_and_blocked_users(response.Data);
				} else {
					//console.log("faut afficher le top50 maintenant");
					UpdateRecents(response.Data);
				}
			},
			error: function (response) {
				console.log(response);
			},
		});
	}

	GetRandomFlow(excluded) {
		let final_data = {
			Data: {
				FlowsExcluded: excluded,
			},
			TokenId: window.localStorage.getItem("user_token"),
		};

		//// console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetRandomFlow,
			data: JSON.stringify(final_data),
			success: function (response) {
				console.log(response);
				showRandomFlow(response);
			},
			error: function (response) {
				console.log(response);
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

		//// console.log(final_data);
		$.ajax({
			type: "POST",
			url: ServerParams.ServerURL + ServerParams.GetFlowOfTheDay,
			data: JSON.stringify(final_data),
			success: function (response) {
				console.log(response);
				showFDJ(response);
			},
			error: function (response) {
				console.log(response);
				pullToRefreshEnd();
			},
		});
	}

	CheckFirstChat(data) // check si on doit crée une nouvelle conversation
	{
		firebase.database().ref(FirebaseEnvironment + '/chats/' + data.chat_id).once('value').then(function (snapshot) {
			/* permet de lire une valeur une seule fois là c'est pour voir si c'est le premier msg envoyé
			pour creer une conversation plutot que just send un msg*/
			console.log("valeur recuperé de la bdd firebase : ");
			console.log(snapshot.val());
			if (snapshot.val() == null) // si c'est le premier msg de la conversation
			{
				first_chat = true;
			}
			else {
				// on crée juste un nouveau message
				first_chat = false;
			}
			Popup("popup-message", true);
		});
	}

	AddMessage(data) { // ajoute les msg à la bdd firebase
		let data_message =
		{
			"sender_id": window.localStorage.getItem("firebase_token"),
			"sender_private_id": window.localStorage.getItem("user_private_id"),
			"sender_full_name": window.localStorage.getItem("user_name"),
			"message": data.message,
			"time": Date.now()
		};
		let db_message = firebase.database().ref(FirebaseEnvironment + '/messages/' + data.chat_id);
		db_message.push().set(data_message).then(() => {
			db_message.once('value').then((snapshot) => {
				console.log(snapshot);
				data_message.message_id = Object.keys(snapshot.val())[0];
			}).then(() => {
				firebase.database().ref(FirebaseEnvironment + "/chats").child(data.chat_id).update({
					last_message: data_message
				});
			});
		});
	}

	AddChat(data, callback) { // ajoute les chats à la bdd firebase
		firebase.database().ref(FirebaseEnvironment + '/chats/' + data.chat_id).update({
			"title": "titre du groupe si c'est un groupe",
			"photo": "lien_photo",
			"creation_date": Date.now(),
			"creator": "", // pour les groupes
			"last_message": "dernier msg de la conv",
			[data.user_id]: true,
			"is_groupe_chat": data.is_groupe_chat,
			[window.localStorage.getItem("firebase_token")]: true
		}).then(function (dataSnapshot) {
			firebase.database().ref(FirebaseEnvironment + '/members/' + data.chat_id).update({
				[data.user_id]: true,
				[window.localStorage.getItem("firebase_token")]: true
			}).then(function () {
				firebase.database().ref(FirebaseEnvironment + '/users/' + data.user_id).child('chats').update({
					[data.chat_id]: true
				});
			}).then(function () {
				firebase.database().ref(FirebaseEnvironment + '/users/' + window.localStorage.getItem("firebase_token")).child('chats').update({
					[data.chat_id]: true
				});
			}).then(function () {
				first_chat = false;
				ServerManager.AddMessage(data);
			});
		});
	}

	GetFirebaseUserProfile(data, callback, chat_id) {

		let all_data_chat = [];
		let all_chat_id = Object.keys(data);
		data = Object.values(data);
		for (let i_nb_chat = 0; i_nb_chat < Object.keys(data).length; i_nb_chat++) {
			let data_chat = data[i_nb_chat];
			let data_get_user_id = Object.keys(data_chat);
			data_chat.chat_id = all_chat_id[i_nb_chat];
			for (let i = data_get_user_id.length - 1; i >= 0; i--) {
				if (data_get_user_id[i].length < 32 || data_get_user_id[i] == window.localStorage.getItem("firebase_token")) {
					data_get_user_id.splice(i, 1);
				}
			}
			let ref_members = firebase.database().ref(FirebaseEnvironment + "/users/" + data_get_user_id[0]);
			ref_members.once('value').then(function (profile_snapshot) {
				if (profile_snapshot.val() != null) {
					let data_block_chat =
					{
						chat_data: data_chat,
						members_data: profile_snapshot.val()
					};
					all_data_chat.push(data_block_chat);
					if (all_data_chat.length == all_chat_id.length) {
						$("#block_chat_contrainer").html("");
						for (let i = 0; i < all_data_chat.length; i++) {
							pop_block_chat(all_data_chat[i]);
						}
					}
				}
			});
		}



		/*
		let data_chat = data;
		data_chat.chat_id = chat_id;
		data = Object.keys(data);

		

		/*for (let i = 0; i < data.length; i++) {
			for (let i_ of Object.keys(data[i][1])) {
				if (i_ != window.localStorage.getItem("firebase_token")) {
					let ref_members = firebase.database().ref(FirebaseEnvironment + "/users/" + i_);
					ref_members.once('value').then(function (profile_snapshot) {
						if (profile_snapshot.val() != null) {
							ServerManager.GetChatData([data[i][0], { [profile_snapshot.key]: [profile_snapshot.val()] }], callback);
						}
					});
				}
			}
		}*/


	}

	//ServerManager.GetChatData(data, callback);

	GetChatData(data, callback) {
		let ref_members = firebase.database().ref(FirebaseEnvironment + "/chats/" + data[0]);
		ref_members.once('value').then(function (dataSnapshot) {
			let data_block_chat = {
				id: data[0],
				member_data: data[1],
				chat_data: dataSnapshot.val()
			};
			callback(data_block_chat);
		});
	}

	GetChatList(data, callback) {
		//startAt(3) index de depart avec inclusion 
		//limitToLast(2) nombre d'enfants que l'on veut
		let data_chat_list = [];
		console.log(" Get chat list was called");
		let ref_members = firebase.database().ref(FirebaseEnvironment + "/members");
		ref_members.orderByChild(data.user_id).equalTo(true).limitToLast(20).once('value').then(function (member_snapshot) {
			ServerManager.GetFirebaseUserProfile(member_snapshot.val(), callback);
			ServerManager.NewChatListener(data);
		});

	}

	NewChatListener(data, callback) {
		firebase.database().ref(FirebaseEnvironment + "/chats").orderByChild(window.localStorage.getItem("firebase_token")).equalTo(true).limitToLast(20)
			.on("value", function (snapshot) {
				console.log("chat modifié : ");
				console.log(snapshot.key);
				console.log("valeur modifié : ");
				console.log(snapshot.val());
				ServerManager.GetFirebaseUserProfile(snapshot.val(), callback, snapshot.key);
			});
	}

	AddUserToFirebase(data) { // ajoute les utilisateurs bdd firebase
		console.log("data add user to firebase : ");
		console.log(data);
		firebase.database().ref(FirebaseEnvironment + '/users/' + data.user_id).update({
			"name": data.full_name,
			"private_id": data.Private_id,
			"profile_pic": data.profile_pic,
			"registration_id": registrationId,
			"LastOs": data.LastOs,
			"time": Date.now()
		});
		ServerManager.NewChatListener(data, pop_block_chat);
	}

	SetMessageToSeen(data) {
		firebase.database().ref(FirebaseEnvironment + '/messages/' + data.chat_id + '/' + data.message_id + '/see_by').update({
			[window.localStorage.getItem("firebase_token")]: true
		});
	}

}

var ServerManager = new ServerManagerClass();