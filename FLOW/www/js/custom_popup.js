/**
 * @param {string} identifier - html popup element id.
 * @param {boolean} show - show or hide popup (true or false).
 * @param {number} [height] - popup offset if not fullscreen (currently only for vertical animations).
 */
function Popup(identifier, show, height = 0) {
    let popup = document.getElementById(identifier);
    let animation_direction = popup.children[1].getAttribute("animation-direction");
    if (show) {
        popup.setAttribute("height", height);
        popup.style.pointerEvents = "auto";
        popup.children[0].style.opacity = "1";
        popup.children[0].children[0].style.display = "block";
        switch (animation_direction) {
            case "left":
            case "right":
            case "up":
                popup.children[1].style.transform = "translate3d(0px, calc(" + height + "* var(--custom-vh)), 0px)";
                break;

            case "down":
                popup.children[1].style.transform = "translate3d(0px, 0px, 0px)";
                break;
        }
        popup.children[1].style.height = "calc((100 - " + height + ") * var(--custom-vh))";
        var event = new CustomEvent('opened');
        popup.dispatchEvent(event);
    } else {
        height = popup.getAttribute("height");
        popup.style.pointerEvents = "none";
        popup.children[0].style.opacity = "0";
        popup.children[0].children[0].style.display = "none";
        switch (animation_direction) {
            case "left":
                popup.children[1].style.transform = "translate3d(100vw, 0px, 0px)";
                break;
            case "right":
                popup.children[1].style.transform = "translate3d(-100vw, 0px, 0px)";
                break;
            case "up":
                popup.children[1].style.transform = "translate3d(0px, calc(100* var(--custom-vh)), 0px)";
                break;

            case "down":
                popup.children[1].style.transform = "translate3d(0px, calc(-" + (100 - height) + "* var(--custom-vh)), 0px)";
                break;
        }
        var event = new CustomEvent('closed');
        popup.dispatchEvent(event);
    }
}

$(".popup_bg").each(function () {
    this.addEventListener("click", function () {
        Popup(this.parentElement.id, false);
    });
});