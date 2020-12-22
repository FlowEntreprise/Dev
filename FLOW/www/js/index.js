var appState = {
	takingPicture: true,
	imageUri: "",
	needRestore: false,
	blob: null,
	blob64: "",
	patternKey: "",
	recordTime: 0,
	flow_title: "",
	flow_description: "",
};

var crashlytics;
var analytics;
var push;
var httpd = null;
var worker;

var registrationId;
var noteId = 0;
var app = {
	// Application Constructor
	initialize: function () {
		document.addEventListener(
			"deviceready",
			this.onDeviceReady.bind(this),
			false
		);
		document.addEventListener("pause", this.onPause, false);
		document.addEventListener("resume", this.onResume, false);
	},
	onDeviceReady: function () {
		Keyboard.hide();
		document.addEventListener("backbutton", onBackKeyDown, false);
		setupApp();
		setTimeout(function () {
			Keyboard.hide();
		}, 500);
		setTimeout(function () {
			if (!window.cordova.platformId == "android") {
				StatusBar.overlaysWebView(false);
			}
			StatusBar.backgroundColorByHexString("#f7f7f8");
			let custom_vh = window.innerHeight / 100;
			document.documentElement.style.setProperty("--custom-vh", custom_vh + "px");

			if (window.innerHeight <= 600) {
				document.body.classList.add("mobile600");
			} else if (window.innerHeight <= 700) {
				document.body.classList.add("mobile700");
			}
			if (connected) {
				$(".faccount")[0].style.backgroundImage = "url('')";
				setTimeout(function () {
					$(".faccount")[0].style.backgroundImage =
						"url('" + window.localStorage.getItem("user_profile_pic") + "')";
				}, 100);
			}
			startTuto();
			navigator.splashscreen.hide();
			$(".custom_popup").css({
				"opacity": "1"
			})
			//Framework7
			// setupFDJ(); definitvely moved to app.js
			setTimeout(function () {
				let custom_vh = window.innerHeight / 100;
				document.documentElement.style.setProperty("--custom-vh", custom_vh + "px");

				if (window.innerHeight <= 600) {
					document.body.classList.add("mobile600");
				} else if (window.innerHeight <= 700) {
					document.body.classList.add("mobile700");
				}
			}, 500);
			cordova.plugins.notification.local.clearAll();

			// if (window.localStorage.getItem("fdj_notif_setup") != "ok") {
			// 	cordova.plugins.notification.local.clearAll();
			// 	cordova.plugins.notification.local.schedule({
			// 		title: 'Découvre le flow du jour !',
			// 		text: "Seras-tu l'heureux élu 👑 ?",
			// 		smallIcon: 'res://flow_icone_one_plus',
			// 		color: '#1a84ef',
			// 		type: "flow_du_jour",
			// 		trigger: {
			// 			every: {
			// 				hour: 18,
			// 				minute: 0,
			// 			},
			// 		}
			// 	});
			// 	window.localStorage.setItem("fdj_notif_setup", "ok");
			// }
			// cordova.plugins.notification.local.on('click', function () {
			// 	console.log(" show flow du jour");
			// 	app.showTab("#tab2");
			// 	explore_categories.slideTo(0);
			// });


		}, 1200);





		window.addEventListener("native.keyboardshow", keyboardShowHandler);

		function keyboardShowHandler(e) {
			// console.log('Keyboard height is: ' + e.keyboardHeight);
		}

		// This event fires when the keyboard will hide
		window.addEventListener("native.keyboardhide", keyboardHideHandler);

		function keyboardHideHandler(e) {
			// console.log('Keyboard hidden');
			if (in_identification) {
				$(".after-record-block-container").css("margin-top", "-30vh");
			}
		}

		IonicDeeplink.route({
				"/flow/:FlowId": {
					target: "flow",
					parent: "flow",
				},
			},
			function (match) {
				console.log("deeplink match !", match);
			},
			function (nomatch) {
				console.log("deeplink didnt match 😞", nomatch);
				if (nomatch.$link.path) {
					let FlowId = nomatch.$link.path.replace("/", "");
					setTimeout(function () {
						ServerManager.GetSingle({
							IdFlow: FlowId,
						});
					}, 200);
				}
			}
		);
		var MAX_DIALOG_WAIT_TIME = 5000;
		var ratingTimerId;
		setTimeout(function () {
			LaunchReview.rating(
				function (result) {
					if (cordova.platformId === "android") {
						console.log("Rating dialog displayed");
						window.localStorage.setItem("last_ask_user_rating", Date.now());
					} else if (cordova.platformId === "ios") {
						if (result === "requested") {
							console.log("Requested display of rating dialog");

							ratingTimerId = setTimeout(function () {
								console.warn(
									"Rating dialog was not shown (after " +
									MAX_DIALOG_WAIT_TIME +
									"ms)"
								);
							}, MAX_DIALOG_WAIT_TIME);
						} else if (result === "shown") {
							console.log("Rating dialog displayed");
							window.localStorage.setItem("last_ask_user_rating", Date.now());
							clearTimeout(ratingTimerId);
						} else if (result === "dismissed") {
							console.log("Rating dialog dismissed");
						}
					}
				},
				function (err) {
					console.log("Error opening rating dialog: " + err);
				}
			);

			let last_review = Math.floor((Date.now() - window.localStorage.getItem("last_ask_user_rating")) / 1000 / 60 / 60 / 24);
			if (last_review > 5) {
				LaunchReview.rating();
			}
		}, 270000);

		if (window.localStorage.getItem("new_features_version") != AppVersion.version) {

			// Exception pour cette version : pas de popup nouveautés :
			$(".fred_dot_toolbar_fdj").css("display", "none");
			$(".fred_dot_toolbar_explore").css("display", "none");
			// $("#div_new_features").css("display", "block");
			// $("#div_new_features_background").css("display", "block");
			// $("#border_close_div_new_features")[0].innerHTML = "5 secondes";
			// setTimeout(function () {
			// 	$("#border_close_div_new_features")[0].innerHTML = "4 secondes";
			// }, 3000);
			// setTimeout(function () {
			// 	$("#border_close_div_new_features")[0].innerHTML = "3 secondes";
			// }, 4000);
			// setTimeout(function () {
			// 	$("#border_close_div_new_features")[0].innerHTML = "2 secondes";
			// }, 5000);
			// setTimeout(function () {
			// 	$("#border_close_div_new_features")[0].innerHTML = "1 seconde";
			// }, 6000);
			// setTimeout(function () {
			// 	$("#border_close_div_new_features")[0].innerHTML = "C'est parti !";
			// 	$("#close_div_new_features").css({
			// 		"opacity": "1",
			// 		"pointer-events": "auto"
			// 	});
			// }, 7000);
		} else {
			$(".fred_dot_toolbar_fdj").css("display", "none");
			$(".fred_dot_toolbar_explore").css("display", "none");
		}

		this.receivedEvent("deviceready");
	},
	onPause: function () {
		console.log("pause");
		stopAllStoriesAudio();
		stopAllBlocksAudio();
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
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
		// if (appState.takingPicture || appState.imageUri) {
		//     window.localStorage.setItem("app_state", JSON.stringify(appState));
		//     console.log("app state saved");
		// }
	},
	onResume: function (event) {
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		stopAllStoriesAudio();
		stopAllBlocksAudio();
	},

	// Update DOM on a Received Event
	receivedEvent: function (id) {
		document.addEventListener(
			"offline",
			function () {
				offline();
			},
			false
		);
		document.addEventListener(
			"online",
			function () {
				online();
			},
			false
		);

		if (window.cordova.platformId == "android") {
			crashlytics = FirebaseCrashlytics.initialise();
			crashlytics.logException("my caught exception");

			// analytics = cordova.plugins.firebase.analytics;
			// analytics.setCurrentScreen(current_page);
		}

		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
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

		httpd =
			cordova && cordova.plugins && cordova.plugins.CorHttpd ?
			cordova.plugins.CorHttpd :
			null;

		// No need since no using workers anymore
		// httpd.startServer({
		//     'www_root': 'js/worker/',
		//     'port': 8080,
		//     'localhost_only': true
		// }, function (url) {
		//     // if server is up, it will return the url of http://<server ip>:port/
		//     // the ip is the active network connection
		//     // if no wifi or no cell, "127.0.0.1" will be returned.
		//     console.log("server is started: " + url);
		//     // createWorker();
		// }, function (error) {
		//     console.log("failed to start server: " + error);
		// });

		if (window.cordova && window.audioinput) {
			// Subscribe to audioinput events
			//
			window.addEventListener("audioinput", onAudioInputCapture, false);
			window.addEventListener("audioinputerror", onAudioInputError, false);

			console.log("cordova-plugin-audioinput successfully initialised");
		} else {
			console.log("cordova-plugin-audioinput not found!");
		}

		var push = PushNotification.init({
			android: {
				icon: "flow_icone_one_plus",
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true",
			},
		});

		let topic = window.cordova.platformId == "ios" ? "all-ios" : "all-android";

		push.subscribe(topic, function () {
			console.log('subscribe success: ' + topic);
		}, function (e) {
			console.log()('subscribe error:');
		});

		push.on("registration", function (data) {
			// data.registrationId
			console.log(data.registrationId);
			registrationId = data.registrationId;

			if (window.cordova.platformId == "ios" && registrationId.length < 100) {
				let data_apns_to_fcm = {
					application: "com.flowapp.flow",
					sandbox: true,
					apns_tokens: [registrationId],
				};
				console.info(
					" le registrationid avant la transformation est : " + registrationId
				);
				ServerManager.APNS_token_to_FCM_token(data_apns_to_fcm);
			}
		});

		push.on("notification", function (data) {
			/*le false correspond au notification recu lorque l'app est en background en gros quand tu reçois une notif mais que t'es
			pas dans l'application */
			console.log(data);
			console.log("pluggin push chris");

			if (data.additionalData.foreground == false) {
				Popup("popup-specifique", false);
				Popup("popup-comment", false);
				if (window.cordova.platformId == "ios" && data.additionalData.type != "flow_du_jour") {
					data.additionalData.sender_info = JSON.parse(
						data.additionalData.sender_info
					);
				}
				if (data.additionalData.type == "story_comment") {
					return;
				}
				if (data.additionalData.type == "flow_du_jour") {
					explore_categories.slideTo(0);
					setupFDJ();
					return;
				}
				if (data.additionalData.type == "follow") {
					let data_go_to_account = {
						private_Id: data.additionalData.sender_info.privateId,
						user_private_Id: window.localStorage.getItem("user_private_id"),
					};
					go_to_account(data_go_to_account);
				} else {
					$(".flow_specifique_container").html("");
					// let myApp = new Framework7();

					if (
						data.additionalData.type == "like_comment" ||
						data.additionalData.type == "send_comment" ||
						(data.additionalData.type == "tag_in_comment" &&
							data.additionalData.sender_info.Id_comment)
					) {
						let data_single_comment = {
							ObjectId: data.additionalData.sender_info.Id_comment,
						};
						ServerManager.GetSingleComment(data_single_comment);
					}
					if (
						data.additionalData.type == "like_response" ||
						data.additionalData.type == "send_response" ||
						(data.additionalData.type == "tag_in_comment" &&
							data.additionalData.sender_info.Id_response)
					) {
						let data_single_response = {
							ObjectId: data.additionalData.sender_info.Id_response,
						};
						ServerManager.GetSingleResponseExtended(data_single_response);
					}
					if (
						data.additionalData.type == "like_flow" ||
						data.additionalData.type == "tag_in_flow"
					) {
						let data_flow = {
							IdFlow: data.additionalData.sender_info.IdFlow,
						};
						ServerManager.GetSingle(data_flow);
					}
				}
				refresh_notif(true);
			}
			if (data.additionalData.foreground == true && data.additionalData.type != "flow_du_jour") {
				in_app_notif(data);
				refresh_notif();
			}
		});

		push.on("error", function (e) {
			console.log(e.message);
		});


		setTimeout(function () {
			let _root = document.documentElement;
			let _myvar = window.innerHeight / 100;
			_root.style.setProperty("--custom-vh", _myvar + "px");
		}, 500);
	},
};

