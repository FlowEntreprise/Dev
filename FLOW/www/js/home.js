// Variables :
let CanRefreshTL = true;
let TLCurrentIndex = 0;

function home_tab_loaded() {
	// scroll to top if tap on home
	$(".home_btn ").on("touchend", function () {
		// var home_scrolling = false;
		if (current_page == "home") {

			home_swiper.slideTo(0);
			// let element = document.querySelector(".home_parent");
			// // element.onscroll = function() {
			// //     home_scrolling = true;
			// // };
			// let last_scrollTop = element.scrollTop;
			// const scrollToTop = () => {
			// 	const c = element.scrollTop;
			// 	if (c > 0 && c <= last_scrollTop) {
			// 		window.requestAnimationFrame(scrollToTop);
			// 		element.scrollTo(0, c - c / 8);
			// 		last_scrollTop = c;
			// 	}
			// };
			// scrollToTop();

			// ------------------------------------------> SLIDE TO TOP avec SWIPERJS <--------------------------------------------
		}
	});

	// setup scroll to load TL rmTL
	// $(".home_parent").scroll(function () {
	// 	var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
	// 	if (CanRefreshTL == true) {
	// 		if (Math.round($(this).scrollTop()) >= limit * 0.75) {
	// 			CanRefreshTL = false;
	// 			console.log("Get Flow on Server");
	// 			console.log("TLCurrentIndex : " + TLCurrentIndex);
	// 			ServerManager.GetTimeline(TLCurrentIndex);
	// 		}
	// 	}
	// });

	// setup input comment placeholder
	$("#finput_comment").blur(function () {
		console.log("an input was out focused");
		$(this).attr("placeholder", "Ajouter un commentaire...");
	});

	// initialize pull to refresh
	// home_ptr = setupPTR(document.querySelector(".home_parent"), function () {
	// 	RefreshTL()
	// });

	// Check if user is connected
	CheckIfConnected();
}

function RefreshTL() {
	console.log("refreshing...");
	// stopAllBlocksAudio();
	TLCurrentIndex = 0;
	// ServerManager.GetTimeline(0);
	ServerManager.GetStory();
}


function pullToRefreshEnd() {
	// console.log("refreshed !");
	// home_ptr.Stop();
	// top50_ptr.Stop();
	// recents_ptr.Stop();
	notifs_ptr.Stop();
}

function PopFlow(data) {
	var image_link = undefined;
	var pattern_key = undefined;
	if (data.Background.PatternKey != undefined) {
		pattern_key = data.Background.PatternKey;
	} else {
		image_link = data.Background;
	}
	const flow_link = data.Audio;

	///// rmRL
	// let slide_html = '<div class="parent" id="' + timelineID + '">Une erreur s\'est produite</div>';
	// if (timeline_block_index < 3) {
	// 	let slide_html = '<div class="parent" id="' + timeline_block_index + '">Une erreur s\'est produite</div>';
	// 	home_swiper.virtual.appendSlide(slide_html);
	// }
	// let str = ".parent#" + timeline_block_index;
	// let container = $(str);
	// if (discover_flows.length > 0) discover_swiper.virtual.appendSlide('<div class="parent">Une erreur s\'est produite</div>');
	let container = $(".swiper-container.home .parent.notloaded").first();
	container[0].innerHTML = "";
	if (container[0]) {
		// if (randomID) tmp_home_flows.splice(tmp_home_flows.indexOf(tmp_home_flows.find(x => x.random_id == randomID)), 1);
		// console.log(tmp_home_flows);
		// console.log(container[0]);
		// if (home_flows.length > 0) home_swiper.virtual.appendSlide('<div class="parent">Une erreur s\'est produite</div>');
		// let container = $(".swiper-container.home .parent").last();
		container[0].innerHTML = "";
		////
		var profilePicLink = data.ProfilePicture;
		// console.log(profilePicLink);
		// console.log(image_link);
		let block_params = {
			parent_element: container,
			afterblock: false,
			audioURL: data.Audio,
			duration: data.Duration,
			patternKey: data.Background.PatternKey,
			imageURL: data.Background,
			title: data.Title,
			description: data.Description,
			pseudo: data.FullName ? data.FullName : data.PrivateId,
			account_imageURL: data.ProfilePicture,
			ObjectId: data.ObjectId,
			PrivateId: data.PrivateId,
			Times: data.Time,
			IsLike: data.IsLike,
			IsComment: data.IsComment,
			Likes: data.Likes,
			Comments: data.Comments,
			RegisterId: data.RegisterId,
			LastOs: data.LastOs,
			Views: data.Views,
			CommentBy: data.CommentBy,
			LikeBy: data.LikeBy,
			Responses: data.Responses,
		};
		var new_block = new block(block_params);

		if (home_flows.length == 0 && !in_new_features) {
			new_block.block_flow.addEventListener("ready", function () {
				if (home_index == 0 && !in_new_features) {
					new_block.flowplay();
				}
			});
		}

		all_blocks.push(new_block);
		home_flows.push(new_block);
		timeline_block_index++;
		container.removeClass("notloaded");
	} else {
		console.warn("could not spawn block", timeline_block_index);
		// tmp_home_flows.push({
		// 	data: data,
		// 	random_id: random_id
		// });
		// console.log(tmp_home_flows);
	}

	// console.log("Pop Flow");
	// console.log(new_block);
}

