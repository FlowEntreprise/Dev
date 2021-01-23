var chat_id;
var data_dm = {};
var first_chat = false;
var current_block_chat = {};
var all_block_chat = [];
var all_block_message = [];
var nb_block_chat_to_pop;
var previous_message = {};
var previous_chat_list = {};
var current_block_message = {};
var can_load_more_message = true;
var InPopupMessage = false;
var lastScrollTop = 0;
var scrollableElement = document.getElementById('fblock_message_content');
let touch_startx;
let recording_vocal = false;
let delete_vocal = false;
let timer;
let record_duration = 0;

function messages_tab_loaded() {
    $("#fnameCompte").on("click", function () {

        if (FirebaseToken < window.localStorage.getItem("firebase_token")) {
            chat_id = FirebaseToken + window.localStorage.getItem("firebase_token");
        } else {
            chat_id = window.localStorage.getItem("firebase_token") + FirebaseToken;
        }

        data_dm = {
            fullname: account_fullname,
            private_id: privateIDAccount,
            user_id: FirebaseToken,
            chat_id: chat_id,
            profile_picture: profilePicLink,
            is_groupe_chat: false
        };

        CreateConversation(data_dm);

    });

    $("#new_conversation").on("click", function () {
        Popup("popup-create-conversation", true);
        // let sayHello = firebase.functions().httpsCallable('TestFirebaseStorage');
        // sayHello({
        //     FirebaseEnvironment: FirebaseEnvironment,
        //     text: "text qui doit etre ajouté depuis firebase cloud functions "
        // });
    });

    $("#SendFromCamera").on("click", function () {
        TakePhoto(function (imageData) {
            console.log(imageData);
            // Contenu de l'image : imageData
            toDataUrl(imageData, function (b64) {
                console.log(b64);
                let data = {
                    content: b64,
                    name: Date.now(),
                    chat_id: current_block_chat.chat_id
                }
                ServerManager.UploadImageToFirebase(data);
            });
        });
    });

    $("#button_send_vocal").on("touchstart", function (e) {
        recording = true;
        touch_startx = e.touches[0].clientX;
        // touch_position.y = e.touches[0].clientY;
        $(this).addClass("pressed");
        $("#input_send_message").addClass("vocal");
        $("#button_send_message")[0].style.display = "none";
        $(".delete_vocal")[0].style.display = "block";
        $(".wave_vocal").css("display", "block");
        $("#SendFromGallery")[0].style.opacity = "0.2";
        $("#SendFromCamera")[0].style.opacity = "0.2";
        delete_vocal = false;
        record_duration = 0;
        $(".wave_vocal")[0].innerHTML = record_duration + "s";
        timer = setInterval(function () {
            record_duration += 1;
            if (!delete_vocal) $(".wave_vocal")[0].innerHTML = record_duration + "s";
        }, 1000);
    });

    $("#button_send_vocal").on("touchmove", function (e) {
        let offset = 0;
        let left_border = ((window.innerWidth) / 100) * 57 - 28;
        offset = touch_startx - e.touches[0].clientX;
        let true_offset = offset;
        if (offset < 0) offset = 0;
        if (offset > left_border - 20) {
            offset = left_border;
            delete_vocal = true;
            $("#input_send_message").addClass("delete");
            $(".delete_vocal").addClass("red");
            $(this).addClass("delete");
            $(".wave_vocal")[0].innerHTML = "annuler";
            $(".wave_vocal").css("color", "#FF5D5D");
        } else {
            delete_vocal = false;
            $("#input_send_message").removeClass("delete");
            $(".delete_vocal").removeClass("red");
            $(this).removeClass("delete");
            $(".wave_vocal")[0].innerHTML = record_duration + "s";
            $(".wave_vocal").css("color", "#DE0F69");
        }
        $(".wave_vocal").css("transform", "translate3d(" + -true_offset + "px, 0, 0)");
        $(this).css("transform", "translate3d(" + -offset + "px, 0, 0)");
    });

    $("#button_send_vocal").on("touchend", function () {
        recording_vocal = false;
        $(this).removeClass("pressed");
        $(this).removeClass("delete");
        $(this).css("transform", "translate3d(0, 0, 0)");
        $(".wave_vocal").css("transform", "translate3d(0, 0, 0)");
        $(".wave_vocal").css("display", "none");
        $("#input_send_message").removeClass("vocal");
        $("#input_send_message").removeClass("delete");
        $("#button_send_message")[0].style.display = "block";
        $(".delete_vocal").removeClass("red");
        $(".delete_vocal")[0].style.display = "none";
        $("#SendFromGallery")[0].style.opacity = "0.5";
        $("#SendFromCamera")[0].style.opacity = "0.5";
        delete_vocal = false;
        clearInterval(timer);
    });

    $("#button_send_message").on("click", function () {
        if ($("#input_send_message").val().trim().length != 0) {
            data_dm.message = $("#input_send_message").val();
            if (first_chat == true) // premier msg
            {
                ServerManager.AddChat(data_dm, pop_block_chat);
            } else {
                send_message(data_dm.chat_id);
            }
            $("#input_send_message").val("");
        }
    });

    $(document).on("keyup", ".fmessages-search-bar", function () {

        let StringMessagesSearchBar = $(".fmessages-search-bar").val().trim();
        if (StringMessagesSearchBar == "") {
            firebase.database().ref(FirebaseEnvironment + "/users/" + window.localStorage.getItem("firebase_token") + "/chats").off();
            ServerManager.NewChatListener(pop_block_chat);
        } else {
            ServerManager.SearchChat(StringMessagesSearchBar);
        }

    });

    $(document).on("keyup", ".create-conversation-search-bar", function () {

        let StringConversationSearchBar = $(".create-conversation-search-bar").val().trim();
        if (StringConversationSearchBar == "") {
            GetFollowingsPopupCreateConversation();
        } else {
            let data_user_search = {
                Index: 0,
                Search: StringConversationSearchBar,
                Nb: 10,
                CreateConversation: true
            };
            ServerManager.SearchUserForTabExplore(data_user_search);
        }

    });

    scrollableElement.addEventListener("scroll", function () {
        let content = $(this);
        if (content.scrollTop() == 0 && can_load_more_message == true) {
            can_load_more_message = false;
            let loading_message = document.createElement("div");
            loading_message.className = "loading-spinner loading_message";
            // $("#fblock_message_content").append(loading_message); // cause flickering
            // console.log("limite :" + limit + "; Current scroll : " + Math.round($(this).scrollTop()));
            console.log("load old messages");
            let old_diff = content[0].scrollHeight - content[0].clientHeight;
            message_infinite_scroll(current_block_chat, old_diff);
        }
    });

    document.getElementById("popup-message").addEventListener("opened", function () {
        InPopupMessage = true;
        can_load_more_message = true;
        $("#div_send_message").css("transform", "translate3d(0vw, 0, 0)");
        $("#fblock_message_content").scrollTop($("#fblock_message_content").height());
    });
    document.getElementById("popup-message").addEventListener("closed", function () {
        InPopupMessage = false;
        firebase.database().ref(FirebaseEnvironment + "/messages/" + current_block_chat.chat_id).off();
        firebase.database().ref(FirebaseEnvironment + '/chats/' + current_block_chat.chat_id + '/last_message/seen_by').off();
        firebase.database().ref(FirebaseEnvironment + '/chats/' + current_block_chat.chat_id).orderByChild('is_typing').off();
        $("#div_send_message").css("transform", "translate3d(100vw, 0, 0)");
        $("#fblock_message_content").html("");
        stopAllBlocksAudio();
        first_chat = false;
        all_block_message.length = 0;
        current_block_chat.first_messake_key = undefined;
        $("#UploadProgressBar").css({
            "display": "none"
        });
    });

    document.getElementById("popup-create-conversation").addEventListener("opened", function () {
        GetFollowingsPopupCreateConversation();
    });
    // document.getElementById("popup-create-conversation").addEventListener("closed", function () {});
}

