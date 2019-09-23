"use_strict";
var block_id = 0;

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
    this.duration = params.duration;
    this.privateID = params.PrivateId;
    this.Time = params.Times;
    this.block_id = block_id;
    this.currentTime = 0;
    this.IsLike = params.IsLike;
    this.IsComment = params.IsComment;
    this.Likes = params.Likes;
    this.RegisterId = params.RegisterId;
    this.Comments = params.Comments;

    this.flowplay = function () {
        block.fplay_button.style.display = "none";
        block.fpause_button.style.display = "block";
        wave.start();
        waveform.style.display = "block";
        console.log("duration : " + block.myaudio.duration);
        console.log("currentTime : " + block.currentTime);
        block.myaudio.play();
        block.progress_div.style.display = 'block';
        block.progress_div.style.borderTopRightRadius = '0vw';
        block.isPlaying = true;
        block.myRange.style.pointerEvents = "all";
    };



    this.flowpause = function () {
        block.fplay_button.style.display = "block";
        block.fpause_button.style.display = "none";
        waveform.style.display = "none";
        wave.stop();
        block.isPlaying = false;
        block.myaudio.pause();
        block.myRange.style.pointerEvents = "none";
    };



    this.duration = document.createElement('div');
    this.duration.id = 'duration';

    this.block_flow = document.createElement('div');
    this.block_flow.className = 'fflow';
    this.block_flow.setAttribute("block_id", this.block_id);
    block_id++;
    params.parent_element.append(this.block_flow);

    this.ftop_part = document.createElement('div');
    this.ftop_part.className = 'ftop_part';

    if (params.patternKey != undefined) {
        this.patternKey = params.patternKey;
        this.ftop_part.style.backgroundImage = pattern = GeoPattern.generate(this.patternKey).toDataUrl();
    } else if (params.imageURL != undefined) {
        this.ftop_part.style.backgroundImage = "url('" + params.imageURL + "')";
    } else {
        this.patternKey = Date.now().toString();
        this.ftop_part.style.backgroundImage = pattern = GeoPattern.generate(this.patternKey).toDataUrl();
    }
    this.block_flow.appendChild(this.ftop_part);

    this.myRange = document.createElement('input');
    this.myRange.type = 'range';
    this.myRange.className = 'fslider';
    this.myRange.min = '1';
    this.myRange.max = '100';
    this.myRange.value = '1';
    this.ftop_part.appendChild(this.myRange);



    this.fplay_button = document.createElement('img');
    this.fplay_button.className = 'fplay_button';
    this.fplay_button.id = 'playBtn';
    this.fplay_button.src = 'src/icons/play.png';
    this.ftop_part.appendChild(this.fplay_button);

    this.fpause_button = document.createElement('img');
    this.fpause_button.className = 'fpause_button';
    this.fpause_button.id = 'pauseBtn';
    this.fpause_button.src = 'src/icons/pause.png';
    this.ftop_part.appendChild(this.fpause_button);

    this.fposter_photo = document.createElement('a');
    // this.fposter_photo.setAttribute('href', '../www/pages/account.html');
    // this.fposter_photo.setAttribute("onclick", "Popup('popup-account', true)");
    this.fposter_photo.className = 'fposter_photo';
    this.fposter_photo.style.backgroundImage = "url('" + params.account_imageURL + "')";
    this.ftop_part.appendChild(this.fposter_photo);

    var waveform = document.createElement('div');
    waveform.id = 'waveform';
    waveform.style.display = 'none';
    this.ftop_part.appendChild(waveform);

    this.bar = document.createElement('div');
    this.bar.id = 'bar';
    this.ftop_part.appendChild(this.bar);

    this.progress_div = document.createElement('div');
    this.progress_div.id = ('progress_div');
    this.ftop_part.appendChild(this.progress_div);

    this.fposter_name = document.createElement('p');
    this.fposter_name.className = 'fposter_name';
    this.fposter_name.innerText = params.pseudo;
    this.ftop_part.appendChild(this.fposter_name);

    this.fbottom_part = document.createElement('div');
    this.fbottom_part.className = 'fbottom_part';
    this.block_flow.appendChild(this.fbottom_part);

    this.title_enter = function (e) {
        if (e.keyCode == 13) {
            block.finput_description.focus();
        }
    }

    if (!params.afterblock) {

        this.fpost_date = document.createElement('p');
        this.fpost_date.className = 'fpost_date';
        this.fpost_date.innerText = set_timestamp(this.Time);
        this.ftop_part.appendChild(this.fpost_date);

        this.fdots = document.createElement('label');
        this.fdots.className = 'fdots';
        this.fdots.innerText = '...';
        this.ftop_part.appendChild(this.fdots);

        this.fpost_title = document.createElement('p');
        this.fpost_title.className = 'fpost_title';
        this.fpost_title.innerText = params.title;
        this.fpost_title.setAttribute('maxlength', 20);
        this.fbottom_part.appendChild(this.fpost_title);

        this.fpost_description = document.createElement('p');
        this.fpost_description.className = 'fpost_description';
        this.fpost_description.innerText = params.description;
        this.fbottom_part.appendChild(this.fpost_description);

        this.fpost_tag = document.createElement('p');
        this.fpost_tag.className = 'fpost_tag';
        this.fpost_tag.innerText = '';
        this.fbottom_part.appendChild(this.fpost_tag);

        this.flike = document.createElement('div');
        this.flike.className = 'flike';
        this.fbottom_part.appendChild(this.flike);
        this.fimg_impression_like = document.createElement('img');
        this.fimg_impression_like.className = 'fimg_impression';
        this.fimg_impression_like.src = this.IsLike == 1 ? 'src/icons/Like_filled.png' : 'src/icons/Like.png';
        this.flike.appendChild(this.fimg_impression_like);
        this.ftxt_impression_like = document.createElement('p');
        this.ftxt_impression_like.className = 'ftxt_impression';
        this.ftxt_impression_like.innerText = affichage_nombre(this.Likes, 1);
        this.flike.appendChild(this.ftxt_impression_like);

        this.fecho = document.createElement('div');
        this.fecho.className = 'fecho';
        this.fbottom_part.appendChild(this.fecho);
        this.fimg_impression_echo = document.createElement('img');
        this.fimg_impression_echo.className = 'fimg_impression';
        this.fimg_impression_echo.src = 'src/icons/Echo.png';
        this.fecho.appendChild(this.fimg_impression_echo);
        this.ftxt_impression_echo = document.createElement('p');
        this.ftxt_impression_echo.className = 'ftxt_impression';
        this.ftxt_impression_echo.innerText = '8.2k';
        this.fecho.appendChild(this.ftxt_impression_echo);

        this.fcomment = document.createElement('div');
        this.fcomment.className = 'fcomment';
        this.fbottom_part.appendChild(this.fcomment);
        this.fimg_impression_comment = document.createElement('img');
        this.fimg_impression_comment.className = 'fimg_impression';
        this.fimg_impression_comment.src = this.IsComment == 1 ? 'src/icons/Comment_filled.png' : 'src/icons/Comment.png';
        this.fcomment.appendChild(this.fimg_impression_comment);
        this.ftxt_impression_comment = document.createElement('p');
        this.ftxt_impression_comment.className = 'ftxt_impression';
        this.ftxt_impression_comment.innerText = affichage_nombre(this.Comments, 1);
        this.fcomment.appendChild(this.ftxt_impression_comment);


    } else {
        this.finput_title = document.createElement('input');
        this.finput_title.className = 'finput_title';
        this.finput_title.placeholder = 'Tap to edit title';
        this.finput_title.maxLength = "25";
        this.finput_title.onkeypress = this.title_enter;
        this.fbottom_part.appendChild(this.finput_title);

        this.finput_description = document.createElement('textarea');
        this.finput_description.className = 'finput_description';
        this.finput_description.placeholder = 'Tap to add description';
        this.finput_description.maxLength = "50";
        this.fbottom_part.appendChild(this.finput_description);
    }

    this.randomColorGradient = function () {
        let color_start = "#000000".replace(/0/g, function () {
            return (~~(Math.random() * 16)).toString(16);
        });
        let color_end = pSBC(-0.8, color_start);
        let lineargradientcss = "linear-gradient(to bottom," + color_start + "," + color_end + ")";
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
        frequency: 2
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
        wave.container.style.margin = -(height / 2) + 'px auto';
    };
    window.addEventListener('resize', resize);
    resize();

    this.myaudio = new Audio("src/sound/son.opus");
    this.myaudioelement;
    if (params.audioURL) {
        this.myaudio = new Audio(params.audioURL);
        this.myaudio.volume = 1.0;
    }

    this.isPlaying = false;
    this.myaudio.ontimeupdate = function () {

        if (block.isPlaying && !block.seeking) {
            this.progress = Math.round(block.myaudio.currentTime * 100 / params.duration);
            block.myRange.value = this.progress;
            block.progress_div.style.width = block.myaudio.currentTime * 100 / params.duration + '%';
            if (block.progress_div.style.width > '99.8%' && block.progress_div.style.width < '101%') {
                block.progress_div.style.borderTopRightRadius = '2vw';

            }
        }
    };

    this.myaudio.onended = function () {
        waveform.style.display = "none";
        block.progress_div.style.borderTopRightRadius = '2vw';
        block.progress_div.style.width = '100%';
        block.flowpause();
        block.currentTime = 0;
        setTimeout(function () {
            if (!block.isPlaying) {
                block.progress_div.style.display = 'none';
                block.progress_div.style.width = '0%';
            }
        }, 600);

    };

    this.seek = function () {
        console.log("seek");
        // this.progress = block.myRange.value;
        // this.time = this.progress * params.duration / 100;
        // block.myaudio.currentTime = Math.round(this.time);
        block.myaudio.currentTime = block.currentTime;
        block.seeking = true;
        block.progress_div.style.display = "block";
        block.progress_div.style.width = block.myaudio.currentTime * 100 / params.duration + '%';
        setTimeout(function () {
            block.seeking = false;
            console.log("seeking = false");
        }, 600);
        block.flowplay();
        console.log("flow play");
    };

    this.fplay_button.addEventListener('click', function () {
        stopAllBlocksAudio();
        block.flowplay(block);
    });
    this.fpause_button.addEventListener('click', function () {
        block.flowpause(block);
    });

    this.myRange.addEventListener('change', function () {
        console.log("change");
        block.seek();
    });
    this.myRange.addEventListener('input', function () {
        console.log("input");
        this.focus();
        //block.wasPlaying = block.isPlaying; 
        block.flowpause();
        block.progress = block.myRange.value;
        if (block.progress > 99) block.progress = 99;
        block.currentTime = block.progress * params.duration / 100;
        // block.myaudio.currentTime = block.time;
        block.progress_div.style.width = block.currentTime * 100 / params.duration + '%';

    });

    $(this.fimg_impression_like).on('click', function () {

        current_flow_block = block;
        impression_coloring(this, 'like', block);
        let data = {

            ObjectId: current_flow_block.ObjectId
        };
        ServerManager.LikeFlow(data, current_flow_block);
    });

    $(this.fimg_impression_echo).on('click', function () {

        impression_coloring(this, 'echo', block.fimg_impression_echo);        
    });

    /*----------------------TEST_LAURE------------*/

    $(this.fdots).on('click', function () {

        $("#registration_test").val(registrationId);
    });

    /*----------------------FIN_TEST_LAURE------------*/

    $(this.fimg_impression_comment).on('click', function () {
        $(".fblock_comment_content").html("");
        var loading_comment = document.createElement("div");
        loading_comment.className = "loading_circle loading_tl loading_comment";
        $(".fblock_comment_content").append(loading_comment);
        $(".fcomment_number").text("");
        current_flow_block = block;
        let data = {

            ObjectId: current_flow_block.ObjectId,
            IsComment: current_flow_block.IsComment
        };
        //impression_coloring(this, 'comment', block.fimg_impression_comment);
        ServerManager.GetFlowComment(data);

        Popup("popup-comment", true, 40);

    });
}
// fonction permettant de colorier ou non les like, echo et comment.
function impression_coloring(object, type, block, like_type) {

    switch (type) {
        case 'like':
            $(object).each(function () {

                let like_number = $(block.ftxt_impression_like).text();

                var attr_img_like = $(object).attr('src');
                if (attr_img_like === 'src/icons/Like.png') {
                    $(block.fimg_impression_like).attr('src', 'src/icons/Like_filled.png');
                    $(block.ftxt_impression_like).text(+like_number + 1);
                    send_notif_to_user(block, "like_flow");
                }
                if (attr_img_like === 'src/icons/Like_filled.png') {
                    $(block.fimg_impression_like).attr('src', 'src/icons/Like.png');
                    $(block.ftxt_impression_like).text(+like_number - 1);
                }
            });
            break;

        case 'echo':
            $(object).each(function () {
                var attr_img_echo = $(object).attr('src');
                if (attr_img_echo === 'src/icons/Echo.png') {
                    $(block.fimg_impression_echo).attr('src', 'src/icons/Echo_filled.png');
                }
                if (attr_img_echo === 'src/icons/Echo_filled.png') {
                    $(block.fimg_impression_echo).attr('src', 'src/icons/Echo.png');
                }
            });
            break;

        case 'comment':
            $(object).each(function () {
                var attr_img_comment = $(object).attr('src');
                var comment_length = current_flow_block.all_comment_blocks.length;
                $(block.fimg_impression_comment).attr('src', 'src/icons/Comment_filled.png');

            });
            break;
    }

}

