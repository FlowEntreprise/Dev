var canShowNavbar = true;
var explore_tabs_initialised = false;
var discover_swiper_initialised = false;
var in_comments = false;
var in_likes = false;
var in_specifique = false;
var in_options = false;
var in_editprofile = false;
var in_following = false;
var in_followers = false;
var in_identification = false;
var in_mypp = false;
var in_pp = false;
var explore_categories = null;
var in_top50 = true;
var in_recents = false;
var in_flowoftheday = false;
var in_dm_image_fullscreen = false;
var in_new_features = false;
//Framework7
// $("#tab1").load("pages/home.html");
// $("#tab2").load("pages/explore.html");
// $("#tab3").load("pages/messages.html");
// $("#tab4").load("pages/notifications.html");

$(".main_topbar").css({
	display: "block",
	height: "calc(19 * var(--custom-vh))",
});
// $("#popup-myaccount").find(".popup_content").load("pages/myAccount.html");

function inHome() {
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

	$(".main_topbar").css({
		display: "block",
		height: "calc(19 * var(--custom-vh))",
	});
	// app.showNavbar($(".navbar"));
	showTopBar(main_topbar);
	canShowNavbar = true;
	current_page = "home";

	$(".fhome-bar").css({
		display: "block",
	});
	$(".fexplore-bar").css({
		display: "none",
	});
	$(".fmessages-bar").css({
		display: "none",
	});
	$(".fnotifications-bar").css({
		display: "none",
	});
	if (window.cordova.platformId == "ios") {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 47px)",
			display: "block",
		});
	} else {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 17px)",
			display: "block",
		});
	}
	stopAllBlocksAudio();
}

function inExplore() {
	let time_in_last_screen = Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
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
	$(".fred_dot_toolbar_explore").css("display", "none");


	last_currentpage_timestamp = Math.floor(Date.now() / 1000);

	$(".main_topbar").css({
		display: "block",
		height: "calc(19 * var(--custom-vh))",
	});
	// app.showNavbar($(".navbar"));
	showTopBar(main_topbar);
	canShowNavbar = true;
	current_page = "explore";


	$(".fhome-bar").css({
		display: "none",
	});
	$(".fexplore-bar").css({
		display: "block",
	});
	$(".fmessages-bar").css({
		display: "none",
	});
	$(".fnotifications-bar").css({
		display: "none",
	});
	if (window.cordova.platformId == "ios") {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 47px)",
			display: "block",
		});
	} else {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 17px)",
			display: "block",
		});
	}
	if (!explore_tabs_initialised) {
		// Framework7
		// let mySwiper = app.swiper(".swiper-3", {
		// 	pagination: ".swiper-3 .swiper-pagination",
		// 	spaceBetween: 0,
		// 	slidesPerView: 3,
		// });

		explore_categories = new Swiper(".explore-swiper", {
			slidesPerView: 3,
			initialSlide: 1
		});

		explore_categories.on("slideChange", function () {
			checkExploreSlide(explore_categories);
		});

		checkExploreSlide(explore_categories);


		// Framework7
		// mySwiper.on("slideChangeStart", function () {
		// var target = "#" + $(".swiper-slide-next").attr("target");
		// app.showTab(target);
		// });

		$(".flowoftheday_btn")[0].addEventListener("click", function () {
			explore_categories.slideTo(0);
		})

		$(".top50_btn")[0].addEventListener("click", function () {
			explore_categories.slideTo(1);
		})

		$(".recents_btn")[0].addEventListener("click", function () {
			explore_categories.slideTo(2);
		})

		// $(".discover_btn")[0].addEventListener("click", function () {
		// 	explore_categories.slideTo(1);
		// })

		// explore_categories.slideTo(3);

		explore_tabs_initialised = true;
	}
	stopAllBlocksAudio();
}