app.initialize();


// app.initialize();

// var $$ = Dom7;

// var app = new Framework7({
// 	showBarsOnPageScrollEnd: false,
// 	material: false,
// 	tapHold: true,
// 	tapHoldDelay: 300,
// 	input: {
// 		scrollIntoViewOnFocus: true,
// 		scrollIntoViewCentered: true,
// 	}, //enable tap hold events
// });

var storage = window.localStorage;

/*************************************** */
function b64toBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || "";
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {
		type: contentType,
	});
	return blob;
}

Storage.prototype.setObj = function (key, obj) {
	return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
	return JSON.parse(this.getItem(key));
};

// Replace default alert by Sweet Alert

/*window.alert = function (txt) {
	swal(txt);
};
*/
$("#close_div_new_features").on("click", function () {
	$("#div_new_features").css("display", "none");
	$("#div_new_features_background").css("display", "none");
	window.localStorage.setItem("new_features_version", AppVersion.version);
});

function check_app_version(app_version) {
	setTimeout(function () {
		if (
			(window.cordova.platformId == "ios" &&
				app_version.Ios != AppVersion.version) ||
			(window.cordova.platformId == "android" &&
				app_version.Android != AppVersion.version)
		) {
			navigator.notification.confirm(
				"Mets l'application à jour pour profiter des toutes dernières fonctionnalités.",
				function (id) {
					if (id == 1) {
						if (window.cordova.platformId == "ios") {
							window.location =
								"https://apps.apple.com/fr/app/flow-reseau-social-vocal/id1505107977?l=en";
						}
						if (window.cordova.platformId == "android") {
							window.location =
								"https://play.google.com/store/apps/details?id=com.flowapp.flow";
						}
					}
				},
				"Nouvelle version de l'application disponible !",
				["OK", "Annuler"]
			);
		}
	}, 1000);
}