$(document).on('click', 'a.fposter_photo', function () {
    var parent = $(this).parent().parent();
    var parentBlockId = parent.attr("block_id");
    if (all_blocks[parentBlockId].privateID == window.localStorage.getItem("user_private_id")) {
        if (current_page != "my-account") {
            Popup("popup-myaccount", true);
        } else {
            // $("#tabMonCompte1").effect("shake", {times: 1, distance: 5}, 300);
            shake("tabMonCompte1");

        }
    } else {
        if (current_page == "account" && privateIDAccount == all_blocks[parentBlockId].privateID) {
            // $("#tabCompte1").effect("shake", {times: 1, distance: 5}, 300);
            shake("tabCompte1");
        } else {
            Popup("popup-account", true);
            fInitialisationAccount(all_blocks[parentBlockId].privateID);
        }
    }

});

function shake(element_id) {
    let tabs = document.getElementById(element_id);
    tabs.classList.remove("shake");
    void tabs.offsetWidth;
    tabs.classList.add("shake");
}

function get_all_comment(response) {



    var text_comment_number;
    if (response == "ERROR GET COMMENT FLOW") {
        $(".loading_comment").remove();
        text_comment_number = " 0 commentaire";
    } else if (response.Data.length) {

        (response.Data.length == 1) ? (text_comment_number = response.Data.length + " commentaire") : (text_comment_number = response.Data.length + " commentaires");
    }
    $(".fcomment_number").text(text_comment_number);

    console.log(response);
    var i = 0;
    if (response.Data) {
        for (i = 0; i < response.Data.length; i++) {

            const src_profile_img = 'https://' + response.LinkBuilder.Hostname + ':' + response.LinkBuilder.Port + '/images/' + response.Data[i].ProfilePicture.name + '?';
            const param_profile_img = `${response.LinkBuilder.Params.hash}=${response.Data[i].ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data[i].ProfilePicture.timestamp}`;
            var profilePicLink = src_profile_img + param_profile_img;

            var comment_data = {
                PrivateId: response.Data[i].PrivateId,
                ProfilePicture: profilePicLink,
                Comment: response.Data[i].Comment,
                Like_number: response.Data[i].Likes,
                Time: response.Data[i].Time,
                IsLike: response.Data[i].IsLike,
                IdComment: response.Data[i].IdComment,
                RegisterId: response.Data[i].RegisterId
            }

            // $(".loading_tl").remove();
            let block_commentaire = new block_comment(comment_data);
            $(".fblock_comment_content").append(block_commentaire);

        }
    }
    if ($.trim($(".fblock_comment_content").html()) != "") {
        $(".loading_comment").remove();
    }

}

