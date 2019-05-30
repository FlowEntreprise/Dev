var story_window;
var story_pos;
var StorySiriWave;
var currentSection = "main";
var story_index = 0;
var storyFlow_index = 0;
// var story_read_ids = window.localStorage.getObj("story_read") || [];
var story_read = window.localStorage.getObj("story_read") || [];
var current_value = 0;
var inSeenPopup = false;
var playing_recorded_com = false;
var recorded_com;

var debug_record = false;
var current_story_audio;
var next_prev_delay = 200;
var can_next_prev = true;

// Version 4.0
const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt,
        m = Math.round,
        a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length,
            x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        }
        return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBCr(c1) : P ? {
        r: 0,
        g: 0,
        b: 0,
        a: -1
    } : {
        r: 255,
        g: 255,
        b: 255,
        a: -1
    }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

class Story {
    constructor() {
        this.user_id = 1;
        this.private_id = "Pamela";
        this.user_picture = "src/pictures/girl1.jpg";
        this.data = [];
        this.lastStoryTime = 0;
    }

    addStoryFlow(time) {
        let new_storyFlow = new StoryFlow();
        new_storyFlow.time = time;
        this.data.push(new_storyFlow);
    }
}

class StoryFlow {
    constructor() {
        this.time = "...";
        this.audio = new Audio("src/sound/son.opus");
        this.duration = 0;
        this.comments = [];
        for (let i = 0; i < 5; i++) {
            this.comments.push(new StoryComment());
        }
        this.seen = [];
        for (let i = 0; i < 15; i++) {
            this.seen.push(new StorySeen());
        }
    }
}

class StoryComment {
    constructor() {
        this.time = "14h56";
        this.audio = new Audio("src/sound/son.opus");
        this.user_id = 1;
        this.private_id = "Pamela";
        this.user_picture = "src/pictures/girl1.jpg";
        this.isPlaying = false;
    }
}

class StorySeen {
    constructor() {
        this.time = "Seen 5m ago";
        this.private_id = "@John";
        this.user_picture = "src/pictures/guy1.jpg";
    }
}

// Faking 3 users stories :
var story_data = [];
// var story_users = ["Pamela", "John", "Vanessa"];
// var story_colors = ["#1A84EF", "#f71668", "#21c40b"];
// var story_images = ["src/pictures/girl1.jpg", "src/pictures/guy1.jpg", "src/pictures/girl2.jpg"];
// for (var i = 0; i < 3; i++) {
//     let userStory = new Story();
//     userStory.id = i;
//     userStory.private_id = story_users[i];
//     userStory.user_picture = story_images[i];
//     userStory.addStoryFlow("2h ago");
//     userStory.addStoryFlow("6h ago");
//     userStory.addStoryFlow("13h ago");
//     //userStory.color = story_colors[i];
//     userStory.color = "#000000".replace(/0/g, function () {
//         return (~~(Math.random() * 16)).toString(16);
//     });
//     userStory.darkColor = pSBC(-0.8, userStory.color);
//     story_data.push(userStory);
// }

// UpdateStoryDataFromServer();

function UpdateStoryDataFromServer(data) {
    /* ------------------------------------------------*/
    /*           GETTING STORIES DATA ON SERVER        */
    /* ------------------------------------------------*/
    story_data = [];
    if (data.Data) {
        for (let i = 0; i < data.Data.length; i++) {
            let userStory = new Story();
            userStory.id = i;
            userStory.private_id = data.Data[i].PrivateId;
            let src = 'https://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.Data[i].ProfilePicture.name + '?';
            let param = `${data.LinkBuilder.Params.hash}=${data.Data[i].ProfilePicture.hash}&${data.LinkBuilder.Params.time}=${data.Data[i].ProfilePicture.timestamp}`;
            userStory.user_picture = src + param;
            userStory.color = "#000000".replace(/0/g, function () {
                return (~~(Math.random() * 16)).toString(16);
            });
            userStory.darkColor = pSBC(-0.8, userStory.color);
            userStory.lastStoryTime = data.Data[i].LastStory;

            if (userStory.private_id == window.localStorage.getItem("user_private_id")) {
                story_data.unshift(userStory);
            } else {
                story_data.push(userStory);
            }
        }
    }
    RefreshStories();
}

