var story_window;
var story_pos;
var StorySiriWave;
var currentSection = "main";
var story_index = 0;
var storyFlow_index = 0;
var story_read_ids = [];

class Story {
    constructor() {
        this.user_id = 1;
        this.user_pseudo = "Pamela";
        this.user_picture = "src/pictures/girl1.jpg";
        this.data = [];
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
    }
}

// Faking 3 users stories :
var story_data = [];
var story_users = ["Pamela", "John", "Vanessa"];
var story_images = ["src/pictures/girl1.jpg", "src/pictures/guy1.jpg", "src/pictures/girl2.jpg"];
for (var i = 0; i < 3; i++) {
    let userStory = new Story();
    userStory.id = i;
    userStory.user_pseudo = story_users[i];
    userStory.user_picture = story_images[i];
    userStory.addStoryFlow("2h ago");
    userStory.addStoryFlow("6h ago");
    userStory.addStoryFlow("13h ago");

    story_data.push(userStory);
}

RefreshStories();

function RefreshStories() {
    $(".fstory_list")[0].innerHTML = "<li><div class=\"fstory_block\"><div class=\"fplus\"></div><img src=\"src/pictures/guy1.jpg\" class=\"fstory_pic fnoshadow\"><div class=\"unread_shadow\"></div></div></li>";
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
        if (!story_read_ids.includes(story_data[i].id)) {
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
            loadStory(story_index, storyFlow_index);

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
    if (direction != null) {
        console.log("swipe " + direction);
        if (direction == "up") {
            showStoryComments();
        } else if (direction == "down") {
            if (currentSection == "comments") {
                showStoryMain();
            } else {
                CloseStory();
            }
        }
    }
}

function CloseStory() {
    stopAllStoriesAudio();
    StorySiriWave.speed = 0;
    StorySiriWave.amplitude = 0;
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
}

function showStoryComments() {
    currentSection = "comments";
    $(".story_main_view").css({
        "transform": "translate3d(0px, -100vh, 0px"
    });
    $(".comments_main_view").css({
        "transform": "translate3d(0px, -100vh, 0px"
    });
}

function showStoryMain() {
    currentSection = "main";
    $(".story_main_view").css({
        "transform": "translate3d(0px, 0vh, 0px"
    });
    $(".comments_main_view").css({
        "transform": "translate3d(0px, 0vh, 0px"
    });
}

function loadStory(story_index, storyFlow_index) {
    $(".fstory_pseudo").text(story_data[story_index].user_pseudo);
    $(".fstory_time").text(story_data[story_index].data[storyFlow_index].time);
    story_pos = $($(".fstory_block")[parseInt(story_index) + 1]).position();
    $(".fstory_indicator_list")[0].innerHTML = "";
    $(".fstory_pp")[0].style.backgroundImage = "url(" + story_data[story_index].user_picture + ")"; 
    for (var i = 0; i < story_data[storyFlow_index].data.length; i++) {
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
    stopAllStoriesAudio();
    setTimeout(function () {
        story_data[story_index].data[storyFlow_index].audio.play();
        story_data[story_index].data[storyFlow_index].audio.ontimeupdate = function () {
            let progress = Math.round(story_data[story_index].data[storyFlow_index].audio.currentTime * 100 / story_data[story_index].data[storyFlow_index].audio.duration);
            story_completion.style.width = progress + "%";
            if (progress == 100) {
                story_data[story_index].data[storyFlow_index].audio.pause();
                nextStory();
            }
        };
        story_completion.style.transitionDuration = (story_data[story_index].data[storyFlow_index].audio.duration / 10) + "s";
        StorySiriWave.speed = 0.2;
        StorySiriWave.amplitude = 1;
    }, 100);

    story_read_ids.push(story_data[story_index].id);
}

function previousStory() {
    if (story_data[story_index].data[storyFlow_index].audio.currentTime < 1) {
        stopAllStoriesAudio();
        if (storyFlow_index > 0) {
            storyFlow_index--;
            loadStory(story_index, storyFlow_index);
        } else if (story_index > 0) {
            story_index--;
            storyFlow_index = story_data[story_index].data.length - 1;
            loadStory(story_index, storyFlow_index);
        } else {
            CloseStory();
        }
    } else {
        $(".fstory_completion")[0].style.transitionDuration = "0s";
        story_data[story_index].data[storyFlow_index].audio.currentTime = 0.0;
        story_data[story_index].data[storyFlow_index].audio.play();
        StorySiriWave.speed = 0;
        StorySiriWave.amplitude = 0;
        setTimeout(function () {
            $(".fstory_completion")[0].style.transitionDuration = (story_data[story_index].data[storyFlow_index].audio.duration / 10) + "s";
            StorySiriWave.speed = 0.2;
            StorySiriWave.amplitude = 1;
        }, 100);
        loadStory(story_index, storyFlow_index);
    }

}

function nextStory() {
    stopAllStoriesAudio();
    if (storyFlow_index < story_data[story_index].data.length - 1) {
        storyFlow_index++;
        loadStory(story_index, storyFlow_index);
    } else if (story_index < story_data.length - 1) {
        story_index++;
        storyFlow_index = 0;
        loadStory(story_index, storyFlow_index);
    } else {
        CloseStory();
    }
}

function stopAllStoriesAudio() {
    StorySiriWave.speed = 0;
    StorySiriWave.amplitude = 0;
    for (var i = 0; i < story_data.length; i++) {
        for (var j = 0; j < story_data[i].data.length; j++) {
            story_data[i].data[j].audio.pause();
            story_data[i].data[j].audio.currentTime = 0.0;
        }
    }
}