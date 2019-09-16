var parent = $(".fblock_comment_content");
var current_comment_block;

function block_comment(comment_data) {

    var block_comment = this;
    this.Id = comment_data.IdComment;
    this.is_liked = comment_data.IsLike;
    this.fcomment_text = comment_data.Comment;
    this.fblock_comment = document.createElement('div');
    this.fblock_comment.className = 'fblock_comment';
    $(".fblock_comment_content").prepend(this.fblock_comment);

    this.fimg_user = document.createElement('div');
    this.fimg_user.className = 'fimg_user';
    $(this.fimg_user).css("background-image", "url(" + comment_data.ProfilePicture + "");
    $(this.fblock_comment).append(this.fimg_user);

    this.fid_user = document.createElement('label');
    this.fid_user.className = 'fid_user';
    this.fid_user.innerHTML = "@"+comment_data.PrivateId+"";
    $(this.fblock_comment).append(this.fid_user);

    this.fblock_comment_comment = document.createElement('p');
    this.fblock_comment_comment.className = 'fblock_comment_comment';
    this.fblock_comment_comment.innerHTML = this.fcomment_text + "<br>";
    $(this.fblock_comment).append(this.fblock_comment_comment);

    this.fdate = document.createElement('label');
    this.fdate.className = 'fdate';
    this.fdate.innerHTML = comment_data.Time == "0" ?  " 1 minute ago" : set_timestamp(comment_data.Time);
    $(this.fblock_comment_comment).append(this.fdate);

    this.fcomment_like = document.createElement('img');
    this.fcomment_like.className = 'fcomment_like';
    this.fcomment_like.src = this.is_liked == 0 ? "src/icons/Like.png" : "src/icons/Like_filled.png" ;
    console.log("lethis que l'on veut tu connais :  "+this.is_liked+"");
    $(this.fblock_comment).append(this.fcomment_like);

    this.fnumber_like = document.createElement('label');
    this.fnumber_like.className = 'fnumber_like';
    this.fnumber_like.innerHTML = comment_data.Like_number;
    $(this.fblock_comment).append(this.fnumber_like);

    $(this.fcomment_like).on('click', function () {
        current_comment_block = block_comment;
        let data = {

            ObjectId : current_comment_block.Id,
        };        
        ServerManager.LikeFlowComment(data,current_comment_block);
    });


    $$(this.fid_user).on('taphold', function () {
        var clickedLink = this;
        app.popover('.popover', clickedLink);


    });


    $$(this.fblock_comment_comment).on('taphold', function () {
        var clickedLink = this;
        current_comment_block = block_comment;
        app.popover('.popover', clickedLink);

    });

}

$(".fpopover_button").on("click", function () {

    app.closeModal('.popover');
});

$(".fpopover_copy").on("click", function () {
    copyToClipboard(current_comment_block.fcomment_text);
});

$(".fpopover_report").on("click", function () {
    alert("This comment was reported");
});

$(".fpopover_delete").on("click", function () {
    console.log("delete");
    //var test = $(this.fimg_user).closest("div");
    delete_comment(current_comment_block.fblock_comment);
});

//copy de commentaire
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    console.log('copy');
};

var pseudo = "@adc_98";
var account_imageURL = "src/pictures/notif1.png";

//post de commentaire

function send_comment_to_server(data)
{

       
    var comment_data = {
        PrivateId      : window.localStorage.getItem("user_private_id"),
        ProfilePicture : window.localStorage.getItem("user_profile_pic"),
        Comment        : data.Comment,
        Like_number    : "0",
        Time           : "0" ,
        IsLike         : 0,
        IdComment      : data.IdComment,
        RegistrationId : registrationId,
        current_flow_block : current_flow_block
    };

    send_notif_to_user(comment_data,"send_comment");

    var new_block_comment = new block_comment(comment_data);
    var i = 0;
    current_flow_block.all_comment_blocks.push(new_block_comment);
    console.log(current_flow_block.all_comment_blocks[0].fblock_comment);
    
    console.log("Comment sucessfully added to database :");
    console.log("data du send comment to server"+data+"");
}

$('.fsend_comment').on('click', function () {

    var comment = ($(".finput_comment").val()).trim();

    let data = {

        ObjectId : current_flow_block.ObjectId,
        Comment : comment
    }
    

    if (comment == "") {
        alert("Commentaire vide !!!");
    } 
    else {

        $(".finput_comment").val("");
        
        ServerManager.AddFlowComment(data);
    }

});

//input des commentaires
$(".finput_comment").keyup(function () {

    if (($(".finput_comment").val()).trim() != "") {
        $(".fsend_comment").css('filter', 'brightness(100%)');
        $(".fsend_comment").css('pointer-events', 'auto');
    } else if (($(".finput_comment").val()).trim() == "") {
        $(".fsend_comment").css('filter', 'brightness(200%)');
        $(".fsend_comment").css('pointer-events', 'none');
    }
});

//supression de commentaire
function delete_comment(element) {
    for (var i = 0; i < current_flow_block.all_comment_blocks.length; i++) {
        if (current_flow_block.all_comment_blocks[i] == current_comment_block) {
            current_flow_block.all_comment_blocks.splice(i, 1);

        }
    }

    $(element).remove();

}

//Notif lors d'un nouveau commentaire

$$('.popup_comment').on('popup:close', function () {
    var comment_lenght = current_flow_block.all_comment_blocks.length;
    if (comment_lenght > 0) {
        $(current_flow_block.fimg_impression_comment).attr('src', 'src/icons/Comment_filled.png');

        $(".fred_dot_toolbar_new_notif").css("display", "block");

    } else {
        $(current_flow_block.fimg_impression_comment).attr('src', 'src/icons/Comment.png');
    }

});


function color_like(block,like) // like des commentaires
{
    console.log("chris color like");
    if(like)
    {
        console.log("chris color is like like like ");
        $(block.fcomment_like).attr('src', 'src/icons/Like_filled.png');
        send_notif_to_user(block,"like_comment");
        block.is_liked = 1;
        block.fnumber_like.innerHTML = parseInt(block.fnumber_like.innerHTML) + 1;
    }
    else
    {
        $(block.fcomment_like).attr('src', 'src/icons/Like.png');
        block.is_liked = 0;
        block.fnumber_like.innerHTML = parseInt(block.fnumber_like.innerHTML) - 1;
    }

}
///////-----mettre le array all comment block dans le block_flow--------/////////
//// FAIRE scroll onto view flow specifique/////////