function duplicates() {

    this.block_flow = document.createElement('div');
    block_flow.className = 'fflow';
    document.getElementById('tab2').appendChild(block_flow);

    this.ftop_part = document.createElement('div');
    ftop_part.className = 'ftop_part';
    block_flow.appendChild(ftop_part);

    this.fposter_name = document.createElement('p');
    fposter_name.className = 'fposter_name';
    fposter_name.innerText = 'Vanessa';
    ftop_part.appendChild(fposter_name);

    this.fpost_date = document.createElement('p');
    fpost_date.className = 'fpost_date';
    fpost_date.innerText = '5 min';
    ftop_part.appendChild(fpost_date);

    this.fdots = document.createElement('p');
    fdots.className = 'fdots';
    fdots.innerText = '...';
    ftop_part.appendChild(fdots);

    this.fplay_button = document.createElement('img');
    fplay_button.className = 'fplay_button';
    fplay_button.id = 'playBtn';
    fplay_button.src = 'images/play.png';
    fplay_button.onclick = flowplay;
    ftop_part.appendChild(fplay_button);

    this.fpause_button = document.createElement('img');
    fpause_button.className = 'fpause_button';
    fpause_button.id = 'pauseBtn';
    fpause_button.src = 'images/pause.png';
    fpause_button.onclick = flowpause;
    ftop_part.appendChild(fpause_button);

    this.fposter_photo = document.createElement('div');
    fposter_photo.className = 'fposter_photo';
    ftop_part.appendChild(fposter_photo);

    this.ffollower1 = document.createElement('div');
    ffollower1.className = 'ffollower1';
    ftop_part.appendChild(ffollower1);

    this.ffollower2 = document.createElement('div');
    ffollower2.className = 'ffollower2';
    ftop_part.appendChild(ffollower2);

    this.ffollower3 = document.createElement('div');
    ffollower3.className = 'ffollower3';
    ftop_part.appendChild(ffollower3);

    this.waveform = document.createElement('div');
    waveform.id = 'waveform';
    ftop_part.appendChild(waveform);

    this.bar = document.createElement('div');
    bar.id = 'bar';
    ftop_part.appendChild(bar);

    this.progress = document.createElement('div');
    progress.id = (progress);
    ftop_part.appendChild(progress);

    this.fbottom_part = document.createElement('div');
    fbottom_part.className = 'fbottom_part';
    block_flow.appendChild(fbottom_part);

    this.fpost_title = document.createElement('p');
    fpost_title.className = 'fpost_title';
    fpost_title.innerText = 'What an Amasing Sound';
    fbottom_part.appendChild(fpost_title);

    this.fpost_description = document.createElement('p');
    fpost_description.className = 'fpost_description';
    fpost_description.innerText = 'very col sound recorded';
    fbottom_part.appendChild(fpost_description);

    this.fpost_tag = document.createElement('p');
    fpost_tag.className = 'fpost_tag';
    fpost_tag.innerText = '#Fresh #Sumer';
    fbottom_part.appendChild(fpost_tag);

    this.flike = document.createElement('div');
    flike.className = 'flike';
    fbottom_part.appendChild(flike);
    this.fimg_impression_like = document.createElement('img');
    fimg_impression_like.className = 'fimg_impression';
    fimg_impression_like.src = 'images/Like.png';
    flike.appendChild(fimg_impression_like);
    this.ftxt_impression_like = document.createElement('p');
    ftxt_impression_like.className = 'ftxt_impression';
    ftxt_impression_like.innerText = '2.5k';
    flike.appendChild(ftxt_impression_like);

    this.fecho = document.createElement('div');
    fecho.className = 'fecho';
    fbottom_part.appendChild(fecho);
    this.fimg_impression_echo = document.createElement('img');
    fimg_impression_echo.className = 'fimg_impression';
    fimg_impression_echo.src = 'images/echo.png';
    fecho.appendChild(fimg_impression_echo);
    this.ftxt_impression_echo = document.createElement('p');
    ftxt_impression_echo.className = 'ftxt_impression';
    ftxt_impression_echo.innerText = '8.2k';
    fecho.appendChild(ftxt_impression_echo);

    this.fcomment = document.createElement('div');
    fcomment.className = 'fcomment';
    fbottom_part.appendChild(fcomment);
    this.fimg_impression_comment = document.createElement('img');
    fimg_impression_comment.className = 'fimg_impression';
    fimg_impression_comment.src = 'images/comment.png';
    fcomment.appendChild(fimg_impression_comment);
    this.ftxt_impression_comment = document.createElement('p');
    ftxt_impression_comment.className = 'ftxt_impression';
    ftxt_impression_comment.innerText = '605';
    fcomment.appendChild(ftxt_impression_comment);


    var sound = new Howl({
        src: ['../www/howler.js/rave_digger.mp3']
    });

    var player1 = new Player([{

        howl: sound,
    }]);

    function flowplay() {
        player1.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    }

    function flowpause() {
        player1.pause();
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    }

    /* 
        wave animation--------------DONE
        div blur -------------------
        play and pause -------------
        one player at the time -----


    */


    // this.myblock = new Block();
    // myblock.index = 99;
    // myblock.name = "Salut salut";
    // myblock.Play();

}