
    function block_notification_like(data) { //type permet de defini si c'est le like d'un flow ou le like d'un commentaire
    this.seen = false;
    var block_notification_like = this;
    this.full_name = data.additionalData.sender_info.fullname; // nom de celui qui a send la notif
    this.message = data.additionalData.sender_info.post_texte; // le contenue de la notif, text de commentaire ou titre de flow
    this.photo_link = data.additionalData.sender_info.profil_pic; // lien de la photo de celui qui a send la notif
    this.like_comment = data.additionalData.type;
    this.private_Id = data.additionalData.sender_info.privateId;
    if(block_notification_like.like_comment == "like_comment"){this.message = data.additionalData.sender_info.like_comment_text;}
    this.block_notification_like = document.createElement('div');
    this.block_notification_like.className = 'fblock_notification';
    $("#tab4").prepend(this.block_notification_like);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_like';
    this.fphoto_block_notif.style.backgroundImage = "url('" + data.additionalData.sender_info.profil_pic + "')";
    this.block_notification_like.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Like_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = this.full_name + ' liked your flow';
    if(block_notification_like.like_comment == "like_comment"){this.fnotif_label.innerText = this.full_name + ' liked your comment';}
    this.block_notification_like.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
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
        $(".flow_specifique_container").html("");
        let myApp = new Framework7();
        let data_flow = {
            IdFlow : data.additionalData.sender_info.IdFlow
        };
        ServerManager.GetSingle(data_flow);             
        Popup("popup-specifique", true);
        if(block_notification_like.like_comment == "like_comment"){
        
            display_all_comments(data);
        }
    });

    $(this.fphoto_block_notif).on('click',function(event){

        let data = 
        {
            private_Id : block_notification_like.private_Id,
            user_private_Id : window.localStorage.getItem("user_private_id") 
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
    $("#tab4").prepend(this.block_notification_echo);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_echo';
    this.fphoto_block_notif.style.backgroundImage = "url('" + data.additionalData.sender_info.profil_pic + "')";
    this.block_notification_echo.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Echo_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = this.full_name + ' echoed your flow';
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
    this.ftime.innerText = '2 min';
    this.block_notification_echo.appendChild(this.ftime);

    $(this.block_notification_echo).on("click", function () {
        $(block_notification_echo.fred_dot_border).css('display', 'none');
        set_seen(block_notification_echo);
        check_seen();
    });

}

function block_notification_comment(data) {
    this.seen = false;
    var block_notification_comment = this;
    this.full_name = data.additionalData.sender_info.fullname; // nom de celui qui a send la notif
    this.message = data.additionalData.sender_info.comment_text; // le contenue de la notif, text de commentaire ou titre de flow
    this.photo_link = data.additionalData.sender_info.profil_pic;
    this.private_Id = data.additionalData.sender_info.privateId; // lien de la photo de celui qui a send la notif
    this.block_notification_comment = document.createElement('div');
    this.block_notification_comment.className = 'fblock_notification';
    $("#tab4").prepend(this.block_notification_comment);

    this.fphoto_block_notif = document.createElement('div');
    this.fphoto_block_notif.className = 'fphoto_block_notif_comment';
    this.fphoto_block_notif.style.backgroundImage = "url('" + data.additionalData.sender_info.profil_pic + "')";
    this.block_notification_comment.appendChild(this.fphoto_block_notif);

    this.ftype_notif = document.createElement('img');
    this.ftype_notif.className = 'ftype_notif';
    this.ftype_notif.src = 'src/icons/Comment_filled.png';
    this.fphoto_block_notif.appendChild(this.ftype_notif);

    this.fnotif_label = document.createElement('label');
    this.fnotif_label.className = 'fnotif_label';
    this.fnotif_label.innerText = this.full_name;
    this.block_notification_comment.appendChild(this.fnotif_label);

    this.fnotif_text = document.createElement('label');
    this.fnotif_text.className = 'fnotif_text';
    this.fnotif_text.innerText = this.message;
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
        $(".flow_specifique_container").html("");
        let myApp = new Framework7();
        let data_flow = {
            IdFlow : data.additionalData.sender_info.IdFlow
        };
        ServerManager.GetSingle(data_flow);             
        Popup("popup-specifique", true);
        display_all_comments(data);
    });
    

    $(this.fphoto_block_notif).on('click',function(event){

        let data = 
        {
            private_Id : block_notification_comment.private_Id,
            user_private_Id : window.localStorage.getItem("user_private_id") 
        };
        go_to_account(data);
        event.stopPropagation();
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
            var new_notif_echo = new block_notification_echo(like_type);
            all_notifications_block.push(new_notif_echo);
            break;
        case 'comment':
            var new_notif_comment = new block_notification_comment(like_type);
            all_notifications_block.push(new_notif_comment);
            break;
    }
      
}

//https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/PAYLOAD.md

function send_notif_to_user(block,type)
{


    let prepare_id_flow = block.ObjectId ? block.ObjectId : block.Flow_block_id;
    let prepare_id_registerId = block.RegisterId ? block.RegisterId : block.current_flow_block.RegisterId;
    if(prepare_id_flow == undefined){prepare_id_flow = block.current_flow_block.ObjectId;}
    var sender_info = { 
                        fullname : window.localStorage.getItem("user_name"),
                        privateId : window.localStorage.getItem("user_private_id"),
                        profil_pic : window.localStorage.getItem("user_profile_pic"),
                        post_texte : $(block.fpost_title).text(), // texte like de flow
                        comment_text : block.Comment_text, // texte commentaire genre le vrai commenaire t'a capté
                        like_comment_text : block.fcomment_text, // texte lorsque l'on like un commentaire
                        IdFlow : prepare_id_flow
                        };        


if( (registrationId != prepare_id_registerId) ||
 (registrationId == prepare_id_registerId && block.tag_user_RegisterId != undefined && registrationId != block.tag_user_RegisterId))
    {
    switch (type) {
        case 'like_flow':
            
            data = {
        
                "data" : {
                 "title" : sender_info.fullname,          
                 "message" : "@" + sender_info.privateId  + " liked your flow : "  + sender_info.post_texte,
                 "type" : "like_flow",
                 "sender_info" : sender_info,
                 "force-start": 1      
               },
               "to":block.RegisterId
               //registrationId
           };
           ServerManager.Send_notif(data);
       
            break;

        case 'send_comment':

                data = {
        
                    "data" : {
                     "title" : sender_info.fullname,          
                     "message": "@" + sender_info.privateId +" commented : "+ block.Comment_text,
                     "type" : "send_comment",
                     "sender_info" : sender_info,
                     "force-start": 1
                   },
                   "to":block.current_flow_block.RegisterId
                   //registrationId
               };
               ServerManager.Send_notif(data);

            break;

            case 'tag_in_comment':

                data = {
        
                    "data" : {
                     "title" : sender_info.fullname,          
                     "message": block.Comment_text,
                     "type" : "send_comment",
                     "sender_info" : sender_info,
                     "force-start": 1
                   },
                   "to":block.tag_user_RegisterId
                   //registrationId
               };
               ServerManager.Send_notif(data);

            break;

        case 'like_comment':

               data = {
        
                    "data" : {
                     "title" : sender_info.fullname,          
                     "message" : "@" + sender_info.privateId +" liked your comment : "+ block.fcomment_text,
                     "type" : "like_comment",
                     "sender_info" : sender_info,
                     "force-start": 1
                   },
                   "to":block.RegisterId
                   //registrationId
               };
               ServerManager.Send_notif(data);

            break;

        }
    } 
    
    else{
        console.log("on peut pas s'envoyer des notifs à soit même voyons");
    }

}


function notif_recieved(data) {

    var notif_type = data.additionalData.type;


    switch (notif_type) {
        case 'like_flow':

            if (data.additionalData.foreground == true) {
                $(".flabel_in_app_notif").text(data.title + " liked your flow");
                $(".f_in_app_notif").css("margin-top", "-40vw");
                setTimeout(function () {
                    $(".f_in_app_notif").css("margin-top", "5vw");
                }, 2000);
            }
            push_notif_block('like', data);

            break;

        case 'send_comment':

            if (data.additionalData.foreground == true) {
            $(".flabel_in_app_notif").text(data.title + " commented your flow");
            $(".f_in_app_notif").css("margin-top", "-40vw");
            setTimeout(function () {
                $(".f_in_app_notif").css("margin-top", "5vw");
            }, 2000);}
            push_notif_block('comment', data);

            break;

        case 'like_comment':

                if (data.additionalData.foreground == true) {
            $(".flabel_in_app_notif").text(data.title + " liked your comment");
            $(".f_in_app_notif").css("margin-top", "-40vw");
            setTimeout(function () {
                $(".f_in_app_notif").css("margin-top", "5vw");
            }, 2000);}
            push_notif_block('like', data);

            break;
    }
}

var all_notifications_block = [];

