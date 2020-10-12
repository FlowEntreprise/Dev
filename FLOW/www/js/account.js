var follow = false;
var followYou;
var privateIDAccount;
var nameCompte;
var bioCompte;
var mainView = app.addView(".view-main");
var FlowBandeau;
var Follower;
var Following;
var indexAccount;
var indexAccountLike;
var accountFlowAdd = true;
var UserFlowAdd = true;
var UserLikeAdd = true;
var profilePicLink;
var account_registrationId;
var LastOs;
var user_is_blocked;
var blocked_by_user;
var last_scroll = 0;

function alertDismissed() {}

function fInitialisationAccount(privateId) {
	$("#UserActivity")[0].innerHTML = "";
	$("#UserLikes")[0].innerHTML = "";
	let loading_tl = document.createElement("div");
	loading_tl.className = "loading-spinner loading_account";
	loading_tl.style.marginTop = "50%";
	$("#UserActivity")[0].appendChild(loading_tl);
	$("#UserLikes")[0].appendChild(loading_tl);
	console.log("on est dans fInitialisationAccount");
	privateIDAccount = privateId;
	indexAccount = 0;
	indexAccountLike = 0;
	if (blocked_by_user == false || connected == false) {
		var getFlow = {
			Index: indexAccount,
			PrivateId: privateIDAccount,
		};
		ServerManager.GetUserFlow(getFlow);
		let data = {
			Index: indexAccountLike,
			PrivateId: privateIDAccount,
		};
		ServerManager.GetLikedFlows(data, false);
	}
	if (blocked_by_user == true) {
		i_am_blocked();
	}

	var getInfosUserNumber = {
		PrivateId: privateIDAccount,
	};
	ServerManager.getInfosUserNumber(getInfosUserNumber);
	var getUserInfoAccount = {
		PrivateId: privateIDAccount,
	};
	ServerManager.GetUserInfo(getUserInfoAccount);
}

function user_block_management(data, privateId) {
	// gere les users que l'on a block et qui nous ont block
	console.log("on est dans user_block_management");

	if (data.UserBlocked.length == 0) {
		user_is_blocked = false;
	} else {
		for (let i in data.UserBlocked) {
			// users que l'on a block
			if (data.UserBlocked[i] == privateId) {
				user_is_blocked = true;
				$("#block_button").css(
					"background-image",
					'url("src/icons/block_filled.png")'
				);
				break;
			} else {
				user_is_blocked = false;
				$("#block_button").css(
					"background-image",
					'url("src/icons/block.png")'
				);
			}
		}
	}

	if (data.BlockedByUser.length == 0) {
		// users qui nous on block
		blocked_by_user = false;
	} else {
		for (let i in data.BlockedByUser) {
			if (data.BlockedByUser[i] == privateId) {
				blocked_by_user = true;
				break;
			} else {
				blocked_by_user = false;
			}
		}
	}

	fInitialisationAccount(privateId);
}

function i_am_blocked() {
	$("#UserActivity").html("");
	$("#UserLikes").html("");
	let label_i_am_blocked = document.createElement("label");
	label_i_am_blocked.id = "label_i_am_blocked";
	label_i_am_blocked.innerHTML = "Vous êtes bloqué par cet utilisateur";
	$("#UserActivity").append(label_i_am_blocked);
	//$("#UserLikes").append(label_i_am_blocked);
	/*$("#fFollowButtunAccount").css("background-color", "#ff0054");
    $("#fFollowButtunAccount").css("border", "solid 1.5px #ff0054");
    $("#fFollowButtunAccount").innerHTML = "BLOQUÉ";
    $("#fFollowButtunAccount").css("pointer-events", "none");*/
	$("#fFollowYouButtunAccount").css("display", "none");
	$("#block_button").css("display", "none");
}

$("#freturnCompte").on("click", function () {
	$("#fFollowButtunAccount").css("border", "solid 1.5px #1a84ef");
	$("#fFollowButtunAccount").innerHTML = "ABONNÉ";
	$("#fFollowButtunAccount").css("pointer-events", "auto");
	$("#block_button").css("display", "block");
});

