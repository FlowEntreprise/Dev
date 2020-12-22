var all_notifications_block = [];
var loading_before_popup_specifique;
var current_notification_block;
var CanRefreshNotificationList = true;
var NotificationListCurrentIndex = 0;
var notification_list_empty = true;

function notifications_tab_loaded() {
    $(".fnotif-btn").on("click", function () {
        // var home_scrolling = false;
        if (current_page == "notifications") {

            set_all_notifs_to_seen();
            let element = document.getElementById("tab4");
            // element.onscroll = function() {
            //     home_scrolling = true;
            // };
            let last_scrollTop = element.scrollTop;
            const scrollToTop = () => {
                const c = element.scrollTop;
                if (c > 0 && c <= last_scrollTop) {
                    window.requestAnimationFrame(scrollToTop);
                    element.scrollTo(0, c - c / 8);
                    last_scrollTop = c;
                }
            };
            scrollToTop();
        } else {
            //all_notifications_block.length = [];
        }
    });

    // Initialize notifs pull to refresh
    notifs_ptr = setupPTR(document.querySelector(".notifications_parent"), function () {
        refresh_notif(true);
    });

    // Scroll to load notifications
    $(".notifications_parent").scroll(function () {
        var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
        if (CanRefreshNotificationList == true) {
            if (Math.round($(this).scrollTop()) >= limit * 0.75) {
                CanRefreshNotificationList = false;
                var data_update_Notification_list = {
                    PrivateId: window.localStorage.getItem("user_private_id"),
                    Index: NotificationListCurrentIndex
                };
                ServerManager.GetNotificationOfUser(data_update_Notification_list);
            }
        }
    });

}