function checkExploreSlide(explore_categories) {
	if (current_block_playing) current_block_playing.flowpause();
	$(".explore_view").removeClass("active");
	if (explore_categories.activeIndex == 0) {
		$(".flowoftheday").addClass("active");
		if (in_flowoftheday) $(".explore_view.active").scrollTop(0);
		$(".fred_dot_toolbar_fdj").css("display", "none");
		in_top50 = false;
		in_recents = false;
		in_flowoftheday = true;
		if (showingFDJ && youAreFDJ) {
			startFDJParticles();
			setTimeout(function () {
				stopFDJParticles();
			}, 5000);
		}
	}
	if (explore_categories.activeIndex == 1) {
		$(".top50").addClass("active");
		if (in_recents) $(".explore_view.active").scrollTop(0);
		in_top50 = true;
		in_recents = false;
		in_flowoftheday = false;
	} else
		if (explore_categories.activeIndex == 2) {
			$(".recents").addClass("active");
			if (in_top50) $(".explore_view.active").scrollTop(0);
			in_top50 = false;
			in_recents = true;
			in_flowoftheday = false;
		} else if (explore_categories.activeIndex == 1) {
			$(".discover").addClass("active");
			if (!discover_swiper_initialised) {
				//setupDiscover();
			} else {
				setTimeout(function () {
					discover_flows[discover_swiper.activeIndex].flowplay();
				}, 500);
			}
		}
}

function inMessages() {
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

	$(".main_topbar").css({
		display: "block",
		height: "calc(14 * var(--custom-vh))",
	});
	$(".faccount").css({
		display: "none",
	});
	// if (window.cordova.platformId == "ios") {
	// 	$(".faccount").css({
	// 		top: "calc(0 * var(--custom-vh) + 47px)",
	// 	});
	// } else {
	// 	$(".faccount").css({
	// 		top: "calc(0 * var(--custom-vh) + 17px)",
	// 	});
	// }

	// app.showNavbar($(".navbar"));
	showTopBar(main_topbar);
	canShowNavbar = true;
	current_page = "messages";

	$(".fhome-bar").css({
		display: "none",
	});
	$(".fexplore-bar").css({
		display: "none",
	});
	$(".fmessages-bar").css({
		display: "block",
	});
	$(".fnotifications-bar").css({
		display: "none",
	});
	///////////

	if (!connected) {
		setTimeout(function () {
			// app.showTab("#tab1");
			pages_swiper.slideTo(0);
			Popup("popup-connect", true, 60);
		}, 100);
	}

	if (no_conv) {
		console.log(" IL N Y A AUCUNE CONVERSATION");
		$(".no_conversation_yet")[0].style.display = "block";
	} else {
		$(".no_conversation_yet")[0].style.display = "none";
	}

	console.log(no_conv);

	stopAllBlocksAudio();
};

function inNotifications() {
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

	if (window.cordova.platformId == "android") {
		$(".main_topbar").css({
			display: "block",
			height: "calc(8 * var(--custom-vh))",
		});
	} else {
		$(".main_topbar").css({
			display: "block",
			height: "calc(8 * var(--custom-vh) + 15px)",
		});
	}
	// app.showNavbar($(".navbar"));
	showTopBar(main_topbar);
	canShowNavbar = true;
	current_page = "home";

	$(".fhome-bar").css({
		display: "none",
	});
	$(".fexplore-bar").css({
		display: "none",
	});
	$(".fmessages-bar").css({
		display: "none",
	});
	$(".fnotifications-bar").css({
		display: "block",
	});
	canShowNavbar = true;
	setTimeout(() => {
		current_page = "notifications";
	}, 100);
	$(".faccount").css({
		top: "calc(1 * var(--custom-vh) + 7px)",
		display: "block",
	});
	if (!connected) {
		setTimeout(function () {
			// app.showTab("#tab1");
			pages_swiper.slideTo(0);
			Popup("popup-connect", true, 60);
		}, 100);
	}

	stopAllBlocksAudio();
}

