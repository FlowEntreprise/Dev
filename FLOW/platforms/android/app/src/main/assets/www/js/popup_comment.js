function block_comment(pseudo, account_imageURL, comment) {

    var block_comment = this;
    this.block_comment = document.createElement('div');
    this.block_comment.className = 'fblock_comment';
    $(".fblock_comment_content").prepend(this.block_comment);

    this.fimg_user = document.createElement('div');
    this.fimg_user.className = 'fimg_user';
    $(this.fimg_user).css("background-image", "url(" + account_imageURL + "");
    $(this.block_comment).append(this.fimg_user);

    this.fid_user = document.createElement('label');
    this.fid_user.className = 'fid_user open-popover';
    this.fid_user.innerHTML = "@adc_98";
    $(this.block_comment).append(this.fid_user);

    this.fblock_comment_comment = document.createElement('p');
    this.fblock_comment_comment.className = 'fblock_comment_comment open-popover';
    this.fblock_comment_comment.innerHTML = comment;
    $(this.block_comment).append(this.fblock_comment_comment);

    this.fdate = document.createElement('label');
    this.fdate.className = 'fdate';
    this.fdate.innerHTML = "3days";
    $(this.block_comment).append(this.fdate);

    this.fcomment_like = document.createElement('img');
    this.fcomment_like.className = 'fcomment_like';
    this.fcomment_like.src = "src/icons/Like.png";
    $(this.block_comment).append(this.fcomment_like);

    this.fnumber_like = document.createElement('label');
    this.fnumber_like.className = 'fnumber_like';
    this.fnumber_like.innerHTML = "136";
    $(this.block_comment).append(this.fnumber_like);

    $(this.fcomment_like).on('click', function () {
        impression_coloring(this, 'like', block_comment.fcomment_like, "comment");
    });
}


$$('.fcomment').on('click', function () {
    app.popup('.popup_comment');
});

$$(".fclose_comment").on("click", function () {});

var pseudo = "@adc_98";
var account_imageURL = "src/pictures/notif1.png";

$('.fsend_comment').on('click', function () {

    var comment = ($(".finput_comment").val()).trim();
    $(".finput_comment").val("");
    var new_block_comment = new block_comment(pseudo, account_imageURL, comment);
    all_comments_block.push(new_block_comment);
    if(comment == "")
    {
        alert("Commentaire vide !!!");
    }
    
});


$(".finput_comment").keyup(function () {

    if ($(".finput_comment").val() != "") {
        $(".fsend_comment").css('filter', 'brightness(100%)');
        $(".fsend_comment").css('pointer-events', 'auto');
    } else if($(".finput_comment").val() == "") {
        $(".fsend_comment").css('filter', 'brightness(125%)');
        $(".fsend_comment").css('pointer-events', 'none');
    }
});

for (var i = 0; i < 6; i++) {
    var new_block_comment = new block_comment(pseudo, account_imageURL, comment);
}

var all_comments_block = [];