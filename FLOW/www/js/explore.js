let searching = false;
let search_index = 0;
let canRefreshUsers = true;
let canRefreshFlows = true;
let exploreCurrentIndex = 0;
let canRefreshTop50 = true;
$(".fsearch-bar")[0].addEventListener("focus", function () {
    $(".search_results")[0].style.opacity = 1;
    $(".search_results")[0].style.pointerEvents = "auto";
    $(".explore-swiper")[0].style.display = "none";
    $(".search_back")[0].style.display = "block";
    searching = true;
    if ($(".fsearch-bar")[0].value.length == 0) {
        RefreshSearch();
    }
});
$(".fsearch-bar")[0].addEventListener("blur", function () {
    if (!searching) {
        $(".search_results")[0].style.opacity = 0;
        $(".search_results")[0].style.pointerEvents = "none";
        $(".explore-swiper")[0].style.display = "block";
    }
});
$(".search_back")[0].addEventListener("click", function () {
    $(".search_results")[0].style.opacity = 0;
    $(".search_results")[0].style.pointerEvents = "none";
    $(".explore-swiper")[0].style.display = "block";
    $(".search_back")[0].style.display = "none";
    searching = false;
    $(".fsearch-bar").blur();
    $(".fsearch-bar")[0].value = "";
    RefreshSearch();
});

var ptrContent_explore = $$('#tab2');
// Add 'refresh' listener on it
ptrContent_explore.on('ptr:refresh', function (e) {
    // Emulate 2s loading
    console.log("refreshing...");
    stopAllBlocksAudio();
    exploreCurrentIndex = 0;
    let data = {
        Index: exploreCurrentIndex,
    }
    ServerManager.GetTop50(data);
});


ptrContent_explore.on('ptr:pullstart', function (e) {
    console.log("pull start");
    $("#ptr_arrow_explore").css("opacity", "1");

});

ptrContent_explore.on('ptr:pullend', function (e) {
    console.log("pull end");
    $("#ptr_arrow_explore").css("opacity", "0");
});

document.addEventListener('deviceready', function () {
    $(".show_more_users")[0].addEventListener("click", function () {
        ShowMoreUsers();
    });
    $(".show_more_flows")[0].addEventListener("click", function () {
        ShowMoreFlows();
    });
    $(".top_users").scroll(function () {
        if (canRefreshUsers) {
            var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
            if (Math.round($(this).scrollTop()) >= limit * 0.75) {
                search_index += 1;
                console.log("search_index : " + search_index);
                let data = {
                    Index: search_index,
                    Search: $(".fsearch-bar")[0].value
                }
                ServerManager.SearchUser(data);
            }
        }
    });

    $(".top_flows").scroll(function () {
        if (canRefreshFlows) {
            var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
            if (Math.round($(this).scrollTop()) >= limit * 0.75) {
                search_index += 1;
                console.log("search_index : " + search_index);
                let data = {
                    Index: search_index,
                    Search: $(".fsearch-bar")[0].value
                }
                ServerManager.SearchFlow(data);
            }
        }
    });

    $("#tab2").scroll(function () {
        if (canRefreshTop50) {
            var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
            if (Math.round($(this).scrollTop()) >= limit * 0.75) {
                canRefreshTop50 = false;
                exploreCurrentIndex += 1;
                console.log("explore top50 index : " + exploreCurrentIndex);
                let data = {
                    Index: exploreCurrentIndex
                }
                ServerManager.GetTop50(data);
            }
        }
    });

    let data = {
        Index: exploreCurrentIndex
    }

    ServerManager.GetTop50(data);

    // const ptr = PullToRefresh.init({
    //     mainElement: '#tab2',
    //     triggerElement: '#tab2',
    //     onRefresh() {
    //         console.log("refreshed !");
    //     }
    // });

});