function RefreshStories() {
    /* ------------------------------------------------*/
    /*              REFRESH AFTER GETTING DATA         */
    /* ------------------------------------------------*/
    $(".fstory_list")[0].innerHTML = "<li><div class=\"fstory_block\"><div class=\"fplus\"></div><a href=\"#\" data-popup=\".popup-story-record\" class=\"open-story-record open-popup\"></a><img src=\"src/icons/Account@3x.png\" class=\"fstory_pic mystory_pic fnoshadow\"><div class=\"unread_shadow\"></div></div></li>";
    if (connected && window.localStorage.getItem("user_profile_pic")) {
        $(".mystory_pic")[0].src = window.localStorage.getItem("user_profile_pic");
    }
    for (var i = 0; i < story_data.length; i++) {
        let story_element = document.createElement("li");
        let story_block = document.createElement("div");
        story_block.className = "fstory_block";
        story_block.onclick = function () {
            if (!InStory) {
                current_page = "story";
                SpawnStoryWindow($(this));
            }
        };
        // if (!story_read_ids.includes(story_data[i].id)) {
        //     story_block.className += " unread";
        // }
        let found = story_read.filter(x => x.private_id == story_data[i].private_id);
        console.log(story_data[i].private_id);
        console.log(story_data[i].lastStoryTime);
        console.log(found);
        // let found = story_read.find(function (element) {
        //     return element.private_id == story_data[i].private_id && element.lastStoryTime < story_data[i].lastStoryTime;
        // });
        if (found.length == 0 || found[0].lastStoryTime < story_data[i].lastStoryTime) {
            story_block.className += " unread";
        }

        story_block.setAttribute("story_id", i);
        let story_img = document.createElement("img");
        story_img.className = "fstory_pic";
        story_img.src = story_data[i].user_picture;
        let story_shadow = document.createElement("div");
        story_shadow.className = "unread_shadow";

        story_block.appendChild(story_img);
        story_block.appendChild(story_shadow);
        story_element.appendChild(story_block);

        $(".fstory_list")[0].appendChild(story_element);

        // $(".fstory_list").
    }

    // $(".fstory_block").each(function () {
    //     this.addEventListener("click", function () {
    //         if (!InStory) {
    //             current_page = "story";
    //             SpawnStoryWindow($(this));
    //         }
    //     });
    // });
}

function SpawnStoryWindow(story_block) {
    window.plugins.insomnia.keepAwake();
    story_window = document.createElement("div");
    story_window.className = "fstory_window";
    story_pos = story_block.position();
    story_window.style.transform = "scale3d(0.1, 0.1, 0.1) translate3d(" + (story_pos.left + (window.innerHeight / 100) * 2) * 10 + "px, " + (story_pos.top + (window.innerHeight / 100) * 6) * 10 + "px , 0px)";
    //story_window.style.top = story_pos.top + (window.innerHeight / 100) * 6 + "px";
    //story_window.style.left = story_pos.left + (window.innerHeight / 100) * 2 + "px";
    story_window.style.top = "0px";
    story_window.style.left = "0px";
    story_window.style.opacity = "0";
    story_window.style.opacity = "0";
    story_index = story_block[0].getAttribute("story_id");
    storyFlow_index = 0;
    document.body.appendChild(story_window);
    $(".fstory_window").load("pages/story.html", function () {
        story_window.addEventListener('touchstart', handleTouchStart, false);
        story_window.addEventListener('touchmove', handleTouchMove, false);
        story_window.addEventListener('touchend', handleTouchEnd, false);
        InStory = true;
        currentSection = "main";
        setTimeout(function () {
            console.log(document.getElementById('fstory_wave'));
            StorySiriWave = new SiriWaveRecord({
                container: document.getElementById('fstory_wave'),
                width: 300,
                height: 300,
                style: "ios",
                color: "1A84EF",
                cover: true,
                lerpSpeed: 1,
                story: true
            });
            StorySiriWave.start();
            StorySiriWave.speed = 0;
            StorySiriWave.amplitude = 0;

            story_window.style.top = "0px";
            story_window.style.left = "0px";
            story_window.style.transform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1)";
            story_window.style.opacity = "1";

            // setTimeout(function () {
            //     loadStory(story_index, storyFlow_index);
            // }, 500);
            // OR
            tryLoadStory(story_index, storyFlow_index);
            showStoryMain(false);

            $('.fstory_addcomment_btn').on('taphold', function () {
                console.log("Hold Record !");
                record_was_hold = true;
                StartRecording();
            });
            $('.fstory_addcomment_btn').on('click', function () {
                console.log("Tap Record !");
                if (recording) {
                    StopRecording();
                } else {
                    StartRecording();
                }
            });


        }, 50);
    });
}




