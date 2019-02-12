function block() {

    var block = this;

    this.flowplay = function () {
        console.log("play");
        block.fplay_button.style.display = "none";
        block.fpause_button.style.display = "block";
        block.sound.play();
        wave.start();
        waveform.style.display = "block";
    }

    this.flowpause = function () {
        console.log("pause");
        block.fplay_button.style.display = "block";
        block.fpause_button.style.display = "none";
        block.sound.pause();
        waveform.style.display = "none";
        
        //waveform.removeChild(waveform.firstChild);
        wave.stop();
    }

    this.block_flow = document.createElement('div');
    this.block_flow.className = 'fflow';
    document.getElementById('tab2').appendChild(this.block_flow);

    this.ftop_part = document.createElement('div');
    this.ftop_part.className = 'ftop_part';
    this.block_flow.appendChild(this.ftop_part);

    this.fposter_name = document.createElement('p');
    this.fposter_name.className = 'fposter_name';
    this.fposter_name.innerText = 'Vanessa';
    this.ftop_part.appendChild(this.fposter_name);

    this.fpost_date = document.createElement('p');
    this.fpost_date.className = 'fpost_date';
    this.fpost_date.innerText = '5 min';
    this.ftop_part.appendChild(this.fpost_date);

    this.fdots = document.createElement('p');
    this.fdots.className = 'fdots';
    this.fdots.innerText = '...';
    this.ftop_part.appendChild(this.fdots);

    this.fplay_button = document.createElement('img');
    this.fplay_button.className = 'fplay_button';
    this.fplay_button.id = 'playBtn';
    this.fplay_button.src = 'images/play.png';
    this.ftop_part.appendChild(this.fplay_button);

    this.fpause_button = document.createElement('img');
    this.fpause_button.className = 'fpause_button';
    this.fpause_button.id = 'pauseBtn';
    // fpause_button.style.visibility = 'hidden';
    this.fpause_button.src = 'images/pause.png';
    this.ftop_part.appendChild(this.fpause_button);

    this.fposter_photo = document.createElement('div');
    this.fposter_photo.className = 'fposter_photo';
    this.ftop_part.appendChild(this.fposter_photo);

    this.ffollower1 = document.createElement('div');
    this.ffollower1.className = 'ffollower1';
    this.ftop_part.appendChild(this.ffollower1);

    this.ffollower2 = document.createElement('div');
    this.ffollower2.className = 'ffollower2';
    this.ftop_part.appendChild(this.ffollower2);

    this.ffollower3 = document.createElement('div');
    this.ffollower3.className = 'ffollower3';
    this.ftop_part.appendChild(this.ffollower3);

    var waveform = document.createElement('div');
    waveform.id = 'waveform';
    waveform.style.display = 'none';
    this.ftop_part.appendChild(waveform);

    this.bar = document.createElement('div');
    this.bar.id = 'bar';
    this.ftop_part.appendChild(this.bar);

    this.progress = document.createElement('div');
    this.progress.id = (this.progress);
    this.ftop_part.appendChild(this.progress);

    this.fbottom_part = document.createElement('div');
    this.fbottom_part.className = 'fbottom_part';
    this.block_flow.appendChild(this.fbottom_part);

    this.fpost_title = document.createElement('p');
    this.fpost_title.className = 'fpost_title';
    this.fpost_title.innerText = 'What an Amasing Sound';
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
    this.fimg_impression_like.src = 'images/Like.png';
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
    this.fimg_impression_echo.src = 'images/echo.png';
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
    this.fimg_impression_comment.src = 'images/comment.png';
    this.fcomment.appendChild(this.fimg_impression_comment);
    this.ftxt_impression_comment = document.createElement('p');
    this.ftxt_impression_comment.className = 'ftxt_impression';
    this.ftxt_impression_comment.innerText = '605';
    this.fcomment.appendChild(this.ftxt_impression_comment);

    var wave;
    
    wave = new SiriWave({
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



    this.sound = new Howl({
        src: ['../www/howler.js/rave_digger.mp3'],
        html5: true,
        onplay: function () {
            // Display the duration.
            /* duration.innerHTML = self.formatTime(Math.round(sound.duration()));
            console.log((Math.round(sound.duration())));
            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(self)); */

            // Start the wave animation if we have already loaded
            wave.container.style.display = 'block';


            // $(".fplay_button").hide();
            // $(".fpause_button").show();
        },
        onload: function () {
            // Start the wave animation.
            //wave.container.style.display = 'none';
            bar.style.display = 'none';
            loading.style.display = 'none';
        },
        onend: function () {
            // Stop the wave animation.
            //wave.container.style.display = 'none';
            bar.style.display = 'none';
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'block';

            // self.skip('next');
        },
        onpause: function () {
            // Stop the wave animation.
            //wave.container.style.display = 'none';

            // this.fplay_button.style.display = "block";
            // this.fpause_button.style.display = "none";
            // $(".fplay_button").show(); 
            // $(".fpause_button").hide();

        },
        onstop: function () {
            // Stop the wave animation.
            //wave.container.style.display = 'none';
            bar.style.display = 'block';

        },
        onseek: function () {
            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(self));
        },
    });

    
    this.fplay_button.addEventListener('click', function() {
        block.flowplay(block);
    });
    this.fpause_button.addEventListener('click', function() {
        block.flowpause(block);
    });



    /* 
        wave animation----------------------------------------DONE
        div blur ---------------------------------------------
        play and pause ---------------------------------------
        one player at the time -------------------------------
        rajouter un player et use step and seek function -----
    */


    // this.myblock = new Block();
    // myblock.index = 99;
    // myblock.name = "Salut salut";
    // myblock.Play();
    
}

var all_blocks = [];

$("#button2").click(function () {
    var new_block = new block();
    all_blocks.push(new_block);
});