$(".fnavAccount").css(
	"transform",
	"translate3d(0vw, calc(7 * var(--custom-vh)), 0vh)"
);

document
	.getElementById("popup-account")
	.addEventListener("opened", function () {
		last_scroll = 0;
		current_page = "account";
		app.showTab("#tabCompte1");
		$(".ftabsAccount")[0].style.display = "block";
		$("#tabCompte2").css("display", "block");
		// $(".ftabsAccount")[0].setAttribute("style", "height:68% !important");
		// $("scrollEventAccount").remove(".swiper-wrapper");
		$("#accountBannerScrollAccount").css(
			"transform",
			"translate3d(0vw, 0vh, 0vh)"
		);
		$(".fnavAccount").removeClass("fnavAccountTransitionTop");
		$(".fnavAccount").addClass("fnavAccountTransitionDown");
		$(".ftabsAccount").css("transition-duration", "0.2s");
		var scrollTest = $(".scrollAccunt").scrollTop();
		$(".fnavAccount").css(
			"transform",
			"translate3d(0vw, calc(7 * var(--custom-vh)), 0vh)"
		);
		// $(".ftabsAccount").css("transform", "translate3d(0vw, 2vh, 0vh)");
		$(".ftabsAccount").css(
			"transform",
			"translate3d(0vw, calc(-30 * var(--custom-vh)), 0vh)"
		);
		boolScrollTop = true;
		$("#UserActivity").addClass("fblockAccountPadding");

		stopAllBlocksAudio();
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page",
			{
				page: current_page,
				duration: time_in_last_screen,
			},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);

		// analytics.setCurrentScreen(current_page);

		// $(".ftabsAccount")[0].setAttribute("style", "height:68% !important");
		$(".fflow-btn").css("display", "none");
		$(".flow-btn-shadow").css("display", "none");

		if (connected == false) {
			$("#block_button").css("display", "none");
			$("#fFollowButtunAccount").removeClass("activeButtunFollow");
			$("#fFollowButtunAccount").text("S'ABONNER");
		} else {
			$("#block_button").css("display", "block");
		}
		/* 
    c'est le pire code au monde putin 
    
    $("#fflowBandeauChiffre").html("");
    $("#ffollowersBandeauChiffre").html("");
    $("#ffollowingBandeauChiffre").html("");
    $("#fbioCompte").html("loading");
    $("#fnameCompte").html("loading");
    $("#privateID").html("loading");
    $("#fprofilPicture").css({
        "background-image": "none"
    });*/

		var scroll_element = $("#tabCompte1");
		scroll_element[0].scrollTop = 0;
		checkScrollAccount();
		$$("#tabCompte1").on("tab:show", function () {
			scroll_element = $("#tabCompte1");
			checkScrollAccount();
		});

		$$("#tabCompte2").on("tab:show", function () {
			scroll_element = $("#tabCompte2");
			checkScrollAccount();
		});

		var boolScrollTop = true;

		$(".scrollAccunt").scroll(function () {
			checkScrollAccount();
		});

		$("#fprofilPicture").click(function () {
			openPP();
		});

		$("#returnProfilPicture").click(function () {
			closePP();
		});

		function checkScrollAccount() {
			let current_scroll =
				scroll_element.scrollTop() + scroll_element.innerHeight();
			if (current_scroll > last_scroll + 10 && last_scroll != 0) {
				// if (scroll_element[0].scrollHeight > document.body.clientHeight) {
				// event.preventDefault();
				// event.stopPropagation();
				// $("scrollEventAccount").remove(".swiper-wrapper");
				$("#accountBannerScrollAccount").css(
					"transform",
					"translate3d(0vw, calc(-30 * var(--custom-vh)), 0vh)"
				);
				if (boolScrollTop) {
					// $(".ftabsAccount")[0].setAttribute("style", "height:94vh !important");
					$(".fnavAccount").removeClass("fnavAccountTransitionDown");
					$(".fnavAccount").addClass("fnavAccountTransitionTop");
					$(".fnavAccount").css(
						"transform",
						"translate3d(0vw, calc(-20 * var(--custom-vh)), 0vh)"
					);
					$(".ftabsAccount").css({
						"transition-duration": "0.4s",
						// "transform": "translate3d(0vw, -23vh, 0vh)"
					});
					boolScrollTop = false;
				}
				$("#UserActivity").removeClass("fblockAccountPadding");
				// }
				// $("scrollEventAccount").addClass(".swiper-wrapper");
			} else {
				// if (scroll < 100 /*&& $(".ftabsAccount")[0].style.height == "94vh"*/ ) {
				if (
					(current_scroll < last_scroll - 10 &&
						current_scroll < scroll_element[0].scrollHeight - 30) ||
					current_scroll <= scroll_element.innerHeight()
				) {
					// event.preventDefault();
					// event.stopPropagation();
					if (boolScrollTop == false) {
						// $(".ftabsAccount")[0].setAttribute("style", "height:68% !important");
						// $("scrollEventAccount").remove(".swiper-wrapper");
						$("#accountBannerScrollAccount").css("transition-duration", "0.2s");
						$("#accountBannerScrollAccount").css(
							"transform",
							"translate3d(0vw, 0vh, 0vh)"
						);
						$(".fnavAccount").removeClass("fnavAccountTransitionTop");
						$(".fnavAccount").addClass("fnavAccountTransitionDown");
						//                     $(".ftabsAccount").css("transition-duration", "0.2s");
						var scrollTest = $(".scrollAccunt").scrollTop();
						$(".fnavAccount").css(
							"transform",
							"translate3d(0vw, calc(7 * var(--custom-vh)), 0vh)"
						);
						//                     $(".ftabsAccount").css("transform", "translate3d(0vw, 2vh, 0vh)");
						$(".ftabsAccount").css({
							"transition-duration": "0.2s",
							// "transform": "translate3d(0vw, 2vh, 0vh)"
						});
						boolScrollTop = true;
						$("#UserActivity").addClass("fblockAccountPadding");
					}
				}
			}
			// position = scroll;
			last_scroll = current_scroll;
		}

		$("#fgobackCompte").click(function () {
			Popup("popup-account", false);
		});

		$("#tabCompte1").scroll(function () {
			var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
			if (UserFlowAdd == true) {
				if (
					Math.round($(this).scrollTop()) >= limit * 0.75 &&
					indexAccount > 0
				) {
					UserFlowAdd = false;
					var addUserFlow = {
						Index: indexAccount,
						PrivateId: privateIDAccount,
					};
					ServerManager.GetUserFlow(addUserFlow);
				}
			}
		});

		$("#tabCompte2").scroll(function () {
			var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
			if (UserLikeAdd == true) {
				if (
					Math.round($(this).scrollTop()) >= limit * 0.75 &&
					indexAccountLike > 0
				) {
					UserLikeAdd = false;
					var data = {
						Index: indexAccountLike,
						PrivateId: privateIDAccount,
					};
					ServerManager.GetLikedFlows(data, false);
				}
			}
		});
	});

