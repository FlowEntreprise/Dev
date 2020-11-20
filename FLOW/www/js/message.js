// Test DM
var chat_id;
var data_dm = {};
var first_chat = false;
var current_block_chat;
var all_block_chat = [];
var all_block_message = [];
var previous_message = {};
var current_block_message;

function block_chat(data) {
    var block_chat = this;
    this.chat_id = data.chat_data.chat_id;
    this.block_chat_last_message = data.chat_data.last_message;
    this.block_chat_title = data.members_data.name;
    this.block_chat_photo = data.members_data.profile_pic;
    this.members = data.members_data;
    this.creator = data.chat_data.creator;
    //this.creation_date = data.chat_data.creation_date;
    this.is_groupe_chat = data.chat_data.is_groupe_chat;
    this.block_chat = document.createElement('div');
    this.block_chat.className = 'fblock_chat';
    $("#block_chat_contrainer").append(this.block_chat);

    $(this.block_chat).on("click", function () {
        current_block_chat = block_chat;
        data_dm =
        {
            fullname: current_block_chat.block_chat_title,
            chat_id: current_block_chat.chat_id,
            profile_picture: current_block_chat.block_chat_photo,
            is_groupe_chat: current_block_chat.is_groupe_chat,
            message_id: current_block_chat.block_chat_last_message.message_id
        };
        ServerManager.SetMessageToSeen(data_dm);
        setup_popup_message(data_dm);
    });
    /*if (this.is_groupe_chat == false) {
        for (let i = 0; i < this.members.length; i++) {
            if (i[0] == window.localStorage.getItem("firebase_token")) {
                let index = this.members.indexOf(this.members[i]);
                if (index > -1) {
                    this.members.splice(index, 1);
                }
            }
        }
        if (this.is_groupe_chat.length < 1) {
            this.block_chat_title = this.members[0];
        }
    }*/
    this.fphoto_block_chat = document.createElement('div');
    this.fphoto_block_chat.className = 'fphoto_block_chat';
    this.fphoto_block_chat.style.backgroundImage = "url(" + this.block_chat_photo + "";
    this.block_chat.appendChild(this.fphoto_block_chat);

    this.fconversation_title = document.createElement('label');
    this.fconversation_title.className = 'fconversation_title';
    this.fconversation_title.innerText = this.block_chat_title;
    this.block_chat.appendChild(this.fconversation_title);

    this.fblock_chat_text = document.createElement('label');
    this.fblock_chat_text.className = 'fblock_chat_text';
    this.fblock_chat_text.innerText = this.block_chat_last_message.message;
    this.block_chat.appendChild(this.fblock_chat_text);

    this.fblock_chat_record = document.createElement("img");
    this.fblock_chat_record.className = "fblock_chat_record";
    this.fblock_chat_record.src = "../www/src/icons/microphone.png";
    $(this.block_chat).append(this.fblock_chat_record);

    this.fblock_chat_time = document.createElement('label');
    this.fblock_chat_time.className = 'fblock_chat_time';
    this.fblock_chat_time.innerText = set_timestamp(this.block_chat_last_message.time, true);
    this.block_chat.appendChild(this.fblock_chat_time);

}

// affichage de la date quand il s'est ecoulé plus de 2h entre 2 msg
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

function block_message(data) {
    var block_message = this;
    this.message_id = data.id;
    this.sender_id = data.sender_id;
    this.sender_full_name = data.sender_full_name;
    this.sender_private_id = data.sender_private_id;
    this.block_message_time = data.time;
    this.block_message_text = data.message;
    this.seen_by = data.seen_by;
    this.block_message = document.createElement('li');

    this.time_and_seen_container = document.createElement('div');
    this.time_and_seen_container.className = 'time_and_seen_container';

    if (this.sender_private_id == window.localStorage.getItem("user_private_id")) // token id par la suite
    {
        this.block_message.className = 'my_block_message';
        this.time_and_seen_container.innerText = set_timestamp(this.block_message_time, true);
    }
    else {
        this.block_message_left_photo = document.createElement('div');
        this.block_message_left_photo.className = 'block_message_left_photo';
        this.block_message_left_photo.style.backgroundImage = "url(" + current_block_chat.block_chat_photo + "";
        this.block_message.className = 'block_message';
        this.time_and_seen_container.innerText = set_timestamp(this.block_message_time, true);
    }


    $(this.block_message).text(this.block_message_text);
    //$(this.block_message).prepend(this.block_message_left_photo);
    this.block_message.id = this.message_id;
    $(this.block_message).append(this.time_and_seen_container);
    $("#fblock_message_content").append(this.block_message);
    if (this.seen_by) {
        block_message_seen(current_block_chat.block_chat_photo);
    }

    $(this.block_message).on("click", function () {
        if ($(block_message.time_and_seen_container).css('display') == 'none') {
            $(block_message.time_and_seen_container).css('display', 'block');
        }
        else {
            $(block_message.time_and_seen_container).css('display', 'none');
        }
        {

        }
    });


}