var all_blocks = [];
var last_story_color;

function stopAllBlocksAudio() {
    all_blocks.map(a => a.flowpause(a));
}

function set_timestamp(timestamp) { // fonction qui permet d'afficher le temp ecoulé depuis un post (posté il y a 2h par exemple)
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

        (minute_past > -2 && minute_past < 2) ? (time_str = "1 minute ago") : (time_str = "" + minute_past + " minutes ago");
        return time_str;

    }

    if (hour_past > 0 && hour_past <= 23) {


        (hour_past > 1) ? (time_str = "" + hour_past + " hours ago") : (time_str = "" + hour_past + " hour ago");
        return time_str;

    }

    if (day_past > 0 && day_past < 7) {

        (day_past > 1) ? (time_str = "" + day_past + " days ago") : (time_str = "" + day_past + " day ago");
        return time_str;

    }

    if (week_past >= 1 && week_past <= 5) {

        (week_past == 1) ? (time_str = "" + week_past + " week ago") : (time_str = "" + week_past + " weeks ago");
        return time_str;

    }

    if (month_past > 0 && month_past <= 12) {


        (month_past < 2) ? (time_str = "" + month_past + " month ago") : (time_str = "" + month_past + " months ago");
        return time_str;

    }

    if (year_past > 0) {

        (year_past < 2) ? (time_str = "" + year_past + " year ago") : (time_str = "" + year_past + " years ago");
        return time_str;

    }
}


function affichage_nombre(number, decPlaces) { // cette fonction permet d'afficher les nombres de likes et autres (1200 devien 1.2 k)

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
            var number = Math.round(number * decPlaces / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if ((number == 1000) && (i < abbrev.length - 1)) {
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

document.getElementById("popup-comment").addEventListener("opened", function () {
    StatusBar.backgroundColorByHexString('#949494');
    StatusBar.styleLightContent();
});

document.getElementById("popup-comment").addEventListener("closed", function () {
    StatusBar.backgroundColorByHexString('#f7f7f8');
    StatusBar.styleDefault();
});