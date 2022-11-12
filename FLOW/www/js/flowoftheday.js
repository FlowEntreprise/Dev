var FDJ_setup = false;
var canPlayFDJParticles = false;
var FDJplaying = false;
var FDJParticles_seed = 0;
var gettingRandomFlow = false;
var showingFDJ = true;
var followingFDJ = false;
var youAreFDJ = false;
var randomExcluded = [];
var rank_tables = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 5,
    8: 5,
    9: 5,
    10: 6,
    11: 6,
    12: 6,
    13: 6,
    14: 6,
    15: 7,
    16: 7,
    17: 7,
    18: 7,
    19: 7,
    20: 8
}

// var countdownFDJ;

function setupFDJ() {
    if (!FDJ_setup) {
        initFDJParticles();

        $(".fdj_follow").on("click", function () {
            if (showingFDJ) {
                $(".fdj_follow").toggleClass("followed");
                followingFDJ = !followingFDJ;
                if (followingFDJ) {
                    if (!$(".fdj_follow").hasClass("followed")) $(".fdj_follow").addClass("followed");
                    $(".fdj_follow")[0].innerHTML = "ABONNÉ";
                } else {
                    if ($(".fdj_follow").hasClass("followed")) $(".fdj_follow").removeClass("followed");
                    $(".fdj_follow")[0].innerHTML = "S'ABONNER";
                }

                let data_user = {
                    PrivateId: block_user_fdj.PrivateId,
                    type: "block_user_follow",
                    block_user: block_user_fdj
                };
                ServerManager.ActionFollow(data_user, function (response, data) {
                    ServerManager.GetFDJ();
                    RefreshTL();
                });

            } else {
                showingFDJ = true;
                ServerManager.GetFDJ();
            }
        });
        FDJ_setup = true;
    } else {
        showingFDJ = true;
        ServerManager.GetFDJ();
    }
}