document
	.getElementById("popup-account")
	.addEventListener("closed", function () {
		//$(".flow-btn-shadow").css("display", "block");
		privateIDAccount = "";
		profilePicLink = "";
		bioCompte = "";
		nameCompte = "";
		// follow = "";
		// followYou = "";
		$(".fflow-btn").css("display", "block");
		$(".flow-btn-shadow").css("display", "block");
		$(".fflow-btn").css("z-index", "1");
		$(".flow-btn-shadow").css("z-index", "0");
		//$("#tabCompte2").css("display", "none");
		$(".ftabsAccount")[0].style.display = "none";
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page",
			{
				page: current_page,
				duration: time_in_last_screen,
			},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		current_page = "home";

		// analytics.setCurrentScreen(current_page);

		stopAllBlocksAudio();
		// mainView.back();
		// tabCompte2
	});

$("#fFollowButtunAccount").click(function () {
	if (connected) {
		if (user_is_blocked == false && blocked_by_user == false) {
			//$(this)[0].style.pointerEvents = "none";
			if ($("#fFollowButtunAccount").attr("class") != "activeButtunFollow") {
				$("#fFollowButtunAccount").addClass("activeButtunFollow");
				$("#fFollowButtunAccount").text("ABONNÉ");
			} else {
				$("#fFollowButtunAccount").removeClass("activeButtunFollow");
				$("#fFollowButtunAccount").text("S'ABONNER");
			}
			let data = {
				PrivateId: privateIDAccount,
				type: "profile_follow",
			};
			ServerManager.ActionFollow(data);
		}
		if (user_is_blocked == true) {
			//alert("Débloquez d'abord cet utilisateur");
			navigator.notification.alert(
				"Débloque d'abord cet utilisateur",
				alertDismissed,
				"Information"
			);
		}
		if (blocked_by_user == true) {
			//alert("Cet utilisateur vous a bloqué");
			navigator.notification.alert(
				"Cet utilisateur t'a bloqué",
				alertDismissed,
				"Information"
			);
		}
	} else {
		Popup("popup-connect", true, 60);
	}
});

