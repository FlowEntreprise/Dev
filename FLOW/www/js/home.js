// Variables :
let CanRefreshTL = true;
let TLCurrentIndex = 0;

function home_tab_loaded() {
	// scroll to top if tap on home
	$(".home_btn ").on("touchend", function () {
		// var home_scrolling = false;
		if (current_page == "home") {
			let element = document.querySelector(".home_parent");
			// element.onscroll = function() {
			//     home_scrolling = true;
			// };
			let last_scrollTop = element.scrollTop;
			const scrollToTop = () => {
				const c = element.scrollTop;
				if (c > 0 && c <= last_scrollTop) {
					window.requestAnimationFrame(scrollToTop);
					element.scrollTo(0, c - c / 8);
					last_scrollTop = c;
				}
			};
			scrollToTop();
		}
	});

	// setup scroll to load TL
	$(".home_parent").scroll(function () {
		var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
		if (CanRefreshTL == true) {
			if (Math.round($(this).scrollTop()) >= limit * 0.75) {
				CanRefreshTL = false;
				console.log("Get Flow on Server");
				console.log("TLCurrentIndex : " + TLCurrentIndex);
				ServerManager.GetTimeline(TLCurrentIndex);
			}
		}
	});

	// setup input comment placeholder
	$("#finput_comment").blur(function () {
		console.log("an input was out focused");
		$(this).attr("placeholder", "Ajouter un commentaire...");
	});

	// initialize pull to refresh
	home_ptr = setupPTR(document.querySelector(".home_parent"), function () {
		RefreshTL()
	});

	// Check if user is connected
	CheckIfConnected();
}

function RefreshTL() {
	console.log("refreshing...");
	stopAllBlocksAudio();
	TLCurrentIndex = 0;
	ServerManager.GetTimeline(0);
	ServerManager.GetStory();
}


function pullToRefreshEnd() {
	console.log("refreshed !");
	home_ptr.Stop();
	// top50_ptr.Stop();
	recents_ptr.Stop();
	notifs_ptr.Stop();
}

function PopFlow(data, LinkBuilder) {
	var image_link = undefined;
	var pattern_key = undefined;
	if (data.Background.PatternKey != undefined) {
		pattern_key = data.Background.PatternKey;
	} else {
		image_link = data.Background;
	}
	const flow_link = data.Audio;

	var profilePicLink = data.ProfilePicture;
	// console.log(profilePicLink);
	// console.log(image_link);
	let block_params = {
		parent_element: $(".list-block")[0],
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
	// Testing Framework7 scroll perf
	var new_block = new block(block_params);
	all_blocks.push(new_block);

	// console.log("Pop Flow");
	// console.log(new_block);
}

function timeline_get_block_and_blocked_users(data_timeline) {
	ServerManager.GetBlockedUsers(data_timeline, "timeline");
}

function UpdateTimeline(data, data_block_user) {
	console.log("updating timeline...");
	stopAllBlocksAudio();
	console.log(data);
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
				$(".list-block")[0].innerHTML = "";
				let loading_tl = document.createElement("div");
				loading_tl.className = "loading-spinner loading_tl";
				$(".list-block")[0].appendChild(loading_tl);
			}
			for (let i = 0; i < unique_data.length; i++) {
				if (unique_block_user.length != 0) {
					for (let i_unique_block_user in unique_block_user) {
						if (
							unique_block_user[i_unique_block_user] != unique_data[i].PrivateId
						) {
							PopFlow(unique_data[i], data.LinkBuilder);
						}
					}
				} else {
					PopFlow(unique_data[i], data.LinkBuilder);
				}
			}
			if ($(".loading_tl")) $(".loading_tl").remove();
			console.log("timeline updated !");
			pullToRefreshEnd();
			TLCurrentIndex++;
			if (unique_data.length < 5) {
				CanRefreshTL = false;
				let tick_tl = document.createElement("div");
				tick_tl.className = "tick_icon";
				$(".list-block")[0].appendChild(tick_tl);
			} else {
				CanRefreshTL = true;
				let loading_tl = document.createElement("div");
				loading_tl.className = "loading-spinner loading_tl";
				$(".list-block")[0].appendChild(loading_tl);
			}
		}, 500);
	} else {
		if (TLCurrentIndex == 0) {
			$(".empty_tl")[0].style.display = "block";
		}
		StopRefreshTL();
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