var current_page = "home";
var last_currentpage_timestamp = Math.floor(Date.now() / 1000);

function onBackKeyDown() {
	console.log("RETOUR");
	//alert(current_page);
	// Handle the back button

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

	if (in_mypp) {
		closeMyPP();
		in_mypp = false;
	} else if (in_pp) {
		closePP();
		in_pp = false;
	} else if (in_options) {
		Popup("popup-option", false);
		in_options = false;
	} else if (in_identification) {
		Popup("popup-identification", false);
		in_identification = false;
	} else if (in_comments) {
		Popup("popup-comment", false);
		in_comments = false;
	} else if (in_likes) {
		Popup("popup-likes", false);
		in_likes = false;
	} else if (in_specifique) {
		Popup("popup-specifique", false);
		in_specifique = false;
	} else if (in_editprofile) {
		closeEditProfile();
		in_editprofile = false;
	} else if (in_following) {
		Popup("popup-followings", false);
		in_following = false;
	} else if (in_followers) {
		Popup("popup-followers", false);
		in_followers = false;
	} else if (searching) {
		back_search();
	} else if (in_dm_image_fullscreen) {
		$(".dm_close_popup_img").click();
	} else if (current_page == "dm_messages") {
		// app.closeModal('.popup-record');
		Popup("popup-message", false);
		if (recording) {
			console.log("stop recording");
			stopCapture(false);
		}
		current_page = "messages";
	} else if (current_page == "record") {
		// app.closeModal('.popup-record');
		Popup("popup-record", false);
		if (recording) {
			console.log("stop recording");
			stopCapture(false);
		}
		current_page = "home";
	} else if (current_page == "record-story") {
		// app.closeModal('.popup-story-record');
		Popup("popup-story-record", false);
		if (recording) {
			console.log("stop recording");
			stopCapture(false);
		}
		current_page = "home";
	} else if (current_page == "connect-popup") {
		// app.closeModal('.popup-connect');
		Popup("popup-connect", false);
		current_page = "home";
	} else if (current_page == "after-record") {
		// app.closeModal('.popup-after-record');
		// app.popup('.popup-record');
		Popup("popup-after-record", false);
		Popup("popup-record", true);
		current_page = "record";

		stopAllBlocksAudio();
	} else if (current_page == "after-story-record") {
		// app.closeModal('.popup-after-story-record');
		Popup("popup-after-story-record", false);
		// app.popup('.popup-story-record');
		Popup("popup-story-record", true);
		current_page = "record-story";
		stopAllBlocksAudio();
	} else if (current_page == "story") {
		if (currentSection == "comments") {
			showStoryMain(true);
		} else {
			previousStory(0);
		}
		// CloseStory();
	} else if (current_page == "my-account") {
		Popup("popup-myaccount", false);
		current_page = "home";
		stopAllBlocksAudio();
		$(".flow_btn_img").css("display", "block");
		$(".flow_btn_shadow").css("display", "block");
		$(".flow_btn_img").css("z-index", "1");
		$(".flow_btn_shadow").css("z-index", "0");
	} else if (current_page == "account") {
		Popup("popup-account", false);
		current_page = "home";
		stopAllBlocksAudio();
		$(".flow_btn_img").css("display", "block");
		$(".flow_btn_shadow").css("display", "block");
		$(".flow_btn_img").css("z-index", "1");
		$(".flow_btn_shadow").css("z-index", "0");
	} else if (current_page == "home") {
		// navigator.app.exitApp();
		stopAllBlocksAudio();
		window.plugins.appMinimize.minimize();
	} else if (
		current_page == "explore" ||
		current_page == "notifications" ||
		current_page == "messages"
	) {
		// navigator.app.exitApp();
		stopAllBlocksAudio();
		window.plugins.appMinimize.minimize();
	}

	// analytics.setCurrentScreen(current_page);
}
