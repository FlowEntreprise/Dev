function Popup(identifier, show, height) {
    let popup = document.getElementById(identifier);
    if (!height) height = 0;
    if (show) {
        popup.style.pointerEvents = "auto";
        popup.children[0].style.opacity = "1";
        popup.children[1].style.transform = "translate3d(0px, calc(" + height + "* var(--custom-vh)), 0px)";
        popup.children[1].style.height = "calc((100 - height) * var(--custom-vh));";
        var event = new CustomEvent('opened');
        popup.dispatchEvent(event);
    } else {
        popup.style.pointerEvents = "none";
        popup.children[0].style.opacity = "0";
        popup.children[1].style.transform = "translate3d(0px, calc(100* var(--custom-vh)), 0px)";

        var event = new CustomEvent('closed');
        popup.dispatchEvent(event);
    }
}

$(".popup_bg").each(function () {
    this.addEventListener("click", function () {
        Popup(this.parentElement.id, false);
    });
});