function timeline_get_block_and_blocked_users(data_timeline) {
	ServerManager.GetBlockedUsers(data_timeline, "timeline");
}

function UpdateTimeline(data, data_block_user) {
	// console.log("updating timeline...");
	// stopAllBlocksAudio();
	// console.log(data);
	// console.log(data.Data);
	if (Array.isArray(data.Data)) {
		$(".empty_tl")[0].style.display = "none";
		let unique_data = [];
		for (let index in data.Data) {
			let unique = true;
			for (let i in unique_data) {
				if (unique_data[i].ObjectId == data.Data[index].ObjectId) {
					unique = false;
				}
			}
			if (unique) {
				unique_data.push(data.Data[index]);
			}
		}
		let unique_block_user = data_block_user.Data.UserBlocked.concat(
			data_block_user.Data.BlockedByUser
		);
		unique_block_user = unique_block_user.filter(
			(item, pos) => unique_block_user.indexOf(item) === pos
		);
		setTimeout(function () {
			if ($(".loading_tl")) $(".loading_tl").remove();
			if (TLCurrentIndex == 0) {
				// $(".list-block")[0].innerHTML = "";
				let loading_tl = document.createElement("div");
				loading_tl.className = "loading-spinner loading_tl";
				// $(".list-block")[0].appendChild(loading_tl);
			}
			for (let i = 0; i < unique_data.length; i++) {
				if (unique_block_user.length != 0) {
					for (let i_unique_block_user in unique_block_user) {
						if (
							unique_block_user[i_unique_block_user] != unique_data[i].PrivateId
						) {
							// console.log("pop flow 1")
							PopFlow(unique_data[i]);
						}
					}
				} else {
					// console.log("pop flow 2")
					PopFlow(unique_data[i]);
				}
			}
			if ($(".loading_tl")) $(".loading_tl").remove();
			// console.log("timeline updated !");
			// pullToRefreshEnd();
			// TLCurrentIndex++;
			// if (unique_data.length < 5) {
			// 	CanRefreshTL = false;
			// 	let tick_tl = document.createElement("div");
			// 	tick_tl.className = "tick_icon";
			// 	// $(".list-block")[0].appendChild(tick_tl);
			// } else {
			// 	CanRefreshTL = true;
			// 	let loading_tl = document.createElement("div");
			// 	loading_tl.className = "loading-spinner loading_tl";
			// 	// $(".list-block")[0].appendChild(loading_tl);
			// }
		}, 500);
	} else {
		if (TLCurrentIndex == 0) {
			$(".empty_tl")[0].style.display = "block";
		}
		// StopRefreshTL();
	}
}

function StopRefreshTL() {
	if ($(".loading_tl")) $(".loading_tl").remove();
	CanRefreshTL = false;
	CanRefreshFollowList = false;
	pullToRefreshEnd();
}



function successFunction() {
	let d = new Date();
	console.log("end_time : " + d.getMilliseconds);
	console.info("It worked!");
}

function errorFunction(error) {
	console.error(error);
}

function trace(value) {
	console.log(value);
}

/////////////////////////////////////////////////////////////////////////////////////////////////

var home_swiper;
let home_index = 0;
let timeline_index = 0;
let timeline_block_index = 0;
let home_flows = [];

function setupHome() {
	home_swiper = new Swiper(".swiper-container.home", {
		direction: "vertical",
		slidesPerView: 3,
		centeredSlides: true,
		spaceBetween: 150,
		initialSlide: 0,
		virtual: {
			slides: (function () {
				let slides = [];
				for (var i = 0; i < 100; i += 1) {
					slides.push("<div class='parent notloaded'>Chargement...</div>");
				}
				return slides;
			})()
		}
	});

	home_swiper.on('transitionEnd', function () {
		// home_swiper.activeIndex == 0 ? canRegisterPTR = true : canRegisterPTR = false;
		let current_index = home_swiper.activeIndex;
		if (current_block_playing) current_block_playing.flowend(true);
		home_flows[current_index].flowplay();
		if (current_index > home_index) {
			home_index = current_index;
			getHomeFlow();
		}
	});

	for (let i = 0; i < 3; i++) {
		getHomeFlow();
	}

	home_swiper_initialised = true;
}

function getHomeFlow() {
	ServerManager.GetTimeline(timeline_index);
	timeline_index += 1;
}