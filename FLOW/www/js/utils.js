// Contient les fontions generiques de l'app

function set_timestamp(timestamp, return_hours) {
    // fonction qui permet d'afficher le temp ecoulé depuis un post (posté il y a 2h par exemple)


    var time_str = "";
    var time = Math.floor(timestamp);
    var now = Math.floor(Date.now() / 1000);

    var second_past = now - time;

    var minute_past = Math.floor(second_past / 60);

    var hour_past = Math.floor(minute_past / 60);

    var day_past = Math.floor(hour_past / 24);

    var week_past = Math.floor(day_past / 7);

    var month_past = Math.floor(day_past / 28);

    var year_past = Math.floor(month_past / 12);


    if (return_hours) {
        let date = new Date(timestamp);
        let difference = Date.now() - timestamp;

        let message_hour_past = Math.floor(difference / 1000 / 60 / 60);
        let minutes;
        date.getMinutes() < 10 ? minutes = "0" + date.getMinutes() : minutes = date.getMinutes();
        //date = date.toLocaleDateString("fr") + " " + date.getHours() + ":" + minutes;
        if (message_hour_past > 8760) {
            date = date.toLocaleDateString("fr") + " " + date.getHours() + ":" + minutes;
            return date;
        }
        if (message_hour_past < 24) {
            date = new Date(timestamp).getHours() + ":" + minutes;
            return date;
        }
        if (message_hour_past >= 24 && message_hour_past < 8760 && return_hours != "label_block_message_date") {
            date = new Date(timestamp).getDate() + " " + language_mapping[device_language]['mois'][new Date(timestamp).getMonth()];
            return date;
        }
        if (message_hour_past >= 24 && message_hour_past < 8760 && return_hours == "label_block_message_date") {
            date = new Date(timestamp).getDate() + " " + language_mapping[device_language]['mois'][new Date(timestamp).getMonth()] + " " + new Date(timestamp).getHours() + ":" + minutes;
            return date;
        }
    }

    if (minute_past <= 59 && hour_past <= 0) {
        minute_past > -2 && minute_past < 2 ?
            (time_str = "1 min") :
            (time_str = minute_past + " min");
        return time_str;
    }

    if (hour_past > 0 && hour_past <= 23) {
        hour_past > 1 ?
            (time_str = hour_past + " h") :
            (time_str = hour_past + " h");
        return time_str;
    }

    if (day_past > 0 && day_past < 7) {
        return time_str = `${day_past} ${language_mapping[device_language]["diminutif_jour"]}`;
    }

    if (week_past >= 1 && week_past <= 5) {
        time_str = `${week_past} ${language_mapping[device_language]["diminutif_semaine"]}`;
        return week_past < 2 ? time_str : time_str + "s";
    }

    if (month_past > 0 && month_past <= 12) {
        time_str = `${month_past} ${language_mapping[device_language]["diminutif_mois"]}`;
        return month_past < 2 ? time_str : time_str + "s";
    }

    if (year_past > 0) {
        time_str = `${year_past} ${language_mapping[device_language]["diminutif_anne"]}`;
        return year_past < 2 ? time_str : time_str + "s";
    }
}

function getPathStorageFromUrl(data_message) {

    let baseUrl = "https://storage.googleapis.com/flow-85249.appspot.com/";

    let url = data_message.audio_url ? data_message.audio_url : data_message.image;
    let elemPath = url.replace(baseUrl, "");

    let indexOfEndPath = elemPath.indexOf("?");

    elemPath = elemPath.substring(0, indexOfEndPath);

    elemPath = elemPath.replace("%2F", "/");

    let data = {
        chat_id: current_block_message.chat_id,
        message_id: current_block_message.message_id,
        path: elemPath
    };

    return ServerManager.Delete_media_from_firebase(data);
}

function create_deleted_message(message_id) { // genere le html d'un message qui vient d'être delete
    $("#" + message_id + ">.block_message_child").text("Ce message a été supprimé");
    $("#" + message_id + ">.block_message_child").removeAttr("style");
    $("#" + message_id + ">.block_message_child").css(
        {
            "background-color": "white",
            "color": "#80808059",
            "box-shadow": "none",
            "padding": "auto",
            "width": "auto"
        }
    );
}

function validURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function check_if_starts_with_http(url) {
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }
    return url;
}

