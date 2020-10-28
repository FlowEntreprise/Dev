var canPlayFDJParticles = false;
var FDJplaying = false;
var FDJParticles_seed = 0;
var gettingRandomFlow = false;
var showingFDJ = true;

var randomExcluded = [];

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

    $(".fdj_follow").on("click", function () {
        if (showingFDJ) {
            console.log("follow the person");
        } else {
            showingFDJ = true;
            ServerManager.GetFDJ();
        }
    });
}

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


function showRandomFlow(data) {
    if (!showingFDJ) {
        let flow = data.Data;
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
                all_blocks.push(new_block);
            }
        }, getRandomInt(800, 2300));

    }
}

function showFDJ(data) {
    let flow = data.Data;
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

    var new_block = new block(block_params);
    all_blocks.push(new_block);

    showingFDJ = true;
    gettingRandomFlow = false;
    $(".random_flow_btn").removeClass("searching");
    $(".fdj_txt")[0].style.opacity = 0;
    $(".fdj_txt")[0].innerHTML = "Recherche dans la bibliothèque de flows...";
    $(".fdj_pp").removeClass("reduced");
    $(".fdj_title").removeClass("reduced");
    $(".fdj_timer").removeClass("reduced");
    $(".fdj_follow").removeClass("reduced");
    $(".fdj_follow")[0].innerHTML = "S'ABONNER";
    $(".empty_flow")[0].style.boxShadow = "0px 0px 0px 3px #CFA441";
    startFDJParticles();
    setTimeout(function () {
        stopFDJParticles();
    }, 5000);
}

function GetRandomFlow() {
    if (!gettingRandomFlow) {
        gettingRandomFlow = true;
        showingFDJ = false;
        $(".random_flow_btn").toggleClass("searching");
        $(".list-block-flowoftheday")[0].innerHTML = "";
        $(".empty_flow")[0].style.boxShadow = "none";
        $(".fdj_crown")[0].style.opacity = 0;
        if (!$(".fdj_pp").hasClass("reduced")) $(".fdj_pp").addClass("reduced");
        if (!$(".fdj_title").hasClass("reduced")) $(".fdj_title").addClass("reduced");
        if (!$(".fdj_timer").hasClass("reduced")) $(".fdj_timer").addClass("reduced");
        if (!$(".fdj_follow").hasClass("reduced")) $(".fdj_follow").addClass("reduced");
        $(".fdj_follow")[0].innerHTML = "VOIR LE FLOW";
        $(".fdj_txt")[0].style.opacity = 0.5;
        $(".fdj_txt")[0].innerHTML = "Recherche dans la bibliothèque de flows...";
        ServerManager.GetRandomFlow(randomExcluded);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}