function block_chat(data) {
    var block_chat = this;
    this.chat_id = data.chat_data.chat_id;
    this.block_chat_last_message = data.chat_data.last_message;
    this.block_chat_title = data.members_data.name;
    this.block_chat_photo = data.members_data.profile_pic;
    this.block_chat_member_private_id = data.members_data.private_id;
    this.members = data.members_data;
    this.creator = data.chat_data.creator;
    this.is_seen = false;
    //this.creation_date = data.chat_data.creation_date;
    this.is_groupe_chat = data.chat_data.is_groupe_chat;
    this.block_chat = document.createElement('div');
    this.block_chat.className = 'fblock_chat';
    this.block_chat.id = this.chat_id;
    $("#block_chat_contrainer").prepend(this.block_chat);

    $(this.block_chat).on("click", function () {
        current_block_chat = block_chat;
        $(current_block_chat.block_chat).css("background-color", "#fff");
        $(".fred_dot_toolbar_new_message").css("display", "none");
        data_dm = {
            fullname: current_block_chat.block_chat_title,
            chat_id: current_block_chat.chat_id,
            profile_picture: current_block_chat.block_chat_photo,
            is_groupe_chat: current_block_chat.is_groupe_chat,
            message_id: current_block_chat.block_chat_last_message.message_id
        };
        ServerManager.SetMessageToSeen(data_dm);
        live_chat(data_dm.chat_id);
        setup_popup_message(data_dm);
    });

    $(this.block_chat).on("taphold", function () {
        current_block_chat = block_chat;
        delete_chat_from_html();
    });

    this.fphoto_block_chat = document.createElement('div');
    this.fphoto_block_chat.className = 'fphoto_block_chat';
    this.fphoto_block_chat.style.backgroundImage = "url(" + this.block_chat_photo + "";
    this.block_chat.appendChild(this.fphoto_block_chat);


    $(this.fphoto_block_chat).on("click", function (e) {
        let data = {
            private_Id: block_chat.block_chat_member_private_id,
            user_private_Id: window.localStorage.getItem("user_private_id"),
        };
        go_to_account(data);
        e.stopPropagation();
    });

    this.fconversation_title = document.createElement('label');
    this.fconversation_title.className = 'fconversation_title';
    this.fconversation_title.innerText = this.block_chat_title;
    this.block_chat.appendChild(this.fconversation_title);

    this.fblock_chat_text = document.createElement('label');
    this.fblock_chat_text.className = 'fblock_chat_text';
    this.fblock_chat_text.innerText = this.block_chat_last_message.message;
    this.block_chat.appendChild(this.fblock_chat_text);

    this.fblock_chat_dots = document.createElement("img");
    this.fblock_chat_dots.className = "fblock_chat_dots";
    this.fblock_chat_dots.src = "../www/src/icons/3dots.png";
    $(this.block_chat).append(this.fblock_chat_dots);

    this.fblock_chat_time = document.createElement('label');
    this.fblock_chat_time.className = 'fblock_chat_time';
    this.fblock_chat_time.innerText = set_timestamp(this.block_chat_last_message.time, true);
    this.block_chat.appendChild(this.fblock_chat_time);

    for (let i of Object.entries(this.block_chat_last_message.seen_by)) {
        if (i[0] == window.localStorage.getItem("firebase_token")) {
            $(block_chat.block_chat).css("background-color", "#fff");
            block_chat.is_seen = true;
        }
    }
    set_block_chat_seen();

}
// affichage de la date complete quand il s'est ecoulé plus de 2h entre 2 msg
function block_message_date(time) {
    var block_message_date = this;
    this.label_block_message_date = document.createElement('li');
    this.label_block_message_date.className = 'label_block_message_date';
    this.label_block_message_date.innerText = set_timestamp(time, "label_block_message_date");
    $("#fblock_message_content").append(this.label_block_message_date);
}
// gestion de la vue des msg comme sur messenger
function block_message_seen(data) {
    var block_message_seen = this;
    this.block_message_seen = document.createElement('li');
    this.block_message_seen.className = 'block_message_seen';
    this.block_message_seen.style.backgroundImage = "url(" + data + "";
    $("#fblock_message_content").append(this.block_message_seen);
}