function initFDJParticles() {
    var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;
    NUM_CONFETTI = 100;
    COLORS = [
        [207, 164, 65],
        [232, 182, 67],
        [184, 184, 184],
        [173, 170, 163],
        [235, 70, 106],
    ];
    PI_2 = 2 * Math.PI;
    canvas = $(".fdj_canvas")[0];
    context = canvas.getContext("2d");
    window.w = 0;
    window.h = 0;
    resizeWindow = function () {
        window.w = canvas.width = window.innerWidth;
        return window.h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeWindow, false);
    setTimeout(resizeWindow, 0);

    range = function (a, b) {
        return (b - a) * Math.random() + a;
    };
    drawCircle = function (x, y, r, style) {
        context.beginPath();
        context.arc(x, y, r, 0, PI_2, false);
        context.fillStyle = style;
        return context.fill();
    };
    xpos = 0.5;
    Confetti = class Confetti {
        constructor() {
            this.style = COLORS[~~range(0, 5)];
            this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
            this.r = ~~range(2, 6);
            this.r2 = 2 * this.r;
            this.replace();
        }

        replace() {
            this.opacity = 0;
            this.dop = 0.03 * range(1, 4);
            this.x = range(-this.r2, w - this.r2);
            this.y = range(-20, h - this.r2);
            this.xmax = w - this.r;
            this.ymax = h - this.r;
            this.vx = range(0, 2) + 8 * xpos - 5;
            return this.vy = 0.7 * this.r + range(-1, 1);
        }

        draw() {
            var ref;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.dop;
            if (this.opacity > 1) {
                this.opacity = 1;
                this.dop *= -1;
            }
            if (this.opacity < 0 || this.y > this.ymax) {
                this.replace();
            }
            if (!(0 < (ref = this.x) && ref < this.xmax)) {
                this.x = (this.x + this.xmax) % this.xmax;
            }
            return drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`);
        }
    };
    confetti = function () {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            results.push(new Confetti());
        }
        return results;
    }();
    window.step = function () {
        if (canPlayFDJParticles) {
            FDJplaying = true;
            var c, j, len, results;
            requestAnimationFrame(step);
            context.clearRect(0, 0, w, h);
            results = [];
            for (j = 0, len = confetti.length; j < len; j++) {
                c = confetti[j];
                results.push(c.draw());
            }
            return results;
        }
    };

}

var block_user_fdj = {};

function startFDJParticles() {
    FDJParticles_seed += 1;
    $(".fdj_canvas")[0].style.opacity = 1;
    canPlayFDJParticles = true;
    if (!FDJplaying && window.step) {
        window.step();
    }
}

function stopFDJParticles() {
    setTimeout(function () {
        if (tmp_seed == FDJParticles_seed) {
            canPlayFDJParticles = false;
            FDJplaying = false;
        }
    }, 1200);
    let tmp_seed = FDJParticles_seed;
    $(".fdj_canvas")[0].style.opacity = 0;
}


function showRandomFlow(data, discover) {
    console.log(data);
    if (discover) showRandomDiscover(data);
    if (!showingFDJ) {
        if (!data.Data) {
            gettingRandomFlow = false;
            $(".random_flow_btn").toggleClass("searching");
            window.localStorage.removeItem("random_excluded");
            console.log("tu as fais le tour de tous les flows de l'app");
            GetRandomFlow();
            return false
        }
        stopAllBlocksAudio();
        let flow = data.Data[0];
        let container = $(".list-block-flowoftheday");
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
        console.log(container);
        console.log(flow);

        setTimeout(function () {
            if (!showingFDJ) {
                gettingRandomFlow = false;
                $(".random_flow_btn").toggleClass("searching");
                $(".list-block-flowoftheday")[0].innerHTML = "";
                $(".fdj_txt")[0].style.opacity = 1;
                $(".fdj_txt")[0].innerHTML = "Flow aléatoire trouvé !";
                var new_block = new block(block_params);
                new_block.block_flow.style.marginTop = "1vw";
                all_blocks.push(new_block);
            }
        }, getRandomInt(800, 2300));
        let tmp_random_excluded = window.localStorage.getItem("random_excluded");
        if (!tmp_random_excluded) tmp_random_excluded = "";
        window.localStorage.setItem("random_excluded", tmp_random_excluded + flow.ObjectId + ",");

        // check random_excluded limit to 100 objectId
        let random_excluded_array = window.localStorage.getItem("random_excluded").split(",");
        if (random_excluded_array.length > 100) {
            random_excluded_array.shift();
            let random_excluded_string = random_excluded_array.join(",");
            window.localStorage.setItem("random_excluded", random_excluded_string);
        }
    }
}

function showFDJ(data) {
    let flow = data.Data;
    let container = $(".list-block-flowoftheday");
    container[0].innerHTML = "";
    let pattern_key = "";
    block_user_fdj.RegisterId = flow.RegisterId;
    block_user_fdj.LastOs = flow.LastOs;
    block_user_fdj.PrivateId = flow.PrivateId;
    if (flow.Background.PatternKey) pattern_key = flow.Background.PatternKey;
    stopAllBlocksAudio();
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
        LastOs: flow.LastOs,
        Views: flow.Views,
        Responses: flow.Responses,
    };

    var new_block = new block(block_params);
    new_block.block_flow.style.marginTop = "1vw";
    all_blocks.push(new_block);

    $(".fdj_pp")[0].style.backgroundImage = "url(" + flow.ProfilePicture + ")";
    $(".fdj_pp").on("click", function () {
        let data_go_to_account = {
            private_Id: flow.PrivateId,
            user_private_Id: window.localStorage.getItem("user_private_id"),
        };
        go_to_account(data_go_to_account);
    })
    let pseudo = flow.FullName;
    if (flow.PrivateId == window.localStorage.getItem("user_private_id")) { // MODIFIE POUR TEST remettre "==" et pas "!="
        youAreFDJ = true;
        pseudo = "Vous";
    } else {
        youAreFDJ = false;
    }
    $(".fdj_title")[0].innerHTML = pseudo + ` ${language_mapping[device_language]['elu_fdj']}`;


    if (flow.YouFollowHim == "1") followingFDJ = true;
    else followingFDJ = false;

    showingFDJ = true;
    gettingRandomFlow = false;
    $(".fdj_crown")[0].style.opacity = 1;
    $(".random_flow_btn").removeClass("searching");
    $(".fdj_txt")[0].style.opacity = 0;
    $(".fdj_txt")[0].innerHTML = `${language_mapping[device_language]['fdj_txt']}`;
    $(".fdj_pp").removeClass("reduced");
    $(".fdj_title").removeClass("reduced");
    $(".fdj_timer").removeClass("reduced");
    $(".fdj_follow").removeClass("reduced");
    $(".empty_flow")[0].style.boxShadow = "0px 0px 0px 3px #CFA441";

    if (!youAreFDJ) {
        if ($(".fdj_follow").hasClass("rank")) $(".fdj_follow").removeClass("rank");
        if (followingFDJ) {
            if (!$(".fdj_follow").hasClass("followed")) $(".fdj_follow").addClass("followed");
            $(".fdj_follow")[0].innerHTML = "ABONNÉ";
        } else {
            if ($(".fdj_follow").hasClass("followed")) $(".fdj_follow").removeClass("followed");
            $(".fdj_follow")[0].innerHTML = `${language_mapping[device_language]['fdj_follow']}`;
        }
    } else {
        let rank = parseInt(flow.NbFlowsOfTheDay);
        if (rank >= 20) rank = 8;
        else rank = rank_tables[rank];

        console.log(rank);
        let crown_colors = ["#9E7D6D", "#7b8a9d", "#CFA441", "#CFA441", "#CFA441", "#c82e21", "#16dc81", "#41dde4"];
        let crown_color = crown_colors[rank - 1];
        document.documentElement.style.setProperty("--crown_color", crown_color);

        if ($(".fdj_follow").hasClass("followed")) $(".fdj_follow").removeClass("followed");
        if (!$(".fdj_follow").hasClass("rank")) $(".fdj_follow").addClass("rank");
        $(".fdj_follow")[0].innerHTML = "";
        let parent = document.createElement("div");
        parent.className = "fdj_rank_parent"
        let txt = document.createElement("span");
        txt.innerHTML = "RANG ACTUEL : " + flow.NbFlowsOfTheDay;
        parent.appendChild(txt);
        let img = document.createElement("img");
        img.src = "./src/icons/crown" + rank + ".png";
        parent.appendChild(img);
        $(".fdj_follow")[0].appendChild(parent);
        startFDJParticles();
        setTimeout(function () {
            stopFDJParticles();
        }, 5000);
    }
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let endtime = new Date(today.setHours(18, 0, 0, 0));
    if (Date.parse(endtime) - Date.parse(today) <= 0) endtime = new Date(tomorrow.setHours(18, 0, 0, 0));
    $(".fdj_timer")[0].innerHTML = getTimeRemaining(endtime);
    // if (countdownFDJ) {
    //     clearInterval(countdownFDJ);
    // }
    // countdownFDJ = setInterval(function () {
    //     let today = new Date();
    //     let tomorrow = new Date(today);
    //     tomorrow.setDate(tomorrow.getDate() + 1);

    //     let endtime = new Date(today.setHours(12, 13, 0, 0));
    //     if (Date.parse(endtime) - Date.parse(today) <= 0) endtime = new Date(tomorrow.setHours(12, 13, 0, 0));
    //     $(".fdj_timer")[0].innerHTML = getTimeRemaining(endtime);
    // }, 1000);
}

function GetRandomFlow() {
    if (!gettingRandomFlow) {
        gettingRandomFlow = true;
        showingFDJ = false;
        $(".random_flow_btn").toggleClass("searching");
        $(".list-block-flowoftheday")[0].innerHTML = "";
        $(".empty_flow")[0].style.boxShadow = "none";
        $(".fdj_crown")[0].style.opacity = 0;
        if ($(".fdj_follow").hasClass("rank")) $(".fdj_follow").removeClass("rank");
        if (!$(".fdj_pp").hasClass("reduced")) $(".fdj_pp").addClass("reduced");
        if (!$(".fdj_title").hasClass("reduced")) $(".fdj_title").addClass("reduced");
        if (!$(".fdj_timer").hasClass("reduced")) $(".fdj_timer").addClass("reduced");
        if (!$(".fdj_follow").hasClass("reduced")) $(".fdj_follow").addClass("reduced");
        $(".fdj_follow")[0].innerHTML = "VOIR LE FLOW";
        $(".fdj_txt")[0].style.opacity = 0.5;
        $(".fdj_txt")[0].innerHTML = `${language_mapping[device_language]['fdj_txt']}`;
        let tmp_random_excluded = window.localStorage.getItem("random_excluded");
        if (!tmp_random_excluded) randomExcluded = [];
        else randomExcluded = tmp_random_excluded.split(",");
        ServerManager.GetRandomFlow(randomExcluded, false);
        stopAllBlocksAudio();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    let result = "";
    if (hours > 0) result = `${language_mapping[device_language]['fdj_nxt_election']} ` + (hours + 1) + ` ${language_mapping[device_language]['heure']}s.`;
    // else if (hours == 1) result = `${language_mapping[device_language]['fdj_nxt_election']}` + hours + " heure.";
    else if (minutes > 0) result = `${language_mapping[device_language]['fdj_nxt_election']} ` + (minutes + 1) + ` ${language_mapping[device_language]['minute']}s.`;
    else if (seconds > 1) result = `${language_mapping[device_language]['fdj_nxt_election']} ` + seconds + ` ${language_mapping[device_language]['seconde']}s.`;
    else if (seconds == 1) result = `${language_mapping[device_language]['fdj_nxt_election']} ` + seconds + ` ${language_mapping[device_language]['heure']}.`;
    else result = `${language_mapping[device_language]['refresh_fdj']}`;

    return result;
    // return {
    //     total,
    //     days,
    //     hours,
    //     minutes,
    //     seconds
    // };
}
