var discover_swiper;
let discover_index = 0;
let discover_flows = [];

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
                for (var i = 0; i < 100; i += 1) {
                    slides.push("<div class='parent notloaded'>Chargement...</div>");
                }
                return slides;
            })()
        }
    });

    discover_swiper.on('transitionEnd', function () {
        let current_index = discover_swiper.activeIndex;
        if (current_block_playing) current_block_playing.flowend(true);
        discover_flows[current_index].flowplay();
        if (current_index > discover_index) {
            discover_index = current_index;
            getDiscoverFlow();
        }

        // let tmp_random_excluded = window.localStorage.getItem("random_excluded");
        // if (!tmp_random_excluded) tmp_random_excluded = "";
        // if (!tmp_random_excluded.includes(discover_flows[current_index].ObjectId)) window.localStorage.setItem("random_excluded", tmp_random_excluded + discover_flows[current_index].ObjectId + ",");
    });

    // console.log(swiper);
    discover_swiper_initialised = true;
    getDiscoverFlow(3);
}

function getDiscoverFlow(numberOfFlows) {
    // console.log("getting discover flow...");
    // let tmp_random_excluded = window.localStorage.getItem("random_excluded");
    // if (!tmp_random_excluded) randomExcluded = [];
    // else randomExcluded = tmp_random_excluded.split(",");
    ServerManager.GetRandomFlow(randomExcluded, true, numberOfFlows);
}


function showRandomDiscover(data) {
    // console.log(data);
    for (let i = 0; i < data.Data.length; i++) {
        // console.log("discover flow loaded !");
        if (!data.Data) {
            $(".random_flow_btn").toggleClass("searching");
            window.localStorage.removeItem("random_excluded");
            console.log("tu as fais le tour de tous les flows de l'app");
            getDiscoverFlow();
            return false
        }
        let flow = data.Data[i];
        // if (discover_flows.length > 0) discover_swiper.virtual.appendSlide('<div class="parent">Une erreur s\'est produite</div>');
        // let container = $(".swiper-container.discover .parent").last();
        let container = $(".swiper-container.discover .parent.notloaded").first();
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
    }
}