function manageFollow(type, element) {
	// html_element est element html qui doit etre affecté
	if (type == "profile_follow") {
		if (follow) {
			$("#fFollowButtunAccount").addClass("activeButtunFollow");
			$("#fFollowButtunAccount").text("ABONNÉ");
		} else {
			$("#fFollowButtunAccount").removeClass("activeButtunFollow");
			$("#fFollowButtunAccount").text("S'ABONNER");
		}
	}

	if (type == "block_user_follow") {
		if (follow) {
			$(element.following_button).text("ABONNÉ");
			$(element.following_button).addClass("activeButtunFollow");
			if (current_page == "my-account") {
				MyFollowing = +MyFollowing + 1;
				$("#ffollowingmyBandeauChiffre").html(MyFollowing);
			}
		} else {
			$(element.following_button).text("S'ABONNER");
			$(element.following_button).removeClass("activeButtunFollow");
			if (current_page == "my-account") {
				MyFollowing = +MyFollowing - 1;
				$("#ffollowingmyBandeauChiffre").html(MyFollowing);
			}
		}
	}
}
//#fFollowButtunAccount

function manageFollowYou() {
	if (followYou) {
		$("#fFollowYouButtunAccount").css("display", "block");
	} else {
		$("#fFollowYouButtunAccount").css("display", "none");
	}
}

function ShowUserProfile(response) {
	console.log(response);
	if (
		response.Data.PrivateId == window.localStorage.getItem("user_private_id")
	) {
		console.log("my profile infos received");
		const src =
			"https://" +
			response.LinkBuilder.Hostname +
			":" +
			response.LinkBuilder.Port +
			"/images/" +
			response.Data.ProfilePicture.name +
			"?";
		const param = `${response.LinkBuilder.Params.hash}=${response.Data.ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data.ProfilePicture.timestamp}`;
		console.log(src + param);
		let link_built = src + param;
		window.localStorage.setItem("user_profile_pic", link_built);
		$("#fmyprofilPicture").css({
			"background-image":
				"url('" + window.localStorage.getItem("user_profile_pic") + "')",
		});
		$(".faccount").css({
			"background-image":
				"url('" + window.localStorage.getItem("user_profile_pic") + "')",
		});
	} else if (response.Data.PrivateId == privateIDAccount) {
		bioCompte = response.Data.Bio;
		// if (Compte.length > 57) bioCompte = bioCompte.substring(0, 57) + "..."; limit bio length by hand (done in css now)
		nameCompte = response.Data.FullName;
		account_registrationId = response.Data.RegisterId;
		LastOs = response.Data.LastOs;
		if (response.Data.HeFollowYou) {
			followYou = JSON.parse(response.Data.HeFollowYou);
			follow = JSON.parse(response.Data.YouFollowHim);
			manageFollow("profile_follow");
			manageFollowYou();
		}
		$("#fbioCompte").html(bioCompte);
		$("#fnameCompte").html(nameCompte);
		$("#privateID").html("@" + privateIDAccount);
		const src_profile_img =
			"https://" +
			response.LinkBuilder.Hostname +
			":" +
			response.LinkBuilder.Port +
			"/images/" +
			response.Data.ProfilePicture.name +
			"?";
		const param_profile_img = `${response.LinkBuilder.Params.hash}=${response.Data.ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data.ProfilePicture.timestamp}`;
		profilePicLink = src_profile_img + param_profile_img;
		$("#fprofilPicture").css({
			"background-image": "url('" + profilePicLink + "')",
		});
		$("#fbigProfilPicture").css({
			"background-image": "url('" + profilePicLink + "')",
		});
		var profilePicture = document.createElement("img");
		profilePicture.setAttribute("src", profilePicLink);

		profilePicture.addEventListener("load", function () {
			var vibrant = new Vibrant(profilePicture);
			var swatches = vibrant.swatches();
			$("#fbigProfilPictureContainer").css(
				"background-color",
				swatches.Muted.getHex()
			);
		});

		//Popup("popup-account", true);
	}
}

