"use_strict";

var block_id = 0;
var audio_playing = false;
var CanRefreshCommentList = true;
var CommentListCurrentIndex = 0;
/*********** BLOCK PARAMS *************
 * var block_params = {
    parent_element: undefined,
    afterblock: undefined,
    audioURL: undefined,
    duration: undefined,
    patternKey: undefined,
    imageURL: undefined,
    title: undefined,
    description: undefined,
    pseudo: undefined,
    account_imageURL: undefined,
    Islike,
    Iscomment
  };
 ****************************************/
function block(params) {
    //console.log("NEW BLOCK CREATED");
    var block = this;
    this.ObjectId = params.ObjectId;
    this.all_comment_blocks = [];
    this.isPlaying = false;
    this.seeking = false;
    this.wasPlaying = false;
    this.patternKey;
    this.duration = params.fake_duration;
    this.privateID = params.PrivateId;
    this.Time = params.Times;
    this.block_id = block_id;
    this.currentTime = 0;
    this.IsLike = params.IsLike;
    this.IsComment = params.IsComment;
    this.Likes = params.Likes;
    this.RegisterId = params.RegisterId;
    this.LastOs = params.LastOs;
    this.Comments = params.Comments;
    this.ready = false;
    this.last_like_time;
    this.offset_indicator = 0;
    params.fake_duration = 89;

    this.flowplay = function () {
        if (this.ready) {
            // if (window.cordova.platformId == "ios") {
            //     cordova.plugins.backgroundMode.enable();
            // }
            block.fplay_button.style.display = "none";
            block.fpause_button.style.display = "block";
            wave.start();
            waveform.style.display = "block";
            block.myaudio.play();
            audio_playing = true;
            console.log(params.fake_duration);
            console.log(block.currentTime);
            block.progress_div.style.transitionDuration = params.fake_duration - block.currentTime + "s";
            block.progress_div.style.display = 'block';
            // block.progress_div.style.borderTopRightRadius = '0vw';
            block.progress_div.style.width = "100%";
            block.isPlaying = true;
            block.myRange.style.pointerEvents = "all";
        } else {
            console.log("audio not ready");
        }
    };

    this.flowpause = function () {
        if (this.ready) {
            // if (window.cordova.platformId == "ios") {
            //     cordova.plugins.backgroundMode.disable();
            // }
            console.log("pause (" + block.offset_indicator + ")");
            block.fplay_button.style.display = "block";
            block.fpause_button.style.display = "none";
            waveform.style.display = "none";
            wave.stop();
            block.isPlaying = false;
            audio_playing = false;
            block.myRange.style.pointerEvents = "none";
            block.progress_div.style.transitionDuration = "0s";
            block.myaudio.getCurrentPosition(function (position) {
                block.myaudio.pause();
                if (position == -1) position = 0;
                if (block.currentTime == -1) block.currentTime = 0;
                console.log("pause : " + position);
                console.log(block.currentTime);
                console.log("-->" + (position - block.currentTime));
                let width = (position + block.offset_indicator) * 100 / params.fake_duration;
                block.progress_div.style.width = width + '%';
                block.currentTime = position;
                // block.offset_indicator = 0;
                // block.myaudio.seekTo(block.currentTime * 1000);
            }, function (err) {
                console.log(err)
            });
        }
    };

    this.duration = document.createElement("div");
    this.duration.id = "duration";

    this.block_flow = document.createElement("div");
    this.block_flow.className = "fflow";
    this.block_flow.setAttribute("block_id", this.block_id);
    block_id++;
    if (params.LikeBy || params.CommentBy) {
        let indicator_txt = "";
        let indicator_icon = "";
        if (params.LikeBy != null) {
            params.LikeBy = params.LikeBy.replace(/[\[\]']+/g, "");
            indicator_txt = params.LikeBy + " a aimé ceci";
            indicator_icon =
                "<img class='tl_indicator_icon' src='./src/icons/Like.png' width='15vw' height='30vw' align='middle'>";
        }
        if (params.CommentBy != null) {
            params.CommentBy = params.CommentBy.replace(/[\[\]']+/g, "");
            indicator_txt = params.CommentBy + " a commenté ceci";
            indicator_icon =
                "<img class='tl_indicator_icon' src='./src/icons/Comment.png' width='15vw' height='30vw' align='middle'>";
        }
        let tl_indicator = document.createElement("p");
        tl_indicator.className = "tl_indicator";
        tl_indicator.innerHTML = indicator_icon + indicator_txt;
        // this.block_flow.style.marginTop = "12vw";
        this.block_flow.appendChild(tl_indicator);
    }
    this.block_flow.style.marginTop = "12vw";
    params.parent_element.append(this.block_flow);

    this.ftop_part = document.createElement("div");
    this.ftop_part.className = "ftop_part";

    if (params.patternKey != undefined && params.patternKey.length > 0) {
        this.patternKey = params.patternKey;
        this.ftop_part.style.backgroundImage = pattern = GeoPattern.generate(
            this.patternKey
        ).toDataUrl();
    } else if (params.imageURL != undefined) {
        this.ftop_part.style.backgroundImage = "url('" + params.imageURL + "')";
    } else {
        this.patternKey = Date.now().toString();
        this.ftop_part.style.backgroundImage = pattern = GeoPattern.generate(
            this.patternKey
        ).toDataUrl();
    }
    this.block_flow.appendChild(this.ftop_part);

    this.myRange = document.createElement("input");
    this.myRange.type = "range";
    this.myRange.className = "fslider";
    this.myRange.min = "1";
    this.myRange.max = "100";
    this.myRange.value = "1";
    this.ftop_part.appendChild(this.myRange);

    this.floading_flow = document.createElement("img");
    this.floading_flow.className = "floading_flow";
    this.floading_flow.src = "src/icons/loading_circle.gif";
    this.ftop_part.appendChild(this.floading_flow);

    this.fplay_button = document.createElement("img");
    this.fplay_button.className = "fplay_button";
    this.fplay_button.id = "playBtn";
    this.fplay_button.src = "src/icons/play.png";
    this.ftop_part.appendChild(this.fplay_button);

    this.fpause_button = document.createElement("img");
    this.fpause_button.className = "fpause_button";
    this.fpause_button.id = "pauseBtn";
    this.fpause_button.src = "src/icons/pause.png";
    this.ftop_part.appendChild(this.fpause_button);

    this.fposter_photo = document.createElement("a");
    // this.fposter_photo.setAttribute('href', '../www/pages/account.html');
    // this.fposter_photo.setAttribute("onclick", "Popup('popup-account', true)");
    this.fposter_photo.className = "fposter_photo";
    this.fposter_photo.style.backgroundImage =
        "url('" + params.account_imageURL + "')";
    this.ftop_part.appendChild(this.fposter_photo);

    var waveform = document.createElement("div");
    waveform.id = "waveform";
    waveform.style.display = "none";
    this.ftop_part.appendChild(waveform);

    this.bar = document.createElement("div");
    this.bar.id = "bar";
    this.ftop_part.appendChild(this.bar);

    this.progress_div = document.createElement("div");
    this.progress_div.id = "progress_div";
    this.ftop_part.appendChild(this.progress_div);

    this.fposter_name = document.createElement("p");
    this.fposter_name.className = "fposter_name";
    this.fposter_name.innerText = params.pseudo;
    this.ftop_part.appendChild(this.fposter_name);

    this.fbottom_part = document.createElement("div");
    this.fbottom_part.className = "fbottom_part";
    this.block_flow.appendChild(this.fbottom_part);

    this.title_enter = function (e) {
        if (e.keyCode == 13) {
            block.finput_description.focus();
        }
    };

    if (!params.afterblock) {
        this.fpost_date = document.createElement("p");
        this.fpost_date.className = "fpost_date";
        this.fpost_date.innerText = set_timestamp(this.Time);
        this.ftop_part.appendChild(this.fpost_date);

        this.fdots = document.createElement("label");
        this.fdots.className = "fdots";
        this.fdots.innerText = "...";
        this.ftop_part.appendChild(this.fdots);

        // this.fpost_title = document.createElement('p');
        // this.fpost_title.className = 'fpost_title';
        // this.fpost_title.innerText = params.title;
        // this.fpost_title.setAttribute('maxlength', 20);
        // this.fbottom_part.appendChild(this.fpost_title);

        this.fpost_description = document.createElement("div");
        this.fpost_description.className = "fpost_description";
        this.fpost_description.innerHTML = params.description;
        this.fbottom_part.appendChild(this.fpost_description);

        this.fpost_tag = document.createElement("p");
        this.fpost_tag.className = "fpost_tag";
        this.fpost_tag.innerText = "";
        this.fbottom_part.appendChild(this.fpost_tag);

        this.flike = document.createElement("div");
        this.flike.className = "flike";
        this.fbottom_part.appendChild(this.flike);
        this.fimg_impression_like = document.createElement("img");
        this.fimg_impression_like.className = "fimg_impression";
        this.fimg_impression_like.src =
            this.IsLike == 1 ? "src/icons/Like_filled.png" : "src/icons/Like.png";
        this.flike.appendChild(this.fimg_impression_like);
        this.ftxt_impression_like = document.createElement("p");
        this.ftxt_impression_like.className = "ftxt_impression";
        this.ftxt_impression_like.innerText = affichage_nombre(this.Likes, 1);
        this.flike.appendChild(this.ftxt_impression_like);

        // this.fecho = document.createElement('div');
        // this.fecho.className = 'fecho';
        // this.fbottom_part.appendChild(this.fecho);
        // this.fimg_impression_echo = document.createElement('img');
        // this.fimg_impression_echo.className = 'fimg_impression';
        // this.fimg_impression_echo.src = 'src/icons/Echo.png';
        // this.fecho.appendChild(this.fimg_impression_echo);
        // this.ftxt_impression_echo = document.createElement('p');
        // this.ftxt_impression_echo.className = 'ftxt_impression';
        // this.ftxt_impression_echo.innerText = '8.2k';
        // this.fecho.appendChild(this.ftxt_impression_echo);

        this.fcomment = document.createElement("div");
        this.fcomment.className = "fcomment";
        this.fbottom_part.appendChild(this.fcomment);
        this.fimg_impression_comment = document.createElement("img");
        this.fimg_impression_comment.className = "fimg_impression";
        this.fimg_impression_comment.src =
            this.IsComment == 1 ?
            "src/icons/Comment_filled.png" :
            "src/icons/Comment.png";
        this.fcomment.appendChild(this.fimg_impression_comment);
        this.ftxt_impression_comment = document.createElement("p");
        this.ftxt_impression_comment.className = "ftxt_impression";
        this.ftxt_impression_comment.innerText = affichage_nombre(this.Comments, 1);
        this.fcomment.appendChild(this.ftxt_impression_comment);

        this.ftxt_impression_like.addEventListener("touchend", function () {
            Popup("popup-likes", true, 40);
            current_flow_block = block;
            display_all_likes(current_flow_block);
        });
    } else {
        // this.finput_title = document.createElement('input');
        // this.finput_title.className = 'finput_title';
        // this.finput_title.placeholder = 'Tap to edit title';
        // this.finput_title.maxLength = "25";
        // this.finput_title.onkeypress = this.title_enter;
        // this.fbottom_part.appendChild(this.finput_title);

        this.finput_description = document.createElement("textarea");
        this.finput_description.className = "finput_description";
        this.finput_description.placeholder = "Touche pour ajouter une description";
        this.finput_description.maxLength = "80";
        this.fbottom_part.appendChild(this.finput_description);
    }

    this.randomColorGradient = function () {
        let color_start = "#000000".replace(/0/g, function () {
            return (~~(Math.random() * 16)).toString(16);
        });
        let color_end = pSBC(-0.8, color_start);
        let lineargradientcss =
            "linear-gradient(to bottom," + color_start + "," + color_end + ")";
        this.ftop_part.style.backgroundImage = lineargradientcss;
        last_story_color = color_start;
    };

    if (params.storyAfterBlock) {
        this.fbottom_part.style.display = "none";
        this.ftop_part.style.height = "100%";
        this.ftop_part.style.borderRadius = "2vw";

        this.fplay_button.style.top = "22vh";
        this.fplay_button.style.left = "41.5vw";
        this.fpause_button.style.top = "22vh";
        this.fpause_button.style.left = "41.5vw";

        this.fposter_photo.style.top = "6vh";
        this.fposter_photo.style.left = "34vw";
        this.fposter_photo.style.width = "25vw";
        this.fposter_photo.style.height = "25vw";

        this.fbottom_part.innerHTML = "";

        waveform.style.opacity = "0";
        block.randomColorGradient();
    }

    var wave;
    wave = new SiriWaveBlock({
        container: waveform,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight * 0.3,
        cover: true,
        speed: 0.03,
        amplitude: 0.7,
        frequency: 2,
    });

    var resize = function () {
        var height = document.documentElement.clientHeight * 0.3;
        var width = document.documentElement.clientWidth;
        wave.height = height;
        wave.height_2 = height / 2;
        wave.MAX = wave.height_2 - 4;
        wave.width = width;
        wave.width_2 = width / 2;
        wave.width_4 = width / 4;
        wave.canvas.height = height;
        wave.canvas.width = width;
        wave.container.style.margin = -(height / 2) + "px auto";
    };
    window.addEventListener("resize", resize);
    resize();

    this.myaudio = new Audio();
    if (params.audioURL) {
        let local_flow = FlowLoader.DownloadFlow(params.audioURL);
        local_flow.OnReady(function (url) {
            console.log("local url : " + url);
            // block.myaudio.src = url;
            // block.myaudio.volume = 1.0;
            block.myaudio = new Media(url, mediaSuccess, mediaFailure, mediaStatus);

            function mediaSuccess() {
                console.log("Successfully finished task.");
            }

            function mediaFailure(err) {
                console.log("An error occurred: " + err.code);
            }

            function mediaStatus(status) {
                console.log("A status change occurred: " + status);
                if (status == 4) {
                    block.flowend();
                }
            }
            // block.myaudio.play();
            // block.myaudio.setVolume('0.0');
            // setTimeout(function () {
            // console.log("duration : " + block.myaudio.getDuration());
            // params.fake_duration = block.myaudio.getDuration();
            block.ready = true;
            block.floading_flow.style.display = "none";
            block.fplay_button.style.display = "block";
            block.fpause_button.style.display = "none";
            // block.myaudio.stop();
            // block.myaudio.seekTo(0);
            block.myaudio.setVolume('1.0');
            block.currentTime = 0;
            block.offset_indicator = 0.25;
            // }, 500);
            // setTimeout(function () {
            //     
            // }, 500)
        });
    }

    this.isPlaying = false;

    this.myaudio.onended = function () {
        block.flowend();
    };

    this.flowend = function () {
        audio_playing = false;
        waveform.style.display = "none";
        block.progress_div.style.transitionDuration = '0s';
        // block.progress_div.style.borderTopRightRadius = '2vw';
        block.progress_div.style.opacity = '0';
        block.flowpause();
        setTimeout(function () {
            block.progress_div.style.opacity = '1';
            block.progress_div.style.width = '0%';
            block.offset_indicator = 0.25;
        }, 100);
        block.currentTime = 0;
    }

    // this.seek = function () {
    //     console.log("seek");
    //     console.log(block.myRange.value);
    //     this.progress = block.myRange.value;
    //     this.time = (this.progress * block.myaudio.duration) / 100;
    //     block.myaudio.currentTime = Math.round(this.time);
    //     block.myaudio.currentTime = block.currentTime;
    //     block.seeking = true;
    //     block.progress_div.style.display = "block";
    //     block.progress_div.style.width =
    //         (block.myaudio.currentTime * 100) / block.myaudio.duration + "%";
    //     setTimeout(function () {
    //         block.seeking = false;
    //         console.log("seeking = false");
    //     }, 600);
    //     // block.flowplay();
    //     // console.log("flow play");
    // };

    this.fplay_button.addEventListener("click", function () {
        stopAllBlocksAudio();
        block.flowplay(block);
    });
    this.fpause_button.addEventListener("click", function () {
        block.flowpause(block);
    });

    this.myRange.addEventListener('input', function () {
        // console.log("change");
        // block.seek();
        block.progress = block.myRange.value;
        block.progress_div.style.transitionDuration = "0s";
        if (block.progress > 99) block.progress = 99;
        block.currentTime = block.progress * params.fake_duration / 100;
        block.progress_div.style.width = block.currentTime * 100 / params.fake_duration + '%';
    });

    this.myRange.addEventListener('touchend', function () {
        // block.myaudio.currentTime = block.currentTime;
        console.log("seek to : " + block.currentTime);
        block.myaudio.seekTo(block.currentTime * 1000);
        block.offset_indicator = 0;
        // setTimeout(function () {
        block.flowplay();
        // }, 100)
        console.log("flow play");
        //current_flow_block
    });

    // this.myRange.addEventListener('input', function () {
    //     console.log("input");
    //     this.focus();
    //     //block.wasPlaying = block.isPlaying;
    //     block.flowpause();
    //     block.progress = block.myRange.value;
    //     if (block.progress > 99) block.progress = 99;
    //     block.currentTime = block.progress * block.duration / 100;
    //     // block.myaudio.currentTime = block.time;
    //     block.progress_div.style.width = block.currentTime * 100 / block.duration + '%';
    //     event.stopPropagation();
    // });

    this.myRange.addEventListener("touchstart", function (e) {
        iosPolyfill(e, this);
        this.focus();
        block.flowpause();
        block.progress = block.myRange.value;
        block.progress_div.style.transitionDuration = params.fake_duration / 100 + "s";
        if (block.progress > 99) block.progress = 99;
        block.currentTime = block.progress * params.fake_duration / 100;
        block.progress_div.style.width = block.currentTime * 100 / params.fake_duration + '%';
    }, {
        passive: true
    });

    // Like d'un flow
    $(this.fimg_impression_like).on("click", function () {
        if (connected) {
            current_flow_block = block;
            impression_coloring(this, "like", block);
            let data = {
                ObjectId: current_flow_block.ObjectId,
            };
            ServerManager.LikeFlow(data, current_flow_block);
        } else {
            Popup("popup-connect", true, 60);
        }
    });

    $(this.fimg_impression_echo).on("click", function () {
        impression_coloring(this, "echo", block.fimg_impression_echo);
    });

    /*----------------------TEST_LAURE------------

      $(this.fdots).on('click', function () {

          $("#registration_test").val(registrationId);
      });

      ----------------------FIN_TEST_LAURE------------*/

    $(this.fimg_impression_comment).on("click", function () {
        if (connected) {
            current_flow_block = block; +
            current_flow_block.Comments == 0 ?
                (text_comment_number = current_flow_block.Comments + " commentaire") :
                (text_comment_number = current_flow_block.Comments + " commentaires");
            $(".fcomment_number").text(text_comment_number);
            CanRefreshCommentList = true;
            CommentListCurrentIndex = 0;
            display_all_comments(current_flow_block);
        } else {
            Popup("popup-connect", true, 60);
        }
    });

    $(this.fposter_photo).on("click", function () {
        let data = {
            private_Id: block.privateID,
            user_private_Id: window.localStorage.getItem("user_private_id"),
        };
        go_to_account(data);
    });

    $(this.fdots).on("click", function () {
        var clickedLink = this;
        if (connected) {
            stopAllBlocksAudio();
            current_flow_block = block;
            delete_flow_from_bdd(current_flow_block);
        } else {
            Popup("popup-connect", true, 60);
        }
    });
}

$(".fpopover_delete_flow").on("click", function () {
    delete_flow(current_flow_block);
});

function display_all_comments(block) {
    //fonction permettant d'affiher tous les commentaires
    $(".fblock_comment_content").html("");
    console.log(" le display all comment à ete appelé");
    var loading_comment = document.createElement("div");
    loading_comment.className = "loading-spinner loading_tl loading_comment";
    $(".fblock_comment_content").append(loading_comment);
    //$(".fcomment_number").text("");
    let ObjectId;
    if (block.ObjectId == undefined && block.IdFlow == undefined)
        ObjectId = block.additionalData.sender_info.IdFlow;
    if (block.ObjectId == undefined && block.additionalData == undefined)
        ObjectId = block.IdFlow;
    if (block.IdFlow == undefined && block.additionalData == undefined)
        ObjectId = block.ObjectId;
    CanRefreshCommentList = true;
    CommentListCurrentIndex = 0;
    let data = {
        ObjectId: ObjectId,
        Index: CommentListCurrentIndex,
        IsComment: block.IsComment,
    };
    ServerManager.GetFlowComment(data);
    Popup("popup-comment", true, 40);
}

function display_all_likes(block) {
    //fonction permettant d'affiher tout les likes
    console.log("display_all_likes");
    likes_index = 0;
    CanRefreshLikes = true;
    $(".fblock_likes_content").html("");
    var loading_likes = document.createElement("div");
    loading_likes.className = "loading-spinner loading_tl loading_likes";
    $(".fblock_likes_content").append(loading_likes);
    $(".flikes_number").text("");
    let ObjectId = block.ObjectId ?
        block.ObjectId :
        block.additionalData.sender_info.IdFlow;
    let data = {
        Index: likes_index,
        ObjectId: ObjectId,
    };
    ServerManager.GetFlowLikes(data);
    Popup("popup-likes", true, 40);
    let nb_likes = affichage_nombre(block.Likes, 1);
    let like_str = "J'aime";
    if (nb_likes == "0" || nb_likes == "1") like_str = "J'aime";
    $(".flikes_number").text(nb_likes + " " + like_str);
}

// fonction permettant de colorier ou non les like, echo et comment.
function impression_coloring(object, type, block, like_type) {
    let now = Date.now();
    switch (type) {
        case "like":
            $(object).each(function () {
                let like_number = $(block.ftxt_impression_like).text();

                var attr_img_like = $(object).attr("src");
                if (attr_img_like === "src/icons/Like.png") {
                    $(block.fimg_impression_like).attr(
                        "src",
                        "src/icons/Like_filled.png"
                    );
                    $(block.ftxt_impression_like).text(+like_number + 1);
                    if (block.last_like_time != undefined) {
                        let last_like = Math.floor(
                            (now - block.last_like_time) / 1000 / 60
                        );
                        if (last_like > 29 && registrationId != block.RegisterId) {
                            send_notif_to_user(block, "like_flow");
                            block.last_like_time = Date.now();
                        }
                    } else if (
                        block.last_like_time == undefined &&
                        registrationId != block.RegisterId
                    ) {
                        send_notif_to_user(block, "like_flow");
                        block.last_like_time = Date.now();
                    }
                }
                if (attr_img_like === "src/icons/Like_filled.png") {
                    $(block.fimg_impression_like).attr("src", "src/icons/Like.png");
                    $(block.ftxt_impression_like).text(+like_number - 1);
                }
            });
            break;

        case "echo":
            $(object).each(function () {
                var attr_img_echo = $(object).attr("src");
                if (attr_img_echo === "src/icons/Echo.png") {
                    $(block.fimg_impression_echo).attr(
                        "src",
                        "src/icons/Echo_filled.png"
                    );
                }
                if (attr_img_echo === "src/icons/Echo_filled.png") {
                    $(block.fimg_impression_echo).attr("src", "src/icons/Echo.png");
                }
            });
            break;

        case "comment":
            $(object).each(function () {
                var attr_img_comment = $(object).attr("src");
                var comment_length = current_flow_block.all_comment_blocks.length;
                $(block.fimg_impression_comment).attr(
                    "src",
                    "src/icons/Comment_filled.png"
                );
            });
            break;
    }
}

function go_to_account(data) {
    //fonction permettant apres click sur sa photo d'aller sur le compte de l'utilisateur
    let time_in_last_screen =
        Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
    facebookConnectPlugin.logEvent(
        "current_page", {
            page: current_page,
            duration: time_in_last_screen,
        },
        null,
        function () {
            console.log("fb current_page event success");
        },
        function () {
            console.log("fb current_page error");
        }
    );
    last_currentpage_timestamp = Math.floor(Date.now() / 1000);

    if (data.private_Id == data.user_private_Id) {
        if (current_page != "my-account") {
            Popup("popup-specifique", false);
            Popup("popup-comment", false);
            Popup("popup-account", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-myaccount", true);
            current_page = "my-account";
        } else {
            shake("tabMonCompte1");
            Popup("popup-comment", false);
        }
    } else {
        if (current_page == "account" && privateIDAccount == data.private_Id) {
            shake("tabCompte1");
            Popup("popup-comment", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-specifique", false);
        } else {
            Popup("popup-comment", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-specifique", false);
            Popup("popup-myaccount", false);
            if (connected == true) {
                ServerManager.GetBlockedUsers(data.private_Id, "go_to_acount"); // true si c'est une redirection vers un compte
            } else {
                fInitialisationAccount(data.private_Id);
            }
            //fInitialisationAccount(data.private_Id);
            Popup("popup-account", true);
            current_page = "account";
            //Popup("popup-account", true);
        }
    }
}

function shake(element_id) {
    let tabs = document.getElementById(element_id);
    tabs.classList.remove("shake");
    void tabs.offsetWidth;
    tabs.classList.add("shake");
}

//--------------------------Comment 10 par 10-------------------------------
$(".fblock_comment_content").scroll(function () {
    var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
    if (CanRefreshCommentList == true) {
        if (Math.round($(this).scrollTop()) >= limit * 0.85) {
            CanRefreshCommentList = false;
            console.log("Get comment on Server");
            console.log("CommentListCurrentIndex : " + CommentListCurrentIndex);
            let data = {
                ObjectId: current_flow_block.ObjectId,
                Index: CommentListCurrentIndex,
                IsComment: block.IsComment,
            };
            ServerManager.GetFlowComment(data);
        }
    }
});

function UpdateCommentList(response, data_block) {
    console.log("updating comment list...");
    var text_comment_number;
    // console.log(data.Data);
    if (Array.isArray(response.Data)) {
        /*(response.Data.length == 1) ? (text_comment_number = response.Data.length + " commentaire") : (text_comment_number = response.Data.length + " commentaires");
            $(".fcomment_number").text(text_comment_number);*/

        if ($(".loading_tl")) $(".loading_tl").remove();
        $(".fblock_comment_content")[0].innerHTML = "";
        if (CommentListCurrentIndex == 0) {
            let loading_tl = document.createElement("div");
            loading_tl.className = "loading-spinner loading_tl";
            $(".fblock_comment_content")[0].appendChild(loading_tl);
        }
        for (let i = 0; i < response.Data.length; i++) {
            const src_profile_img =
                "https://" +
                response.LinkBuilder.Hostname +
                ":" +
                response.LinkBuilder.Port +
                "/images/" +
                response.Data[i].ProfilePicture.name +
                "?";
            const param_profile_img = `${response.LinkBuilder.Params.hash}=${response.Data[i].ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data[i].ProfilePicture.timestamp}`;
            let profilePicLink = src_profile_img + param_profile_img;

            let comment_data = {
                PrivateId: response.Data[i].PrivateId,
                ProfilePicture: profilePicLink,
                Comment: response.Data[i].Comment,
                Comment_text: response.Data[i].Comment,
                Like_number: response.Data[i].Likes,
                Time: response.Data[i].Time,
                IsLike: response.Data[i].IsLike,
                IdComment: response.Data[i].IdComment,
                RegisterId: response.Data[i].RegisterId,
                LastOs: response.Data[i].LastOs,
                Flow_block_id: data_block.ObjectId,
                Responses: response.Data[i].Responses, //nombre de reponses
            };

            comment_data.Comment = comment_data.Comment.replace(
                /@[^ ]+/gi,
                '<span class="tagged_users">$&</span>'
            );
            let block_commentaire = new block_comment(comment_data);
            current_flow_block.all_comment_blocks.push(block_commentaire);
            $(".fblock_comment_content").append(block_commentaire);
        }
        CommentListCurrentIndex++;
        if ($(".loading_tl")) $(".loading_tl").remove();
        console.log("user updated !");
        pullToRefreshEnd();
        if (response.Data.length < 10) {
            CanRefreshCommentList = false;
            let tick_tl = document.createElement("div");
            tick_tl.className = "tick_icon";
            $(".fblock_comment_content")[0].appendChild(tick_tl);
        } else {
            CanRefreshCommentList = true;
            let loading_tl = document.createElement("div");
            loading_tl.className = "loading-spinner loading_tl";
            $(".fblock_comment_content")[0].appendChild(loading_tl);
        }
    } else {
        text_comment_number = " 0 commentaire";
        StopRefreshTL();
    }
}

function get_all_likes(response) {
    // if (response == "ERROR GET LIKES FLOW" || response.Data.length == 0) {
    //     $(".loading_likes").remove();
    //     text_likes_number = " 0 like";
    // } else if (response.Data.length) {

    //     (response.Data.length == 1) ? (text_likes_number = response.Data.length + " like") : (text_likes_number = response.Data.length + " likes");
    // }
    // $(".flikes_number").text(text_likes_number);

    console.log(response);
    console.log(likes_index);
    var i = 0;
    if (response.Data) {
        likes_index++;
        for (i = 0; i < response.Data.length; i++) {
            let like_data = response.Data[i];
            this.fblock_like = document.createElement("div");
            this.fblock_like.className = "fblock_like";
            $(".fblock_likes_content").append(this.fblock_like);

            this.fimg_user = document.createElement("div");
            this.fimg_user.className = "fimg_user";
            $(this.fimg_user).css(
                "background-image",
                "url(" + like_data.ProfilePicture + ""
            );
            $(this.fblock_like).append(this.fimg_user);

            this.fid_user = document.createElement("label");
            this.fid_user.className = "fid_user_likes";
            this.fid_user.innerHTML = "@" + like_data.PrivateId + "";
            $(this.fblock_like).append(this.fid_user);

            this.fimg_user.onclick = function () {
                let data = {
                    private_Id: like_data.PrivateId,
                    user_private_Id: window.localStorage.getItem("user_private_id"),
                };
                Popup("popup-likes", false);
                go_to_account(data);
            };

            // like_data.Comment = like_data.Comment.replace(/@[^ ]+/gi, '<span class="tagged_users">$&</span>');

            // let block_commentaire = new block_comment(like_data);
            // block_commentaire.chris_test = "chacal";
        }
    }
    if ($.trim($(".fblock_likes_content").html()) != "") {
        $(".loading_likes").remove();
    }
}

var all_blocks = [];
var last_story_color;

function stopAllBlocksAudio() {
    if (audio_playing) {
        all_blocks.map((a) => a.flowpause(a));
        audio_playing = false;
    }
}

function set_timestamp(timestamp) {
    // fonction qui permet d'afficher le temp ecoulé depuis un post (posté il y a 2h par exemple)
    var time_str = "";
    var time = Math.floor(timestamp);
    var now = Math.floor(Date.now() / 1000);

    var second_past = now - time;

    var minute_past = Math.floor(second_past / 60);

    var hour_past = Math.floor(minute_past / 60);

    var day_past = Math.floor(hour_past / 24);

    var week_past = Math.floor(day_past / 7);

    var month_past = Math.floor(day_past / 28);

    var year_past = Math.floor(month_past / 12);

    if (minute_past <= 59 && hour_past <= 0) {
        minute_past > -2 && minute_past < 2 ?
            (time_str = "1 min") :
            (time_str = minute_past + " min");
        return time_str;
    }

    if (hour_past > 0 && hour_past <= 23) {
        hour_past > 1 ?
            (time_str = hour_past + " h") :
            (time_str = hour_past + " h");
        return time_str;
    }

    if (day_past > 0 && day_past < 7) {
        day_past > 1 ? (time_str = day_past + " j") : (time_str = day_past + " j");
        return time_str;
    }

    if (week_past >= 1 && week_past <= 5) {
        week_past == 1 ?
            (time_str = week_past + " sem") :
            (time_str = week_past + " sem");
        return time_str;
    }

    if (month_past > 0 && month_past <= 12) {
        month_past < 2 ?
            (time_str = month_past + " m") :
            (time_str = month_past + " m");
        return time_str;
    }

    if (year_past > 0) {
        year_past < 2 ?
            (time_str = year_past + " an") :
            (time_str = year_past + " ans");
        return time_str;
    }
}

function affichage_nombre(number, decPlaces) {
    // cette fonction permet d'afficher les nombres de likes et autres (1200 devien 1.2 k)

    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            var number = Math.round((number * decPlaces) / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if (number == 1000 && i < abbrev.length - 1) {
                number = 1;
                i++;
            }

            // console.log(number);
            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}

document
    .getElementById("popup-comment")
    .addEventListener("opened", function () {
        if (window.cordova.platformId == "android") {
            StatusBar.backgroundColorByHexString("#949494");
            StatusBar.styleLightContent();
            CanRefreshCommentList = true;
            CommentListCurrentIndex = 0;
        }
    });

document
    .getElementById("popup-comment")
    .addEventListener("closed", function () {
        if (window.cordova.platformId == "android") {
            StatusBar.backgroundColorByHexString("#f7f7f8");
            StatusBar.styleDefault();
        }
        CanRefreshCommentList = true;
        CommentListCurrentIndex = 0;
    });

document.getElementById("popup-likes").addEventListener("opened", function () {
    in_likes = true;
    if (window.cordova.platformId == "android") {
        StatusBar.backgroundColorByHexString("#949494");
        StatusBar.styleLightContent();
    }
});

document.getElementById("popup-likes").addEventListener("closed", function () {
    in_likes = false;
    if (window.cordova.platformId == "android") {
        StatusBar.backgroundColorByHexString("#f7f7f8");
        StatusBar.styleDefault();
    }
});

function iosPolyfill(e, slider) {
    var val =
        (e.pageX - slider.getBoundingClientRect().left) /
        (slider.getBoundingClientRect().right -
            slider.getBoundingClientRect().left),
        max = slider.getAttribute("max"),
        segment = 1 / (max - 1),
        segmentArr = [];

    max++;

    for (var i = 0; i < max; i++) {
        segmentArr.push(segment * i);
    }

    var segCopy = JSON.parse(JSON.stringify(segmentArr)),
        ind = segmentArr.sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0];

    slider.value = segCopy.indexOf(ind) + 1;
}