function block_message(data, previous_message) {
    var block_message = this;
    this.message_id = data.id;
    this.sender_id = data.sender_id;
    this.sender_full_name = data.sender_full_name;
    this.sender_private_id = data.sender_private_id;
    this.block_message_time = data.time;
    this.block_message_text = data.message;
    this.seen_by = data.seen_by;
    this.block_message = document.createElement('li');
    this.image = data.image;

    this.time_and_seen_container = document.createElement('div');
    this.time_and_seen_container.className = 'time_and_seen_container';

    $(".loading_message").remove();
    $("#" + this.message_id + "").remove();

    if (this.sender_private_id == window.localStorage.getItem("user_private_id")) // token id par la suite
    {
        this.block_message.className = 'my_block_message';
        this.time_and_seen_container.innerText = set_timestamp(this.block_message_time, true);
    } else {
        this.block_message_left_photo = document.createElement('div');
        this.block_message_left_photo.className = 'block_message_left_photo';
        this.block_message_left_photo.style.backgroundImage = "url(" + current_block_chat.block_chat_photo + "";
        this.block_message.className = 'block_message';
        this.time_and_seen_container.innerText = set_timestamp(this.block_message_time, true);
    }

    $(this.block_message).text(this.block_message_text);
    $(this.block_message).prepend(this.block_message_left_photo);
    this.block_message.id = this.message_id;
    $(this.block_message).append(this.time_and_seen_container);
    if (previous_message) {
        $("#fblock_message_content").prepend(this.block_message);
    } else {
        $("#fblock_message_content").append(this.block_message);
    }

    let current = $(this.block_message);
    setTimeout(function () {
        let prev = current.prev();
        let next = current.next();
        if (prev && current.hasClass("block_message") && prev.hasClass("block_message")) {
            // prev.css({
            //     "background": "white"
            // });
            prev.find(".block_message_left_photo").css({
                "display": "none"
            });
        }

        if (next && current.hasClass("block_message") && next.hasClass("block_message")) {
            current.find(".block_message_left_photo").css({
                "display": "none"
            });
        }
    }, 50);

    /*if (this.seen_by) {
        pop_block_message_seen(current_block_chat.block_chat_photo);
    }*/

    $(this.block_message).on("click", function () {
        all_block_message.forEach(item => {
            $(item.time_and_seen_container).css('display', 'none');
        });
        $(block_message.time_and_seen_container).css('display', 'block');

    });

    if (this.image) {
        $(this.block_message).text("");
        let image = document.createElement("img");
        image.src = this.image;
        image.style.maxWidth = "54vw";
        image.style.maxHeight = "300px";
        image.style.objectFit = "contain";
        image.style.borderRadius = "4vw";
        this.block_message.appendChild(image);
        this.block_message.style.background = "transparent";
        this.block_message.style.padding = "0px";
        this.block_message.style.boxShadow = "none";
    }

}


