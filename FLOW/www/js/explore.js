let searching = false;
let search_index = 0;
let canRefreshUsers = true;
let canRefreshFlows = true;
let top50CurrentIndex = 0;
let recentsCurrentIndex = 0;
let canRefreshTop50 = true;
let canRefreshRecents = true;
let searching_users = false;
let searching_flows = false;
let recentsCurrentLanguage = navigator.language.slice(0, 2).toUpperCase();
let top50CurrentLanguage = navigator.language.slice(0, 2).toUpperCase();


function explore_tab_loaded() {

	// Initilize top50 pull to refresh
	top50_ptr = setupPTR(document.querySelector(".top50"), function () {
		refresh_top50();
	});

	// Initilize recents pull to refresh
	recents_ptr = setupPTR(document.querySelector(".recents"), function () {
		refresh_recents();
	});
	RefreshExplore();

	// Initialize search_bar events 
	$(".fsearch-bar")[0].addEventListener("focus", function () {
		// app.destroyPullToRefresh(ptrContent_explore);
		$(".search_results")[0].style.opacity = 1;
		$(".search_results")[0].style.pointerEvents = "auto";
		// $(".list-block-top50")[0].style.opacity = 0;
		// $(".list-block-top50")[0].style.display = "none";
		// $(".list-block-top50")[0].style.pointerEvents = "none";
		$(".list-block-recents")[0].style.opacity = 0;
		$(".list-block-recents")[0].style.display = "none";
		$(".list-block-recents")[0].style.pointerEvents = "none";
		$(".fdj_parent")[0].style.display = "none";
		//$(".swiper-container.discover")[0].style.display = "none";

		// $(".list-block-top50")[0].innerHTML = "";
		top50CurrentIndex = 0;
		recentsCurrentIndex = 0;
		$(".explore-swiper")[0].style.display = "none";
		$(".search_back")[0].style.display = "block";
		searching = true;
		if ($(".fsearch-bar")[0].value.length == 0) {
			RefreshSearch();
		}
		searching_users = false;
		searching_flows = false;
	});
	$(".fsearch-bar")[0].addEventListener("blur", function () {
		if (!searching) {
			// app.initPullToRefresh(ptrContent_explore);
			$(".search_results")[0].style.opacity = 0;
			$(".search_results")[0].style.pointerEvents = "none";
			// $(".list-block-top50")[0].style.opacity = 1;
			// $(".list-block-top50")[0].style.display = "block";
			// $(".list-block-top50")[0].style.pointerEvents = "auto";
			$(".list-block-recents")[0].style.opacity = 1;
			$(".list-block-recents")[0].style.display = "block";
			$(".list-block-recents")[0].style.pointerEvents = "auto";
			$(".explore-swiper")[0].style.display = "block";
			$(".fdj_parent")[0].style.display = "block";
			//$(".swiper-container.discover")[0].style.display = "block";
		}
	});
	$(".search_back")[0].addEventListener("touchend", function () {
		back_search();
	});
	$(".fsearch-bar")[0].addEventListener("keydown", function (e) {
		setTimeout(function () {
			if ($(".fsearch-bar")[0].value.length > 0) {
				RefreshSearch();
				let data = {
					Index: search_index,
					Search: $(".fsearch-bar")[0].value,
				};
				ServerManager.SearchUser(data);
				ServerManager.SearchFlow(data);
			}
		}, 50);
		if (e.keyCode == 13) {
			$(".fsearch-bar").blur();
		}
	});
	// Scroll to top when explore-btn touched
	$(".explore_btn").on("touchend", function () {
		// var home_scrolling = false;
		$(".fred_dot_toolbar_explore").css("display", "none");
		if (current_page == "explore") {
			let element;
			if ($(".top50").hasClass("active")) {
				element = document.querySelector(".top50");
			}
			else {
				element = document.querySelector(".recents");
			}
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

	// Scroll loading infos 
	$(".show_more_users")[0].addEventListener("touchend", function () {
		ShowMoreUsers();
	});

	$(".list-block-recents").scroll(function () {
		if (!searching) {
			if (in_top50) {
				if (canRefreshTop50) {
					var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
					if (Math.round($(this).scrollTop()) >= limit * 0.75) {
						canRefreshTop50 = false;
						top50CurrentIndex += 1;
						console.log("explore top50 index : " + top50CurrentIndex);
						let data = {
							Index: top50CurrentIndex,
							language: top50CurrentLanguage
						};
						ServerManager.GetTop50(data);
					}
				}
			} else if (in_recents) {
				if (canRefreshRecents) {
					var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
					if (Math.round($(this).scrollTop()) >= limit * 0.75) {
						canRefreshRecents = false;
						recentsCurrentIndex += 1;
						console.log("explore recents index : " + recentsCurrentIndex);
						let data = {
							Index: recentsCurrentIndex,
							language: recentsCurrentLanguage
						};
						ServerManager.GetNewFlows(data);
					}
				}
			}
		} else {
			if (canRefreshUsers && searching_users) {
				var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
				if (Math.round($(this).scrollTop()) >= limit * 0.75) {
					search_index += 1;
					console.log("search_index : " + search_index);
					let data = {
						Index: search_index,
						Search: $(".fsearch-bar")[0].value,
					};
					ServerManager.SearchUser(data);
				}
			} else if (canRefreshFlows && searching_flows) {
				var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
				if (Math.round($(this).scrollTop()) >= limit * 0.75) {
					search_index += 1;
					console.log("search_index : " + search_index);
					let data = {
						Index: search_index,
						Search: $(".fsearch-bar")[0].value,
					};
					ServerManager.SearchFlow(data);
				}
			}
		}
	});

	let data1 = {
		Index: top50CurrentIndex,
	};

	ServerManager.GetFDJ();

	$(".show_more_users")[0].addEventListener("touchend", function () {
		ShowMoreUsers();
	});
	$(".explore_view").scroll(function () {
		if (!searching) {
			if (in_top50) {
				if (canRefreshTop50) {
					var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
					if (Math.round($(this).scrollTop()) >= limit * 0.75) {
						canRefreshTop50 = false;
						top50CurrentIndex += 1;
						console.log("explore top50 index : " + top50CurrentIndex);
						let data = {
							Index: top50CurrentIndex,
							language: top50CurrentLanguage
						};
						ServerManager.GetTop50(data);
					}
				}
			} else if (in_recents) {
				if (canRefreshRecents) {
					var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
					if (Math.round($(this).scrollTop()) >= limit * 0.75) {
						canRefreshRecents = false;
						recentsCurrentIndex += 1;
						console.log("explore recents index : " + recentsCurrentIndex);
						let data = {
							Index: recentsCurrentIndex,
							language: recentsCurrentLanguage
						};
						ServerManager.GetNewFlows(data);
					}
				}
			}
		} else {
			if (canRefreshUsers && searching_users) {
				var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
				if (Math.round($(this).scrollTop()) >= limit * 0.75) {
					search_index += 1;
					console.log("search_index : " + search_index);
					let data = {
						Index: search_index,
						Search: $(".fsearch-bar")[0].value,
					};
					ServerManager.SearchUser(data);
				}
			} else if (canRefreshFlows && searching_flows) {
				var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
				if (Math.round($(this).scrollTop()) >= limit * 0.75) {
					search_index += 1;
					console.log("search_index : " + search_index);
					let data = {
						Index: search_index,
						Search: $(".fsearch-bar")[0].value,
					};
					ServerManager.SearchFlow(data);
				}
			}
		}
	});
}



function back_search() {
	// app.initPullToRefresh(ptrContent_explore);
	$(".search_results")[0].style.opacity = 0;
	$(".search_results")[0].style.pointerEvents = "none";
	// $(".list-block-top50")[0].style.opacity = 1;
	// $(".list-block-top50")[0].style.display = "block";
	// $(".list-block-top50")[0].style.pointerEvents = "auto";
	$(".list-block-recents")[0].style.opacity = 1;
	$(".list-block-recents")[0].style.display = "block";
	$(".list-block-recents")[0].style.pointerEvents = "auto";
	$(".explore-swiper")[0].style.display = "block";
	$(".search_back")[0].style.display = "none";
	$(".fdj_parent")[0].style.display = "block";
	//$(".swiper-container.discover")[0].style.display = "block";
	searching = false;
	$(".fsearch-bar").blur();
	$(".fsearch-bar")[0].value = "";
	RefreshSearch();
	searching_users = false;
	searching_flows = false;
}

var ptrContent_explore = $("#tab2");
ptrContent_explore.on("ptr:refresh", function (e) {
	RefreshExplore();
});


function refresh_top50() {
	stopAllBlocksAudio();
	top50CurrentIndex = 0;
	top50CurrentLanguage = navigator.language.slice(0, 2).toUpperCase();
	let data1 = {
		Index: top50CurrentIndex,
		language: top50CurrentLanguage
	};
	ServerManager.GetTop50(data1);
}

function refresh_recents() {
	stopAllBlocksAudio();
	recentsCurrentIndex = 0;
	recentsCurrentLanguage = navigator.language.slice(0, 2).toUpperCase();
	let data2 = {
		Index: recentsCurrentIndex,
		language: recentsCurrentLanguage
	};
	ServerManager.GetNewFlows(data2);
}

function RefreshExplore() {
	console.log("refreshing...");
	refresh_top50();
	refresh_recents();
	// ServerManager.GetRandomFlow(randomExcluded);
	ServerManager.GetFDJ();
}

function RefreshSearch() {
	search_index = 0;
	$(".top_users")[0].innerHTML = "";
	$(".top_flows")[0].innerHTML = "";
	$(".top_users_txt")[0].style.display = "block";
	$(".top_users")[0].style.display = "block";
	$(".top_flows_txt")[0].style.display = "block";
	$(".top_flows")[0].style.display = "block";
	$(".show_more_users")[0].style.display = "none";
	// $(".show_more_flows")[0].style.display = "none";
	$(".show_more_flows").remove();
	search_index = 0;
	let no_users = document.createElement("div");
	no_users.className = "no_results";
	no_users.innerHTML = "Pas de résultat";
	$(".top_users")[0].appendChild(no_users);
	let no_flows = document.createElement("div");
	no_flows.className = "no_results";
	no_flows.innerHTML = "Pas de résultat";
	$(".top_flows")[0].appendChild(no_flows);
	$(".top_users")[0].style.height =
		" calc(" + (0 * 7 + 2) + " * var(--custom-vh))";
	$(".top_flows_txt")[0].style.top =
		" calc(" + (0 * 7 + 32) + " * var(--custom-vh))";
	$(".top_flows")[0].style.top =
		" calc(" + (0 * 7 + 37) + " * var(--custom-vh))";
}

function SpawnUserSearch(data) {
	let users = data.Data;
	let top_users = $(".top_users")[0];
	if (search_index == 0) {
		top_users.innerHTML = "";
		$(".top_users")[0].style.height =
			" calc(" + (users.length * 7 + 2) + " * var(--custom-vh))";
		$(".top_flows_txt")[0].style.top =
			" calc(" + (users.length * 7 + 32) + " * var(--custom-vh))";
		$(".top_flows")[0].style.top =
			" calc(" + (users.length * 7 + 37) + " * var(--custom-vh))";
		// $(".show_more_flows")[0].style.top = "calc(" + ((users.length * 7) + 237) + " * var(--custom-vh))";
	}
	for (let index in users) {
		let user = users[index];
		let user_block = document.createElement("div");
		user_block.className = "user_block";
		user_block.onclick = function () {
			let data = {
				private_Id: user.PrivateId,
				user_private_Id: window.localStorage.getItem("user_private_id"),
			};
			go_to_account(data);
		};
		let pp = document.createElement("div");
		pp.className = "user_pp";
		pp.style.backgroundImage = "url('" + user.ProfilePicture + "')";
		let user_name = document.createElement("label");
		user_name.className = "user_name";
		user_name.innerHTML = user.FullName;
		let user_privateId = document.createElement("label");
		user_privateId.className = "user_privateId";
		user_privateId.innerHTML = "@" + user.PrivateId;
		let follow_btn = document.createElement("div");
		follow_btn.className = "follow_btn";
		follow_btn.innerHTML = "S'ABONNER";
		if (user.YouFollowHim == "true") {
			follow_btn.className = "follow_btn following";
			follow_btn.innerHTML = "ABONNÉ";
		}

		user_block.appendChild(pp);
		user_block.appendChild(user_name);
		user_block.appendChild(user_privateId);
		if (user.PrivateId != window.localStorage.getItem("user_private_id")) {
			user_block.appendChild(follow_btn);
		}
		console.log(user_block);
		top_users.appendChild(user_block);
	}

	if (users.length >= 5 && search_index == 0) {
		$(".show_more_users")[0].style.display = "block";
	} else {
		$(".show_more_users")[0].style.display = "none";
		if (search_index == 0 && users.length == 0) {
			let no_users = document.createElement("div");
			no_users.className = "no_results";
			no_users.innerHTML = "Pas de résultat";
			top_users.appendChild(no_users);
		}
	}

	if (users.length >= 5) {
		canRefreshUsers = true;
	} else {
		canRefreshUsers = false;
	}
}

function SpawnFlowSearch(data) {
	let flows = data.Data;
	let top_flows = $(".top_flows");
	if (search_index == 0) {
		top_flows[0].innerHTML = "";
	}
	for (let index in flows) {
		let flow = flows[index];
		let pattern_key = "";
		if (flow.Background.PatternKey) pattern_key = flow.Background.PatternKey;
		let block_params = {
			parent_element: top_flows,
			afterblock: false,
			audioURL: flow.Audio,
			duration: flow.Duration,
			patternKey: pattern_key,
			imageURL: flow.Background,
			title: flow.Title,
			description: flow.Description,
			pseudo: flow.FullName ? flow.FullName : flow.PrivateId,
			account_imageURL: flow.ProfilePicture,
			ObjectId: flow.ObjectId,
			PrivateId: flow.PrivateId,
			Times: flow.Time,
			IsLike: flow.IsLike,
			IsComment: flow.IsComment,
			Likes: flow.Likes,
			Comments: flow.Comments,
			RegisterId: flow.RegisterId,
			Views: flow.Views,
			Responses: flow.Responses,
		};
		console.log(top_flows);
		console.log(flow);

		var new_block = new block(block_params);
		all_blocks.push(new_block);
	}

	if (flows.length >= 5 && search_index == 0) {
		// $(".show_more_flows")[0].style.display = "block";
		let show_more_flows = document.createElement("div");
		show_more_flows.className = "show_more_flows";
		show_more_flows.innerHTML = "Afficher plus";
		show_more_flows.addEventListener("touchend", function () {
			ShowMoreFlows();
		});
		top_flows[0].appendChild(show_more_flows);
	} else {
		$(".show_more_flows").remove();
		if (search_index == 0 && flows.length == 0) {
			let no_flows = document.createElement("div");
			no_flows.className = "no_results";
			no_flows.innerHTML = "Pas de résultat";
			top_flows[0].appendChild(no_flows);
		}
	}

	if (flows.length >= 5) {
		canRefreshFlows = true;
	} else {
		canRefreshFlows = false;
	}

	$(".offset_search").remove();
	let offset_div = document.createElement("div");
	offset_div.className = "offset_search";
	top_flows[0].appendChild(offset_div);
}

function ShowMoreUsers() {
	searching_users = true;
	searching_flows = false;
	$(".show_more_users")[0].style.display = "none";
	$(".top_flows_txt")[0].style.display = "none";
	$(".top_flows")[0].style.display = "none";
	// $(".show_more_flows")[0].style.display = "none";
	$(".show_more_flows").remove();
	$(".top_users")[0].style.height = " calc(62 * var(--custom-vh))";
	search_index += 1;
	let data = {
		Index: search_index,
		Search: $(".fsearch-bar")[0].value,
	};
	ServerManager.SearchUser(data);
}

function ShowMoreFlows() {
	searching_users = false;
	searching_flows = true;
	$(".show_more_users")[0].style.display = "none";
	$(".top_users_txt")[0].style.display = "none";
	$(".top_users")[0].style.display = "none";
	// $(".show_more_flows")[0].style.display = "none";
	$(".show_more_flows").remove();
	$(".top_flows_txt")[0].style.top = " calc(20 * var(--custom-vh))";
	$(".top_flows")[0].style.height = " calc(62 * var(--custom-vh))";
	$(".top_flows")[0].style.top = " calc(27 * var(--custom-vh))";
	search_index += 1;
	let data = {
		Index: search_index,
		Search: $(".fsearch-bar")[0].value,
	};
	ServerManager.SearchFlow(data);
}

function explore_get_block_and_blocked_users(data_explore) {
	ServerManager.GetBlockedUsers(data_explore, "explore");
}

function recents_get_block_and_blocked_users(data_explore) {
	ServerManager.GetBlockedUsers(data_explore, "recents");
}


function UpdateTop50(data, data_block_user) {
	console.log("updating top50...");
	stopAllBlocksAudio();
	console.log(data);
	if (Array.isArray(data.Data) && data.Data.length > 0) {
		let unique_block_user;
		if (connected) {
			unique_block_user = data_block_user.Data.UserBlocked.concat(
				data_block_user.Data.BlockedByUser
			);
			unique_block_user = unique_block_user.filter(
				(item, pos) => unique_block_user.indexOf(item) === pos
			);
		}

		setTimeout(function () {
			if ($(".loading_top50")) $(".loading_top50").remove();
			$(".list-block-top50 .tick_icon").remove();
			if (top50CurrentIndex == 0 && top50CurrentLanguage == device_language) {
				$(".list-block-top50")[0].innerHTML = "";
				let loading_top50 = document.createElement("div");
				loading_top50.className = "loading-spinner loading_top50";
				$(".list-block-top50")[0].appendChild(loading_top50);
			}
			for (let i = 0; i < data.Data.length; i++) {
				if (unique_block_user && unique_block_user.length != 0) {
					for (let i_unique_block_user in unique_block_user) {
						// flow avec filtre utilisateurs bloqués
						if (unique_block_user[i_unique_block_user] != data.Data[i].PrivateId) {
							let flow = data.Data[i];
							let pattern_key = "";
							if (flow.Background.PatternKey)
								pattern_key = flow.Background.PatternKey;
							let block_params = {
								parent_element: $(".list-block-top50")[0],
								afterblock: false,
								audioURL: flow.Audio,
								duration: flow.Duration,
								patternKey: pattern_key,
								imageURL: flow.Background,
								title: flow.Title,
								description: flow.Description,
								pseudo: flow.FullName ? flow.FullName : flow.PrivateId,
								account_imageURL: flow.ProfilePicture,
								ObjectId: flow.ObjectId,
								PrivateId: flow.PrivateId,
								Times: flow.CREATION,
								IsLike: flow.IsLike,
								IsComment: flow.IsComment,
								Likes: flow.Likes,
								Comments: flow.Comments,
								RegisterId: flow.RegisterId,
								LastOs: flow.LastOs,
								Views: flow.Views,
								Responses: flow.Responses,
							};
							let new_block = new block(block_params);
							all_blocks.push(new_block);
						}
					}
				} else {
					let flow = data.Data[i];
					let pattern_key = "";
					if (flow.Background.PatternKey)
						pattern_key = flow.Background.PatternKey;
					let block_params = {
						parent_element: $(".list-block-top50")[0],
						afterblock: false,
						audioURL: flow.Audio,
						duration: flow.Duration,
						patternKey: pattern_key,
						imageURL: flow.Background,
						title: flow.Title,
						description: flow.Description,
						pseudo: flow.FullName ? flow.FullName : flow.PrivateId,
						account_imageURL: flow.ProfilePicture,
						ObjectId: flow.ObjectId,
						PrivateId: flow.PrivateId,
						Times: flow.CREATION,
						IsLike: flow.IsLike,
						IsComment: flow.IsComment,
						Likes: flow.Likes,
						Comments: flow.Comments,
						RegisterId: flow.RegisterId,
						LastOs: flow.LastOs,
						Views: flow.Views,
						Responses: flow.Responses,
					};
					let new_block = new block(block_params);
					all_blocks.push(new_block);
				}
			}
			if ($(".loading_top50")) $(".loading_top50").remove();
			console.log("top50 updated !");
			pullToRefreshEnd();

			//Arrivé à la fin des flow du même language que le device, on change de language
			if (data.Data.length < 5 && top50CurrentLanguage == device_language) {
				canRefreshTop50 = true;
				top50CurrentIndex = 0;
				/*let loading_recent = document.createElement("div");
				loading_recent.className = "loading-spinner loading_recent";
				$(".list-block-recents")[0].appendChild(loading_recent);*/
				if (device_language == "FR") {
					top50CurrentLanguage = "EN";
				}
				else {
					top50CurrentLanguage = "FR";
				}
				let data = {
					Index: recentsCurrentIndex,
					language: top50CurrentLanguage
				};
				ServerManager.GetTop50(data);
			}
			if (data.Data.length < 5 && top50CurrentLanguage != device_language) {
				canRefreshTop50 = false;
				let tick_tl = document.createElement("div");
				tick_tl.className = "tick_icon";
				$(".list-block-top50")[0].appendChild(tick_tl);
			} else {
				canRefreshTop50 = true;
				let loading_top50 = document.createElement("div");
				loading_top50.className = "loading-spinner loading_top50";
				$(".list-block-top50")[0].appendChild(loading_top50);
			}
		}, 500);
	} else {
		StopRefreshTop50();
	}
}

function StopRefreshTop50() {
	if ($(".loading_tl")) $(".loading_tl").remove();
	canRefreshTop50 = false;
	pullToRefreshEnd();
}

// ---------------------------------------------- //

function UpdateRecents(data, data_block_user) {
	console.log("updating recents...");
	stopAllBlocksAudio();
	console.log(data);
	if (Array.isArray(data) && data.length > 0) {
		let unique_block_user;
		if (connected) {
			unique_block_user = data_block_user.Data.UserBlocked.concat(
				data_block_user.Data.BlockedByUser
			);
			unique_block_user = unique_block_user.filter(
				(item, pos) => unique_block_user.indexOf(item) === pos
			);
		}

		setTimeout(function () {
			if ($(".loading_recent")) $(".loading_recent").remove();
			$(".list-block-recents .tick_icon").remove();
			if (recentsCurrentIndex == 0 && recentsCurrentLanguage == device_language) {
				$(".list-block-recents")[0].innerHTML = "";
				let loading_recent = document.createElement("div");
				loading_recent.className = "loading-spinner loading_recent";
				$(".list-block-recents")[0].appendChild(loading_recent);
			}
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				if (unique_block_user && unique_block_user.length != 0) {
					for (let i_unique_block_user in unique_block_user) {
						//flow avec filtre utilisateurs bloqués
						if (unique_block_user[i_unique_block_user] != data[i].PrivateId) {
							let flow = data[i];
							let pattern_key = "";
							if (flow.Background.PatternKey)
								pattern_key = flow.Background.PatternKey;
							let block_params = {
								parent_element: $(".list-block-recents")[0],
								afterblock: false,
								audioURL: flow.Audio,
								duration: flow.Duration,
								patternKey: pattern_key,
								imageURL: flow.Background,
								title: flow.Title,
								description: flow.Description,
								pseudo: flow.FullName ? flow.FullName : flow.PrivateId,
								account_imageURL: flow.ProfilePicture,
								ObjectId: flow.ObjectId,
								PrivateId: flow.PrivateId,
								Times: flow.Time,
								IsLike: flow.IsLike,
								IsComment: flow.IsComment,
								Likes: flow.Likes,
								Comments: flow.Comments,
								RegisterId: flow.RegisterId,
								LastOs: flow.LastOs,
								Views: flow.Views,
								Responses: flow.Responses,
							};
							let new_block = new block(block_params);
							all_blocks.push(new_block);
						}
					}
				} else {
					let flow = data[i];
					let pattern_key = "";
					if (flow.Background.PatternKey)
						pattern_key = flow.Background.PatternKey;
					let block_params = {
						parent_element: $(".list-block-recents")[0],
						afterblock: false,
						audioURL: flow.Audio,
						duration: flow.Duration,
						patternKey: pattern_key,
						imageURL: flow.Background,
						title: flow.Title,
						description: flow.Description,
						pseudo: flow.FullName ? flow.FullName : flow.PrivateId,
						account_imageURL: flow.ProfilePicture,
						ObjectId: flow.ObjectId,
						PrivateId: flow.PrivateId,
						Times: flow.Time,
						IsLike: flow.IsLike,
						IsComment: flow.IsComment,
						Likes: flow.Likes,
						Comments: flow.Comments,
						RegisterId: flow.RegisterId,
						LastOs: flow.LastOs,
						Views: flow.Views,
						Responses: flow.Responses,
					};
					let new_block = new block(block_params);
					all_blocks.push(new_block);
				}
			}
			//if ($(".loading_recent")) $(".loading_recent").remove();
			console.log("recents updated !");
			pullToRefreshEnd();

			//Arrivé à la fin des flow du même language que le device, on change de language
			if (data.length < 5 && recentsCurrentLanguage == device_language) {
				canRefreshRecents = true;
				recentsCurrentIndex = 0;
				/*let loading_recent = document.createElement("div");
				loading_recent.className = "loading-spinner loading_recent";
				$(".list-block-recents")[0].appendChild(loading_recent);*/
				if (device_language == "FR") {
					recentsCurrentLanguage = "EN";
				}
				else {
					recentsCurrentLanguage = "FR";
				}
				let data = {
					Index: recentsCurrentIndex,
					language: recentsCurrentLanguage
				};
				ServerManager.GetNewFlows(data);
			}
			if (data.length < 5 && recentsCurrentLanguage != device_language) {
				canRefreshRecents = false;
				let tick_tl = document.createElement("div");
				tick_tl.className = "tick_icon";
				$(".list-block-recents")[0].appendChild(tick_tl);
			} else {
				canRefreshRecents = true;
				let loading_recent = document.createElement("div");
				loading_recent.className = "loading-spinner loading_recent";
				$(".list-block-recents")[0].appendChild(loading_recent);
			}
		}, 500);
	} else {
		StopRefreshRecents();
	}
}

function StopRefreshRecents() {
	//if ($(".loading_recent")) $(".loading_recent").remove();
	canRefreshRecents = false;
	pullToRefreshEnd();
}