function ShowInfosUserNumber(data) {
	FlowBandeau = data.NbFlow;
	Follower = data.NbFollower;
	Following = data.NbFollowing;
	$("#fflowBandeauChiffre").html(FlowBandeau);
	$("#ffollowersBandeauChiffre").html(Follower);
	$("#ffollowingBandeauChiffre").html(Following);
}

function ShowUserFlow(flow) {
	if ($(".loading_account")) $(".loading_account").remove();
	if (Array.isArray(flow.Data) == false || flow.Data.length == 0) {
		UserFlowAdd = false;
		if (indexAccount == 0) {
			let no_flows = document.createElement("label");
			no_flows.className = "empty_content";
			no_flows.innerHTML = "Aucun flow publié";
			$("#UserActivity")[0].appendChild(no_flows);
		}
	} else if (flow.Data[0].PrivateId == privateIDAccount) {
		var countFlow = 0;
		for (let i = 0; i < flow.Data.length; i++) {
			countFlow++;
			let data = flow.Data[i];
			var image_link = undefined;
			var pattern_key = undefined;
			if (data.Background.PatternKey == undefined) {
				const src_img =
					"https://" +
					flow.LinkBuilder.Hostname +
					":" +
					flow.LinkBuilder.Port +
					"/images/" +
					data.Background.name +
					"?";
				const param_img = `${flow.LinkBuilder.Params.hash}=${data.Background.hash}&${flow.LinkBuilder.Params.time}=${data.Background.timestamp}`;
				image_link = src_img + param_img;
			} else {
				pattern_key = data.Background.PatternKey;
			}

			const src_flow =
				"https://" +
				flow.LinkBuilder.Hostname +
				":" +
				flow.LinkBuilder.Port +
				"/flows/" +
				data.Audio.name +
				"?";
			const param_flow = `${flow.LinkBuilder.Params.hash}=${data.Audio.hash}&${flow.LinkBuilder.Params.time}=${data.Audio.timestamp}`;
			const flow_link = src_flow + param_flow;

			const src_profile_img =
				"https://" +
				flow.LinkBuilder.Hostname +
				":" +
				flow.LinkBuilder.Port +
				"/images/" +
				data.ProfilPicture.name +
				"?";
			const param_profile_img = `${flow.LinkBuilder.Params.hash}=${data.ProfilPicture.hash}&${flow.LinkBuilder.Params.time}=${data.ProfilPicture.timestamp}`;
			var profilePicLink = src_profile_img + param_profile_img;
			let block_params = {
				parent_element: $("#UserActivity"),
				afterblock: false,
				ObjectId: data.ObjectId,
				audioURL: flow_link,
				duration: data.Duration,
				patternKey: pattern_key,
				imageURL: image_link,
				title: data.Title,
				description: data.Description,
				pseudo: data.PrivateId,
				account_imageURL: profilePicLink,
				IsLike: data.IsLike,
				IsComment: data.IsComment,
				Likes: data.Likes,
				PrivateId: data.PrivateId,
				Times: data.Time,
				RegisterId: data.RegisterId,
				LastOs: data.LastOs,
				Comments: data.Comments,
			};
			var new_block = new block(block_params);
			all_blocks.push(new_block);
			if (i == 0 && indexAccount == 0)
				new_block.block_flow.style.marginTop = "calc(37 * var(--custom-vh))";
		}
		if (countFlow < 5) {
			indexAccount++;
			UserFlowAdd = false;
			// let tick_tl = document.createElement("div");
			// tick_tl.className = "tick_icon";
			// $("#UserActivity")[0].appendChild(tick_tl);
		} else {
			indexAccount++;
			UserFlowAdd = true;
			let loading_tl = document.createElement("div");
			loading_tl.className = "loading-spinner loading_account";
			$("#UserActivity")[0].appendChild(loading_tl);
		}
	}
}

