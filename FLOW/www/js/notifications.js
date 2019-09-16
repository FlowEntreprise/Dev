function block_notification_like(type) { //type permet de defini si c'est le like d'un flow ou le like d'un commentaire
    this.seen = false;
    var block_notification_like = this;
    this.block_notification_like = document.createElement('div');
    this.block_notification_like.className = 'fblock_notification';
    $("#tab4").prepend(this.block_notification_like);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_like';
    this.block_notification_like.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Like_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = 'Chris liked your flow';
    if(type == "comment"){this.fnotif_label.innerText = 'Chris liked your comment';}
    this.block_notification_like.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = 'What an amazing sound';
    this.block_notification_like.appendChild(this.fnotif_text);

    this.fred_dot_border = document.createElement('label');
    this.fred_dot_border.className = 'fred_dot_border';
    this.block_notification_like.appendChild(this.fred_dot_border);

    this.fred_dot = document.createElement('label');
    this.fred_dot.className = 'fred_dot';
    this.fred_dot_border.appendChild(this.fred_dot);

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = '2 min';
    this.block_notification_like.appendChild(this.ftime);

    $(this.block_notification_like).on("click", function () {
        $(block_notification_like.fred_dot_border).css('display', 'none');
        set_seen(block_notification_like);
        check_seen();
    });
}

function block_notification_echo() {
    this.seen = false;
    var block_notification_echo = this;
    this.block_notification_echo = document.createElement('div');
    this.block_notification_echo.className = 'fblock_notification';
    $("#tab4").prepend(this.block_notification_echo);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_echo';
    this.block_notification_echo.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Echo_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = 'Alice echoed your flow';
    this.block_notification_echo.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = 'What an amazing sound';
    this.block_notification_echo.appendChild(this.fnotif_text);

    this.fred_dot_border = document.createElement('label');
    this.fred_dot_border.className = 'fred_dot_border';
    this.block_notification_echo.appendChild(this.fred_dot_border);

    this.fred_dot = document.createElement('label');
    this.fred_dot.className = 'fred_dot';
    this.fred_dot_border.appendChild(this.fred_dot);

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = '2 min';
    this.block_notification_echo.appendChild(this.ftime);

    $(this.block_notification_echo).on("click", function () {
        $(block_notification_echo.fred_dot_border).css('display', 'none');
        set_seen(block_notification_echo);
        check_seen();
    });

}

function block_notification_comment() {
    this.seen = false;
    var block_notification_comment = this;
    this.block_notification_comment = document.createElement('div');
    this.block_notification_comment.className = 'fblock_notification';
    $("#tab4").prepend(this.block_notification_comment);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_comment';
    this.block_notification_comment.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Comment_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = 'Justine comment your flow';
    this.block_notification_comment.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = 'What an amazing sound';
    this.block_notification_comment.appendChild(this.fnotif_text);

    this.fred_dot_border = document.createElement('label');
    this.fred_dot_border.className = 'fred_dot_border';
    this.block_notification_comment.appendChild(this.fred_dot_border);

    this.fred_dot = document.createElement('label');
    this.fred_dot.className = 'fred_dot';
    this.fred_dot_border.appendChild(this.fred_dot);

    this.ftime = document.createElement('label');
    this.ftime.className = 'ftime';
    this.ftime.innerText = '2 min';
    this.block_notification_comment.appendChild(this.ftime);

    $(this.block_notification_comment).on("click", function () {
        $(block_notification_comment.fred_dot_border).css('display', 'none');
        set_seen(block_notification_comment);
        check_seen();
    });

}

//fonction qui permet de faire disparaitre le point rouge de l'iconne de notifications
//quand toute les notifications on été consulté
function check_seen() {
    var incrementation = 0;
    for (var i = 0; i < all_notifications_block.length; i++) {
        if (all_notifications_block[i].seen == true) {
            incrementation++;
        }
        if (incrementation == all_notifications_block.length) {
            $(".fred_dot_toolbar_new_notif").css('display', 'none');
        }

    }

}

//fonction qui permet de set la variable seen qui indique si une notif a été consulté ou pas
function set_seen(object) {

    for (var i = 0; i < all_notifications_block.length; i++) {
        if (all_notifications_block[i] == object) {
            all_notifications_block[i].seen = true;
        }
    }
}

//fonction qui permet de creer les blocs de notifs
function push_notif_block(notification_type,like_type) {

    $(".fred_dot_toolbar_new_notif").css('display', 'block');
    switch (notification_type) {
        case 'like':
            var new_notif_like = new block_notification_like(like_type);
            all_notifications_block.push(new_notif_like);
            break;
        case 'echo':
            var new_notif_echo = new block_notification_echo();
            all_notifications_block.push(new_notif_echo);
            break;
        case 'comment':
            var new_notif_comment = new block_notification_comment();
            all_notifications_block.push(new_notif_comment);
            break;
    }
      
}


function send_notif_to_user(block,type)
{

    let sender_fullname = window.localStorage.getItem("user_name");
    let sender_privateId = window.localStorage.getItem("user_private_id");

    if(registrationId == block.RegisterId) 
    {
        console.log("on peut pas s'envoyer des notifs à soit même voyons");
    }
    else{
    switch (type) {
        case 'like_flow':
        
            data = {
        
                "data" : {
                 "title":sender_fullname,          
                 "message":"@" + sender_privateId  + " liked your flow : "  + $(block.fpost_title).text()
               },
               "to":block.RegisterId
               //registrationId
           };
           ServerManager.Send_notif(data);
       
            break;

        case 'send_comment':

                data = {
        
                    "data" : {
                     "title":sender_fullname,          
                     "message": "@" + sender_privateId +" commented : "+ block.Comment
                   },
                   "to":block.current_flow_block.RegisterId
                   //registrationId
               };
               ServerManager.Send_notif(data);

            break;

        case 'like_comment':

               data = {
        
                    "data" : {
                     "title":sender_fullname,          
                     "message": "@" + sender_privateId +" liked your comment : "+ block.fcomment_text
                   },
                   "to":block.RegisterId
                   //registrationId
               };
               ServerManager.Send_notif(data);

            break;

        }
    }    

}

var all_notifications_block = [];