var story_window;
var story_pos;

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
    document.body.appendChild(story_window);
    $(".fstory_window").load("pages/story.html");

    story_window.addEventListener('touchstart', handleTouchStart, false);
    story_window.addEventListener('touchmove', handleTouchMove, false);
    story_window.addEventListener('touchend', handleTouchEnd, false);

    setTimeout(function () {
        story_window.style.top = "0px";
        story_window.style.left = "0px";
        story_window.style.transform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1)";
        story_window.style.opacity = "1";
    }, 50);
}

$(".fstory_block").each(function () {
    this.addEventListener("click", function () {
        SpawnStoryWindow($(this));
    });
});


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
            $(".comments_main_view").css({
                "transform": "translate3d(0px, -100vh, 0px"
            });
        } else if (direction == "down") {
            $(".comments_main_view").css({
                "transform": "translate3d(0px, 0vh, 0px"
            });
        }
    }
}

function CloseStory() {
    story_window.style.transform = "scale3d(0.1, 0.1, 0.1)";
    // story_window.style.top = story_pos.top + (window.innerHeight / 100) * 6 + "px";
    // story_window.style.left = story_pos.left + (window.innerHeight / 100) * 2 + "px";
    story_window.style.transform = "scale3d(0.1, 0.1, 0.1) translate3d(" + (story_pos.left + (window.innerHeight / 100) * 2) * 10 + "px, " + (story_pos.top + (window.innerHeight / 100) * 6) * 10 + "px , 0px)";
    story_window.style.opacity = "0";
    setTimeout(function () {
        document.body.removeChild(story_window);
        story_window = null;
    }, 400);
}