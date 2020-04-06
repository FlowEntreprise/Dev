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
        this.seen = false;
        //if(this.like_comment == "like_comment")
        //{this.message = data.additionalData.sender_info.comment_text;}
    } else {
        this.full_name = data.FullName;
        this.message = data.Content;
        this.photo_link = data.ProfilePicture;
        this.like_comment = data.TypeOfNotification;
        this.private_Id = data.PrivateId;
        this.time = data.Time;
        this.IdFlow = data.IdFlow;
        this.seen = !!+data.IsView;
        this.IdNotif = data.IdNotif;
    }

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
    this.block_notification_like.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
    this.block_notification_like.appendChild(this.fnotif_text);

    /*if (block_notification_like.seen == false) {
        this.fred_dot_border = document.createElement('label');
        this.fred_dot_border.className = 'fred_dot_border';
        this.block_notification_like.appendChild(this.fred_dot_border);

        this.fred_dot = document.createElement('label');
        this.fred_dot.className = 'fred_dot';
        this.fred_dot_border.appendChild(this.fred_dot);
    }*/

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
        $(block_notification_like.fred_dot_border).css('display', 'none');
        console.log("le point rouge shoud disparaitre pour de la notif de like");
        set_seen(block_notification_like);
        check_seen();
        $(".flow_specifique_container").html("");
        let myApp = new Framework7();
        let data_flow = {
            IdFlow: block_notification_like.IdFlow
        };
        ServerManager.GetSingle(data_flow);
        Popup("popup-specifique", true);
        if (block_notification_like.like_comment == "like_comment") {

            display_all_comments(data);
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

function block_notification_echo(data) {
    this.seen = false;
    var block_notification_echo = this;
    this.block_notification_echo = document.createElement('div');
    this.block_notification_echo.className = 'fblock_notification';
    $(".list-notif-block").append(this.block_notification_echo);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_echo';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_echo.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Echo_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = this.full_name + ' a echo ton flow';
    this.block_notification_echo.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
    this.block_notification_echo.appendChild(this.fnotif_text);

    this.fred_dot_border = document.createElement('label');
    this.fred_dot_border.className = 'fred_dot_border';
    this.block_notification_echo.appendChild(this.fred_dot_border);

    this.fred_dot = document.createElement('label');
    this.fred_dot.className = 'fred_dot';
    this.fred_dot_border.appendChild(this.fred_dot);

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = set_timestamp(this.time);
    this.block_notification_echo.appendChild(this.ftime);

    $(this.block_notification_echo).on("click", function () {
        $(block_notification_echo.fred_dot_border).css('display', 'none');
        set_seen(block_notification_echo);
        check_seen();
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
        this.seen = false;
    } else {
        this.full_name = data.FullName;
        this.message = data.Content;
        this.photo_link = data.ProfilePicture;
        this.like_comment = data.TypeOfNotification;
        this.private_Id = data.PrivateId;
        this.time = data.Time;
        this.IdFlow = data.IdFlow;
        this.seen = !!+data.IsView;
        this.IdNotif = data.IdNotif;
    }

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
    this.fnotif_label.innerText = '@' + this.private_Id;
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
        $(block_notification_comment.fred_dot_border).css('display', 'none');
        set_seen(block_notification_comment);
        check_seen();
        $(".flow_specifique_container").html("");
        let myApp = new Framework7();
        let data_flow = {
            IdFlow: block_notification_comment.IdFlow
        };
        ServerManager.GetSingle(data_flow);
        Popup("popup-specifique", true);
        display_all_comments(data);
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
    }

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
        /* $(".flow_specifique_container").html("");
         let myApp = new Framework7();
         let data_flow = {
             IdFlow: block_notification_follow.IdFlow
         };
         ServerManager.GetSingle(data_flow);
         Popup("popup-specifique", true);
         display_all_follows(data);*/
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
    }

    this.block_notification_story_comment = document.createElement('div');
    this.block_notification_story_comment.className = 'fblock_notification';
    $(".list-notif-block").append(this.block_notification_story_comment);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_follow';
    this.fphoto_block_notif.style.backgroundImage = "url('" + this.photo_link + "')";
    this.block_notification_story_comment.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/follow_you.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    // this.fnotif_label = document.createElement('label');
    // this.fnotif_label.className = 'fnotif_label';
    // this.fnotif_label.innerText = '@' + this.private_Id;
    // this.block_notification_story_comment.appendChild(this.fnotif_label);

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
         Popup("popup-specifique", true);
         display_all_follows(data);*/
        let data = {
            private_Id: block_notification_story_comment.private_Id,
            user_private_Id: window.localStorage.getItem("user_private_id")
        };
        go_to_account(data);
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

/*
$(".fnotif-btn").on("click",function(){
    if(notification_list_empty == true)
    {
        $(".list-notif-block").html("");
        let data_notification = 
        {
            PrivateId : window.localStorage.getItem("user_private_id"),
            Index : 0
        };
        ServerManager.GetNotificationOfUser(data_notification);
    } 
});
*/
// cette fonction de fdp est copié collé 4 fois dans le code putin de merde


$(".fnotif-btn").on("click", function () {
    // var home_scrolling = false;
    if (current_page == "notifications") {
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
        all_notifications_block.length = [];
    }
});


var ptrNotif = $$('.pull-to-refresh-content');
// Add 'refresh' listener on it
ptrNotif.on('ptr:refresh', function (e) {
    // Emulate 2s loading
    console.log("refreshing...");
    NotificationListCurrentIndex = 0;
    let data_update_Notification_list = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        Index: NotificationListCurrentIndex
    };
    ServerManager.GetNotificationOfUser(data_update_Notification_list);
    check_seen();
});


