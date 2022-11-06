let first_open = window.localStorage.getItem("first_open");
if (first_open) first_open = false;
else
{
    first_open = true;
    FirebasePlugin.logEvent("first_open", {content_type: "page_view", item_id: "first_time_tuto"});
}

if (first_open) {
    $(".tuto_app")[0].style.display = "block";
} else {
    $(".tuto_app")[0].style.display = "none";
}

let txt_1_positions = [43, 31, 28, 26, 25];
let txt_2_positions = [45, 45, 42, 40, 39];
let txt_3_positions = [49, 49, 49, 47, 46];
let txt_4_positions = [54, 54, 54, 54, 53];
let txt_5_positions = [60, 60, 60, 60, 60];
let txt_1_opacity = [1, 1, 1, 1, 1];
let txt_2_opacity = [0, 1, 1, 1, 1];
let txt_3_opacity = [0, 0, 1, 1, 1];
let txt_4_opacity = [0, 0, 0, 1, 1];
let txt_5_opacity = [0, 0, 0, 0, 1];

let txt_6_positions = [45, 45, 45, 42, 39, 39, 39, 39, 39, 39];
let txt_7_positions = [45, 45, 45, 49, 46, 46, 46, 46, 46, 46];
let txt_8_positions = [53, 53, 53, 53, 53, 53, 53, 53, 53, 53];
let txt_9_positions = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
let txt_10_positions = [75, 75, 75, 75, 75, 75, 75, 75, 75, 75];
let txt_11_positions = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
let txt_12_positions = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
let txt_13_positions = [75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75];
let txt_6_opacity = [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let txt_7_opacity = [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let txt_8_opacity = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let txt_9_opacity = [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let txt_10_opacity = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let txt_11_opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
let txt_12_opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1];
let txt_13_opacity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

let tuto_1_index = 0;
let tuto_2_index = 0;
let autoAnim;

function startTuto() {
    setTimeout(function () {
        $(".tuto_txt._1")[0].style.opacity = 1;
        autoAnim = setTimeout(function () {
            nextTutoFrame();
        }, 2000);
    }, 500);
}



function nextTutoFrame() {
    let delay = 2500;
    (tuto_1_index < 6) ? tuto_1_index++ : tuto_2_index++;
    if (tuto_1_index < 6) {
        $(".tuto_txt._1")[0].style.top = txt_1_positions[tuto_1_index] + "vh";
        $(".tuto_txt._2")[0].style.top = txt_2_positions[tuto_1_index] + "vh";
        $(".tuto_txt._3")[0].style.top = txt_3_positions[tuto_1_index] + "vh";
        $(".tuto_txt._4")[0].style.top = txt_4_positions[tuto_1_index] + "vh";
        $(".tuto_txt._5")[0].style.top = txt_5_positions[tuto_1_index] + "vh";

        $(".tuto_txt._1")[0].style.opacity = txt_1_opacity[tuto_1_index];
        $(".tuto_txt._2")[0].style.opacity = txt_2_opacity[tuto_1_index];
        $(".tuto_txt._3")[0].style.opacity = txt_3_opacity[tuto_1_index];
        $(".tuto_txt._4")[0].style.opacity = txt_4_opacity[tuto_1_index];
        $(".tuto_txt._5")[0].style.opacity = txt_5_opacity[tuto_1_index];
    } else {
        if (tuto_2_index == 1) {
            delay = 500;
        }
        if (tuto_2_index == 5) {
            delay = 500;
        }
        if (tuto_2_index == 6) {
            delay = 1000;
        }
        if (tuto_2_index == 7) {
            delay = 1500;
        }
        if (tuto_2_index == 8) {
            delay = 4000;
        }
        if (tuto_2_index == 9) {
            delay = 1000;
        }
        if (tuto_2_index == 10) {
            delay = 1500;
        }
        if (tuto_2_index == 11) {
            delay = 4500;
        }
        if (tuto_2_index == 12) {
            delay = 1000;
        }
        if (tuto_2_index == 12) {
            delay = 1000;
        }
        if (tuto_2_index == 13) {
            delay = 300;
        }
        if (tuto_2_index == 14) {
            delay = 1000;
        }
        if (tuto_2_index == 15) {
            delay = 1500;
        }
        if (tuto_2_index == 16) {
            delay = 2000;
        }
        $(".tuto_txt._6")[0].style.top = txt_6_positions[tuto_2_index] + "vh";
        $(".tuto_txt._7")[0].style.top = txt_7_positions[tuto_2_index] + "vh";
        $(".tuto_txt._8")[0].style.top = txt_8_positions[tuto_2_index] + "vh";
        $(".tuto_txt._9")[0].style.top = txt_9_positions[tuto_2_index] + "vh";
        $(".tuto_txt._10")[0].style.top = txt_10_positions[tuto_2_index] + "vh";
        $(".tuto_txt._11")[0].style.top = txt_11_positions[tuto_2_index] + "vh";
        $(".tuto_txt._12")[0].style.top = txt_12_positions[tuto_2_index] + "vh";
        $(".tuto_txt._13")[0].style.top = txt_13_positions[tuto_2_index] + "vh";

        $(".tuto_txt._6")[0].style.opacity = txt_6_opacity[tuto_2_index];
        $(".tuto_txt._7")[0].style.opacity = txt_7_opacity[tuto_2_index];
        $(".tuto_txt._8")[0].style.opacity = txt_8_opacity[tuto_2_index];
        $(".tuto_txt._9")[0].style.opacity = txt_9_opacity[tuto_2_index];
        $(".tuto_txt._10")[0].style.opacity = txt_10_opacity[tuto_2_index];
        $(".tuto_txt._11")[0].style.opacity = txt_11_opacity[tuto_2_index];
        $(".tuto_txt._12")[0].style.opacity = txt_12_opacity[tuto_2_index];
        $(".tuto_txt._13")[0].style.opacity = txt_13_opacity[tuto_2_index];

        if (tuto_2_index >= 7) {
            if (tuto_2_index == 9 || tuto_2_index == 12 || tuto_2_index == 13) {
                $(".screen_tuto")[0].style.opacity = 0;
                $(".tuto_record_btn")[0].style.opacity = 0;
            } else {
                $(".screen_tuto")[0].style.opacity = 1;
            }

            if (tuto_2_index < 9) {
                $(".tuto_record_btn")[0].style.opacity = 1;
            } else {
                $(".tuto_record_btn")[0].style.opacity = 0;
            }

            if (tuto_2_index == 10) {
                $(".screen_tuto")[0].style.backgroundImage = 'url("src/pictures/tuto/story_screen.png")';
                $(".screen_tuto")[0].style.opacity = 1;
                $(".tuto_story_btn")[0].style.opacity = 1;
                $(".tuto_story_btn")[0].style.animationName = "fade";
            }

            if (tuto_2_index == 12) {
                $(".tuto_story_btn")[0].style.animationName = "none";
                setTimeout(function () {
                    $(".tuto_story_btn")[0].style.opacity = 0;
                }, 100);
            }

            if (tuto_2_index == 13) {
                $(".screen_tuto")[0].style.backgroundImage = 'url("src/pictures/tuto/follow_screen.png")';
            }

            if (tuto_2_index == 16) {
                $(".screen_tuto")[0].style.backgroundImage = 'url("src/pictures/tuto/following_screen.png")';
            }
            if (tuto_2_index == 18) {
                $(".tuto_next_btn_shadow")[0].style.opacity = 1;
                $(".tuto_next_btn")[0].innerHTML = `${language_mapping[device_language]['c_parti']}`;
                $(".tuto_next_btn")[0].style.opacity = 1;
                $(".tuto_next_btn")[0].style.pointerEvents = "auto";
            }

            if (tuto_2_index == 19) {
                $(".tuto_app")[0].style.transform = "translate3d(0, calc(100 * var(--custom-vh)), 0)";
                $(".tuto_app")[0].style.pointerEvents = "none";
                window.localStorage.setItem("first_open", "false");
                let custom_vh = window.innerHeight / 100;
                window.localStorage.setItem("custom_vh", custom_vh);
                document.documentElement.style.setProperty("--custom-vh", custom_vh + "px");

                setTimeout(function () {
                    $(".tuto_app")[0].style.display = "none";
                }, 1000);
            }
        }
    }
    if (tuto_1_index == 5 && tuto_2_index == 0) {
        $(".tuto_next_btn_shadow")[0].style.opacity = 1;
        $(".tuto_next_btn")[0].style.opacity = 1;
        $(".tuto_next_btn")[0].style.pointerEvents = "auto";
    } else if (tuto_2_index < 18) {
        $(".tuto_next_btn_shadow")[0].style.opacity = 0;
        $(".tuto_next_btn")[0].style.opacity = 0;
        $(".tuto_next_btn")[0].style.pointerEvents = "none";
    }

    if (tuto_1_index == 6 && tuto_2_index == 0) {
        $(".tuto_txt._1")[0].style.opacity = 0;
        $(".tuto_txt._2")[0].style.opacity = 0;
        $(".tuto_txt._3")[0].style.opacity = 0;
        $(".tuto_txt._4")[0].style.opacity = 0;
        $(".tuto_txt._5")[0].style.opacity = 0;
    }
    clearTimeout(autoAnim);
    if (tuto_1_index != 5 && tuto_2_index != 18) {
        autoAnim = setTimeout(function () {
            nextTutoFrame();
        }, delay);
    }
}

function skip() {
    if (tuto_1_index != 5 && tuto_2_index != 18) {
        nextTutoFrame();
    }
}