function ShowLikedFlows(flow, data_block_user) {
	console.log(flow);
	if (Array.isArray(flow.Data) == false || flow.Data.length == 0) {
		UserLikeAdd = false;
		if (indexAccountLike == 0) {
			let no_flows = document.createElement("label");
			no_flows.className = "empty_content";
			no_flows.innerHTML = "Aucun flow aimé";
			$("#UserLikes")[0].appendChild(no_flows);
			// Testing purposes only !!
			// for (let i = 0; i < 3; i++) {
			//     let block_params = {
			//         parent_element: $("#UserLikes")[0]
			//     };
			//     let fake_block = new block(block_params);
			//     //$(fake_block.block_flow).css("display", "none");
			// }
		}
		if ($(".loading_account")) $(".loading_account").remove();
	} else {
		var countFlow = 0;
		let unique_block_user;

		if (data_block_user) {
			unique_block_user = data_block_user.Data.UserBlocked.concat(
				data_block_user.Data.BlockedByUser
			);
			unique_block_user = unique_block_user.filter(
				(item, pos) => unique_block_user.indexOf(item) === pos
			);
		}

		for (let i = 0; i < flow.Data.length; i++) {
			countFlow++;
			let data = flow.Data[i];
			var image_link = undefined;
			var pattern_key = undefined;
			if (data.Background.PatternKey == undefined) {
				image_link = data.Background;
			} else {
				pattern_key = data.Background.PatternKey;
			}
			const flow_link = data.Audio;
			console.log(flow_link);
			var profilePicLink = data.ProfilePicture;
			if (unique_block_user && unique_block_user.length > 0) {
				for (let i_unique_block_user in unique_block_user) {
					if (unique_block_user[i_unique_block_user] != data.PrivateId) {
						let block_params = {
							parent_element: $("#UserLikes"),
							afterblock: false,
							ObjectId: data.ObjectId,
							audioURL: flow_link,
							duration: data.Duration,
							patternKey: pattern_key,
							imageURL: image_link,
							title: data.Title,
							description: data.Description,
							pseudo: data.PrivateId,
							account_imageURL: profilePicLink,
							IsLike: data.IsLike,
							IsComment: data.IsComment,
							Likes: data.Likes,
							ObjectId: data.ObjectId,
							PrivateId: data.PrivateId,
							Times: data.Time,
							RegisterId: data.RegisterId,
							LastOs: data.LastOs,
							Comments: data.Comments,
						};
						let new_block = new block(block_params);
						all_blocks.push(new_block);
						if (i == 0 && indexAccountLike == 0)
							new_block.block_flow.style.marginTop =
								"calc(37 * var(--custom-vh))";
						if ($(".loading_account")) $(".loading_account").remove();
					}
				}
			} else {
				let block_params = {
					parent_element: $("#UserLikes"),
					afterblock: false,
					ObjectId: data.ObjectId,
					audioURL: flow_link,
					duration: data.Duration,
					patternKey: pattern_key,
					imageURL: image_link,
					title: data.Title,
					description: data.Description,
					pseudo: data.PrivateId,
					account_imageURL: profilePicLink,
					IsLike: data.IsLike,
					IsComment: data.IsComment,
					Likes: data.Likes,
					ObjectId: data.ObjectId,
					PrivateId: data.PrivateId,
					Times: data.Time,
					RegisterId: data.RegisterId,
					LastOs: data.LastOs,
					Comments: data.Comments,
				};
				let new_block = new block(block_params);
				all_blocks.push(new_block);
				if (i == 0 && indexAccountLike == 0)
					new_block.block_flow.style.marginTop = "calc(37 * var(--custom-vh))";
				if ($(".loading_account")) $(".loading_account").remove();
			}
		}
		if (countFlow < 5) {
			indexAccountLike++;
			UserLikeAdd = false;
			// let tick_tl = document.createElement("div");
			// tick_tl.className = "tick_icon";
			// $("#UserLikes")[0].appendChild(tick_tl);
		} else {
			indexAccountLike++;
			UserLikeAdd = true;
			let loading_tl = document.createElement("div");
			loading_tl.className = "loading-spinner loading_account";
			$("#UserLikes")[0].appendChild(loading_tl);
		}
	}
}