function CreateConversation(data) {
    ServerManager.CheckFirstChat(data);
}

function set_block_chat_seen() {
    for (let i = 0; i < all_block_chat.length; i++) {
        if (all_block_chat[i] && all_block_chat[i].is_seen == false) {
            $(".fred_dot_toolbar_new_message").css("display", "block");
        }
    }
}


function setup_popup_message(data, LiveChat) { // si on doit debuter le live chat ou pas
    $("#chat_photo").css({
        "background-image": "url('" + data.profile_picture + "')",
    });
    $("#chat_title").text(data.fullname);
    $("#fblock_message_content").html("");
    let loading_msg = document.createElement("div");
    loading_msg.className = "loading-spinner loading_message";
    $("#fblock_message_content").append(loading_msg);
    if (LiveChat == true) {
        live_chat(data.chat_id);
    }
    Popup("popup-message", true);
    Popup("popup-create-conversation", false);
}

function send_message(chat_id) {
    let data_message = {
        message: $("#input_send_message").val(),
        chat_id: chat_id
    };
    ServerManager.AddMessage(data_message);
    $("#input_send_message").val(" ");
    if ($(".block_message_seen")) {
        // $(".block_message_seen").remove();
    }
    // Empecher l'utilisateur de pouvoir clicker si l'imput msg est vide
}

function pop_block_chat(data) {
    $(".loading_chat_list").remove();
    let new_block_chat = new block_chat(data);
    all_block_chat.push(new_block_chat);

}

