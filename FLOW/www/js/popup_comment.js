var parent = $(".fblock_comment_content");
var current_comment_block;
var identification_request_inprogess = false;
var last_identifcation_txt = "";
// $(document).ready(function() {
//     $('.regex-example').highlightWithinTextarea({
//             highlight: /@[^ ]+/gi
//     });

// });


function block_comment(comment_data) {

    var block_comment = this;
    this.Flow_block_id = comment_data.Flow_block_id;
    this.Id = comment_data.IdComment;
    this.private_Id = comment_data.PrivateId;
    this.is_liked = comment_data.IsLike;
    this.RegisterId = comment_data.RegisterId;
    this.LastOs = comment_data.LastOs;
    this.fcomment_text = comment_data.Comment;
    this.Comment_text = comment_data.Comment_text;
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
    this.fdate.innerHTML = comment_data.Time == "0" ? " il y a 1 minute" : set_timestamp(comment_data.Time);
    $(this.fblock_comment_comment).append(this.fdate);

    this.fcomment_like = document.createElement('img');
    this.fcomment_like.className = 'fcomment_like';
    if (connected) {
        this.fcomment_like.src = this.is_liked == 0 ? "src/icons/Like.png" : "src/icons/Like_filled.png";
    } else {
        this.fcomment_like.src = "src/icons/Like.png";
    }
    $(this.fblock_comment).append(this.fcomment_like);

    this.fnumber_like = document.createElement('label');
    this.fnumber_like.className = 'fnumber_like';
    this.fnumber_like.innerHTML = comment_data.Like_number;
    $(this.fblock_comment).append(this.fnumber_like);

    $(this.fcomment_like).on('click', function () { // like d'un commentaire
        if (connected) {
            current_comment_block = block_comment;
            let data = {

                ObjectId: current_comment_block.Id,
            };
            ServerManager.LikeFlowComment(data, current_comment_block);
        } else {
            Popup("popup-connect", true, 40);
        }
    });

    $$(this.fid_user).on('taphold', function () {
        var clickedLink = this;
        // app.popover('#popover_comment', clickedLink);

    });


    $$(this.fblock_comment_comment).on('taphold', function () {
        var clickedLink = this;
        current_comment_block = block_comment;
        delete_comment_from_bdd(current_comment_block);
    });



    $(this.fimg_user).on('click', function () {

        let data = {
            private_Id: block_comment.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
    });

    /* $(block_comment).find("span").on('click',function()
    {
        let data = 
        {
            private_Id : $(this).text().slice(1),
            user_private_Id : window.localStorage.getItem("user_private_id") 
        };
        go_to_account(data);
    });*/

}

$(".fpopover_button").on("touchend", function () {
    app.closeModal('.popover');
});

$(".fpopover_copy_comment").on("touchend", function () {
    copyToClipboard(current_comment_block.fcomment_text);
});

$(".fpopover_report_comment").on("touchend", function () {
    alert("Ce commentaire a été signalé");
});

$(".fpopover_delete_comment").on("touchend", function () {
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


    let comment_data = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        ProfilePicture: window.localStorage.getItem("user_profile_pic"),
        Comment: data.Comment.replace(/@[^ ]+/gi, '<span class="tagged_users">$&</span>'),
        Comment_text: data.Comment,
        Like_number: "0",
        Time: "0",
        IsLike: 0,
        IdComment: data.IdComment,
        //RegisterId: registrationId,
        current_flow_block: current_flow_block,
        tag_user_RegisterId: undefined
    };

    let comment_number = parseInt($(".fcomment_number").text());
    let tableau_comment_to_tag_users = data.Comment.split(" ");
    comment_number = comment_number + 1;
    $(".fcomment_number").text(comment_number + " commentaires");
    $(current_flow_block.ftxt_impression_comment).text(comment_number);
    if (comment_data.Comment == comment_data.Comment_text) {
        send_notif_to_user(comment_data, "send_comment");
    } else {
        for (let i = 0; i < tableau_comment_to_tag_users.length; i++) {
            if (tableau_comment_to_tag_users[i].slice(0, 1) == "@") {
                for (let i_all_tag = 0; i_all_tag < all_tagged_users.length; i_all_tag++) {
                    if (tableau_comment_to_tag_users[i] == all_tagged_users[i_all_tag].private_Id) {
                        comment_data.tag_user_RegisterId = all_tagged_users[i_all_tag].RegisterId;
                        send_notif_to_user(comment_data, "tag_in_comment");
                    }
                }

            }
        }
    }
    all_tagged_users.length = 0;
    $(".hwt-backdrop").html(" ");
    var new_block_comment = new block_comment(comment_data);
    current_flow_block.all_comment_blocks.push(new_block_comment);
    impression_coloring(this, 'comment', current_flow_block);
    console.log(current_flow_block.all_comment_blocks[0].fblock_comment);
    console.log("Comment sucessfully added to database :");
    console.log("data du send comment to server" + data + "");
}


$('.fsend_comment').on('click', function () {

    var comment = ($("#finput_comment").val()).trim();

    let data = {

        ObjectId: current_flow_block.ObjectId,
        Comment: comment
    };


    if (comment == "") {
        alert("Le commentaire est vide");
    } else {

        $("#finput_comment").val("");

        ServerManager.AddFlowComment(data);
    }

});



$(".finput_comment").keypress(function (event) {
    console.log("la touche pressé est :" + event.key);
});

$(document).on('click', '.tagged_users', function () {
    let tagged_user_private_id = ($(this).text()).slice(1);
    let data = {
        private_Id: tagged_user_private_id,
        user_private_Id: window.localStorage.getItem("user_private_id")
    };
    go_to_account(data);
});

var string_input_comment;
var all_search_users_with_follow = [];
var all_search_users_without_follow = [];
var current_search;

function get_users_with_follow(data) {
    UpdateIdentificationList(data, true, "yes_search");
};

//input des commentaires

$('#finput_comment').on('paste', function () {
    $(".fsend_comment").css('filter', 'brightness(100%)');
    $(".fsend_comment").css('pointer-events', 'auto');
});

$("input").focus(function () {
    $(".hwt-backdrop").css("top", "0vh !important");
});

$("#finput_comment").keyup(function () {

    if (($("#finput_comment").val()).trim() != "") {
        $(".fsend_comment").css('filter', 'brightness(100%)');
        $(".fsend_comment").css('pointer-events', 'auto');
    } else if (($("#finput_comment").val()).trim() == "") {
        $(".fsend_comment").css('filter', 'brightness(200%)');
        $(".fsend_comment").css('pointer-events', 'none');
    }

    string_input_comment = $("#finput_comment").val();
    string_input_comment_split = string_input_comment.split(" ");

    IdentificationListCurrentIndex = 0;
    //ne plus looper sur tout le string_input_comment_split lenght
    var split_lenght = string_input_comment_split.length;

    if (string_input_comment_split[split_lenght - 1].slice(0, 1) == "@") {
        IdentificationListCurrentIndex = 0;
        if (string_input_comment_split[split_lenght - 1] == "@") {
            // quand le input est juste un @ on affiche la ligne des followings
            let data_following = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: 0,
                follow_list: true
            };
            ServerManager.GetFollowingOfUser(data_following);
            IdentificationListCurrentIndex = 0;

        }
        if (string_input_comment_split[split_lenght - 1].length > 1 && string_input_comment_split[split_lenght - 1] != "@") {
            // quand le input debute par un @ et est suivi d'un character
            current_search = string_input_comment_split[split_lenght - 1].slice(1, string_input_comment_split[split_lenght - 1].length);
            if (!identification_request_inprogess) {
                last_identifcation_txt = current_search;
                let data_user_search = {
                    Index: IdentificationListCurrentIndex,
                    Search: current_search,
                    Nb: 10
                };
                ServerManager.SearchUserForTabExplore(data_user_search);
                IdentificationListCurrentIndex++;
                console.log("current index :" + IdentificationListCurrentIndex);
                console.log("let mot recherché est  :" + current_search);
                identification_request_inprogess = true;
            }
        }
        Popup("popup-identification", true, -6);
    } else {
        Popup("popup-identification", false, -5);
        IdentificationListCurrentIndex = 0;

    }

    var str1 = $("#finput_comment").val();
    var str2;
    console.log(str1);
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
    $(".fwrite_comment").css("display", "block");
    in_comments = true;
});

//Notif lors d'un nouveau commentaire

document.getElementById("popup-comment").addEventListener("closed", function () {
    $(".fwrite_comment")[0].style.display = "none";
    in_comments = false;
    current_flow_block.all_comment_blocks.length = 0;
    // app.closeModal('#popover_comment');

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
        if (block.last_like_time != undefined) {
            let last_like = Math.floor(((now - block.last_like_time) / 1000) / 60);
            if (last_like > 29) {
                send_notif_to_user(block, "like_comment");
                block.last_like_time = Date.now();
            }
        } else if (block.last_like_time == undefined) {
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