$("#fnameCompte").on("click", function () {

    if (FirebaseToken < window.localStorage.getItem("firebase_token")) {
        chat_id = FirebaseToken + window.localStorage.getItem("firebase_token");
    }
    else {
        chat_id = window.localStorage.getItem("firebase_token") + FirebaseToken;
    }

    data_dm =
    {
        fullname: account_fullname,
        user_id: FirebaseToken,
        chat_id: chat_id,
        profile_picture: profilePicLink,
        is_groupe_chat: false
    };
    setup_popup_message(data_dm);
    ServerManager.CheckFirstChat(data_dm);
});


$("#button_send_message").on("click", function () {
    if ($("#input_send_message").val().trim().length != 0) {
        data_dm.message = $("#input_send_message").val();
        if (first_chat == true) // premier msg
        {
            ServerManager.AddChat(data_dm, pop_block_chat);
        }
        else {
            send_message(data_dm.chat_id);
        }
    }
});

function setup_popup_message(data) {
    $("#chat_photo").css({ "background-image": "url('" + data.profile_picture + "')", });
    $("#chat_title").text(data.fullname);
    $("#fblock_message_content").html("");
    Popup("popup-message", true);
    live_chat(data.chat_id);
}

function send_message(chat_id) {
    let data_message =
    {
        message: $("#input_send_message").val(),
        chat_id: chat_id
    };
    ServerManager.AddMessage(data_message);
    $("#input_send_message").val(" ");
    if ($(".block_message_seen")) {
        $(".block_message_seen").remove();
    }
    // Empecher l'utilisateur de pouvoir clicker si l'imput msg est vide
}

function pop_block_chat(data) {
    let new_block_chat = new block_chat(data);
    all_block_chat.push(new_block_chat);

}

function pop_block_message(id, data) {
    data.id = id;
    let new_block_message = new block_message(data);
    all_block_message.push(new_block_message);
}

function pop_block_message_seen(data) {
    $(".block_message_seen").remove();
    let new_block_message_seen = new block_message_seen(data);
}

