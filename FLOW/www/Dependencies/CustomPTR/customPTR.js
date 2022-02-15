const pStart = {
    x: 0,
    y: 0
};
const pCurrent = {
    x: 0,
    y: 0
};
// const cards = document.querySelectorAll(".card");
// const main = document.querySelector("body > div");
// var ptr_parent = document.querySelector(".home_parent");

// let ptr_options = {};
let isLoading = false;

function loading(ptr_options) {
    ptr_options.ptr_parent.style.transition = "transform 0.5s";
    isLoading = true;
    ptr_options.ptr_parent.style.transform = "translate3d(0, 100px, 0)";
    ptr_options.ptr_loading.style.opacity = 1;
    ptr_options.ptr_loading.style.backgroundColor = "rgba(0, 255, 120, 0.5)";
    ptr_options.ptr_loading.classList.add("active");
    ptr_options.callback();
    // setTimeout(() => {
    //     ptrStop();
    // }, 2000);
}

function ptrStop(ptr_options) {
    ptr_options.ptr_parent.style.transform = "translate3d(0, 0, 0)";
    isLoading = false;
    ptr_options.ptr_loading.style.backgroundColor = "";
    ptr_options.ptr_loading.style.opacity = 0;
    ptr_options.ptr_loading.classList.remove("active");
}

function swipeStart(e, ptr_options) {
    console.log("swipe_start", ptr_options);
    if (typeof e["targetTouches"] !== "undefined") {
        let touch = e.targetTouches[0];
        pStart.x = touch.screenX;
        pStart.y = touch.screenY;
    } else {
        pStart.x = e.screenX;
        pStart.y = e.screenY;
    }
}

function swipeEnd(e, ptr_options) {
    if (ptr_options.ptr_parent.scrollTop === 0 && !isLoading) {
        ptr_options.ptr_parent.style.transition = "transform 0.5s";
        ptr_options.ptr_parent.style.transform = "translate3d(0, 0, 0)";
        ptr_options.ptr_loading.style.opacity = 0;
    }
}

function swipe(e, ptr_options) {
    if (typeof e["changedTouches"] !== "undefined") {
        let touch = e.changedTouches[0];
        pCurrent.x = touch.screenX;
        pCurrent.y = touch.screenY;
    } else {
        pCurrent.x = e.screenX;
        pCurrent.y = e.screenY;
    }
    let changeY = pStart.y < pCurrent.y ? Math.abs(pStart.y - pCurrent.y) : 0;
    // const rotation = changeY < 100 ? changeY * 30 / 100 : 30;
    if (ptr_options.ptr_parent.scrollTop <= 0 && !isLoading && canRegisterPTR) {
        ptr_options.ptr_parent.style.transition = "none";
        if (changeY >= 100) loading(ptr_options);
        else {
            ptr_options.ptr_loading.classList.remove("active");
            ptr_options.ptr_loading.style.opacity = 1;
            ptr_options.ptr_parent.style.transform = "translate3d(0, " + changeY + "px, 0)";
        }
    } else if (!isLoading) {
        ptr_options.ptr_loading.classList.remove("active");
        ptr_options.ptr_loading.style.opacity = 0;
        ptr_options.ptr_parent.style.transform = "translate3d(0, 0, 0)";
    }
}

// document.addEventListener("touchstart", e => swipeStart(e), false);
// document.addEventListener("touchmove", e => swipe(e), false);
// document.addEventListener("touchend", e => swipeEnd(e), false);

function setupPTR(element, callback) {
    console.log(element);
    let ptr_options = {};
    ptr_options.ptr_parent = element;
    ptr_options.ptr_loading = element.querySelector(".ptr_loading");
    ptr_options.callback = callback;
    ptr_options.Stop = function () {
        ptrStop(this);
    }

    ptr_options.ptr_parent.addEventListener("touchstart", e => swipeStart(e, ptr_options), false);
    ptr_options.ptr_parent.addEventListener("touchmove", e => swipe(e, ptr_options), false);
    ptr_options.ptr_parent.addEventListener("touchend", e => swipeEnd(e, ptr_options), false);

    return ptr_options;
    // ptr_parent = element;
    // ptr_loading = element.querySelector(".ptr_loading");
}