function go_to_account(data) {
    //fonction permettant apres click sur sa photo d'aller sur le compte de l'utilisateur
    let time_in_last_screen =
        Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
    facebookConnectPlugin.logEvent(
        "current_page", {
        page: current_page,
        duration: time_in_last_screen,
    },
        null,
        function () {
            // console.log("fb current_page event success");
        },
        function () {
            console.warn("fb current_page error");
        }
    );
    last_currentpage_timestamp = Math.floor(Date.now() / 1000);

    if (data.private_Id == data.user_private_Id) {
        if (current_page != "my-account") {
            Popup("popup-specifique", false);
            Popup("popup-comment", false);
            Popup("popup-account", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-message", false);
            Popup("popup-create-conversation", false);
            Popup("popup-sms", false);
            Popup("popup-contact-on-flow", false);
            Popup("popup-myaccount", true);
            current_page = "my-account";
        } else {
            shake("tabMonCompte1");
            Popup("popup-comment", false);
        }
    } else {
        if (current_page == "account" && privateIDAccount == data.private_Id) {
            shake("tabCompte1");
            Popup("popup-comment", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-message", false);
            Popup("popup-create-conversation", false);
            Popup("popup-specifique", false);
            Popup("popup-sms", false);
            Popup("popup-contact-on-flow", false);
        } else {
            Popup("popup-comment", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-message", false);
            Popup("popup-create-conversation", false);
            Popup("popup-specifique", false);
            Popup("popup-myaccount", false);
            Popup("popup-sms", false);
            Popup("popup-contact-on-flow", false);
            if (connected == true) {
                ServerManager.GetBlockedUsers(data.private_Id, "go_to_acount"); // true si c'est une redirection vers un compte
            } else {
                fInitialisationAccount(data.private_Id);
            }
            //fInitialisationAccount(data.private_Id);
            Popup("popup-account", true);
            current_page = "account";
            //Popup("popup-account", true);
        }
    }
}

function shake(element_id) {
    let tabs = document.getElementById(element_id);
    tabs.classList.remove("shake");
    void tabs.offsetWidth;
    tabs.classList.add("shake");
}

function affichage_nombre(number, decPlaces) {
    // cette fonction permet d'afficher les nombres de likes et autres (1200 devien 1.2 k)

    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            var number = Math.round((number * decPlaces) / size) / decPlaces;

            // Handle special case where we round up to the next abbreviation
            if (number == 1000 && i < abbrev.length - 1) {
                number = 1;
                i++;
            }

            // console.log(number);
            // Add the letter for the abbreviation
            number += abbrev[i];

            // We are done... stop
            break;
        }
    }

    return number;
}

function check_if_url_in_string(string_to_check) {
    string_to_check.split(" ").forEach(function (elem, index) {
        if (validURL(elem)) {
            let clean_str = check_if_starts_with_http(elem);
            let a_tag = document.createElement("a");
            a_tag.title = clean_str;
            a_tag.href = clean_str;
            clean_str = clean_str.replace(/(^\w+:|^)\/\//, '');
            if (string_to_check > 26) {
                clean_str = clean_str.substring(0, 20) + "...";
            }
            a_tag.innerHTML = clean_str;
            $(a_tag).css({
                "top": "-0.5",
                "color": "#1A84EF",
                "text-decoration": "none",
                "position": "relative"
            });
            let word_to_replace = string_to_check.split(" ")[index];
            string_to_check = string_to_check.replace(word_to_replace, a_tag.outerHTML);
        }
    });
    return string_to_check + "<br>";
}

function checkIfItsBeen1Month(data) {
    data.PrivateId = data.data.sender_info.notif_recipient_private_id;
    if (data.lastConnexionTime) {
        let diffDays = parseInt((Date.now() - new Date(data.lastConnexionTime)) / (1000 * 60 * 60 * 24), 10);
        if (diffDays > 30) {

            ServerManager.GetUserInfo(data, 'send_mail');
        }
    }
    else {
        ServerManager.GetUserInfo(data, 'send_mail');
    }

}

function translate_app() {
    language_mapping = {
        //English
        "EN": {
            //STATIC
            "fpopup-connect-msg-inscription": "An account is required to perform this action",
            "privacy_policy": ["By continuing you agree to the ",
                "<a class=\"funderline\" onclick=\"window.open('https:\/\/www.flowappweb.com/terms_and_conditions.html', '_self', 'location=no')\">Terms of Use</a> ",
                "and affirm that you have read and understand FLOW's ",
                "<a class=\"funderline\" onclick=\"window.open('https:\/\/www.flowappweb.com/privacy_policy.html', '_self', 'location=no')\">privacy policy</a>"
            ],
            "fdj_title": "You have been elected flow of the day!",
            "fdj_follow": "FOLLOW",
            "fdj_timer": "The next election in 22 hours.",
            "fdj_txt": "Searching the flows library...",
            "random_flow_btn": "Next",
            "flowoftheday_btn": "<span>Today's flow</span>",
            "top50_btn": "<span>Trending</span>",
            "recents_btn": "<span>Latest</span>",
            "fstory_user": "Your story",
            "fexplore_text": "Discover",
            "fbackground-after-txt": "Background Image",
            "ios_camera_auth": "Authorisation in progress...<br><br>the first time this step may take up to 10 seconds",
            "fbackground-after-story-txt": "Background color",
            "frandom-color-txt": "OTHER COLOUR",
            "ffollowersBandeau": "Followers",
            "ffollowingBandeau": "Followings",
            "fnameMonCompte": "Loading",
            "feditProfil": "EDIT PROFIL",
            "myactivity": "My Activity",
            "mylikes": "Likes",
            "disconnect_btn": "Disconnect",
            "fFollowButtunAccount": "FOLLOW",
            "activity": "Activity",
            "likes": "Like",
            "popup_followings_title": "Followings",
            "popup_followers_title": "Followers",
            "popup_identification_title": "Tag a friend",
            "label_user_blocked_message": "This user has blocked you",
            "label_user_you_blocked_message": "You have blocked this user",
            "create-conversation_title": "New conversation",
            "tuto_txt_1": "Welcome to FLOW",
            "tuto_txt_2": "The first <span>voice-based</span> social network",
            "tuto_txt_3": "You are one of the <span>first users</span> of the app",
            "tuto_txt_4": "We chase <span>bugs</span> every day",
            "tuto_txt_5": "We <span>update</span> the app very regularly",
            "tuto_next_btn": "NEXT",
            "tuto_txt_6": "You can <span>listen</span> and <span>publish</span> <span>vocals</span>",
            "tuto_txt_7": "These vocals are called <span>flows</span>",
            "tuto_txt_8": "They last less than <span>15 seconds</span>",
            "tuto_txt_9": "To <span>record</span> your first flow",
            "tuto_txt_10": "Uses the <span>record button</span>",
            "tuto_txt_11": "You can also add a temporary flow<br>by making a <span>story</span> for your <span>subscribers</span>",
            "tuto_txt_12": "<span>Subscribe</span> to the accounts you like <br>for more content",
            "tuto_txt_13": "Have fun on <span>FLOW</span>",
            "loading_connect_txt": "Connection",
            "tl_private_id_indicator_like": "liked this",
            "tl_private_id_indicator_comment": "commented this",
            "single_flow_views": "listen",
            "multi_flow_views": "listens",
            "finput_description": "Touch to add a description",
            "single_comment": "comment",
            "multi_comment": "comments",
            "single_seconde": "second",
            "multi_seconde": "seconds",
            "c_parti": "Let's go!",
            "fin_de_lapplication": "<div class='parent notloaded'>You’ve been through the app !<br>Come back tomorrow for more content</div>",
            "chargement_swiper": "<div class='parent notloaded'>Loading...</div>",
            "no_results": "No result",
            "show_more": "View more",
            "message_was_deleted": "This message has been deleted",
            "no_message_in_conversation": "There are no messages in this conversation",
            "empty_content": "No flows published",
            "empty_liked_content": "No liked flow",
            "flow_like": "liked your flow",
            "comment_like": "liked your comment",
            "response_like": "liked your response",
            "notif_commented": "commented",
            "notif_responded": "responded",
            "notif_tag": "tagged you",
            "followed_you": "followed you",
            "reacted_to_your_story": "reacted to your story",
            "was_blocked": "has been blocked",
            "was_unblocked": "has been unblocked",
            "report_flow": "This flow has been reported",
            "report_comment": "This comment has been reported",
            "report_dm": "This message has been reported",
            "delete_flow": "This flow has been deleted",
            "_delete_comment": "This comment has been deleted",
            "reply": "Reply",
            "show_responses": "Show responses",
            "previous_responses": "Previous responses",
            "reduce": "Hide",
            "empty_comment": "Comment is empty",
            "btn_delete_conversation": "Delete conversation",
            "btn_delete_message": "Delete message",
            "btn_report_message": "Report message",
            "btn_copy_message": "Copy message",
            "btn_delete_flow": "Delete flow",
            "btn_report_flow": "Report flow",
            "btn_copy_flow_title": "Copy flow title",
            "btn_delete_commentaire": "Delete comment",
            "btn_report_commentaire": "Report comment",
            "btn_copy_commentaire_title": "Copy  comment",
            "flow_report_confirmation": "Do you really want to report this flow ?",
            "user_report_confirmation": "Do you really want to report this user ?",
            "user_block_confirmation": "Do you really want to block this user ?",
            "commentaire_report_confirmation": "Do you really want to report this comment ?",
            "message_report_confirmation": "Do you really want to report this message ?",
            "flow_delete_confirmation": "Do you really want to delete this flow ?",
            "commentaire_delete_confirmation": "Do you really want to delete this comment ?",
            "reponse_delete_confirmation": "Do you really want to delete this response ?",
            "message_delete_confirmation": "Do you really want to delete this message ?",
            "error_while_deleting": "An error occurred while deleting this item",
            "yes": "Yes",
            "cancel": "Cancel",
            "flow_empty_description": "The description of a Flow cannot be empty",
            "photo_permission_denied": "Photo permission not granted",
            "gallery_permission_denied": "Permission for photo gallery not granted",
            "add_story": "Add story",
            "top_users_txt": "Users",
            "empty_tl_1": "No Flows here yet ?",
            "empty_tl_2": "Your timeline will fill up as soon as you start following people.",
            "empty_tl_3": "Find people to follow",
            "no_conversation_yet": "You don't have a conversation yet",
            "no_notification": "No notification",
            "placeholder_explore": "Explore",
            "placeholder_find_conversation": "Search for a conversation",
            "placeholder_add_comment": "Add a comment...",
            "placeholder_add_response": "Add a response...",
            "input_send_message": "Type a message",
            "create-conversation-search-bar": "Search for a user",
            "mois": {
                0: "jan",
                1: "feb",
                2: "mar",
                3: "apr",
                4: "may",
                5: "jun",
                6: "jul",
                7: "aug",
                8: "sep",
                9: "oct",
                10: "nov",
                11: "dec"
            },
            "diminutif_jour": "d",
            "diminutif_semaine": "week",
            "diminutif_mois": "month",
            "diminutif_anne": "year",
            "update_ap": "Update the app to get the latest features.",
            "new_version_available": "New version available!",
            "elu_fdj": "was elected today's flow!",
            "fdj_nxt_election": "next election in",
            "heure": "hour",
            "minute": "minute",
            "seconde": "second",
            "refresh_fdj": "refreshed to discover today's!",
            "title_popup_sms": "Find your friends on flow!",
            "erreur_numero": "Incorrect number",
            "btn_valider_numero": "Validate",
            "ignorer_numero": "Skip",
            "title_contact_on_flow": "Friends already on flow",
            "no_friends": "Unfortunately your friends are not yet on Flow, don't hesitate to invite them",
            "explore_find_friends": "Find friends",
            "confirmation_supprimer_compte": "Do you really want to delete your account ?",
            "supression_compte_sept_jours": "Your account will be deleted within 7 days",
            "delete_account_btn": "Delete account",
            "invite_button": "Invite",
            "join_flow": "Hey join me on FLOW the app to be heard http://onelink.to/6b7mth"
        },
        //French
        "FR": {
            //STATIC
            "fpopup-connect-msg-inscription": "Un compte est nécessaire pour réaliser cette action",
            "privacy_policy": ["En continuant vous acceptez les ",
                "<a class=\"funderline\" onclick=\"window.open('https:\/\/www.flowappweb.com/terms_and_conditions.html', '_self', 'location=no')\">conditions d'utilisations</a> ",
                "et affirmez avoir lu et compris la ",
                "<a class=\"funderline\" onclick=\"window.open('https:\/\/www.flowappweb.com/privacy_policy.html', '_self', 'location=no')\">politique de confidentialité de FLOW</a>"
            ],
            "fdj_title": "Vous avez été élu flow du jour !",
            "fdj_follow": "S'ABONNER",
            "fdj_timer": "prochaine élection dans 22 heures.",
            "fdj_txt": "Recherche dans la bibliothèque de flows...",
            "random_flow_btn": "Suivant",
            "flowoftheday_btn": "<span>Flow du jour</span>",
            "top50_btn": "<span>Tendances</span>",
            "recents_btn": "<span>Récents</span>",
            "fstory_user": "Ta story",
            "fexplore_text": "Découvrir",
            "fbackground-after-txt": "Image de fond",
            "ios_camera_auth": "Autorisation des médias en cours...<br><br>la première fois cette étape peut prendre jusqu'à 10 secondes",
            "fbackground-after-story-txt": "Couleur de fond",
            "frandom-color-txt": "AUTRE COULEUR",
            "ffollowersBandeau": "Abonné",
            "ffollowingBandeau": "Abonnements",
            "fnameMonCompte": "Chargement",
            "feditProfil": "MODIFIER PROFIL",
            "myactivity": "Mon Activité",
            "mylikes": "J'aime",
            "disconnect_btn": "Se deconnecter",
            "fFollowButtunAccount": "S'ABONNER",
            "activity": "Activité",
            "likes": "Aime",
            "popup_followings_title": "Abonnements",
            "popup_followers_title": "Abonnés",
            "popup_identification_title": "Identifie un ami",
            "label_user_blocked_message": "Cet utilisateur vous a bloqué",
            "label_user_you_blocked_message": "Vous avez bloqué cet utilisateur",
            "create-conversation_title": "Nouvelle conversation",
            "tuto_txt_1": "Bienvenue sur FLOW",
            "tuto_txt_2": "Le premier réseau social basé sur la <span>voix</span>",
            "tuto_txt_3": "Tu fais partie des <span>premiers utilisateurs</span> de l'application",
            "tuto_txt_4": "Nous faisons la chasse aux <span>bugs</span> tous les jours",
            "tuto_txt_5": "Nous <span>mettons à jour</span> l'application très régulièrement",
            "tuto_next_btn": "SUIVANT",
            "tuto_txt_6": "Tu peux <span>écouter</span> et <span>publier</span> des <span>vocaux</span>",
            "tuto_txt_7": "Ces vocaux sont appelés des <span>flows</span>",
            "tuto_txt_8": "Ils durent moins de <span>15 secondes</span>",
            "tuto_txt_9": "Pour <span>enregistrer</span> ton premier flow",
            "tuto_txt_10": "Utilise le <span>bouton d'enregistrement</span>",
            "tuto_txt_11": "Tu peux également ajouter un flow temporaire<br>en faisant une <span>story</span> pour tes <span>abonnés</span>",
            "tuto_txt_12": "<span>Abonne toi</span> aux comptes qui te plaisent pour<br>toujours plus de contenu",
            "tuto_txt_13": "Amuse-toi bien sur <span>FLOW</span>",
            "loading_connect_txt": "Connexion",
            "tl_private_id_indicator_like": "a aimé ceci",
            "tl_private_id_indicator_comment": "a commenté ceci",
            "single_flow_views": "écoute",
            "multi_flow_views": "écoutes",
            "finput_description": "Touche pour ajouter une description",
            "single_comment": "commentaire",
            "multi_comment": "commentaires",
            "single_seconde": "seconde",
            "multi_seconde": "secondes",
            "c_parti": "C'est parti !",
            "fin_de_lapplication": "<div class='parent notloaded'>Tu as fait le tour de l'application !<br>Reviens demain pour plus de contenu</div>",
            "chargement_swiper": "<div class='parent notloaded'>Chargement...</div>",
            "no_results": "Pas de résultat",
            "show_more": "Afficher plus",
            "message_was_deleted": "Ce message a été supprimé",
            "no_message_in_conversation": "Il n'y a aucun message dans cette conversation",
            "empty_content": "Aucun flow publié",
            "empty_liked_content": "Aucun flow aimé",
            "flow_like": "a aimé ton flow",
            "comment_like": "a aimé ton commentaire",
            "response_like": "a aimé ta réponse",
            "notif_commented": "a commenté",
            "notif_responded": "a répondu",
            "notif_tag": "t'a identifié",
            "followed_you": "s'est abonné à toi",
            "reacted_to_your_story": "a réagi à ta story",
            "was_blocked": "a été bloqué",
            "was_unblocked": "a été débloqué",
            "report_flow": "Ce flow a bien été signalé",
            "report_comment": "Ce commentaire a bien été signalé",
            "report_dm": "Ce message a bien été signalé",
            "delete_flow": "Ce flow a bien été supprimé",
            "_delete_comment": "Ce commentaire a bien été supprimé",
            "reply": "Reply",
            "show_responses": "Afficher les réponses",
            "previous_responses": "Réponses précédentes",
            "reduce": "Réduire",
            "empty_comment": "Le commentaire est vide",
            "btn_delete_conversation": "Supprimer la conversation",
            "btn_delete_message": "Supprimer le message",
            "btn_report_message": "Signaler le message",
            "btn_copy_message": "Copier le message",
            "btn_delete_flow": "Supprimer le flow",
            "btn_report_flow": "Signaler le flow",
            "btn_copy_flow_title": "Copier le titre du flow",
            "btn_delete_commentaire": "Supprimer le commentaire",
            "btn_report_commentaire": "Signaler le commentaire",
            "btn_copy_commentaire_title": "Copier le commentaire",
            "flow_report_confirmation": "Veux-tu vraiment signaler cet utilisateur ?",
            "user_report_confirmation": "Veux-tu vraiment signaler ce flow ?",
            "user_block_confirmation": "Veux-tu vraiment bloquer cet utilisateur ?",
            "commentaire_report_confirmation": "Veux-tu vraiment signaler ce commentaire ?",
            "message_report_confirmation": "Veux-tu vraiment signaler ce message ?",
            "flow_delete_confirmation": "Veux-tu vraiment supprimer ce flow ?",
            "commentaire_delete_confirmation": "Veux-tu vraiment supprimer ce commentaire ?",
            "reponse_delete_confirmation": "Veux-tu vraiment supprimer cette réponse ?",
            "message_delete_confirmation": "Veux-tu vraiment supprimer ce message ?",
            "error_while_deleting": "Une erreur est survenue lors de la suppression de cet élément",
            "yes": "Oui",
            "cancel": "Annuler",
            "flow_empty_description": "La description d'un Flow ne peut pas être vide",
            "photo_permission_denied": "Permission photo non acordée",
            "gallery_permission_denied": "Permission galerie photo non accordée",
            "add_story": "Ajouter story",
            "top_users_txt": "Utilisateurs",
            "empty_tl_1": "Pas encore de Flows ici ?",
            "empty_tl_2": "Ton accueil se remplira dès que tu commenceras à suivre des personnes.",
            "empty_tl_3": "Trouver des personnes à suivre",
            "no_conversation_yet": "Tu n'as pas encore de conversation",
            "no_notification": "Aucune notification",
            "placeholder_explore": "Explorer",
            "placeholder_find_conversation": "Chercher une conversation",
            "placeholder_add_comment": "Ajouter un commentaire...",
            "placeholder_add_response": "Ajouter une réponse...",
            "input_send_message": "Taper un message",
            "create-conversation-search-bar": "Chercher un utilisateur",
            "mois": {
                0: "janv",
                1: "févr",
                2: "mars",
                3: "avril",
                4: "mai",
                5: "juin",
                6: "juill",
                7: "août",
                8: "sept",
                9: "oct",
                10: "nov",
                11: "déc"
            },
            "diminutif_jour": "j",
            "diminutif_semaine": "sem",
            "diminutif_mois": "moi",
            "diminutif_anne": "an",
            "update_ap": "Mets l'application à jour pour profiter des toutes dernières fonctionnalités.",
            "new_version_available": "Nouvelle version de l'application disponible !",
            "elu_fdj": "a été élu flow du jour !",
            "fdj_nxt_election": "prochaine élection dans",
            "heure": "heure",
            "minute": "minute",
            "seconde": "seconde",
            "refresh_fdj": "rafraîchis pour découvrir le flow du jour!",
            "title_popup_sms": "Retrouves tes amis déja present sur flow!",
            "erreur_numero": "Numero incorrect",
            "btn_valider_numero": "Valider",
            "ignorer_numero": "Ignorer",
            "title_contact_on_flow": "Amis déja present sur flow",
            "no_friends": "Malheureusement tes amis ne sont pas encore sur Flow, n'hesite pas à les inviter",
            "explore_find_friends": "Retrouver des amis",
            "confirmation_supprimer_compte": "Voulez-vous vraiment supprimer votre compte ?",
            "supression_compte_sept_jours": "Votre compte sera suprimmé sous 7 jours",
            "delete_account_btn": "Supprimer compte",
            "invite_button": "Inviter",
            "join_flow": "Hey rejoins-moi sur FLOW l'application pour se faire entendre http://onelink.to/6b7mth"
        }

    };

    $(".language").each(function (index, element) {
        if ($(this).attr("placeholder")) {
            if ($(this).attr("id") == "finput_comment") {
                $(this).attr("placeholder", language_mapping[device_language]["placeholder_add_comment"]);
            }
            else {
                $(this).attr("placeholder", language_mapping[device_language][$(this).attr("id")]);
            }
        }
        else {
            $(this).html(language_mapping[device_language][$(this).attr("id")]);
        }
    });
}

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}

//#TODO Faire traduction des places holder




