var parent = $(".fblock_comment_content");
var current_comment_block;

function block_comment(comment_data) {

    var block_comment = this;
    this.Flow_block_id = comment_data.Flow_block_id;
    this.Id = comment_data.IdComment;
    this.private_Id = comment_data.PrivateId;
    this.is_liked = comment_data.IsLike;
    this.RegisterId = comment_data.RegisterId;
    this.fcomment_text = comment_data.Comment;
    this.last_like_time;
    this.fblock_comment = document.createElement('div');
    this.fblock_comment.className = 'fblock_comment';
    $(".fblock_comment_content").prepend(this.fblock_comment);

    this.fimg_user = document.createElement('div');
    this.fimg_user.className = 'fimg_user';
    $(this.fimg_user).css("background-image", "url(" + comment_data.ProfilePicture + "");
    $(this.fblock_comment).append(this.fimg_user);

    this.fid_user = document.createElement('label');
    this.fid_user.className = 'fid_user';
    this.fid_user.innerHTML = "@" + comment_data.PrivateId + "";
    $(this.fblock_comment).append(this.fid_user);

    this.fblock_comment_comment = document.createElement('p');
    this.fblock_comment_comment.className = 'fblock_comment_comment';
    this.fblock_comment_comment.innerHTML = this.fcomment_text + "<br>";
    $(this.fblock_comment).append(this.fblock_comment_comment);

    this.fdate = document.createElement('label');
    this.fdate.className = 'fdate';
    this.fdate.innerHTML = comment_data.Time == "0" ? " 1 minute ago" : set_timestamp(comment_data.Time);
    $(this.fblock_comment_comment).append(this.fdate);

    this.fcomment_like = document.createElement('img');
    this.fcomment_like.className = 'fcomment_like';
    this.fcomment_like.src = this.is_liked == 0 ? "src/icons/Like.png" : "src/icons/Like_filled.png";
    console.log("lethis que l'on veut tu connais :  " + this.is_liked + "");
    $(this.fblock_comment).append(this.fcomment_like);

    this.fnumber_like = document.createElement('label');
    this.fnumber_like.className = 'fnumber_like';
    this.fnumber_like.innerHTML = comment_data.Like_number;
    $(this.fblock_comment).append(this.fnumber_like);

    $(this.fcomment_like).on('click', function () { // like d'un commentaire
        current_comment_block = block_comment;        
        let data = {

            ObjectId: current_comment_block.Id,
        };
        ServerManager.LikeFlowComment(data, current_comment_block);
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

    $(this.fimg_user).on('click', function () {

        let data = {
            private_Id: block_comment.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
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

function send_comment_to_server(data) {


    var comment_data = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        ProfilePicture: window.localStorage.getItem("user_profile_pic"),
        Comment: data.Comment,
        Like_number: "0",
        Time: "0",
        IsLike: 0,
        IdComment: data.IdComment,
        RegisterId: registrationId,
        current_flow_block: current_flow_block
    };

    let comment_number = parseInt($(".fcomment_number").text());
    comment_number = comment_number + 1;
    $(".fcomment_number").text(comment_number + " commentaires");
    $(current_flow_block.ftxt_impression_comment).text(comment_number);
    send_notif_to_user(comment_data, "send_comment");
    var new_block_comment = new block_comment(comment_data);
    var i = 0;
    current_flow_block.all_comment_blocks.push(new_block_comment);
    impression_coloring(this, 'comment', current_flow_block);
    console.log(current_flow_block.all_comment_blocks[0].fblock_comment);
    console.log("Comment sucessfully added to database :");
    console.log("data du send comment to server" + data + "");
}

$('.fsend_comment').on('click', function () {

    var comment = ($(".finput_comment").val()).trim();

    let data = {

        ObjectId: current_flow_block.ObjectId,
        Comment: comment
    }


    if (comment == "") {
        alert("Commentaire vide !!!");
    } else {

        $(".finput_comment").val("");

        ServerManager.AddFlowComment(data);
    }

});

//input des commentaires
$(".finput_comment").keyup(function () {


    $(".finput_comment").keypress(function(event) {
        console.log("la touche pressé est :" + event.key);
    });

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
document.getElementById("popup-comment").addEventListener("opened", function () {
    $(".fwrite_comment")[0].style.display = "block";
});

//Notif lors d'un nouveau commentaire

document.getElementById("popup-comment").addEventListener("closed", function () {
    $(".fwrite_comment")[0].style.display = "none";
});


function color_like(block, like) // like des commentaires
{
    let now = Date.now();
    console.log("chris color like");
    if (like) {
        console.log("chris color is like like like ");
        $(block.fcomment_like).attr('src', 'src/icons/Like_filled.png');        
        block.is_liked = 1;
        block.fnumber_like.innerHTML = parseInt(block.fnumber_like.innerHTML) + 1;
        if(block.last_like_time != undefined)
                    {
                    let last_like = Math.floor(((now - block.last_like_time) / 1000) / 60);
                    if(last_like > 29)
                    {
                    send_notif_to_user(block, "like_comment");
                    block.last_like_time = Date.now();
                    }
                    }
                    else if(block.last_like_time == undefined)
                    {
                        send_notif_to_user(block, "like_comment");
                        block.last_like_time = Date.now();
                    }

    } else {
        $(block.fcomment_like).attr('src', 'src/icons/Like.png');
        block.is_liked = 0;
        block.fnumber_like.innerHTML = parseInt(block.fnumber_like.innerHTML) - 1;
    }

}
///////-----mettre le array all comment block dans le block_flow--------/////////
//// FAIRE scroll onto view flow specifique/////////