function offline() {
	console.log("you are offline");
	pullToRefreshEnd();
}

function online() {
	console.log("you are online");
	ServerManager.GetStory();
}

window.handleOpenURL = function (url) {
	setTimeout(function () {
		console.log("received url: " + url);
		if (url.includes("flow")) {
			let IdFlow = url.split("flow/")[1];
			ServerManager.GetSingle({
				IdFlow: IdFlow,
			});
		}
	}, 200);
};

var tab1_count = 0;
var tab2_count = 0;
var tab3_count = 0;
var tab4_count = 0;
$(".home_btn").on("click", function () {
	tab1_count++;
	setTimeout(function () {
		tab1_count = 0;
	}, 1000);
});
$(".explore_btn").on("click", function () {
	if (tab1_count == 2) {
		tab2_count++;
		setTimeout(function () {
			tab2_count = 0;
		}, 1000);
	}
});
$(".messages_btn").on("click", function () {
	if (tab2_count == 1) {
		tab3_count++;
		setTimeout(function () {
			tab3_count = 0;
		}, 1000);
	}
});
$(".notifications_btn").on("click", function () {
	if (tab3_count == 5) {
		if (ServerParams.ServerURL == "https://api-test.flowappweb.com/") {
			DisconnectUser();
			ServerParams.ServerURL = "https://api.flowappweb.com/";
		} else if (ServerParams.ServerURL == "https://api.flowappweb.com/") {
			DisconnectUser();
			ServerParams.ServerURL = "https://api-test.flowappweb.com/";
		}
		setTimeout(function () {
			tab4_count = 0;
		}, 1000);
	}
});

/*
J'ai remove ça du config.xml juste pour save ça qq part :
<preference name="AndroidLaunchMode" value="singleInstance" />
<preference name="KeepRunning" value="true" />
*/