function openPP() {
	$("#fbigProfilPictureContainer").css({
		transform: "scale(1)",
		opacity: "1",
		"pointer-events": "auto",
	});
	in_pp = true;
}

function closePP() {
	$("#fbigProfilPictureContainer").css({
		transform: "scale(0.4)",
		opacity: "0",
		"pointer-events": "none",
	});
	in_pp = false;
}

function FollowResponse(response, type, element) {
	if (response.Follow !== undefined) {
		follow = true;
		if (type != "block_user_follow") {
			Follower++;
			$("#ffollowersBandeauChiffre").html(Follower);
		}
		let data_notif_follow = {
			sender_private_id: window.localStorage.getItem("user_private_id"),
			RegisterId: account_registrationId,
			LastOs: LastOs,
		};
		if (type == "block_user_follow") {
			(data_notif_follow.RegisterId = element.RegisterId),
				(data_notif_follow.LastOs = element.LastOs);
		}
		send_notif_to_user(data_notif_follow, "follow");
	} else if (response.UnFollow !== undefined) {
		follow = false;
		if (type != "block_user_follow") {
			Follower--;
			$("#ffollowersBandeauChiffre").html(Follower);
		}
	} else {
	}
	$("#fFollowButtunAccount")[0].style.pointerEvents = "auto";
	manageFollow(type, element);
}

// block user

$("#block_button").on("click", function () {
	console.log("click sur boutton de block");
	if (user_is_blocked == false) {
		// block.png icone grise donc user debloqué
		navigator.notification.confirm(
			"Veux-tu vraiment bloquer cet utilisateur ?",
			function (id) {
				if (id == 1) {
					function alertDismissed() {}
					// On me bloque pas moi.
					if (
						privateIDAccount.toUpperCase() == "KING.CHRIS" ||
						privateIDAccount.toUpperCase() == "CRYOS" ||
						privateIDAccount.toUpperCase() == "VICFOU"
					) {
						navigator.notification.alert(
							"Une erreur est survenue veuillez réessayer ultérieurement",
							alertDismissed,
							"Information",
							"Ok"
						);
					} else {
						let data = {
							additionalData: {
								type: "block_user",
								privateId: privateIDAccount,
							},
						};
						ServerManager.BlockUser(data);
						$("#block_button").css(
							"background-image",
							'url("src/icons/block_filled.png")'
						);
						$("#fFollowYouButtunAccount").css("display", "none");
						$("#fFollowButtunAccount").removeClass("activeButtunFollow");
						$("#fFollowButtunAccount").text("S'ABONNER");
						if (follow == true && Follower > 0) {
							Follower = +Follower - 1;
						}

						$("#ffollowersBandeauChiffre").html(Follower);
						user_is_blocked = true;
					}
				}
			},
			"Confirmation",
			["Oui", "Annuler"]
		);

		return;
	}
	if (user_is_blocked == true) {
		// block_filled.png icone rouge donc user bloqué
		navigator.notification.confirm(
			"Veux-tu vraiment débloquer cet utilisateur ?",
			function (id) {
				if (id == 1) {
					let data = {
						additionalData: {
							type: "unblock_user",
							privateId: privateIDAccount,
						},
					};
					ServerManager.UnBlockUser(data);
					$("#block_button").css(
						"background-image",
						'url("src/icons/block.png")'
					);
					user_is_blocked = false;
				}
			},
			"Confirmation",
			["Oui", "Annuler"]
		);
		return;
	}
});