function pop_block_message(id, data, previous_message) {
    data.id = id;
    let new_block_message = new block_message(data, previous_message);
    all_block_message.push(new_block_message);
}

function pop_block_message_seen(data) {
    $(".block_message_seen").remove();
    let new_block_message_seen = new block_message_seen(data);
}

/* 
Exclu la derniere clé de la requete
Si je demande les 20 previous msg à partir d'une clé X
la clé X ne sera pas retourné
*/
function exclude(key) {
    return key.substring(0, key.length - 1) + String.fromCharCode(key.charCodeAt(key.length - 1) - 1);
}

// Affiche les msg precedent 20 par 20
function message_infinite_scroll(data, old_diff) {
    console.log("message_infinite_scroll was called");
    firebase.database().ref(FirebaseEnvironment + "/messages/" + data.chat_id).orderByKey().endAt(exclude(data.first_messake_key)).limitToLast(30)
        .once('value').then(function (dataSnapshot) {
            //console.log(" les 20 anciens msg sont : ");
            //console.log(dataSnapshot.val());
            //console.log(" les id des anciens msg sont : ");
            //console.log(dataSnapshot.key);
            let tab_all_messages = Object.entries(dataSnapshot.val());
            current_block_chat.first_messake_key = tab_all_messages[0][0];

            if (tab_all_messages.length < 30) {
                can_load_more_message = false;
            }
            for (let i = 0; i < tab_all_messages.length; i++) {
                previous_message = tab_all_messages[i][1];
                let time = Math.floor((tab_all_messages[i][1].time - previous_message.time) / 1000 / 60 / 60);
                previous_message = tab_all_messages[i][1];
                if (time > 2) {

                    block_message_date(tab_all_messages[i][1].time);
                }

                pop_block_message(tab_all_messages[i][0], tab_all_messages[i][1], true);

                if (i == (tab_all_messages.length - 1) && tab_all_messages.length < 30) {
                    can_load_more_message = false;
                }
                if (i == (tab_all_messages.length - 1) && tab_all_messages.length == 30) {
                    can_load_more_message = true;
                }
            }
            let new_diff = scrollableElement.scrollHeight - scrollableElement.clientHeight;
            $(scrollableElement).scrollTop(new_diff - old_diff);
            console.log(new_diff, old_diff);


        });

}

// Messagerie instantanéé
function live_chat(chat_id) {
    previous_message = {};
    firebase.database().ref(FirebaseEnvironment + "/messages/" + chat_id).limitToLast(30).on("child_added", function (snapshot, prevChildKey) {
        var html = "";
        // give each message a unique ID
        // show delete button if message is sent by me
        if (!current_block_chat.first_messake_key) {
            current_block_chat.first_messake_key = prevChildKey;
        }
        let time = Math.floor((snapshot.val().time - previous_message.time) / 1000 / 60 / 60);
        previous_message = snapshot.val();
        previous_message.id = snapshot.key;
        if (time > 0.5) {
            block_message_date(snapshot.val().time);
        }
        pop_block_message(snapshot.key, snapshot.val());
        let data_set_to_seen = {
            chat_id: chat_id,
            message_id: snapshot.key
        };
        ServerManager.SetMessageToSeen(data_set_to_seen);

    });

    // Firebase listenener du seen_by
    firebase.database().ref(FirebaseEnvironment + '/messages/' + chat_id).orderByChild('seen_by').limitToLast(1).on("value", function (child_change_snapshot) {
        if (child_change_snapshot.val() != null) {
            let user_who_seen = Object.entries(child_change_snapshot.val());
            user_who_seen = Object.entries(user_who_seen[0][1].seen_by);
            for (let i = 0; i < user_who_seen.length; i++) {
                if (user_who_seen[i][0] != window.localStorage.getItem("firebase_token") && user_who_seen[i][1] == true)
                    pop_block_message_seen(current_block_chat.block_chat_photo);
                scroll_to_bottom($("#fblock_message_content"));
            }
        }

    });


    // Firebase listenener du is_typing
    firebase.database().ref(FirebaseEnvironment + '/chats/' + chat_id).orderByChild('is_typing').on("value", function (is_typing_snapshot) {

        if (is_typing_snapshot.val() && is_typing_snapshot.val().is_typing) {
            for (let i = 0; i < Object.keys(is_typing_snapshot.val().is_typing).length; i++) {
                let data_is_typing = {
                    user_id: Object.entries(is_typing_snapshot.val().is_typing)[i][0],
                    value: Object.entries(is_typing_snapshot.val().is_typing)[i][1]
                };
                if (data_is_typing.user_id != window.localStorage.getItem("firebase_token") && data_is_typing.value == true) {
                    $(".is_typing").remove();
                    let is_typing = document.createElement("li");
                    is_typing.className = "is_typing";
                    $("#fblock_message_content").append(is_typing);
                    scroll_to_bottom($("#fblock_message_content"));
                }
                if (data_is_typing.user_id != window.localStorage.getItem("firebase_token") && data_is_typing.value == false) {
                    $(".is_typing").remove();
                }
            }
        }
    });


    $("#input_send_message").focusin(function () {

        if (first_chat == false) {
            firebase.database().ref(FirebaseEnvironment + '/chats/' + current_block_chat.chat_id + '/is_typing/')
                .update({
                    [window.localStorage.getItem("firebase_token")]: true
                });
        }

        scroll_to_bottom($("#fblock_message_content"), 100);
    });

    $("#input_send_message").focusout(function () {
        if (recording_vocal) {
            $("#input_send_message").focus();
        } else {
            if (first_chat == false) {
                firebase.database().ref(FirebaseEnvironment + '/chats/' + current_block_chat.chat_id + '/is_typing/')
                    .update({
                        [window.localStorage.getItem("firebase_token")]: false
                    });
            }

            scroll_to_bottom($("#fblock_message_content"), 350, true);
        }
    });

}

