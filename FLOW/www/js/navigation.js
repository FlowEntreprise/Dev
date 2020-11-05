var canShowNavbar = true;
var explore_tabs_initialised = false;
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
$("#tab1").load("pages/home.html");
$("#tab2").load("pages/explore.html");
$("#tab3").load("pages/messages.html");
$("#tab4").load("pages/notifications.html");

$(".navbar").css({
	display: "block",
	height: "calc(19 * var(--custom-vh))",
});
// $("#popup-myaccount").find(".popup_content").load("pages/myAccount.html");

$$("#tab1").on("tab:show", function () {
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

	$(".navbar").css({
		display: "block",
		height: "calc(19 * var(--custom-vh))",
	});
	app.showNavbar($(".navbar"));
	canShowNavbar = true;
	current_page = "home";

	$(".fhome-bar").css({
		display: "block",
	});
	$(".fexplore-bar").css({
		display: "none",
	});
	$(".fnotifications-bar").css({
		display: "none",
	});
	if (window.cordova.platformId == "ios") {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 47px)",
		});
	} else {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 17px)",
		});
	}
	stopAllBlocksAudio();
});

$$("#tab2").on("tab:show", function () {
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
	if (explore_categories) {
		if (explore_categories.realIndex == 0) {
			if (in_flowoftheday) $("#tab2").scrollTop(0);
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
		if (explore_categories.realIndex == 1) {
			if (in_recents) $("#tab2").scrollTop(0);
			in_top50 = true;
			in_recents = false;
			in_flowoftheday = false;
		} else if (explore_categories.realIndex == 2) {
			if (in_top50) $("#tab2").scrollTop(0);
			in_top50 = false;
			in_recents = true;
			in_flowoftheday = false;
		}
	}

	last_currentpage_timestamp = Math.floor(Date.now() / 1000);

	$(".navbar").css({
		display: "block",
		height: "calc(19 * var(--custom-vh))",
	});
	app.showNavbar($(".navbar"));
	canShowNavbar = true;
	current_page = "explore";

	$(".fhome-bar").css({
		display: "none",
	});
	$(".fexplore-bar").css({
		display: "block",
	});
	$(".fnotifications-bar").css({
		display: "none",
	});
	if (window.cordova.platformId == "ios") {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 47px)",
		});
	} else {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 17px)",
		});
	}
	if (!explore_tabs_initialised) {
		let mySwiper = app.swiper(".swiper-3", {
			pagination: ".swiper-3 .swiper-pagination",
			spaceBetween: 0,
			slidesPerView: 3,
		});

		explore_categories = mySwiper;

		mySwiper.on("slideChangeStart", function () {
			var target = "#" + $(".swiper-slide-next").attr("target");
			app.showTab(target);
		});

		explore_categories = mySwiper;

		$(".flowoftheday_btn")[0].addEventListener("click", function () {
			explore_categories.slideTo(0);
		})

		$(".recents_btn")[0].addEventListener("click", function () {
			explore_categories.slideTo(2);
		})

		$(".top50_btn")[0].addEventListener("click", function () {
			explore_categories.slideTo(1);
		})

		explore_categories.slideTo(1);

		explore_tabs_initialised = true;
	}
	stopAllBlocksAudio();
});

$$("#tab3").on("tab:show", function () {
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

	$(".navbar").css({
		display: "none",
	});
	if (window.cordova.platformId == "ios") {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 47px)",
		});
	} else {
		$(".faccount").css({
			top: "calc(0 * var(--custom-vh) + 17px)",
		});
	}
	app.hideNavbar($(".navbar"));
	canShowNavbar = false;
	current_page = "messages";

	if (!connected) {
		setTimeout(function () {
			app.showTab("#tab1");
			Popup("popup-connect", true, 60);
		}, 100);
	}

	stopAllBlocksAudio();
});

$$("#tab4").on("tab:show", function () {
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
		$(".navbar").css({
			display: "block",
			height: "calc(8 * var(--custom-vh))",
		});
	} else {
		$(".navbar").css({
			display: "block",
			height: "calc(8 * var(--custom-vh) + 15px)",
		});
	}
	app.showNavbar($(".navbar"));
	canShowNavbar = true;
	current_page = "home";

	$(".fhome-bar").css({
		display: "none",
	});
	$(".fexplore-bar").css({
		display: "none",
	});
	$(".fnotifications-bar").css({
		display: "block",
	});
	canShowNavbar = true;
	current_page = "notifications";
	$(".faccount").css({
		top: "calc(1 * var(--custom-vh) + 7px)",
	});
	if (!connected) {
		setTimeout(function () {
			app.showTab("#tab1");
			Popup("popup-connect", true, 60);
		}, 100);
	}

	stopAllBlocksAudio();
});

$$(".fnav-btn").on("touchstart", function () {
	if (!$$(this).hasClass("fflow-btn")) {
		PlayNavRipple($$(this));
	}
});

function PlayNavRipple(element) {
	// element.removeClass('fripple');
	// setTimeout(function () {
	//     element.addClass('fripple');
	// }, 10);
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
		$(".fflow-btn").css("display", "block");
		$(".flow-btn-shadow").css("display", "block");
		$(".fflow-btn").css("z-index", "1");
		$(".flow-btn-shadow").css("z-index", "0");
	} else if (current_page == "account") {
		Popup("popup-account", false);
		current_page = "home";
		stopAllBlocksAudio();
		$(".fflow-btn").css("display", "block");
		$(".flow-btn-shadow").css("display", "block");
		$(".fflow-btn").css("z-index", "1");
		$(".flow-btn-shadow").css("z-index", "0");
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
