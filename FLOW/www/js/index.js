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
var device_language;
var language_mapping;
var registrationId = "";
var noteId = 0;
var my_number_of_flow;
var data_notif_firebasex;
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
        firebase.initializeApp(firebaseConfig);
		Keyboard.hide();
		let custom_vh = window.innerHeight / 100;
		device_language = navigator.language.slice(0, 2).toUpperCase();
		console.log(window.localStorage.getItem("custom_vh"), custom_vh);
		if (window.localStorage.getItem("custom_vh")) {
			custom_vh = window.localStorage.getItem("custom_vh");
		} else {
			window.localStorage.setItem("custom_vh", custom_vh);
		}
		document.documentElement.style.setProperty("--custom-vh", custom_vh + "px");

		if (window.screen.height <= 600) {
			document.body.classList.add("mobile600");
		} else if (window.screen.height <= 700) {
			document.body.classList.add("mobile700");
		}

		document.addEventListener("backbutton", onBackKeyDown, false);
		setupApp();
		setTimeout(function () {
			if (!window.cordova.platformId == "android") {
				StatusBar.overlaysWebView(false);
			}
			StatusBar.backgroundColorByHexString("#f7f7f8");

			if (window.screen.height <= 600) {
				document.body.classList.add("mobile600");
			} else if (window.screen.height <= 700) {
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
			});
		}, 1200);
		window.addEventListener("native.keyboardshow", keyboardShowHandler);

		function keyboardShowHandler(e) {
			// // console.log('Keyboard height is: ' + e.keyboardHeight);
		}

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
				// console.log("deeplink match !", match);
			},
			function (nomatch) {
				// console.log("deeplink didnt match 😞", nomatch);
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
						// console.log("Rating dialog displayed");
						window.localStorage.setItem("last_ask_user_rating", Date.now());
					} else if (cordova.platformId === "ios") {
						if (result === "requested") {
							// console.log("Requested display of rating dialog");

							ratingTimerId = setTimeout(function () {
								console.warn(
									"Rating dialog was not shown (after " +
									MAX_DIALOG_WAIT_TIME +
									"ms)"
								);
							}, MAX_DIALOG_WAIT_TIME);
						} else if (result === "shown") {
							// console.log("Rating dialog displayed");
							window.localStorage.setItem("last_ask_user_rating", Date.now());
							clearTimeout(ratingTimerId);
						} else if (result === "dismissed") {
							// console.log("Rating dialog dismissed");
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

		setTimeout(function () {
			let last_phone_number_verification_asked = Math.floor((Date.now() - window.localStorage.getItem("last_time_phone_number_verification_was_asked")) / 1000 / 60 / 60 / 24);
			if (last_phone_number_verification_asked > 3 || window.localStorage.getItem("last_time_phone_number_verification_was_asked") == null) {
				askIfUserWantToVerifyPhoneNumber();
			}
		}, 15000);

		this.receivedEvent("deviceready");
	},
	onPause: function () {
		// console.log("pause");
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
				// // console.log("fb current_page event success");
			},
			function () {
				// console.warn("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		// if (appState.takingPicture || appState.imageUri) {
		//     window.localStorage.setItem("app_state", JSON.stringify(appState));
		//     // console.log("app state saved");
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
				// // console.log("fb current_page event success");
			},
			function () {
				// console.warn("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);

		httpd = cordova && cordova.plugins && cordova.plugins.CorHttpd ? cordova.plugins.CorHttpd : null;

		if (window.cordova && window.audioinput) {
			// Subscribe to audioinput events
			//
			window.addEventListener("audioinput", onAudioInputCapture, false);
			window.addEventListener("audioinputerror", onAudioInputError, false);

			// console.log("cordova-plugin-audioinput successfully initialised");
		} else {
			// console.log("cordova-plugin-audioinput not found!");
		}

        
        FirebasePlugin.getToken(function(fcmToken) {
            registrationId = fcmToken;
            if (!window.localStorage.getItem("user_token")) {
                let data = {
                    RegisterId: registrationId
                };
                console.log("Le registration id est : " + data.RegisterId);
                ServerManager.IsRegisterExist(data);
            }
            FirebasePlugin.onMessageReceived(function(message) {
                
                let data = {};
                data.additionalData =  message;
                /*le false correspond au notification recu lorque l'app est en background en gros quand tu reçois une notif mais que t'es
                pas dans l'application */
                //console.log("data notif firebase");
                //console.log(data);
                if (data.additionalData.tap) {
                    Popup("popup-specifique", false);
                    Popup("popup-comment", false);
                    if (window.cordova.platformId == "ios") {
                        data.additionalData.sender_info = JSON.parse(message.sender_info);
                    }
                    if (data.additionalData.type == "send_message") {
                        Popup("popup-message", false);
                        let data_popup_msg = {
                            profile_picture: data.additionalData.sender_info.profil_pic,
                            fullname: data.additionalData.sender_info.fullname,
                            chat_id: data.additionalData.sender_info.chat_id
                        };
                        /*
                        -Pour generer le block_message_seen à l'ouverture d'une notif
                        - Pour generer les blocks message de l'epediteur à l'ouverture d'une notif
                        */
                        //setup_popup_message(data_popup_msg, true);
                        //app.showTab("#tab2");
                        let loading_popup_message = document.createElement("div");
                        loading_popup_message.className = "loading-spinner loading_chat_list";
                        $(".home_parent").append(loading_popup_message);

                        if ($("#" + data_popup_msg.chat_id + "").length) {
                            $("#" + data_popup_msg.chat_id + "").trigger("click");
                        } else {
                            notif_chat_id = data_popup_msg.chat_id;
                        }
                        return;
                    }
                    if (data.additionalData.type == "story_comment") {
                        return;
                    }
                    if (data.additionalData.type == "flow_du_jour") {
                        pages_swiper.slideTo(1);
                        setTimeout(function () {
                            explore_categories.slideTo(0);
                        }, 800);
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
                if (data.additionalData.foreground == true) {
                    in_app_notif(data);
                    refresh_notif();
                }
                
            }, function(error) {
                console.error(error);
            });
        }, function(error) {
            console.error(error);
        });
        
        FirebasePlugin.grantPermission(function(hasPermission){
            console.log("Permission was " + (hasPermission ? "granted" : "denied"));
        });
		push = PushNotification.init({
			android: {
				icon: device.manufacturer == "OnePlus" ?
					"flow_icone_one_plus" : "flow_icone",
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true",
			},
		});

		push.on("registration", function (data) {
			// data.registrationId
			//// console.log(data.registrationId);
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

			if (!window.localStorage.getItem("user_token")) {
				let data = {
					RegisterId: registrationId
				};
				console.log("Le registration id est : " + data.RegisterId);
				ServerManager.IsRegisterExist(data);
			}

		});

		if (window.cordova.platformId == "ios") {
			let topic;
			let unsubscribe;
			if (device_language == "FR") {
				topic = "all-ios-fr";
				unsubscribe = "all-ios-en";
			}
			else {
				topic = "all-ios-en";
				unsubscribe = "all-ios-fr";
			}
			            
            FirebasePlugin.unsubscribe(unsubscribe, function(){
                console.log("Unsubscribed from topic");
            }, function(error){
                 console.error("Error unsubscribing from topic: "+topic + error);
            });
            
            FirebasePlugin.subscribe(topic, function(){
                console.log("Subscribed to topic" +topic);
            }, function(error){
                 console.error("Error subscribing to topic: "+topic + error);
            });
            
            
		}

		if (window.cordova.platformId == "android") {

			let topic;
			let unsubscribe;
			if (device_language == "FR") {
				topic = "all-android-fr";
				unsubscribe = "all-android-en";
			}
			else {
				topic = "all-android-en";
				unsubscribe = "all-android-fr";
			}

			console.log("LA LANGUE DE DEVICE : " + device_language);
			
            FirebasePlugin.unsubscribe(unsubscribe, function(){
                console.log("Unsubscribed from topic");
            }, function(error){
                 console.error("Error unsubscribing from topic: "+topic + error);
            });
            
            FirebasePlugin.subscribe(topic, function(){
                console.log("Subscribed to topic" +topic);
            }, function(error){
                 console.error("Error subscribing to topic: "+topic + error);
            });
		}

        
        

		push.on("notification", function (data) {
			/*le false correspond au notification recu lorque l'app est en background en gros quand tu reçois une notif mais que t'es
			pas dans l'application */
			//console.log("data notif firebase");
			//console.log(data);
			if (data.additionalData.foreground == false) {
				Popup("popup-specifique", false);
				Popup("popup-comment", false);
				if (window.cordova.platformId == "ios") {
					data.additionalData.sender_info = JSON.parse(
						data.additionalData.sender_info
					);
				}
				if (data.additionalData.type == "send_message") {
					Popup("popup-message", false);
					let data_popup_msg = {
						profile_picture: data.additionalData.sender_info.profil_pic,
						fullname: data.additionalData.sender_info.fullname,
						chat_id: data.additionalData.sender_info.chat_id
					};
					/*
					-Pour generer le block_message_seen à l'ouverture d'une notif
					- Pour generer les blocks message de l'epediteur à l'ouverture d'une notif
					*/
					//setup_popup_message(data_popup_msg, true);
					//app.showTab("#tab2");
					let loading_popup_message = document.createElement("div");
					loading_popup_message.className = "loading-spinner loading_chat_list";
					$(".home_parent").append(loading_popup_message);

					if ($("#" + data_popup_msg.chat_id + "").length) {
						$("#" + data_popup_msg.chat_id + "").trigger("click");
					} else {
						notif_chat_id = data_popup_msg.chat_id;
					}
					return;
				}
				if (data.additionalData.type == "story_comment") {
					return;
				}
				if (data.additionalData.type == "flow_du_jour") {
					pages_swiper.slideTo(1);
					explore_categories.slideTo(0);
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
			if (data.additionalData.foreground == true) {
				in_app_notif(data);
				refresh_notif();
			}
		});

		push.on("error", function (e) {
			//console.log(e.message);
		});

		
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
	in_new_features = false;
	discover_flows[0].flowplay();
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
				`${language_mapping[device_language]['update_ap']}`,
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
				`${language_mapping[device_language]['new_version_available']}`,
				[`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]
			);
		}
	}, 1000);
}


function offline() {
	// console.log("you are offline");
	pullToRefreshEnd();
}

function online() {
	// console.log("you are online");
	ServerManager.GetStory();
}

window.handleOpenURL = function (url) {
	setTimeout(function () {
		// console.log("received url: " + url);
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
			FirebaseEnvironment = "prod";
		} else if (ServerParams.ServerURL == "https://api.flowappweb.com/") {
			DisconnectUser();
			ServerParams.ServerURL = "https://api-test.flowappweb.com/";
			FirebaseEnvironment = "dev";
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