function scroll_to_bottom(element, delay, noanim) {
    if (!delay) delay = 350;
    setTimeout(function () {
        if (noanim) {
            element.scrollTop(element[0].scrollHeight);
        } else {
            element.animate({
                scrollTop: element[0].scrollHeight
            }, 200, 'swing');
        }
    }, 350);

}

function difference(obj1, obj2) {
    let keyFound = false;
    Object.keys(obj1).forEach(key => {
        if (obj1[key] !== obj2[key]) {
            return keyFound = key;
        }
    });
    //console.log("key difference : ");
    return keyFound || -1;
}

function GetFollowingsPopupCreateConversation() {
    let data_followings = {
        PrivateId: window.localStorage.getItem("user_private_id"),
        Index: 0,
        follow_list: "CreateConversation",
    };
    ServerManager.GetFollowingOfUser(data_followings);

}

function DisplayFollowingsPopupCreateConversation(data, follow_list) {
    if (Array.isArray(data) && data.length != 0) {
        $(".fconversation_block_utilisateur_list").html("");
        data.forEach(item => {
            if (item.FirebaseToken != window.localStorage.getItem("firebase_token")) {
                let user = new block_user(follow_list, "CreateConversation", item);
                all_users_block.push(user);
            }

        });

    } else {
        let no_users = document.createElement("div");
        no_users.className = "no_results no_results_messages";
        no_users.innerHTML = "Pas de résultat";
        $(".fconversation_block_utilisateur_list").html("");
        $(".fconversation_block_utilisateur_list")[0].appendChild(no_users);
    }
}

function UpdateProgressBar(percent) {
    $("#UploadProgressBar").css({
        "display": "block",
        "width": percent + "vw"
    });
    if (percent == 100) {
        $("#UploadProgressBar").css("width", percent + "vw");

        setTimeout(function () {
            $("#UploadProgressBar").css({
                "display": "none"
            });
        }, 500);

    }
}

/*------------------------TO DO-----------------------
- Gestion des vues ----------DONE
- Gestion du Is typing ------DONE
- Scroll nvx msg ------------DONE
- Scroll is typing ----------DONE
- Notifications -------------DONE
- Scroll conv list
- Scroll message list
- Fix le load des conversations
- Sécuriser la conexion à la bdd
---Pas Urgent------
- Message limite nb de charactere
- Demandes de dm
- Possibilité de mute les conv
*/