ptrNotif.on('ptr:pullstart', function (e) {
    console.log("pull start");
    $("#ptr_arrow_notif").css("opacity", "1");

});

ptrNotif.on('ptr:pullend', function (e) {
    console.log("pull end");
    $("#ptr_arrow_notif").css("opacity", "0");
});

function pullToRefreshEnd() {
    console.log("refreshed !");
    $("#ptr_arrow_notif").css("opacity", "0");
    app.pullToRefreshDone();
}

function StopRefreshTL() {
    if ($(".loading_tl")) $(".loading_tl").remove();
    CanRefreshTL = false;
    CanRefreshFollowList = false;
    pullToRefreshEnd();
}


let CanRefreshNotificationList = true;
let NotificationListCurrentIndex = 0;
var notification_list_empty = true;
$("#tab4").scroll(function () {
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

function UpdateNotificationList(data) {
    console.log("updating notification list...");
    // console.log(data.Data);
    if (Array.isArray(data.Data)) {
        if (data.Data.length > 0) {
            $(".no_notif")[0].style.display = "none";
        } else {
            $(".no_notif")[0].style.display = "block";
        }
        setTimeout(function () {
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
        }, 500);
        notification_list_empty = false;
    } else {
        $(".no_notif")[0].style.display = "block";
    }
}

// fin du copié collé de la fonction de scroll de fdp

//fonction qui permet de faire disparaitre le point rouge de l'iconne de notifications
//quand toute les notifications on été consulté
function check_seen() {
    let nombre_de_notif_unseen = 0;
    let all_notifications_block_without_doublon;

    var cache = {};
    all_notifications_block_without_doublon = all_notifications_block.filter(function (elem, index, array) {
        return cache[elem.IdNotif] ? 0 : cache[elem.IdNotif] = 1;
    });

    for (var i = 0; i < all_notifications_block_without_doublon.length; i++) {
        if (all_notifications_block_without_doublon[i].seen == false) {
            //
            nombre_de_notif_unseen++;
        }
    }
    if (nombre_de_notif_unseen == 0) {
        $(".fred_dot_toolbar_new_notif").css('display', 'none');
    }
    if (nombre_de_notif_unseen != 0) {

        $(".fred_dot_toolbar_new_notif").css('display', 'block');
    }
    nombre_de_notif_unseen = 0;

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
        case 'echo':
            var new_notif_echo = new block_notification_echo(like_type);
            all_notifications_block.push(new_notif_echo);
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


    let prepare_id_flow = block.ObjectId ? block.ObjectId : block.Flow_block_id;
    let prepare_id_registerId = block.RegisterId ? block.RegisterId : block.current_flow_block.RegisterId;
    if (prepare_id_flow == undefined && type != "follow" && type != "story_comment") {
        prepare_id_flow = block.current_flow_block.ObjectId;
    }
    var sender_info = {
        fullname: window.localStorage.getItem("user_name"),
        privateId: window.localStorage.getItem("user_private_id"),
        profil_pic: window.localStorage.getItem("user_profile_pic"),
        post_texte: $(block.fpost_description).text(), // texte like de flow
        comment_text: block.Comment_text, // texte commentaire genre le vrai commenaire t'a capté
        like_comment_text: block.fcomment_text, // texte lorsque l'on like un commentaire
        IdFlow: prepare_id_flow == undefined ? prepare_id_flow = "undefined" : prepare_id_flow
    };
    if (sender_info.comment_text == undefined) {
        sender_info.comment_text = sender_info.post_texte;
    }

    if ((block.tag_user_RegisterId != undefined &&
        block.tag_user_RegisterId != prepare_id_registerId &&
        block.tag_user_RegisterId != registrationId) ||
        (block.tag_user_RegisterId == undefined &&
            registrationId != prepare_id_registerId)) {
        if (block.tag_user_RegisterId == undefined && type == "tag_in_comment") {
            block.tag_user_RegisterId = block.current_flow_block.RegisterId;
        }
        noteId++;
        switch (type) {
            case 'story_comment':
                if (block.LastOs == "ios") {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a réagi à ta story " + sender_info.post_texte,
                            "type": "story_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a réagi à ta story " + sender_info.post_texte,
                            "type": "story_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                        //registrationId
                    };
                }
                else {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a réagi à ta story " + sender_info.post_texte,
                            "type": "story_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                        //registrationId
                    };
                }

                ServerManager.Send_notif(data);

                break;

            case 'follow':
                if (block.LastOs == "ios") {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " s'est abonné à toi " + sender_info.post_texte,
                            "type": "follow",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " s'est abonné à toi " + sender_info.post_texte,
                            "type": "follow",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                        //registrationId
                    };
                }
                else {
                    data = {
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " s'est abonné à toi " + sender_info.post_texte,
                            "type": "follow",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                        //registrationId
                    };
                }
                ServerManager.Send_notif(data);

                break;

            case 'like_flow':
                if (block.LastOs == "ios") {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a aimé ton flow : " + sender_info.post_texte,
                            "type": "like_flow",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a aimé ton flow : " + sender_info.post_texte,
                            "type": "like_flow",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                    };
                }
                else {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a aimé ton flow : " + sender_info.post_texte,
                            "type": "like_flow",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                    };
                }
                ServerManager.Send_notif(data);

                break;

            case 'send_comment':
                if (block.LastOs == "ios") {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a commenté : " + block.Comment,
                            "type": "send_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a commenté : " + block.Comment,
                            "type": "send_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.current_flow_block.RegisterId
                        //registrationId
                    };
                }
                else {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a commenté : " + block.Comment,
                            "type": "send_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.current_flow_block.RegisterId
                        //registrationId
                    };
                }
                ServerManager.Send_notif(data);

                break;

            case 'tag_in_comment':
                if (block.LastOs == "ios") {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": block.Comment,
                            "type": "send_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": block.Comment,
                            "type": "send_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.tag_user_RegisterId
                        //registrationId
                    };
                }
                else {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": block.Comment,
                            "type": "send_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.tag_user_RegisterId
                        //registrationId
                    };

                }
                ServerManager.Send_notif(data);

                break;

            case 'like_comment':
                if (block.LastOs == "ios") {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a aimé ton commentaire : " + block.Comment_text,
                            "type": "like_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "notification": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a aimé ton commentaire : " + block.Comment_text,
                            "type": "like_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                        //registrationId
                    };
                }
                else {
                    data = {
                        "data": {
                            "title": "@" + sender_info.fullname,
                            "body": "@" + sender_info.privateId + " a aimé ton commentaire : " + block.Comment_text,
                            "type": "like_comment",
                            "sender_info": sender_info,
                            "force-start": 1,
                            "notId": noteId,
                            "content_available": true,
                            "priority": "high"
                        },
                        "to": block.RegisterId
                        //registrationId
                    };
                }

                ServerManager.Send_notif(data);

                break;

        }
    } else {
        console.log("on peut pas s'envoyer des notifs à soit même voyons");
    }

}


