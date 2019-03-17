"use_strict";

function block() {

    var block = this;
    this.isPlaying = false;
    this.seeking = false;
    this.wasPlaying = false;

    this.flowplay = function () {
        block.fplay_button.style.display = "none";
        block.fpause_button.style.display = "block";
        wave.start();
        waveform.style.display = "block";
        block.myaudio.play();
        // console.log(block.myRange);
        block.progress_div.style.display = 'block';
        block.progress_div.style.borderTopRightRadius = '0vw';
        block.isPlaying = true;
        console.log("play");
        block.myRange.style.pointerEvents = "all";
    };



    this.flowpause = function () {


        block.fplay_button.style.display = "block";
        block.fpause_button.style.display = "none";
        //this.player1.pause();
        waveform.style.display = "none";

        //waveform.removeChild(waveform.firstChild);
        wave.stop();
        block.isPlaying = false;
        block.myaudio.pause();
        console.log("pause");
        block.myRange.style.pointerEvents = "none";

    };



    this.duration = document.createElement('div');
    this.duration.id = 'duration';

    this.block_flow = document.createElement('div');
    this.block_flow.className = 'fflow';
    $(".list-block").append(this.block_flow);

    this.ftop_part = document.createElement('div');
    this.ftop_part.className = 'ftop_part';
    this.block_flow.appendChild(this.ftop_part);

    this.myRange = document.createElement('input');
    this.myRange.type = 'range';
    this.myRange.className = 'fslider';
    this.myRange.min = '1';
    this.myRange.max = '100';
    this.myRange.value = '1';
    this.ftop_part.appendChild(this.myRange);

    this.fposter_name = document.createElement('p');
    this.fposter_name.className = 'fposter_name';
    this.fposter_name.innerText = 'Vanessa';
    this.ftop_part.appendChild(this.fposter_name);

    this.fpost_date = document.createElement('p');
    this.fpost_date.className = 'fpost_date';
    this.fpost_date.innerText = '5 min';
    this.ftop_part.appendChild(this.fpost_date);

    this.fdots = document.createElement('label');
    this.fdots.className = 'fdots';
    this.fdots.innerText = '...';
    this.ftop_part.appendChild(this.fdots);

    this.fplay_button = document.createElement('img');
    this.fplay_button.className = 'fplay_button';
    this.fplay_button.id = 'playBtn';
    this.fplay_button.src = 'src/icons/play.png';
    this.ftop_part.appendChild(this.fplay_button);

    this.fpause_button = document.createElement('img');
    this.fpause_button.className = 'fpause_button';
    this.fpause_button.id = 'pauseBtn';
    // fpause_button.style.visibility = 'hidden';
    this.fpause_button.src = 'src/icons/pause.png';
    this.ftop_part.appendChild(this.fpause_button);

    this.fposter_photo = document.createElement('div');
    this.fposter_photo.className = 'fposter_photo';
    this.ftop_part.appendChild(this.fposter_photo);

    /* this.ffollower1 = document.createElement('div');
    this.ffollower1.className = 'ffollower1';
    this.ftop_part.appendChild(this.ffollower1);

    this.ffollower2 = document.createElement('div');
    this.ffollower2.className = 'ffollower2';
    this.ftop_part.appendChild(this.ffollower2);

    this.ffollower3 = document.createElement('div');
    this.ffollower3.className = 'ffollower3';
    this.ftop_part.appendChild(this.ffollower3); */

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

    this.fbottom_part = document.createElement('div');
    this.fbottom_part.className = 'fbottom_part';
    this.block_flow.appendChild(this.fbottom_part);

    this.fpost_title = document.createElement('p');
    this.fpost_title.className = 'fpost_title';
    this.fpost_title.innerText = 'What an Amazing Sound';
    this.fbottom_part.appendChild(this.fpost_title);

    this.fpost_description = document.createElement('p');
    this.fpost_description.className = 'fpost_description';
    this.fpost_description.innerText = 'very col sound recorded';
    this.fbottom_part.appendChild(this.fpost_description);

    this.fpost_tag = document.createElement('p');
    this.fpost_tag.className = 'fpost_tag';
    this.fpost_tag.innerText = '#Fresh #Sumer';
    this.fbottom_part.appendChild(this.fpost_tag);

    this.flike = document.createElement('div');
    this.flike.className = 'flike';
    this.fbottom_part.appendChild(this.flike);
    this.fimg_impression_like = document.createElement('img');
    this.fimg_impression_like.className = 'fimg_impression';
    this.fimg_impression_like.src = 'src/icons/Like.png';
    this.flike.appendChild(this.fimg_impression_like);
    this.ftxt_impression_like = document.createElement('p');
    this.ftxt_impression_like.className = 'ftxt_impression';
    this.ftxt_impression_like.innerText = '2.5k';
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
    this.fimg_impression_comment.src = 'src/icons/Comment.png';
    this.fcomment.appendChild(this.fimg_impression_comment);
    this.ftxt_impression_comment = document.createElement('p');
    this.ftxt_impression_comment.className = 'ftxt_impression';
    this.ftxt_impression_comment.innerText = '605';
    this.fcomment.appendChild(this.ftxt_impression_comment);

    var wave;

    wave = new SiriWaveBlock({
        container: waveform,
        width: window.innerWidth,
        height: window.innerHeight * 0.3,
        cover: true,
        speed: 0.03,
        amplitude: 0.7,
        frequency: 2
    });

    var resize = function () {
        var height = window.innerHeight * 0.3;
        var width = window.innerWidth;
        wave.height = height;
        wave.height_2 = height / 2;
        wave.MAX = wave.height_2 - 4;
        wave.width = width;
        wave.width_2 = width / 2;
        wave.width_4 = width / 4;
        wave.canvas.height = height;
        wave.canvas.width = width;
        wave.container.style.margin = -(height / 2) + 'px auto';

        // Update the position of the slider.
        // block.sound = player1.playlist[player1.index].howl;
        // if (block.sound) {
        //     var vol = block.sound.volume();
        //     var barWidth = (vol * 0.9);
        //     sliderBtn.style.left = (window.innerWidth * barWidth + window.innerWidth * 0.05 - 25) + 'px';
        // }
    };
    window.addEventListener('resize', resize);
    resize();

    this.myaudio = new Audio("src/sound/son.mp3");
    this.isPlaying = false;
    this.myaudio.ontimeupdate = function () {

        if (block.isPlaying && !block.seeking) {
            this.progress = Math.round(block.myaudio.currentTime * 100 / block.myaudio.duration);
            block.myRange.value = this.progress;
            block.progress_div.style.width = block.myaudio.currentTime * 100 / block.myaudio.duration + '%';
            if (block.progress_div.style.width > '99.8%' && block.progress_div.style.width < '101%') {
                block.progress_div.style.borderTopRightRadius = '2vw';

            }
        }
    };

    this.myaudio.onended = function () {
        console.log("end of audio");
        waveform.style.display = "none";
        block.progress_div.style.borderTopRightRadius = '2vw';
        block.flowpause();
        setTimeout(function () {
            if (!block.isPlaying) {
                block.progress_div.style.display = 'none';
                block.progress_div.style.width = '0%';
            }
        }, 600);

    };

    this.seek = function () {
        this.progress = block.myRange.value;
        if (this.progress > 99) this.progress = 99;
        this.time = this.progress * block.myaudio.duration / 100;
        block.myaudio.currentTime = this.time;
        block.seeking = true;
        block.progress_div.style.display = "block";
        block.progress_div.style.width = block.myaudio.currentTime * 100 / block.myaudio.duration + '%';
        setTimeout(function () {
            block.seeking = false;
        }, 600);
        block.flowplay();
        // if(block.wasPlaying)
        // {
        //     block.flowplay();
        // }
        // else
        // {
        //     block.flowpause();
        // }
    };



    this.fplay_button.addEventListener('click', function () {

        all_blocks.map(a => a.flowpause(a));
        block.flowplay(block);
    });
    this.fpause_button.addEventListener('click', function () {
        block.flowpause(block);
    });

    this.myRange.addEventListener('change', function () {
        block.seek();
    });
    this.myRange.addEventListener('input', function () {
        this.focus();
        //block.wasPlaying = block.isPlaying; 
        block.flowpause();
        block.progress = block.myRange.value;
        if (block.progress > 99) block.progress = 99;
        block.time = block.progress * block.myaudio.duration / 100;
        block.myaudio.currentTime = block.time;
        block.progress_div.style.width = block.myaudio.currentTime * 100 / block.myaudio.duration + '%';

    });
    /* 
        wave animation----------------------------------------DONE
        play and pause ---------------------------------------DONE
        one player at the time -------------------------------DONE
        rajouter un player et use step and seek function -----
    */

    // this.myblock = new Block();
    // myblock.index = 99;
    // myblock.name = "Salut salut";
    // myblock.Play();

    $(this.fimg_impression_like).on('click', function () {
       
        $(this).each(function () {
            var attr_img_like = $(this).attr('src');
            if ( attr_img_like === 'src/icons/Like.png' ) {
                $(block.fimg_impression_like).attr('src', 'src/icons/like_rempli.png');
                push_notif_block('like');
            }
            if ( attr_img_like === 'src/icons/like_rempli.png' ) {
                $(block.fimg_impression_like).attr('src', 'src/icons/Like.png');
            }
          });
    });

    $(this.fimg_impression_echo).on('click', function () {
       
        $(this).each(function () {
            var attr_img_echo = $(this).attr('src');
            if ( attr_img_echo === 'src/icons/Echo.png' ) {
                $(block.fimg_impression_echo).attr('src', 'src/icons/echo_rempli.png');
                push_notif_block('echo');
            }
            if ( attr_img_echo === 'src/icons/echo_rempli.png' ) {
                $(block.fimg_impression_echo).attr('src', 'src/icons/Echo.png');
            }
          });
    });

    $(this.fimg_impression_comment).on('click', function () {
       
        $(this).each(function () {
            var attr_img_comment = $(this).attr('src');
            if ( attr_img_comment === 'src/icons/Comment.png' ) {
                $(block.fimg_impression_comment).attr('src', 'src/icons/comment_rempli.png');
                push_notif_block('comment');    
            }
            if ( attr_img_comment === 'src/icons/comment_rempli.png' ) {
                $(block.fimg_impression_comment).attr('src', 'src/icons/Comment.png');
            }
          });
    });
}


var all_blocks = [];

// $("#button2").click(function () {
//     var new_block = new block();
//     all_blocks.push(new_block);
// });