function block_notification_like(data) { //type permet de defini si c'est le like d'un flow ou le like d'un commentaire
    this.seen = !!+data.IsView;
    var block_notification_like = this;
    if (data.additionalData) {
        this.full_name = data.additionalData.sender_info.fullname; // nom de celui qui a send la notif
        this.message = data.additionalData.sender_info.post_texte; // le contenue de la notif, text de commentaire ou titre de flow
        this.photo_link = data.additionalData.sender_info.profil_pic; // lien de la photo de celui qui a send la notif
        this.like_comment = data.additionalData.type;
        this.private_Id = data.additionalData.sender_info.privateId;
        this.time = Date.now();
        this.IdFlow = data.additionalData.sender_info.IdFlow;
        this.Id_comment = data.additionalData.sender_info.Id_comment;
        this.Id_response = data.additionalData.sender_info.Id_response;
        this.seen = false;
        this.type = data.additionalData.type;

    } else {
        this.full_name = data.FullName;
        this.message = data.Content;
        this.photo_link = data.ProfilePicture;
        this.like_comment = data.TypeOfNotification;
        this.private_Id = data.PrivateId;
        this.time = data.Time;
        this.type = data.TypeOfNotification;
        if (data.TypeOfNotification == "like_comment" || data.TypeOfNotification == "send_comment") {
            this.Id_comment = data.ObjectId;
        }
        if (data.TypeOfNotification == "like_response" || data.TypeOfNotification == "send_response") {
            this.Id_response = data.ObjectId;
        }
        if (data.TypeOfNotification == "like_flow") {
            this.IdFlow = data.ObjectId;
        }

    }
    this.seen = !!+data.IsView;
    this.IdNotif = data.IdNotif;


    if (this.message.length > 28) this.message = this.message.substring(0, 28) + "...";

    this.block_notification_like = document.createElement('div');
    this.block_notification_like.className = 'fblock_notification';
    $(".list-notif-block").append(this.block_notification_like);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_like';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_like.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Like_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = '@' + this.private_Id + ' a aimé ton flow';
    this.fnotif_label.style.top = "2.5vh";
    if (block_notification_like.like_comment == "like_comment") {
        let txt = '@' + this.private_Id + ' a aimé ton commentaire';
        if (txt.length > 28) txt = txt.substring(0, 28) + "...";
        this.fnotif_label.innerText = txt;
    }
    if (block_notification_like.like_comment == "like_response") {
        let txt = '@' + this.private_Id + ' a aimé ta réponse';
        if (txt.length > 28) txt = txt.substring(0, 28) + "...";
        this.fnotif_label.innerText = txt;
    }
    this.block_notification_like.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
    this.block_notification_like.appendChild(this.fnotif_text);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_like';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_like.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Like_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.style.top = "2.5vh";
    this.fnotif_label.innerText = '@' + this.private_Id + ' a aimé ton flow';
    if (block_notification_like.like_comment == "like_comment") {
        let txt = '@' + this.private_Id + ' a aimé ton commentaire';
        if (txt.length > 28) txt = txt.substring(0, 28) + "...";
        this.fnotif_label.innerText = txt;
    }
    if (block_notification_like.like_comment == "like_response") {
        let txt = '@' + this.private_Id + ' a aimé ta réponse';
        if (txt.length > 28) txt = txt.substring(0, 28) + "...";
        this.fnotif_label.innerText = txt;
    }
    this.block_notification_like.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
    this.block_notification_like.appendChild(this.fnotif_text);

    if (block_notification_like.seen == false) {
        this.fred_dot_border = document.createElement('label');
        this.fred_dot_border.className = 'fred_dot_border';
        this.block_notification_like.appendChild(this.fred_dot_border);

        this.fred_dot = document.createElement('label');
        this.fred_dot.className = 'fred_dot';
        this.fred_dot_border.appendChild(this.fred_dot);
    }

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = set_timestamp(this.time);
    this.block_notification_like.appendChild(this.ftime);


    $(this.block_notification_like).on("click", function () {
        current_notification_block = block_notification_like;
        loading_before_popup_specifique = document.createElement("div");
        loading_before_popup_specifique.className = "loading-spinner loading_tl";
        $("#tab4").append(loading_before_popup_specifique);
        $(loading_before_popup_specifique).css("top", "46vh");
        $(block_notification_like.fred_dot_border).css('display', 'none');
        console.log("le point rouge shoud disparaitre pour de la notif de like");
        set_seen(block_notification_like);
        check_seen();
        $(".flow_specifique_container").html("");

        // c'est like_comment partout mais ça devrait etre juste le type de like
        if (block_notification_like.like_comment == "like_comment" || block_notification_like.like_comment == "send_comment") {
            let data_single_comment = {
                ObjectId: block_notification_like.Id_comment
            };
            ServerManager.GetSingleComment(data_single_comment);
        }
        if (block_notification_like.like_comment == "like_response" || block_notification_like.like_comment == "send_response") {
            let data_single_response = {
                ObjectId: block_notification_like.Id_response
            };
            ServerManager.GetSingleResponseExtended(data_single_response);
        }
        if (block_notification_like.like_comment == "like_flow") {
            let data_flow = {
                IdFlow: block_notification_like.IdFlow
            };
            ServerManager.GetSingle(data_flow);
        }
    });

    $(this.fphoto_block_notif).on('click', function (event) {

        let data = {
            private_Id: block_notification_like.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
        event.stopPropagation();
    });
}


function block_notification_comment(data) {
    this.seen = !!+data.IsView;
    var block_notification_comment = this;
    if (data.additionalData) {
        this.full_name = data.additionalData.sender_info.fullname;
        this.message = data.additionalData.sender_info.post_texte;
        this.photo_link = data.additionalData.sender_info.profil_pic;
        this.like_comment = data.additionalData.type;
        this.private_Id = data.additionalData.sender_info.privateId;
        this.time = Date.now();
        this.IdFlow = data.additionalData.sender_info.IdFlow;
        this.Id_comment = data.additionalData.sender_info.Id_comment;
        this.seen = false;
        this.type = data.additionalData.type;

    } else {
        this.full_name = data.FullName;
        this.message = data.Content;
        this.photo_link = data.ProfilePicture;
        this.like_comment = data.TypeOfNotification;
        this.private_Id = data.PrivateId;
        this.time = data.Time;
        this.seen = !!+data.IsView;
        this.IdNotif = data.IdNotif;
        this.type = data.TypeOfNotification;
        if (data.TypeOfNotification == "like_comment" || data.TypeOfNotification == "send_comment") {
            this.Id_comment = data.ObjectId;
        }
        if (data.TypeOfNotification == "like_response" || data.TypeOfNotification == "send_response") {
            this.Id_response = data.ObjectId;
        }
        if (data.TypeOfNotification == "tag_in_flow") {
            this.IdFlow = data.ObjectId;
        }
    }
    if (this.message.length > 28) this.message = this.message.substring(0, 28) + "...";
    this.block_notification_comment = document.createElement('div');
    this.block_notification_comment.className = 'fblock_notification';
    $(".list-notif-block").append(this.block_notification_comment);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_comment';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_comment.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Comment_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    if (data.TypeOfNotification == "send_comment") {
        this.fnotif_label.innerText = '@' + this.private_Id + " a commenté ";
        if (this.fnotif_label.innerText.length > 28) this.fnotif_label.innerText = this.fnotif_label.innerText.substring(0, 28) + "...";
    }
    if (data.TypeOfNotification == "send_response") {
        this.fnotif_label.innerText = '@' + this.private_Id + " a répondu";
        if (this.fnotif_label.innerText.length > 28) this.fnotif_label.innerText = this.fnotif_label.innerText.substring(0, 28) + "...";
    }

    if (data.TypeOfNotification == "tag_in_flow") {
        this.fnotif_label.innerText = '@' + this.private_Id + " t'a identifié dans un flow";
        if (this.fnotif_label.innerText.length > 28) this.fnotif_label.innerText = this.fnotif_label.innerText.substring(0, 28) + "...";
    }

    this.block_notification_comment.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
    this.block_notification_comment.appendChild(this.fnotif_text);

    if (block_notification_comment.seen == false) {
        this.fred_dot_border = document.createElement('label');
        this.fred_dot_border.className = 'fred_dot_border';
        this.block_notification_comment.appendChild(this.fred_dot_border);

        this.fred_dot = document.createElement('label');
        this.fred_dot.className = 'fred_dot';
        this.fred_dot_border.appendChild(this.fred_dot);
    }

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = set_timestamp(this.time);
    this.block_notification_comment.appendChild(this.ftime);

    $(this.block_notification_comment).on("click", function () {
        current_notification_block = block_notification_comment;
        loading_before_popup_specifique = document.createElement("div");
        loading_before_popup_specifique.className = "loading-spinner loading_tl";
        $("#tab4").append(loading_before_popup_specifique);
        $(loading_before_popup_specifique).css("top", "46vh");
        $(block_notification_comment.fred_dot_border).css('display', 'none');
        set_seen(block_notification_comment);
        check_seen();
        $(".flow_specifique_container").html("");
        if (block_notification_comment.Id_comment) {
            let data_single_comment = {
                ObjectId: block_notification_comment.Id_comment
            };
            ServerManager.GetSingleComment(data_single_comment);
        }

        if (block_notification_comment.Id_response) {
            let data_single_response = {
                ObjectId: block_notification_comment.Id_response
            };
            ServerManager.GetSingleResponseExtended(data_single_response);
        }
        if (block_notification_comment.like_comment == "tag_in_flow") {
            let data_flow = {
                IdFlow: block_notification_comment.IdFlow,
            };
            ServerManager.GetSingle(data_flow);
        }
    });

    $(this.fphoto_block_notif).on('click', function (event) {

        let data = {
            private_Id: block_notification_comment.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
        event.stopPropagation();
    });
}

function block_notification_follow(data) {
    this.seen = !!+data.IsView;
    var block_notification_follow = this;
    if (data.additionalData) {
        this.full_name = data.additionalData.sender_info.fullname;
        this.message = data.additionalData.sender_info.post_texte;
        this.photo_link = data.additionalData.sender_info.profil_pic;
        this.like_follow = data.additionalData.type;
        this.private_Id = data.additionalData.sender_info.privateId;
        this.time = Date.now();
        this.IdFlow = data.additionalData.sender_info.IdFlow;
        this.seen = false;
        this.type = data.additionalData.type;
    } else {
        this.full_name = data.FullName;
        this.message = data.Content;
        this.photo_link = data.ProfilePicture;
        this.like_follow = data.TypeOfNotification;
        this.private_Id = data.PrivateId;
        this.time = data.Time;
        this.IdFlow = data.IdFlow;
        this.seen = !!+data.IsView;
        this.IdNotif = data.IdNotif;
        this.type = data.TypeOfNotification;
    }
    if (this.message.length > 28) this.message = this.message.substring(0, 28) + "...";
    this.block_notification_follow = document.createElement('div');
    this.block_notification_follow.className = 'fblock_notification';
    $(".list-notif-block").append(this.block_notification_follow);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_follow';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_follow.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/follow_you.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = '@' + this.private_Id;
    this.block_notification_follow.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = '@' + this.private_Id + " s'est abonné à toi";
    this.block_notification_follow.appendChild(this.fnotif_text);

    if (block_notification_follow.seen == false) {
        this.fred_dot_border = document.createElement('label');
        this.fred_dot_border.className = 'fred_dot_border';
        this.block_notification_follow.appendChild(this.fred_dot_border);

        this.fred_dot = document.createElement('label');
        this.fred_dot.className = 'fred_dot';
        this.fred_dot_border.appendChild(this.fred_dot);
    }

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = set_timestamp(this.time);
    this.block_notification_follow.appendChild(this.ftime);

    $(this.block_notification_follow).on("click", function () {
        $(block_notification_follow.fred_dot_border).css('display', 'none');
        set_seen(block_notification_follow);
        check_seen();

        let data = {
            private_Id: block_notification_follow.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
    });


    $(this.fphoto_block_notif).on('click', function (event) {

        let data = {
            private_Id: block_notification_follow.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
        event.stopPropagation();
    });

}

function block_notification_story_comment(data) {
    this.seen = !!+data.IsView;
    var block_notification_story_comment = this;
    if (data.additionalData) {
        this.full_name = data.additionalData.sender_info.fullname;
        this.message = data.additionalData.sender_info.post_texte;
        this.photo_link = data.additionalData.sender_info.profil_pic;
        this.like_follow = data.additionalData.type;
        this.private_Id = data.additionalData.sender_info.privateId;
        this.time = Date.now();
        this.IdFlow = data.additionalData.sender_info.IdFlow;
        this.seen = false;
        this.type = data.additionalData.type;
    } else {
        this.full_name = data.FullName;
        this.message = data.Content;
        this.photo_link = data.ProfilePicture;
        this.like_follow = data.TypeOfNotification;
        this.private_Id = data.PrivateId;
        this.time = data.Time;
        this.IdFlow = data.IdFlow;
        this.seen = !!+data.IsView;
        this.IdNotif = data.IdNotif;
        this.type = data.TypeOfNotification;
    }
    if (this.message.length > 28) this.message = this.message.substring(0, 28) + "...";
    this.block_notification_story_comment = document.createElement('div');
    this.block_notification_story_comment.className = 'fblock_notification';
    $(".list-notif-block").append(this.block_notification_story_comment);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_story_comment';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_story_comment.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/microphone_2.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_label';
    this.fnotif_text.style.top = "3.7vh";
    let txt = '@' + this.private_Id + " a réagi à ta story";
    if (txt.length > 28) txt = txt.substring(0, 28) + "...";
    this.fnotif_text.innerText = txt;
    this.block_notification_story_comment.appendChild(this.fnotif_text);

    if (block_notification_story_comment.seen == false) {
        this.fred_dot_border = document.createElement('label');
        this.fred_dot_border.className = 'fred_dot_border';
        this.block_notification_story_comment.appendChild(this.fred_dot_border);

        this.fred_dot = document.createElement('label');
        this.fred_dot.className = 'fred_dot';
        this.fred_dot_border.appendChild(this.fred_dot);
    }

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = set_timestamp(this.time);
    this.block_notification_story_comment.appendChild(this.ftime);

    $(this.block_notification_story_comment).on("click", function () {
        $(block_notification_story_comment.fred_dot_border).css('display', 'none');
        set_seen(block_notification_story_comment);
        check_seen();
        /* $(".flow_specifique_container").html("");
         let myApp = new Framework7();
         let data_flow = {
             IdFlow: block_notification_story_comment.IdFlow
         };
         ServerManager.GetSingle(data_flow);
         
         display_all_follows(data);*/
        // app.showTab("#tab1");
        pages_swiper.slideTo(0);
    });


    $(this.fphoto_block_notif).on('click', function (event) {

        let data = {
            private_Id: block_notification_story_comment.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
        event.stopPropagation();
    });

}

function refresh_notif(set_to_seen) {
    let data_notification = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        Index: 0,
    };
    NotificationListCurrentIndex = 0;
    all_notifications_block.length = 0;
    ServerManager.GetNotificationOfUser(data_notification, set_to_seen);
}

function set_all_notifs_to_seen() {
    for (let i = 0; i < all_notifications_block.length; i++) {
        let data_notif_seen = {
            IdNotif: all_notifications_block[i].IdNotif
        };
        if (all_notifications_block[i].seen != true) {
            ServerManager.UpdateNotificationToView(data_notif_seen);
            all_notifications_block[i].seen = true;
            if (all_notifications_block[i].fred_dot_border) {
                all_notifications_block[i].fred_dot_border.remove();
            }
        }
    }
    $(".fred_dot_toolbar_new_notif").css("display", "none");
}

function show_specifique_element_for_comment_button(notif_block) {
    if (notif_block.type == "like_comment" || notif_block.type == "send_comment") {
        let data_single_comment = {
            ObjectId: notif_block.Id_comment
        };
        ServerManager.GetSingleComment(data_single_comment);
        return;
    }
    if (notif_block.type == "like_response" || notif_block.type == "send_response") {
        let data_single_response = {
            ObjectId: notif_block.Id_response
        };
        ServerManager.GetSingleResponseExtended(data_single_response);
        return;
    }
    if (notif_block.type == "like_flow") {
        let data_flow = {
            IdFlow: notif_block.IdFlow
        };
        ServerManager.GetSingle(data_flow);
        return;
    }
}

function UpdateNotificationList(data, set_to_seen) {
    console.log("updating notification list...");
    // console.log(data.Data);
    if (Array.isArray(data.Data)) {
        if (data.Data.length > 0) {
            $(".no_notif")[0].style.display = "none";
        } else {
            $(".no_notif")[0].style.display = "block";
        }
        if ($(".loading_tl")) $(".loading_tl").remove();
        if (NotificationListCurrentIndex == 0) {
            $(".list-notif-block")[0].innerHTML = "";
            let loading_tl = document.createElement("div");
            loading_tl.className = "loading-spinner loading_tl";
            $(".list-notif-block")[0].appendChild(loading_tl);
        }
        for (let i = 0; i < data.Data.length; i++) {
            pop_notif_block(data.Data[i]);
        }
        NotificationListCurrentIndex++;
        if ($(".loading_tl")) $(".loading_tl").remove();
        console.log("notification updated !");
        if (data.Data.length < 10) {
            CanRefreshNotificationList = false;
            let tick_tl = document.createElement("div");
            tick_tl.className = "tick_icon";
            $(".list-notif-block")[0].appendChild(tick_tl);

        } else {
            CanRefreshNotificationList = true;
            let loading_tl = document.createElement("div");
            loading_tl.className = "loading-spinner loading_tl";
            $(".list-notif-block")[0].appendChild(loading_tl);
        }
        notification_list_empty = false;
        if (set_to_seen) {
            set_all_notifs_to_seen();
        }
    } else {
        $(".no_notif")[0].style.display = "block";
    }
    pullToRefreshEnd();
}

// fin du copié collé de la fonction de scroll de fdp

//fonction qui permet de faire disparaitre le point rouge de l'iconne de notifications
//quand toute les notifications on été consulté
function check_seen() {

    let all_notifications_block_without_doublon;
    var cache = {};
    all_notifications_block_without_doublon = all_notifications_block.filter(function (elem, index, array) {
        return cache[elem.IdNotif] ? 0 : cache[elem.IdNotif] = 1;
    });

    $(".fred_dot_toolbar_new_notif").css('display', 'none');

    for (var i = 0; i < all_notifications_block_without_doublon.length; i++) {
        if (all_notifications_block_without_doublon[i].seen == false) {
            $(".fred_dot_toolbar_new_notif").css('display', 'block');
        }
    }

}

//fonction qui permet de set la variable seen qui indique si une notif a été consulté ou pas
function set_seen(object) {

    let data_notif_seen = {
        IdNotif: object.IdNotif
    };
    ServerManager.UpdateNotificationToView(data_notif_seen);
    for (var i = 0; i < all_notifications_block.length; i++) {
        if (all_notifications_block[i] == object) {
            all_notifications_block[i].seen = true;
        }
    }
}

//fonction qui permet de creer les blocs de notifs
function push_notif_block(notification_type, like_type) {

    if (like_type.IsView == "0") {
        $(".fred_dot_toolbar_new_notif").css('display', 'block');
    }
    switch (notification_type) {
        case 'like':
            var new_notif_like = new block_notification_like(like_type);
            all_notifications_block.push(new_notif_like);
            break;
        case 'comment':
            var new_notif_comment = new block_notification_comment(like_type);
            all_notifications_block.push(new_notif_comment);
            break;

        case 'follow':
            var new_notif_follow = new block_notification_follow(like_type);
            all_notifications_block.push(new_notif_follow);
            break;

        case 'story_comment':
            var new_notif_story_comment = new block_notification_story_comment(like_type);
            all_notifications_block.push(new_notif_story_comment);
            break;
    }
}


//https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/PAYLOAD.md

function send_notif_to_user(block, type) {

    let notif_lastos;
    let notif_body;
    let notif_recipient; // destinataire
    let prepare_id_flow = block.Flow_block_id ? block.Flow_block_id : block.ObjectId;
    let sender_info = {
        fullname: window.localStorage.getItem("user_name"),
        privateId: window.localStorage.getItem("user_private_id"),
        profil_pic: window.localStorage.getItem("user_profile_pic"),
        post_texte: $(block.fpost_description).text(), // texte like de flow
        comment_text: block.Comment_text, // texte commentaire genre le vrai commenaire t'a capté
        like_comment_text: block.fcomment_text, // texte lorsque l'on like un commentaire
        IdFlow: prepare_id_flow == undefined ? prepare_id_flow = "undefined" : prepare_id_flow,
        Id_comment: block.IdComment /*? block.ObjectId : undefined*/ ,
        Id_response: block.Idresponse /*? block.ObjectId : undefined*/ ,
        tag_in_flow: block.tag_in_flow
    };
    if (sender_info.comment_text == undefined) {
        sender_info.comment_text = sender_info.post_texte;
    }

    noteId++;

    switch (type) {
        case 'story_comment':

            notif_lastos = block.LastOs;
            notif_body = "@" + sender_info.privateId + " a réagi à ta story " + sender_info.post_texte;
            notif_recipient = block.RegisterId;
            break;

        case 'follow':

            notif_lastos = block.LastOs;
            notif_body = "@" + sender_info.privateId + " s'est abonné à toi " + sender_info.post_texte;
            notif_recipient = block.RegisterId;
            break;

        case 'like_flow':

            notif_lastos = block.LastOs;
            notif_body = "@" + sender_info.privateId + " a aimé ton flow : " + sender_info.post_texte;
            notif_recipient = block.RegisterId;
            break;

        case 'tag_in_flow':

            notif_lastos = block.LastOs;
            notif_body = "@" + sender_info.privateId + " t'a identifié dans un flow : " + block.Comment_text;
            notif_recipient = block.RegisterId;
            break;

        case 'send_response':

            notif_lastos = block.current_flow_block.LastOs;
            notif_body = "@" + sender_info.privateId + " a répondu : " + block.Comment;
            notif_recipient = block.current_flow_block.RegisterId;
            break;

        case 'send_comment':

            notif_lastos = block.current_flow_block.LastOs;
            notif_body = "@" + sender_info.privateId + " a commenté : " + block.Comment;
            notif_recipient = block.current_flow_block.RegisterId;
            break;

        case 'tag_in_comment':

            notif_lastos = block.LastOs;
            notif_body = block.Comment;
            notif_recipient = block.tag_user_RegisterId;
            break;

        case 'like_comment':

            notif_lastos = block.LastOs;
            notif_body = "@" + sender_info.privateId + " a aimé ton commentaire : " + block.Comment_text;
            notif_recipient = block.RegisterId;
            break;

        case 'like_response':

            notif_lastos = block.LastOs;
            notif_body = "@" + sender_info.privateId + " a aimé ta réponse : " + block.response_text;
            notif_recipient = block.RegisterId;
            break;

        case 'send_message':

            sender_info.chat_id = block.chat_id;
            notif_lastos = block.recipient_info.LastOs;
            notif_body = block.message;
            notif_recipient = block.recipient_info.registration_id;
            break;

    }

    if (notif_lastos == "ios") {
        data = {
            "data": {
                "title": sender_info.fullname,
                "body": notif_body,
                "type": type,
                "sender_info": sender_info,
                "force-start": 1,
                "content_available": true,
                "priority": "high"
            },
            "notification": {
                "title": sender_info.fullname,
                "body": notif_body,
                "type": type,
                "sender_info": sender_info,
                "force-start": 1,
                "content_available": true,
                "priority": "high"
            },
            "to": notif_recipient
            //registrationId
        };
    } else {
        data = {
            "data": {
                "title": sender_info.fullname,
                "body": notif_body,
                "type": type,
                "sender_info": sender_info,
                "force-start": 1,
                "notId": noteId,
                "content_available": true,
                "priority": "high"
            },
            "to": notif_recipient
            //registrationId
        };
    }
    ServerManager.Send_notif(data);
}

function pop_notif_block(data) { //bloc de notif de l'onglet notifications

    switch (data.TypeOfNotification) {
        case 'like_flow':

            push_notif_block('like', data);
            break;

        case 'send_comment':

            push_notif_block('comment', data);
            break;

        case 'send_response':

            push_notif_block('comment', data);
            break;

        case 'like_comment':

            push_notif_block('like', data);
            break;

        case 'like_response':

            push_notif_block('like', data);
            break;

        case 'follow':

            push_notif_block('follow', data);
            break;

        case 'story_comment':

            push_notif_block('story_comment', data);
            break;

        case 'tag_in_flow':

            push_notif_block('comment', data);
            break;
    }
}

function in_app_notif(data) { // petite popup qui apparait lorsque l'on reçois une notif et qu'on est dans l'app
    let NotifDuration = 3000;
    if (window.cordova.platformId == "ios") {
        if (data.additionalData.sender_info) {
            data.additionalData.sender_info = JSON.parse(data.additionalData.sender_info);
        }
    }
    switch (data.additionalData.type) {
        case 'like_flow':

            $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " a aimé ton flow");
            $(".f_in_app_notif").css("background-color", "rgb(255, 0, 84)");
            break;

        case 'send_comment':

            if (data.additionalData.tag_in_comment || data.additionalData.sender_info.tag_in_flow) {
                $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " t'a identifié");
            } else {

                $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " a commenté ton flow");
            }

            $(".f_in_app_notif").css("background-color", "rgb(26, 132, 239)");

            break;

        case 'send_response':

            if (data.additionalData.tag_in_comment) {
                $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " t'a identifié");
            } else {

                $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " a répondu");
            }
            $(".f_in_app_notif").css("background-color", "rgb(26, 132, 239)");

            break;

        case 'like_comment':

            $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " a aimé ton commentaire");
            $(".f_in_app_notif").css("background-color", "rgb(255, 0, 84)");
            break;

        case 'like_response':

            $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " a aimé ta réponse");
            $(".f_in_app_notif").css("background-color", "rgb(255, 0, 84)");
            break;

        case 'follow':

            $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " s'est abonné à toi");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'story_comment':
            $(".flabel_in_app_notif").text("@" + data.additionalData.sender_info.privateId + " a réagi à ta s...");
            $(".f_in_app_notif").css("background-color", "rgb(152, 57, 198)");
            break;

        case 'block_user':
            $(".flabel_in_app_notif").text("@" + data.additionalData.privateId + " a été bloqué");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'unblock_user':
            $(".flabel_in_app_notif").text("@" + data.additionalData.privateId + " a été débloqué");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'report_flow':
            $(".flabel_in_app_notif").text("Ce flow a bien été signalé");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'report_comment':
            $(".flabel_in_app_notif").text("Ce commentaire a bien été signalé");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'delete_flow':
            $(".flabel_in_app_notif").text("Ce flow a bien été supprimé");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'delete_comment':
            $(".flabel_in_app_notif").text("Ce commentaire a bien été supprimé");
            $(".f_in_app_notif").css("background-color", "rgb(146, 171, 178)");
            break;

        case 'send_message':
            $("#InAppNotifNewMessageUsername").text(data.additionalData.sender_info.fullname);
            $("#InAppNotifNewMessage").text(data.message); // le message
            $("#InAppNotifNewMessageUsername").css("display", "block");
            $("#InAppNotifNewMessageIcone").css("display", "block");
            $(".f_in_app_notif").css("background-color", "rgb(26, 132, 239)");
            $(".f_in_app_notif").css("height", "calc(7 * var(--custom-vh))");
            NotifDuration = 4000;
            break;

    }
    $(".f_in_app_notif").on("click", function () {
        // app.showTab("#tab4");
        if (data.additionalData.type == 'send_message') {
            pages_swiper.slideTo(2);
        } else {
            pages_swiper.slideTo(3);
        }
    });


    if (current_page == "messages" && data.additionalData.type == 'send_message' || InPopupMessage == true) {
        // Il est tard je suis fatigué et ne sais plus faire l'inverse d'un ou logique
    } else {
        $(".f_in_app_notif").css("margin-top", "-40vw");
    }
    setTimeout(function () {
        $(".f_in_app_notif").css("margin-top", "5vw");
        $("#InAppNotifNewMessageIcone").css("display", "none");
        $("#InAppNotifNewMessageUsername").css("display", "none");
        $(".f_in_app_notif").css("height", "auto");
    }, NotifDuration);
}