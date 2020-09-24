var parent = $(".fblock_comment_content");
var current_comment_block;
var current_response_block;
var it_is_a_response = false;
var it_is_a_response_to_a_response = false;
var response_current_index = 0;
var nombre_de_reponses_restant;
// $(document).ready(function() {
//     $('.regex-example').highlightWithinTextarea({
//             highlight: /@[^ ]+/gi
//     });

// });

function block_response(response_data, response_is_specifique) {
    var block_response = this;
    this.Flow_block_id = response_data.Flow_block_id;
    this.ObjectId = response_data.Idresponse;
    this.private_Id = response_data.PrivateId;
    this.is_liked = response_data.IsLike;
    this.RegisterId = response_data.RegisterId;
    this.LastOs = response_data.LastOs;
    if (response_data.Comment) { // CTRL+F hack_response pour les explications
        this.fresponse_text = response_data.Comment;
        this.response_text = response_data.Comment_text;
    } else {
        this.fresponse_text = response_data.response;
        this.response_text = response_data.response_text;
    }
    this.last_like_time;

    this.fblock_response = document.createElement('div');
    this.fblock_response.className = 'fblock_response';
    if (response_is_specifique) {
        $(current_comment_block.fblock_response_container).prepend(this.fblock_response);
    } else {

        $(current_comment_block.fblock_response_container).append(this.fblock_response);
    }

    $(this.fblock_response).on('click', function () {
        current_response_block = block_response;
    });

    this.f_response_img_user = document.createElement('div');
    this.f_response_img_user.className = 'f_response_img_user';
    $(this.f_response_img_user).css("background-image", "url(" + response_data.ProfilePicture + "");
    $(this.fblock_response).append(this.f_response_img_user);

    this.f_response_id_user = document.createElement('label');
    this.f_response_id_user.className = 'f_response_id_user';
    this.f_response_id_user.innerHTML = "@" + response_data.PrivateId + "";
    $(this.fblock_response).append(this.f_response_id_user);

    this.fblock_response_response = document.createElement('p');
    this.fblock_response_response.className = 'fblock_response_response';
    this.fblock_response_response.innerHTML = this.fresponse_text + "<br>";
    $(this.fblock_response).append(this.fblock_response_response);

    this.f_response_date = document.createElement('label');
    this.f_response_date.className = 'f_response_date';
    this.f_response_date.innerHTML = response_data.Time == "0" ? "1 min" : set_timestamp(response_data.Time);
    $(this.fblock_response_response).append(this.f_response_date);

    this.fblock_response_label_repondre = document.createElement('label');
    this.fblock_response_label_repondre.className = 'fblock_response_label_repondre';
    this.fblock_response_label_repondre.innerHTML = "Répondre";
    $(this.fblock_response_response).append(this.fblock_response_label_repondre);

    $(this.fblock_response_label_repondre).on('click', function () {
        current_response_block = block_response;
        it_is_a_response = true;
        it_is_a_response_to_a_response = true;
        $("#finput_comment").focus();
    });

    this.fresponse_like = document.createElement('img');
    this.fresponse_like.className = 'fresponse_like';
    if (connected) {
        this.fresponse_like.src = this.is_liked == 0 ? "src/icons/Like.png" : "src/icons/Like_filled.png";
    } else {
        this.fresponse_like.src = "src/icons/Like.png";
    }
    $(this.fblock_response).append(this.fresponse_like);

    $(this.fresponse_like).on('click', function () { // like d'un response
        console.log("click sur le like d'une reponse");
        if (connected) {
            current_response_block = block_response;
            let data = {

                ObjectId: current_response_block.ObjectId,
            };
            ServerManager.LikeResponse(data, current_response_block);
        } else {
            Popup("popup-connect", true, 60);
        }
    });

    this.f_response_number_like = document.createElement('label');
    this.f_response_number_like.className = 'f_response_number_like';
    this.f_response_number_like.innerHTML = response_data.Like_number;
    $(this.fblock_response).append(this.f_response_number_like);

    this.fbr_1 = document.createElement('br');
    $(this.fblock_response).append(this.fbr_1);


    $$(this.fblock_response_response).on('taphold', function () {
        current_response_block = block_response;
        let delete_response = true;
        delete_comment_from_bdd(current_response_block, delete_response);
    });


    $(this.f_response_id_user).on('click', function () {

        let data = {
            private_Id: block_response.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
    });

}



function block_comment(comment_data, comment_is_specifique) {

    let block_comment = this;
    this.Flow_block_id = comment_data.Flow_block_id;
    this.ObjectId = comment_data.IdComment;
    this.private_Id = comment_data.PrivateId;
    this.is_liked = comment_data.IsLike;
    this.RegisterId = comment_data.RegisterId;
    this.LastOs = comment_data.LastOs;
    this.fcomment_text = comment_data.Comment;
    this.Comment_text = comment_data.Comment_text;
    this.last_like_time;
    this.nombre_de_reponses = +comment_data.Responses;
    this.was_hidden = false;
    this.response_container_previous_height;
    this.all_response_blocks = [];

    this.fblock_comment = document.createElement('div');
    this.fblock_comment.className = 'fblock_comment';
    if (comment_is_specifique) {
        $(".fblock_comment_content").prepend(this.fblock_comment);
    } else {

        $(".fblock_comment_content").append(this.fblock_comment);
    }

    $(this.fblock_comment).on('click', function () {
        current_comment_block = block_comment;
    });

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
    this.fdate.innerHTML = comment_data.Time == "0" ? "1 min" : set_timestamp(comment_data.Time);
    $(this.fblock_comment_comment).append(this.fdate);

    this.fblock_comment_label_repondre = document.createElement('label');
    this.fblock_comment_label_repondre.className = 'fblock_comment_label_repondre';
    this.fblock_comment_label_repondre.innerHTML = "Répondre";
    $(this.fblock_comment_comment).append(this.fblock_comment_label_repondre);

    $(this.fblock_comment_label_repondre).on('click', function () {
        current_comment_block = block_comment;
        current_response_block = undefined;
        it_is_a_response = true;
        $("#finput_comment").focus();
    });

    if (this.nombre_de_reponses > 0) {

        this.fblock_comment_label_afficher_les_reponses = document.createElement('label');
        this.fblock_comment_label_afficher_les_reponses.className = 'fblock_comment_label_afficher_les_reponses';
        this.fblock_comment_label_afficher_les_reponses.innerHTML = "Afficher les reponses (" + this.nombre_de_reponses + ")";
        $(this.fblock_comment_comment).append(this.fblock_comment_label_afficher_les_reponses);

        $(this.fblock_comment_label_afficher_les_reponses).on('click', function () {
            current_comment_block = block_comment;
            response_current_index = 0;
            if (current_comment_block.was_hidden == true) {
                //$(current_comment_block.fblock_response_container).animate({ height: current_comment_block.response_container_previous_height + "px" }, 'smooth');
                $(current_comment_block.fblock_response_container).css("height", "" + current_comment_block.response_container_previous_height + "px");
                $(current_comment_block.afficher_plus_de_reponses_container).css("display", "inline-flex");
            } else {
                let loading_tl = document.createElement("div");
                loading_tl.className = "loading-spinner loading_tl loading_response";
                $("#popup-comment").append(loading_tl);
                let data = {
                    ObjectId: current_comment_block.ObjectId,
                    Index: response_current_index

                };
                ServerManager.GetCommentResponse(data);

            }
            $(current_comment_block.fblock_comment_label_afficher_les_reponses).css("opacity", "0");
        });
    }

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

    this.fbr_1 = document.createElement('br');
    $(this.fblock_comment).append(this.fbr_1);

    this.fblock_response_container = document.createElement('div');
    this.fblock_response_container.className = 'fblock_response_container';
    (this.fblock_comment).append(this.fblock_response_container);

    this.afficher_plus_de_reponses_container = document.createElement('div');
    this.afficher_plus_de_reponses_container.className = 'afficher_plus_de_reponses_container';
    $(this.fblock_comment).append(this.afficher_plus_de_reponses_container);

    this.label_afficher_plus_de_reponses = document.createElement('label');
    this.label_afficher_plus_de_reponses.className = 'label_afficher_plus_de_reponses';
    this.label_afficher_plus_de_reponses.innerHTML = "Afficher plus (" + this.nombre_de_reponses + ")";
    $(this.afficher_plus_de_reponses_container).append(this.label_afficher_plus_de_reponses);

    $(this.label_afficher_plus_de_reponses).on('click', function () {
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading-spinner loading_tl loading_response";
        $("#popup-comment").append(loading_tl);
        $(current_comment_block.fblock_response_container).css("height", "");
        let data = {
            ObjectId: current_comment_block.ObjectId,
            Index: response_current_index

        };
        ServerManager.GetCommentResponse(data);
    });

    this.label_hide_and_up_arrow_grey_container = document.createElement('div');
    this.label_hide_and_up_arrow_grey_container.className = 'label_hide_and_up_arrow_grey_container';
    $(this.afficher_plus_de_reponses_container).append(this.label_hide_and_up_arrow_grey_container);

    $(this.label_hide_and_up_arrow_grey_container).on('click', function () {
        current_comment_block = block_comment;
        current_comment_block.response_container_previous_height = $(current_comment_block.fblock_response_container).height();
        let scroll_to = $(current_comment_block.fblock_comment).position();
        scroll_to = scroll_to.top;
        console.log("le scroll to top est : " + scroll_to);
        current_comment_block.was_hidden = true;
        scroll_to = $('.fblock_comment_content').scrollTop() + scroll_to - current_comment_block.response_container_previous_height / 2;
        $(current_comment_block.fblock_response_container).css("height", "0px");
        $(current_comment_block.afficher_plus_de_reponses_container).css("display", "none");
        $(current_comment_block.fblock_comment_label_afficher_les_reponses).css("opacity", "1");
        //$(".fblock_comment_content").scrollTop(scroll_to.top);
        setTimeout(function () {
            $(".fblock_comment_content").animate({
                scrollTop: scroll_to
            }, 400, 'swing');
        }, 350);

        //current_comment_block.scrollIntoView();

    });

    this.label_cacher_reponse = document.createElement('label');
    this.label_cacher_reponse.className = 'label_cacher_reponse';
    this.label_cacher_reponse.innerHTML = "Réduire";
    $(this.label_hide_and_up_arrow_grey_container).append(this.label_cacher_reponse);

    this.up_arrow_grey = document.createElement('img');
    this.up_arrow_grey.className = 'up_arrow_grey';
    this.up_arrow_grey.src = "src/icons/UpArrowGrey.png";
    $(this.label_hide_and_up_arrow_grey_container).append(this.up_arrow_grey);

    $(this.fcomment_like).on('click', function () { // like d'un commentaire
        console.log("click sur le like d'un commentaire");
        if (connected) {
            current_comment_block = block_comment;
            let data = {

                ObjectId: current_comment_block.ObjectId,
            };
            ServerManager.LikeFlowComment(data, current_comment_block);
        } else {
            Popup("popup-connect", true, 60);
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
    //alert("Ce commentaire a été signalé");
    navigator.notification.alert("Ce commentaire a été signalé", alertDismissed, "Information");
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

function display_response(response) { // affiche les reponses par 5

    if (typeof (response) != "string") {
        for (let i = 0; i < response.Data.length; i++) {
            const src_profile_img = 'https://' + response.LinkBuilder.Hostname + ':' + response.LinkBuilder.Port + '/images/' + response.Data[i].ProfilePicture.name + '?';
            const param_profile_img = `${response.LinkBuilder.Params.hash}=${response.Data[i].ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data[i].ProfilePicture.timestamp}`;
            let profilePicLink = src_profile_img + param_profile_img;

            let response_data = {
                response: response.Data[i].Comment,
                response_text: response.Data[i].Comment,
                Flow_block_id: current_flow_block.ObjectId,
                Idresponse: response.Data[i].IdResponse,
                IsLike: response.Data[i].IsLike,
                LastOs: response.Data[i].LastOs,
                Like_number: response.Data[i].Likes,
                PrivateId: response.Data[i].PrivateId,
                ProfilePicture: profilePicLink,
                RegisterId: response.Data[i].RegisterId,
                Time: response.Data[i].Time
            };
            response_data.response = response_data.response.replace(/@[^ ]+/gi, '<span class="tagged_users">$&</span>');
            let new_block_response = new block_response(response_data);

            for (let i = 0; i < current_comment_block.all_response_blocks.length; i++) {
                if (current_comment_block.all_response_blocks[i].ObjectId == new_block_response.ObjectId) {
                    $(new_block_response.fblock_response).remove();
                }
            }
            current_comment_block.all_response_blocks.push(new_block_response);

            $(".loading_tl").remove();
        }
        if (current_comment_block.nombre_de_reponses > 5) {
            current_comment_block.nombre_de_reponses = current_comment_block.nombre_de_reponses - 5;
        }
        if (response.Data.length < 5 || current_comment_block.nombre_de_reponses == 0) {
            $(current_comment_block.label_afficher_plus_de_reponses).css("display", "none");
        }
        $(current_comment_block.label_afficher_plus_de_reponses).text("Afficher plus (" + current_comment_block.nombre_de_reponses + ")");
        $(current_comment_block.afficher_plus_de_reponses_container).css("display", "inline-flex");
        if (response.Data.length <= 5) {

            response_current_index++;
        }
    } else {
        $(".loading_tl").remove();
    }

}

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
        RegisterId: "",
        current_flow_block: current_flow_block,
        tag_user_RegisterId: undefined,
        Responses: 0
    };

    let comment_number = parseInt($(".fcomment_number").text());
    let tableau_comment_to_tag_users = data.Comment.split(" ");
    comment_number = comment_number + 1;
    $(".fcomment_number").text(comment_number + " commentaire");
    if (comment_number > 1) {
        $(".fcomment_number").text(comment_number + " commentaires");
    }

    $(current_flow_block.ftxt_impression_comment).text(comment_number);
    if (comment_data.Comment == comment_data.Comment_text && registrationId != comment_data.current_flow_block.RegisterId) {
        comment_data.RegisterId = current_flow_block.RegisterId;
        send_notif_to_user(comment_data, "send_comment");
    } else {
        for (let i = 0; i < tableau_comment_to_tag_users.length; i++) {
            if (tableau_comment_to_tag_users[i].slice(0, 1) == "@") {
                for (let i_all_tag = 0; i_all_tag < all_tagged_users.length; i_all_tag++) {
                    if (tableau_comment_to_tag_users[i] == all_tagged_users[i_all_tag].private_Id &&
                        registrationId != all_tagged_users[i_all_tag].RegisterId) {
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
    $(".tick_icon").remove();
}

function send_response_to_server(data) {
    let response_data = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        ProfilePicture: window.localStorage.getItem("user_profile_pic"),
        Comment: data.Response,
        Comment_text: data.Response,
        Like_number: "0",
        Time: "0",
        IsLike: 0,
        Idresponse: data.IdResponse,
        RegisterId: "",
        current_comment_block: current_comment_block,
        current_flow_block: current_comment_block, //peut sembler etrange mais facilite l'envoi des notifs (case "send_comment") 
        tag_user_RegisterId: undefined
    };
    if (it_is_a_response == true && current_response_block != undefined) {
        response_data.current_flow_block = current_response_block;
    }
    /* 
        hack_response
    le response_data.Comment et Comment_text devraient etre des Responses et Responses_text
       mais flemme de créer une notifs specialement juste pour les reponses donc 
       je fais passer ça comme une notif de commentaire. 
    */


    if (current_comment_block.fblock_comment_label_afficher_les_reponses) {
        current_comment_block.nombre_de_reponses = +$(current_comment_block.fblock_comment_label_afficher_les_reponses).text().match(/\d+/)[0];
    }
    let initial_response_number = current_comment_block.nombre_de_reponses;
    let tableau_response_to_tag_users = data.Response.split(" ");
    current_comment_block.nombre_de_reponses = current_comment_block.nombre_de_reponses + 1;
    $(current_comment_block.fblock_comment_label_afficher_les_reponses).text("Afficher les reponses (" + current_comment_block.nombre_de_reponses + ")");
    if (response_data.Comment == response_data.Comment_text && registrationId != response_data.current_flow_block.RegisterId) {
        /* registrationId != response_data.current_flow_block.RegisterId permet de tester le RegisterId
            d'un block commentaire et d'un block response 
            car il ya le cas de reponses à un commentaire et le cas de reponse à une reponse
        */
        response_data.RegisterId = current_comment_block.RegisterId;
        send_notif_to_user(response_data, "send_response");
    } else {
        for (let i = 0; i < tableau_response_to_tag_users.length; i++) {
            if (tableau_response_to_tag_users[i].slice(0, 1) == "@") {
                for (let i_all_tag = 0; i_all_tag < all_tagged_users.length; i_all_tag++) {
                    if (tableau_response_to_tag_users[i] == all_tagged_users[i_all_tag].private_Id &&
                        registrationId != all_tagged_users[i_all_tag].RegisterId) {
                        response_data.RegisterId = all_tagged_users[i_all_tag].RegisterId;
                        send_notif_to_user(response_data, "tag_in_comment");
                    }
                }

            }
        }
    }
    all_tagged_users.length = 0;
    $(".hwt-backdrop").html(" ");
    if (it_is_a_response == true) {

        response_data.Comment = response_data.Comment.replace(/@[^ ]+/gi, '<span class="tagged_users">$&</span>');
    }
    $(current_comment_block.fblock_response_container).css("height", "auto");
    var new_block_response = new block_response(response_data);
    current_comment_block.all_response_blocks.push(new_block_response);
    console.log("response sucessfully added to database :");
    console.log("data du send response to server" + data + "");
    $(current_comment_block.label_afficher_plus_de_reponses).text("Afficher plus (" + current_comment_block.nombre_de_reponses + ")");
    $(current_comment_block.fblock_comment_label_afficher_les_reponses).css("opacity", "0");
    $(current_comment_block.afficher_plus_de_reponses_container).css("display", "inline-flex");
    if (response_current_index == 0 && current_comment_block.label_afficher_plus_de_reponses) {
        $(current_comment_block.label_afficher_plus_de_reponses).click();
    }
    if (initial_response_number == 0) {
        $(current_comment_block.label_afficher_plus_de_reponses).css("opacity", "0");
    }
    it_is_a_response = false;
    it_is_a_response_to_a_response = false;
    $(".tick_icon").remove();
}

// send comment
$('.fsend_comment').on('click', function () {

    var text = ($("#finput_comment").val()).trim();
    Popup("popup-identification", false, -5);
    let data;
    if (it_is_a_response == true) { // envoi de reponses
        data = {

            ObjectId: current_comment_block.ObjectId,
            Response: text
        };

        if (it_is_a_response_to_a_response == true &&
            current_response_block &&
            current_response_block.private_Id != window.localStorage.getItem("user_private_id")) {

            data.Response = "@" + current_response_block.private_Id + " " + text;
        }

        if (text == "") {
            //alert("Le commentaire est vide");
            navigator.notification.alert("Le commentaire est vide", alertDismissed, "Information");
        } else {

            $("#finput_comment").val("");

            ServerManager.AddCommentResponse(data);
        }


    } else { // envoi de commentaires
        data = {

            ObjectId: current_flow_block.ObjectId,
            Comment: text
        };

        if (text == "") {
            //alert("Le commentaire est vide");
            navigator.notification.alert("Le commentaire est vide", alertDismissed, "Information");
        } else {

            $("#finput_comment").val("");

            ServerManager.AddFlowComment(data);
        }
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

$(document).on('click', '.flow_tagged_users', function () {
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

if (window.cordova.platformId == "ios") {
    $("#finput_comment").focus(function () {
        setTimeout(
            function () {
                Popup("popup-comment", true, 55);
            }, 200)

    });

    $("#finput_comment").focusout(function () {
        setTimeout(
            function () {
                Popup("popup-comment", true, 40);
            }, 200)

    });
}

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

            let data_following = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: 0,
                follow_list: true
            };
            ServerManager.GetFollowingOfUser(data_following);
            IdentificationListCurrentIndex = 0;

        } else if (string_input_comment_split[split_lenght - 1].length > 1 && string_input_comment_split[split_lenght - 1] != "@") {

            for (let i = 0; i < 1; i++) {
                let data_user_search = {
                    Index: IdentificationListCurrentIndex,
                    Search: string_input_comment_split[split_lenght - 1].slice(1, string_input_comment_split[split_lenght - 1].length),
                    Nb: 10
                };
                ServerManager.SearchUserForTabExplore(data_user_search);
                IdentificationListCurrentIndex++;
                console.log("boucle :" + i);
                console.log("current index :" + IdentificationListCurrentIndex);
            }
            $(".popup_identification_container")[0].innerHTML = "";
        }
        if (window.cordova.platformId == "ios") {
            Popup("popup-identification", true, 55);
        } else {
            Popup("popup-identification", true, 5);
        }
    } else {
        Popup("popup-identification", false);
        IdentificationListCurrentIndex = 0;

    }

    var str1 = $("#finput_comment").val();
    var str2;
    console.log(str1);
});


function clean_all_tagged_users(all_tagged_users, flow_ObjectId, flow_title) {
    let flow_title_split = flow_title.split(" ");

    for (let i = 0; i < all_tagged_users.length; i++) {

        all_tagged_users[i].ObjectId = flow_ObjectId;
        all_tagged_users[i].Comment_text = flow_title; // c'est le titre du flow
        all_tagged_users[i].tag_in_flow = true;
        for (let i_ = 0; i_ < flow_title_split.length; i_++) {
            if (all_tagged_users[i].private_Id == flow_title_split[i_]) {
                send_notif_to_user(all_tagged_users[i], "tag_in_flow");
            }
        }

    }


}



$(document).on('keyup', '#finput_description', function () {

    string_input_comment = $("#finput_description").val();
    string_input_comment_split = string_input_comment.split(" ");

    IdentificationListCurrentIndex = 0;
    //ne plus looper sur tout le string_input_comment_split lenght
    var split_lenght = string_input_comment_split.length;

    if (string_input_comment_split[split_lenght - 1].slice(0, 1) == "@") {
        IdentificationListCurrentIndex = 0;
        if (string_input_comment_split[split_lenght - 1] == "@") {

            let data_following = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: 0,
                follow_list: true
            };
            ServerManager.GetFollowingOfUser(data_following);
            IdentificationListCurrentIndex = 0;

        } else if (string_input_comment_split[split_lenght - 1].length > 1 && string_input_comment_split[split_lenght - 1] != "@") {

            for (let i = 0; i < 1; i++) {
                let data_user_search = {
                    Index: IdentificationListCurrentIndex,
                    Search: string_input_comment_split[split_lenght - 1].slice(1, string_input_comment_split[split_lenght - 1].length),
                    Nb: 10
                };
                ServerManager.SearchUserForTabExplore(data_user_search);
                IdentificationListCurrentIndex++;
                console.log("boucle :" + i);
                console.log("current index :" + IdentificationListCurrentIndex);
            }
            $(".popup_identification_container")[0].innerHTML = "";
        }
        if (window.cordova.platformId == "ios") {
            Popup("popup-identification", true, 55);
        } else {
            Popup("popup-identification", true, 20);
        }
    } else {
        Popup("popup-identification", false);
        IdentificationListCurrentIndex = 0;

    }

});



document.getElementById("popup-identification").addEventListener("opened", function () {

    $(".after-record-block-container").css("margin-top", "-40vh");
});


document.getElementById("popup-identification").addEventListener("closed", function () {

    $(".after-record-block-container").css("margin-top", "");

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
    CommentListCurrentIndex = 0;
});

//Notif lors d'un nouveau commentaire

document.getElementById("popup-comment").addEventListener("closed", function () {
    $(".fwrite_comment")[0].style.display = "none";
    in_comments = false;
    CommentListCurrentIndex = 0;
    if (current_flow_block) {
        current_flow_block.all_comment_blocks.length = 0

    }
    if (current_comment_block) {

        current_comment_block.all_response_blocks.length = 0
    }
    /*rent_flow_block !== undefined) {
        current_flow_block.all_comment_blocks.length = 0;
    }*/
    // app.closeModal('#popover_comment');

});


function color_like(block, like) // like des commentaires et de reponses
{
    let now = Date.now();
    console.log("chris color like");
    if (block.fblock_response) { // si c'est un like de reponse
        if (like) {
            console.log("chris color is like like like ");

            $(block.fresponse_like).attr('src', 'src/icons/Like_filled.png');
            block.is_liked = 1;
            block.f_response_number_like.innerHTML = parseInt(block.f_response_number_like.innerHTML) + 1;
            if (block.last_like_time != undefined) {
                let last_like = Math.floor(((now - block.last_like_time) / 1000) / 60);
                if (last_like > 29 && registrationId != block.RegisterId) {
                    block.Comment_text = block.fresponse_text; // pour faciliter les notifs à redev ulterieurement
                    send_notif_to_user(block, "like_response");
                    block.last_like_time = Date.now();
                }
            } else if (block.last_like_time == undefined && registrationId != block.RegisterId) {
                block.Comment_text = block.fresponse_text; // pour faciliter les notifs à redev ulterieurement
                send_notif_to_user(block, "like_response");
                block.last_like_time = Date.now();
            }

        } else {
            $(block.fresponse_like).attr('src', 'src/icons/Like.png');
            block.is_liked = 0;
            block.f_response_number_like.innerHTML = parseInt(block.f_response_number_like.innerHTML) - 1;
        }

    } else { // si c'est un like de commentaire
        if (like) {
            console.log("chris color is like like like ");

            $(block.fcomment_like).attr('src', 'src/icons/Like_filled.png');
            block.is_liked = 1;
            block.fnumber_like.innerHTML = parseInt(block.fnumber_like.innerHTML) + 1;
            if (block.last_like_time != undefined) {
                let last_like = Math.floor(((now - block.last_like_time) / 1000) / 60);
                if (last_like > 29 && registrationId != block.RegisterId) {
                    send_notif_to_user(block, "like_comment");
                    block.last_like_time = Date.now();
                }
            } else if (block.last_like_time == undefined && registrationId != block.RegisterId) {
                send_notif_to_user(block, "like_comment");
                block.last_like_time = Date.now();
            }

        } else {
            $(block.fcomment_like).attr('src', 'src/icons/Like.png');
            block.is_liked = 0;
            block.fnumber_like.innerHTML = parseInt(block.fnumber_like.innerHTML) - 1;
        }
    }
}
///////-----mettre le array all comment block dans le block_flow--------/////////
//// FAIRE scroll onto view flow specifique/////////