/* ------------------------- */

var xDown = null;
var yDown = null;
var direction;

function getTouches(evt) {
    return evt.touches || // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
    direction = null;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
            /* left swipe */
            direction = "left";
        } else {
            /* right swipe */
            direction = "right";
        }
    } else {
        if (yDiff > 0) {
            /* up swipe */
            direction = "up";
        } else {
            /* down swipe */
            direction = "down";
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

function handleTouchEnd(evt) {
    if (direction != null && $(".fstory_comment_list").scrollTop() < 5 && !inSeenPopup) {
        console.log("swipe " + direction);
        if (direction == "up") {
            if (current_story_audio) {
                current_story_audio.pause();
            }
            showStoryComments();
        } else if (direction == "down") {
            if (currentSection == "comments") {
                stopAllStoriesAudio();
                showStoryMain(true);
            } else {
                CloseStory();
            }
        }
    }
}

function CloseStory() {
    stopAllStoriesAudio();
    if (StorySiriWave) {
        StorySiriWave.speed = 0;
        StorySiriWave.amplitude = 0;
    }
    story_window.style.transform = "scale3d(0.1, 0.1, 0.1)";
    // story_window.style.top = story_pos.top + (window.innerHeight / 100) * 6 + "px";
    // story_window.style.left = story_pos.left + (window.innerHeight / 100) * 2 + "px";
    story_window.style.transform = "scale3d(0.1, 0.1, 0.1) translate3d(" + (story_pos.left + (window.innerHeight / 100) * 2) * 10 + "px, " + (story_pos.top + (window.innerHeight / 100) * 6) * 10 + "px , 0px)";
    story_window.style.opacity = "0";
    setTimeout(function () {
        document.body.removeChild(story_window);
        story_window = null;
        InStory = false;
        current_page = "home";
        StorySiriWave.stop();
    }, 400);

    RefreshStories();
    StatusBar.backgroundColorByHexString('#f7f7f8');
    StatusBar.styleDefault();
    window.plugins.insomnia.allowSleepAgain();
}

function showStoryComments() {
    story_data[story_index].data[storyFlow_index].audio.pause();
    currentSection = "comments";
    $(".story_main_view").css({
        "transform": "translate3d(0px, -100vh, 0px)",
        "opacity": "0"
    });
    $(".comments_main_view").css({
        "transform": "translate3d(0px, -100vh, 0px)",
        "opacity": "1"
    });
}

function showStoryMain(play_story) {
    if (play_story) {
        tryLoadStory(story_index, storyFlow_index);
        // current_story_audio.audio.play();
    }
    currentSection = "main";
    $(".story_main_view").css({
        "transform": "translate3d(0px, 0vh, 0px)",
        "opacity": "1"
    });
    $(".comments_main_view").css({
        "transform": "translate3d(0px, 0vh, 0px)",
        "opacity": "0"
    });
}

function tryLoadStory(story_index, storyFlow_index) {
    if (!story_data[story_index].data[storyFlow_index]) {
        can_next_prev = false;
        // LOAD STORY FROM SERVER
        $(".fstory_pseudo").text("Loading");
        $(".fstory_time").text("...");
        story_pos = $($(".fstory_block")[parseInt(story_index) + 1]).position();
        $(".fstory_indicator_list")[0].innerHTML = "";
        $(".fstory_pp")[0].style.backgroundImage = "white";
        // $(".fstory_window")[0].style.backgroundImage = "linear-gradient(" + story_data[story_index].data[storyFlow_index].color + ", " + story_data[story_index].darkColor + ");";
        let color_gradient = "linear-gradient(white, black)";
        StatusBar.backgroundColorByHexString("#ffffff");
        StatusBar.styleDefault();
        $(".fstory_window")[0].style.backgroundImage = color_gradient;

        setTimeout(function () {
            ServerManager.GetUserStory(story_data[story_index].private_id);
        }, 10);
    } else {
        loadStory(story_index, storyFlow_index);
    }
}

function GetStoryForUserFromServer(data) {
    story_data[story_index].data = [];
    for (let i = 0; i < data.Data.length; i++) {
        let story_flow = new StoryFlow();
        story_flow.time = data.Data[i].Time;
        story_flow.duration = parseFloat(data.Data[i].Duration);
        story_flow.color = data.Data[i].Color;
        story_flow.darkColor = pSBC(-0.8, story_flow.color);
        let src_flow = 'https://' + data.LinkBuilder.Hostname + '/stories/' + data.Data[i].Audio.name + '?';
        let param_flow = `${data.LinkBuilder.Params.hash}=${data.Data[i].Audio.hash}&${data.LinkBuilder.Params.time}=${data.Data[i].Audio.timestamp}`;
        let audio_link = src_flow + param_flow;
        story_flow.audio = new Audio(audio_link);
        story_data[story_index].data.push(story_flow);
    }

    loadStory(story_index, 0);
}

function loadStory(story_index, storyFlow_index) {
    console.log("LOAD STORY");
    can_next_prev = true;
    $(".fstory_pseudo").text(story_data[story_index].private_id);
    $(".fstory_time").text(story_data[story_index].data[storyFlow_index].time);
    story_pos = $($(".fstory_block")[parseInt(story_index) + 1]).position();
    $(".fstory_indicator_list")[0].innerHTML = "";
    $(".fstory_pp")[0].style.backgroundImage = "url(" + story_data[story_index].user_picture + ")";
    // $(".fstory_window")[0].style.backgroundImage = "linear-gradient(" + story_data[story_index].data[storyFlow_index].color + ", " + story_data[story_index].darkColor + ");";
    let color_gradient = "linear-gradient(" + story_data[story_index].data[storyFlow_index].color + ", " + story_data[story_index].data[storyFlow_index].darkColor + ")";
    StatusBar.backgroundColorByHexString(story_data[story_index].data[storyFlow_index].color);
    StatusBar.styleLightContent();
    $(".fstory_window")[0].style.backgroundImage = color_gradient;
    // story_data[storyFlow_index].data =/= story_data.data[storyFlow_index] à check
    for (var i = 0; i < story_data[story_index].data.length; i++) {
        let story_indicator_li = document.createElement("li");
        let story_indicator = document.createElement("div");
        story_indicator.className = "fstory_indicator";
        if (i < storyFlow_index) {
            story_indicator.className += " active";
        } else if (i == storyFlow_index) {
            var story_completion = document.createElement("div");
            story_completion.className = "fstory_completion";
            story_indicator.appendChild(story_completion);
        }
        //story_indicator.innerHTML += ".";
        story_indicator_li.appendChild(story_indicator);
        $(".fstory_indicator_list")[0].appendChild(story_indicator_li);
    }
    if (current_story_audio) {
        current_story_audio.pause();
    }
    current_story_audio = new Audio(story_data[story_index].data[storyFlow_index].audio.src);
    current_story_audio.oncanplaythrough = function () {
        if (current_story_audio) {
            console.log("can play story");
            current_story_audio.play();
            StorySiriWave.speed = 0.2;
            StorySiriWave.amplitude = 1;
        }
    }
    current_story_audio.ontimeupdate = function () {
        if (current_story_audio) {
            let progress = Math.floor(current_story_audio.currentTime * 100 / story_data[story_index].data[storyFlow_index].duration);
            story_completion.style.width = progress + "%";
            // console.log(progress);
        }
    };

    current_story_audio.onended = function () {
        story_completion.style.width = "100%";
        story_data[story_index].data[storyFlow_index].audio.pause();
        // setTimeout(function () {
        nextStory();
        // }, 500);
    }
    // REPLACE EVERYTING WITH current_story_audio !!!!!!!!!!!!!!!!!!!!

    // setTimeout(function () {
    //     story_data[story_index].data[storyFlow_index].audio.play();
    //     story_data[story_index].data[storyFlow_index].audio.ontimeupdate = function () {
    //         let progress = Math.floor(story_data[story_index].data[storyFlow_index].audio.currentTime * 100 / story_data[story_index].data[storyFlow_index].duration);
    //         story_completion.style.width = progress + "%";
    //         console.log(progress);
    //         // if (progress == 100) {
    //         //     story_data[story_index].data[storyFlow_index].audio.pause();
    //         //     nextStory();
    //         // }
    //     };
    //     story_data[story_index].data[storyFlow_index].audio.onended = function () {
    //         story_completion.style.width = "100%";
    //         story_data[story_index].data[storyFlow_index].audio.pause();
    //         setTimeout(function () {
    //             nextStory();
    //         }, 500);
    //     }
    //     story_completion.style.transitionDuration = (story_data[story_index].data[storyFlow_index].duration / 10) + "s";
    //     StorySiriWave.speed = 0.2;
    //     StorySiriWave.amplitude = 1;
    // }, 100);

    // -- story_read_ids.push(story_data[story_index].id);
    // -- window.localStorage.setObj("story_read", story_read_ids);
    let found = story_read.filter(x => x.private_id == story_data[story_index].private_id);
    if (found.length > 0) {
        if (story_data[story_index].data[storyFlow_index].time > found[0].lastStoryTime) {
            story_read[story_read.indexOf(found[0])].lastStoryTime = story_data[story_index].data[storyFlow_index].time;
            console.log("update story read : " + story_data[story_index].data[storyFlow_index].time);
        }
    } else {
        story_read.push({
            private_id: story_data[story_index].private_id,
            lastStoryTime: story_data[story_index].data[storyFlow_index].time
        })
        console.log(story_data);
        console.log(story_index);
        console.log(storyFlow_index);
        console.log("add story read : " + story_data[story_index].data[storyFlow_index].time);
    }

    window.localStorage.setObj("story_read", story_read);

    loadStoryComments();
    loadStorySeen();
}

function previousStory() {
    if (can_next_prev) {
        current_story_audio.pause();
        if (current_story_audio.currentTime < 0.5) {
            stopAllStoriesAudio();
            if (storyFlow_index > 0) {
                storyFlow_index--;
                tryLoadStory(story_index, storyFlow_index);
            } else if (story_index > 0) {
                story_index--;
                storyFlow_index = story_data[story_index].data.length - 1;
                tryLoadStory(story_index, storyFlow_index);
            } else {
                CloseStory();
            }
        } else {
            $(".fstory_completion")[0].style.transitionDuration = "0s";
            current_story_audio.currentTime = 0.0;
            StorySiriWave.speed = 0;
            StorySiriWave.amplitude = 0;
            setTimeout(function () {
                $(".fstory_completion")[0].style.transitionDuration = (story_data[story_index].data[storyFlow_index].duration / 10) + "s";
                StorySiriWave.speed = 0.2;
                StorySiriWave.amplitude = 1;
            }, 100);
            tryLoadStory(story_index, storyFlow_index);
        }
        can_next_prev = false;
        setTimeout(function () {
            can_next_prev = true
        }, next_prev_delay);
    }

}

function nextStory() {
    if (can_next_prev) {
        stopAllStoriesAudio();
        if (storyFlow_index < story_data[story_index].data.length - 1) {
            storyFlow_index++;
            tryLoadStory(story_index, storyFlow_index);
        } else if (story_index < story_data.length - 1) {
            story_index++;
            storyFlow_index = 0;
            tryLoadStory(story_index, storyFlow_index);
        } else {
            CloseStory();
        }
        can_next_prev = false;
        setTimeout(function () {
            can_next_prev = true
        }, next_prev_delay);
    }
}

function stopAllStoriesAudio() {
    if (StorySiriWave) {
        StorySiriWave.speed = 0;
        StorySiriWave.amplitude = 0;
    }
    if (current_story_audio) {
        current_story_audio.pause();
        current_story_audio.currentTime = 0.0;
        current_story_audio = null;
    }
    // for (var i = 0; i < story_data.length; i++) {
    //     for (var j = 0; j < story_data[i].data.length; j++) {
    //         story_data[i].data[j].audio.pause();
    //         story_data[i].data[j].audio.currentTime = 0.0;
    //     }
    // }

    if (story_data[story_index] && story_data[story_index].data[storyFlow_index]) {
        for (let i = 0; i < story_data[story_index].data[storyFlow_index].comments.length; i++) {
            let com = story_data[story_index].data[storyFlow_index].comments[i];
            com.audio.pause();
            com.audio.currentTime = 0;
            com.isPlaying = false;
        }
    }

    if (recorded_com) {
        recorded_com.pause();
    }
}

function loadStoryComments() {
    $(".fstory_comment_list")[0].innerHTML = "";
    for (let i = 0; i < story_data[story_index].data[storyFlow_index].comments.length; i++) {
        let comment_li = document.createElement("li");
        comment_li.className = "fstory_comment_li";
        let comment_time = document.createElement("label");
        comment_time.innerHTML = story_data[story_index].data[storyFlow_index].comments[i].time;
        comment_time.className = "fstory_comment_time";
        let comment_loading = document.createElement("div");
        comment_loading.className = "fstory_comment_loading";
        comment_loading.setAttribute("comment_loading_id", i);
        let comment_pp = document.createElement("div");
        comment_pp.className = "fstory_comment_pp";
        comment_pp.style.backgroundImage = "url(" + story_data[story_index].data[storyFlow_index].comments[i].user_picture + ")";
        let comment_play = document.createElement("div");
        comment_play.setAttribute("comment_id", i);
        comment_play.className = "fstory_comment_play";
        comment_play.onclick = function () {
            playStoryComment(story_data[story_index].data[storyFlow_index].comments[i], comment_play)
        };
        let comment_pseudo = document.createElement("label");
        comment_pseudo.className = "fstory_comment_pseudo";
        comment_pseudo.innerHTML = story_data[story_index].data[storyFlow_index].comments[i].private_id;

        comment_li.appendChild(comment_time);
        comment_li.appendChild(comment_loading);
        comment_li.appendChild(comment_pp);
        comment_li.appendChild(comment_play);
        comment_li.appendChild(comment_pseudo);
        $(".fstory_comment_list")[0].appendChild(comment_li);
    }
}

function playStoryComment(comment, htmlelement) {
    // stop all comments
    for (let i = 0; i < story_data[story_index].data[storyFlow_index].comments.length; i++) {
        let com = story_data[story_index].data[storyFlow_index].comments[i];
        if (com != comment) {
            $("div[comment_id='" + i + "']")[0].style.backgroundImage = "url('src/icons/play.png')";
            com.audio.pause();
            com.audio.currentTime = 0;
            com.isPlaying = false;
        }
    }

    if (!comment.isPlaying) {
        var loading_com = $("div[comment_loading_id='" + htmlelement.getAttribute("comment_id") + "']")[0];
        // var current_value = 0;
        htmlelement.style.backgroundImage = "url('src/icons/pause.png')";
        comment.audio.play();
        comment.audio.onended = function () {
            htmlelement.style.backgroundImage = "url('src/icons/play.png')";
            comment.isPlaying = false;
            comment.audio.currentTime = 0;
            current_value = 0;
        };
        comment.audio.ontimeupdate = function () {
            //console.log(loading_com);
            //--let target_value = (comment.audio.currentTime / comment.audio.duration) * 100;
            // current_value = Lerp(current_value, target_value, 0.5);
            //--let css = "rgba(0, 0, 0, 0) conic-gradient(white 0deg, white "+target_value+"%, transparent 0deg, transparent 100%) repeat scroll 0% 0% / auto padding-box border-box";
            //--$(loading_com).css({"background": css});//.style.backgroundImage = "conic-gradient(white 0 50%, transparent 0 100%);";
        }
        current_value = (comment.audio.currentTime / comment.audio.duration) * 100;
        smoothUpdateBar(loading_com, comment);
        comment.isPlaying = true;
    } else {
        htmlelement.style.backgroundImage = "url('src/icons/play.png')";
        comment.audio.pause();
        comment.isPlaying = false;
    }
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

function smoothUpdateBar(loading_com, comment) {
    setTimeout(function () {
        let target_value = (comment.audio.currentTime / comment.audio.duration) * 100;
        current_value = Lerp(current_value, target_value, 0.5);
        let css = "rgba(0, 0, 0, 0) conic-gradient(white 0deg, white " + current_value + "%, transparent 0deg, transparent 100%) repeat scroll 0% 0% / auto padding-box border-box";
        $(loading_com).css({
            "background": css
        });
        if (comment.isPlaying) {
            smoothUpdateBar(loading_com, comment);
        }
    }, 40);
}

function ShowSeenPopup() {
    inSeenPopup = true;
    $(".seen_popup_bg").css({
        "opacity": "0.3",
        "pointer-events": "auto"
    });
    $(".seen_popup").css({
        "transform": "translate3d(0, 0, 0)"
    });
}

function CloseSeenPopup() {
    inSeenPopup = false;
    $(".seen_popup_bg").css({
        "opacity": "0",
        "pointer-events": "none"
    });
    $(".seen_popup").css({
        "transform": "translate3d(0, 70vh, 0)"
    });
}

function loadStorySeen() {
    $(".fstory_seen_txt")[0].innerHTML = story_data[story_index].data[storyFlow_index].seen.length;
    $(".seen_number")[0].innerHTML = story_data[story_index].data[storyFlow_index].seen.length;
    $(".seen_ul")[0].innerHTML = "";
    for (let i = 0; i < story_data[story_index].data[storyFlow_index].seen.length; i++) {
        let seen_li = document.createElement("li");
        seen_li.className = "seen_li";
        let seen_pseudo = document.createElement("label");
        seen_pseudo.innerHTML = story_data[story_index].data[storyFlow_index].seen[i].private_id;
        seen_pseudo.className = "seen_pseudo";
        let seen_pp = document.createElement("div");
        seen_pp.className = "seen_pp";
        let seen_time = document.createElement("label");
        seen_time.innerHTML = story_data[story_index].data[storyFlow_index].seen[i].time;
        seen_time.className = "seen_time";

        seen_li.appendChild(seen_pseudo);
        seen_li.appendChild(seen_pp);
        seen_li.appendChild(seen_time);
        $(".seen_ul")[0].appendChild(seen_li);
    }
}

function closeRecordComment() {
    StopRecording("cancel");
    $(".comment_record_popup").css({
        "opacity": "0",
        "pointer-events": "none"
    });
    $$('.fstory_addcomment_btn')[0].style.display = "block";
    $(".validate_record_comment")[0].style.display = "none";
    $(".listen_record_comment")[0].style.display = "none";
    recorded_com.pause();
}

function ListenRecordedComment() {
    if (playing_recorded_com) {
        recorded_com.pause();
        $(".play_record_comment")[0].style.backgroundImage = "url('src/icons/play.png')";
        playing_recorded_com = false;
    } else {
        recorded_com.play();
        $(".play_record_comment")[0].style.backgroundImage = "url('src/icons/pause.png')";
        playing_recorded_com = true;
    }
}

function PublishRecordedComment() {
    // Send recorded com to the server
    console.log("published comment (ignore canceled debug)");
    closeRecordComment();
}

////////////////////////// RECORDING STORY //////////////////////////
$$('.popup-story-record').on('popup:open', function () {
    $$('.frecord-btn').css({
        "display": "flex"
    });
    $(".record-shadow")[0].style.display = "block";
    current_page = "record-story";
});

$$('.popup-story-record').on('popup:close', function () {
    $$('.frecord-btn').css({
        "display": "none"
    });
    $(".record-shadow")[0].style.display = "none";
    StopRecording();
    current_page = "home";
});