$(".fsearch-bar")[0].addEventListener("keydown", function (e) {
    setTimeout(function () {
        if ($(".fsearch-bar")[0].value.length > 0) {
            RefreshSearch();
            let data = {
                Index: search_index,
                Search: $(".fsearch-bar")[0].value
            }
            ServerManager.SearchUser(data);
            ServerManager.SearchFlow(data);
        }
    }, 50);
    if (e.keyCode == 13) {
        $(".fsearch-bar").blur();
    }
});

function RefreshSearch() {
    search_index = 0;
    $(".top_users")[0].innerHTML = "";
    $(".top_flows")[0].innerHTML = "";
    $(".top_users_txt")[0].style.display = "block";
    $(".top_users")[0].style.display = "block";
    $(".top_flows_txt")[0].style.display = "block";
    $(".top_flows")[0].style.display = "block";
    $(".show_more_users")[0].style.display = "none";
    $(".show_more_flows")[0].style.display = "none";
    search_index = 0;
    let no_users = document.createElement("div");
    no_users.className = "no_results";
    no_users.innerHTML = "No results";
    $(".top_users")[0].appendChild(no_users);
    let no_flows = document.createElement("div");
    no_flows.className = "no_results";
    no_flows.innerHTML = "No results";
    $(".top_flows")[0].appendChild(no_flows);
    $(".top_users")[0].style.height = " calc(" + ((0 * 7) + 2) + " * var(--custom-vh))";
    $(".top_flows_txt")[0].style.top = " calc(" + ((0 * 7) + 32) + " * var(--custom-vh))";
    $(".top_flows")[0].style.top = " calc(" + ((0 * 7) + 37) + " * var(--custom-vh))";
}