function live_chat(chat_id) {
    previous_message = {};
    firebase.database().ref(FirebaseEnvironment + "/messages/" + chat_id).limitToLast(20).on("child_added", function (snapshot) {
        var html = "";
        // give each message a unique ID
        // show delete button if message is sent by me
        let time = Math.floor((snapshot.val().time - previous_message.time) / 1000 / 60 / 60);
        previous_message = snapshot.val();
        previous_message.id = snapshot.key;
        if (time > 2) {

            block_message_date(snapshot.val().time);
        }
        pop_block_message(snapshot.key, snapshot.val());
        let data_set_to_seen = {
            chat_id: chat_id,
            message_id: snapshot.key
        };
        ServerManager.SetMessageToSeen(data_set_to_seen);
        /*setTimeout(function () {
            $("#fblock_message_content").animate({
                scrollTop: $("#fblock_message_content").height()
            }, 400, 'swing');
        }, 350);*/
        /*if (snapshot.val().sender == window.localStorage.getItem("user_private_id")) {
            html += "<li class='my_block_message' id='message-" + snapshot.key + "'>";    
        }
        else {
            html += "<li class='block_message' id='message-" + snapshot.key + "'>";
        }
        html += snapshot.val().sender + ": " + snapshot.val().message;
        html += "</li>";
        document.getElementById("liste_message").innerHTML += html;*/
    });

    // Firebase listenener du seen_by
    firebase.database().ref(FirebaseEnvironment + '/messages/' + chat_id).orderByChild('seen_by').limitToLast(1).on("value", function (child_change_snapshot) {
        console.log(" le message mis en lu est :");
        console.log(child_change_snapshot.val());
        console.log("l'id du msg est : " + child_change_snapshot.key);
        if (child_change_snapshot.val() != null) {
            let user_who_seen = Object.entries(child_change_snapshot.val());
            user_who_seen = Object.entries(user_who_seen[0][1].see_by);
            for (let i = 0; i < user_who_seen.length; i++) {
                if (user_who_seen[i][0] != window.localStorage.getItem("firebase_token") && user_who_seen[i][1] == true)
                    pop_block_message_seen(current_block_chat.block_chat_photo);
                scroll_to_bottom($("#fblock_message_content"));
            }
        }

    });

    // Firebase listenener du is_typing
    firebase.database().ref(FirebaseEnvironment + '/chats/' + chat_id).orderByChild('is_typing').on("value", function (is_typing_snapshot) {
        console.log(" is typing val");
        console.log(is_typing_snapshot.val());
        console.log(" is typing key");
        console.log(is_typing_snapshot.key);
        if (is_typing_snapshot.val()) {
            for (let i = 0; i < Object.keys(is_typing_snapshot.val().is_typing).length; i++) {
                let data_is_typing =
                {
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
}

$("#input_send_message").focusin(function () {

    firebase.database().ref(FirebaseEnvironment + '/chats/' + current_block_chat.chat_id + '/is_typing').update({
        [window.localStorage.getItem("firebase_token")]: true
    });

});

$("#input_send_message").focusout(function () {

    firebase.database().ref(FirebaseEnvironment + '/chats/' + current_block_chat.chat_id + '/is_typing').update({
        [window.localStorage.getItem("firebase_token")]: false
    });

});

function scroll_to_bottom(element) {
    setTimeout(function () {
        element.animate({
            scrollTop: element[0].scrollHeight
        }, 400, 'swing');
    }, 350);
}


/*function get_chat(data) // fonction qui recupere les conversations
{

    //startAt(3) index de depart avec inclusion 
    //limitToLast(2) nombre d'enfants que l'on veut
    let ref = firebase.database().ref(FirebaseEnvironment + "/members");
    ref.orderByChild(data[1].user_id).equalTo(true).limitToLast(20).on("child_added", function (snapshot) {

        console.log("Data get chat");
        console.log(snapshot.key);
        console.log(snapshot.val());
    });
}*/


function deleteMessage(self) {
    // get message ID
    var messageId = self.getAttribute("data-id");

    // delete message
    firebase.database().ref(FirebaseEnvironment + "/messages").child(messageId).remove();
}

/* attach listener for delete message
firebase.database().ref(FirebaseEnvironment + "/messages").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
});*/

document
    .getElementById("popup-message")
    .addEventListener("opened", function () {
        $("#div_send_message").css("left", "0vw");
        current_page = "popup_message";
        scroll_to_bottom($("#fblock_message_content"));
    });
document
    .getElementById("popup-message")
    .addEventListener("closed", function () {
        firebase.database().ref(FirebaseEnvironment + "/messages/" + current_block_chat.chat_id).off();
        firebase.database().ref(FirebaseEnvironment + '/chats/' + chat_id + '/last_message/see_by').off();
        firebase.database().ref(FirebaseEnvironment + '/chats/' + chat_id).orderByChild('is_typing').off();
        $("#div_send_message").css("left", "-100vw");
        $("#fblock_message_content").html("");
        stopAllBlocksAudio();
        first_chat = false;
    });


/*------------------------TO DO-----------------------

- Gestion des vues ----------DONE
- Gestion du Is typing ------DONE
- Scroll nvx msg ------------DONE
- Scroll is typing ----------DONE
- Fix le load des conversations
- Notifications
- Possibilité de mute les conv
- Scroll conv list
- Scroll message list
- Demandes de dm
- Message limite nb de charactere
- Sécuriser la conexion à la bdd

*/