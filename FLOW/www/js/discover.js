var discover_swiper;
let discover_index = 0;
let discover_flow_index = 0;
let discover_flows = [];
let DiscoverFlowsArray = [];
let discover_flows_seen = [];

function setupDiscover() {
    discover_swiper = new Swiper(".swiper-container.discover", {
        direction: "vertical",
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 150,
        initialSlide: 0,
        virtual: {
            slides: (function () {
                let slides = [];
                for (var i = 0; i < 1; i += 1) {
                    slides.push("<div class='parent notloaded'>Chargement...</div>");
                }
                return slides;
            })()
        }
    });

    discover_swiper.on('transitionEnd', function () {
        let current_index = discover_swiper.activeIndex;
        if (current_block_playing) current_block_playing.flowend(true);
        TryPopDiscoverFlows();
        if (discover_flows[current_index] && discover_flows_seen.includes(discover_flows[current_index].ObjectId)) {
            discover_flows_seen.splice(discover_flows_seen.indexOf(discover_flows[current_index].ObjectId), 1);
            console.log("remove : " + discover_flows[current_index].ObjectId);
        }
        if (discover_flows[current_index]) discover_flows[current_index].flowplay();
        if (current_index > discover_index && (current_index + 3) % 5 == 0) {
            discover_index = current_index;
            getDiscoverFlow(5);
        }

        // let tmp_random_excluded = window.localStorage.getItem("random_excluded");
        // if (!tmp_random_excluded) tmp_random_excluded = "";
        // if (!tmp_random_excluded.includes(discover_flows[current_index].ObjectId)) window.localStorage.setItem("random_excluded", tmp_random_excluded + discover_flows[current_index].ObjectId + ",");
    });

    // console.log(swiper);
    discover_swiper_initialised = true;
    getDiscoverFlow(5);
}

function getDiscoverFlow(numberOfFlows) {
    // console.log("getting discover flow...");
    // let tmp_random_excluded = window.localStorage.getItem("random_excluded");
    // if (!tmp_random_excluded) randomExcluded = [];
    // else randomExcluded = tmp_random_excluded.split(",");
    // if (discover_index > 0) index = discover_index + 2;
    let excluded = discover_flows_seen;
    // console.log(DiscoverFlowsArray.length);
    // console.log(excluded);
    ServerManager.GetFlowDiscover(discover_flow_index, numberOfFlows, excluded);
    discover_flow_index++;
}

function AddToDiscoverArray(data) {
    if (!data.Data) {
        discover_swiper.virtual.removeSlide(discover_swiper.virtual.slides.length - 1);
        discover_swiper.virtual.appendSlide(`${language_mapping[device_language]['fin_de_lapplication']}`);
        discover_swiper.slideTo(discover_swiper.virtual.slides.length - 1);
    } else {
        for (let i = 0; i < data.Data.length; i++) {
            if (discover_index == 0) discover_swiper.virtual.appendSlide("<div class='parent notloaded'>Chargement...</div>");
            DiscoverFlowsArray.push(data.Data[i]);
            discover_flows_seen.push(data.Data[i].ObjectId);
        }

        if (discover_index == 0) {
            TryPopDiscoverFlows();
            discover_swiper.slideTo(0);
        }
    }
}

function TryPopDiscoverFlows() {
    let indexesToRemove = [];
    if (discover_swiper.activeIndex >= discover_swiper.virtual.slides.length - 2 && DiscoverFlowsArray.length > 0) {
        for (let i in DiscoverFlowsArray) {
            discover_swiper.virtual.appendSlide("<div class='parent notloaded'>Chargement...</div>");
        }
    }
    for (let i in DiscoverFlowsArray) {
        let container = $(".swiper-container.discover .parent.notloaded").first();
        if (container[0]) {
            showRandomDiscover(DiscoverFlowsArray[i], container);
            indexesToRemove.unshift(i);
        }
    }
    for (let i in indexesToRemove) {
        DiscoverFlowsArray.splice(indexesToRemove[i], 1);
    }
}

function showRandomDiscover(data, container) {
    let flow = data

    container[0].innerHTML = "";
    let pattern_key = "";
    if (flow.Background.PatternKey) pattern_key = flow.Background.PatternKey;
    let block_params = {
        parent_element: container,
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
    let new_block = new block(block_params);
    // discover_swiper.virtual.appendSlide(new_block.block_flow);
    new_block.block_flow.style.marginTop = "1vw";

    if (discover_flows.length == 0 && !in_new_features) {
        new_block.block_flow.addEventListener("ready", function () {
            if (discover_index == 0 && !in_new_features) {
                new_block.flowplay();
            }
        });
    }

    all_blocks.push(new_block);
    discover_flows.push(new_block);
    container.removeClass("notloaded");
    // if (discover_index == 0) discover_swiper.slideTo(0);
    // }
}

function ResetAccountDev() {
    push.unregister(
        () => {
            console.log('success');
            let push = PushNotification.init({
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
        },
        () => {
            console.log('error');
        }
    );
}