function SpawnUserSearch(data) {
    let users = data.Data;
    let top_users = $(".top_users")[0];
    if (search_index == 0) {
        top_users.innerHTML = "";
        $(".top_users")[0].style.height = " calc(" + ((users.length * 7) + 2) + " * var(--custom-vh))";
        $(".top_flows_txt")[0].style.top = " calc(" + ((users.length * 7) + 32) + " * var(--custom-vh))";
        $(".top_flows")[0].style.top = " calc(" + ((users.length * 7) + 37) + " * var(--custom-vh))";
        $(".show_more_flows")[0].style.top = "calc(" + ((users.length * 7) + 237) + " * var(--custom-vh))";
    }
    for (let index in users) {
        let user = users[index];
        let user_block = document.createElement("div");
        user_block.className = "user_block";
        user_block.onclick = function () {
            let data = {
                private_Id: user.PrivateId
            }
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
        follow_btn.innerHTML = "FOLLOW";
        if (user.YouFollowHim == "true") {
            follow_btn.className = "follow_btn following";
            follow_btn.innerHTML = "FOLLOWING";
        }

        user_block.appendChild(pp);
        user_block.appendChild(user_name);
        user_block.appendChild(user_privateId);
        if (user.PrivateId != window.localStorage.getItem("user_private_id") && user.YouFollowHim == "true") {
            user_block.appendChild(follow_btn);
        }

        top_users.appendChild(user_block);
    }

    if (users.length >= 5 && search_index == 0) {
        $(".show_more_users")[0].style.display = "block";
    } else {
        $(".show_more_users")[0].style.display = "none";
        if (search_index == 0 && users.length == 0) {
            let no_users = document.createElement("div");
            no_users.className = "no_results";
            no_users.innerHTML = "No results";
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
            pseudo: flow.PrivateId,
            account_imageURL: flow.ProfilePicture,
            ObjectId: flow.ObjectId,
            PrivateId: flow.PrivateId,
            Times: flow.Time,
            IsLike: flow.IsLike,
            IsComment: flow.IsComment,
            Likes: flow.Likes,
            Comments: flow.Comments,
            RegisterId: flow.RegisterId,
        };

        var new_block = new block(block_params);
        all_blocks.push(new_block);
    }

    if (flows.length >= 5 && search_index == 0) {
        $(".show_more_flows")[0].style.display = "block";
    } else {
        $(".show_more_flows")[0].style.display = "none";
        if (search_index == 0 && flows.length == 0) {
            let no_flows = document.createElement("div");
            no_flows.className = "no_results";
            no_flows.innerHTML = "No results";
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
    $(".show_more_users")[0].style.display = "none";
    $(".top_flows_txt")[0].style.display = "none";
    $(".top_flows")[0].style.display = "none";
    $(".show_more_flows")[0].style.display = "none";
    $(".top_users")[0].style.height = " calc(66 * var(--custom-vh))";
    search_index += 1;
    let data = {
        Index: search_index,
        Search: $(".fsearch-bar")[0].value
    }
    ServerManager.SearchUser(data);
}

function ShowMoreFlows() {
    $(".show_more_users")[0].style.display = "none";
    $(".top_users_txt")[0].style.display = "none";
    $(".top_users")[0].style.display = "none";
    $(".show_more_flows")[0].style.display = "none";
    $(".top_flows_txt")[0].style.top = " calc(20 * var(--custom-vh))";
    $(".top_flows")[0].style.height = " calc(66 * var(--custom-vh))";
    $(".top_flows")[0].style.top = " calc(27 * var(--custom-vh))";
    search_index += 1;
    let data = {
        Index: search_index,
        Search: $(".fsearch-bar")[0].value
    }
    ServerManager.SearchFlow(data);
}

function UpdateTop50(data) {
    console.log("updating top50...");
    stopAllBlocksAudio();
    console.log(data);
    if (Array.isArray(data) && data.length > 0) {
        setTimeout(function () {
            // if ($(".loading_tl")) $(".loading_tl").remove();
            if (exploreCurrentIndex == 0) {
                $(".list-block-top50")[0].innerHTML = "";
                let loading_tl = document.createElement("div");
                loading_tl.className = "loading_circle loading_tl";
                $(".list-block-top50")[0].appendChild(loading_tl);
            }
            for (let i = 0; i < data.length; i++) {
                let flow = data[i];
                let pattern_key = "";
                if (flow.Background.PatternKey) pattern_key = flow.Background.PatternKey;
                let block_params = {
                    parent_element: $(".list-block-top50")[0],
                    afterblock: false,
                    audioURL: flow.Audio,
                    duration: flow.Duration,
                    patternKey: pattern_key,
                    imageURL: flow.Background,
                    title: flow.Title,
                    description: flow.Description,
                    pseudo: flow.PrivateId,
                    account_imageURL: flow.ProfilePicture,
                    ObjectId: flow.ObjectId,
                    PrivateId: flow.PrivateId,
                    Times: flow.CREATION,
                    IsLike: flow.IsLike,
                    IsComment: flow.IsComment,
                    Likes: flow.Likes,
                    Comments: flow.Comments,
                    RegisterId: flow.RegisterId,
                };

                var new_block = new block(block_params);
                all_blocks.push(new_block);
            }
            if ($(".loading_tl")) $(".loading_tl").remove();
            console.log("top50 updated !");
            pullToRefreshEnd();
            // exploreCurrentIndex++;
            if (data.length < 5) {
                canRefreshTop50 = false;
                let tick_tl = document.createElement("div");
                tick_tl.className = "tick_icon";
                $(".list-block-top50")[0].appendChild(tick_tl);
            } else {
                canRefreshTop50 = true;
                let loading_tl = document.createElement("div");
                loading_tl.className = "loading_circle loading_tl";
                $(".list-block-top50")[0].appendChild(loading_tl);
            }
        }, 500);
    } else {
        StopRefreshTop50();
    }
}

function StopRefreshTop50() {
    if ($(".loading_tl")) $(".loading_tl").remove();
    canRefreshTop50 = false;
    // pullToRefreshEnd();
}