function pop_notif_block(data) {

    var notif_type;
    if (data.additionalData != undefined) {
        notif_type = data.additionalData.type;
    } else {
        notif_type = data.TypeOfNotification;
    }


    switch (notif_type) {
        case 'like_flow':

            if (data.additionalData != undefined && data.additionalData.foreground == true) {
                $(".flabel_in_app_notif").text(data.title + " a aimé ton flow");
                $(".f_in_app_notif").css("margin-top", "-40vw");
                setTimeout(function () {
                    $(".f_in_app_notif").css("margin-top", "5vw");
                }, 2000);
            }
            push_notif_block('like', data);

            break;

        case 'send_comment':

            if (data.additionalData != undefined && data.additionalData.foreground == true) {
                $(".flabel_in_app_notif").text(data.title + " a commenté ton flow");
                $(".f_in_app_notif").css("margin-top", "-40vw");
                setTimeout(function () {
                    $(".f_in_app_notif").css("margin-top", "5vw");
                }, 2000);
            }
            push_notif_block('comment', data);

            break;

        case 'like_comment':

            if (data.additionalData != undefined && data.additionalData.foreground == true) {
                $(".flabel_in_app_notif").text(data.title + " a aimé ton commentaire");
                $(".f_in_app_notif").css("margin-top", "-40vw");
                setTimeout(function () {
                    $(".f_in_app_notif").css("margin-top", "5vw");
                }, 2000);
            }
            push_notif_block('like', data);

            break;

        case 'follow':

            if (data.additionalData != undefined && data.additionalData.foreground == true) {
                $(".flabel_in_app_notif").text(data.title + " s'est abonné à toi");
                $(".f_in_app_notif").css("margin-top", "-40vw");
                setTimeout(function () {
                    $(".f_in_app_notif").css("margin-top", "5vw");
                }, 2000);
            }
            push_notif_block('follow', data);

            break;
        case 'story_comment':

            if (data.additionalData != undefined && data.additionalData.foreground == true) {
                $(".flabel_in_app_notif").text(data.title + " a réagi à ta s...");
                $(".f_in_app_notif").css("margin-top", "-40vw");
                setTimeout(function () {
                    $(".f_in_app_notif").css("margin-top", "5vw");
                }, 2000);
            }
            push_notif_block('story_comment', data);
            break;
    }
}

var all_notifications_block = [];
