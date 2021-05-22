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
        let mois = ["janv", "févr", "mars", "avril", "mai", "juin", "juill", "août", "sept", "oct", "nov", "déc"];
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
            date = new Date(timestamp).getDate() + " " + mois[new Date(timestamp).getMonth()];
            return date;
        }
        if (message_hour_past >= 24 && message_hour_past < 8760 && return_hours == "label_block_message_date") {
            date = new Date(timestamp).getDate() + " " + mois[new Date(timestamp).getMonth()] + " " + new Date(timestamp).getHours() + ":" + minutes;
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
        day_past > 1 ? (time_str = day_past + " j") : (time_str = day_past + " j");
        return time_str;
    }

    if (week_past >= 1 && week_past <= 5) {
        week_past == 1 ?
            (time_str = week_past + " sem") :
            (time_str = week_past + " sem");
        return time_str;
    }

    if (month_past > 0 && month_past <= 12) {
        month_past < 2 ?
            (time_str = month_past + " mois") :
            (time_str = month_past + " mois");
        return time_str;
    }

    if (year_past > 0) {
        year_past < 2 ?
            (time_str = year_past + " an") :
            (time_str = year_past + " ans");
        return time_str;
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
        } else {
            Popup("popup-comment", false);
            Popup("popup-followers", false);
            Popup("popup-followings", false);
            Popup("popup-identification", false);
            Popup("popup-message", false);
            Popup("popup-create-conversation", false);
            Popup("popup-specifique", false);
            Popup("popup-myaccount", false);
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

var language_mapping = {
    //English
    "en": {
        //STATIC
        "fpopup-connect-msg-inscription": "An account is required to perform this action",
        "privacy_policy": ["By continuing you agree to the ",
            "<a class=\"funderline\" onclick=\"window.open('http:\/\/www.flowappweb.com/terms_and_conditions.html', '_self', 'location=no')\">Terms of Use</a> ",
            "and affirm that you have read and understand FLOW's ",
            "<a class=\"funderline\" onclick=\"window.open('http:\/\/www.flowappweb.com/privacy_policy.html', '_self', 'location=no')\">privacy policy</a>"
        ],
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
        "popup_identification_title": "Tag a friend",
        "label_user_blocked_message": "This user has blocked you",
        "label_user_you_blocked_message": "You have blocked this user",
        "create-conversation_title": "New conversation",
        "tuto_txt_1": "Welcome to FLOW",
        "tuto_txt_2": "The first <span>voice-based</span> social network",
        "tuto_txt_3": "You are one of the <span>first users</span> of the application",
        "tuto_txt_4": "We chase <span>bugs</span> every day",
        "tuto_txt_5": "We <span>update</span> the application very regularly",
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
        "finput_description": "Touch to add a description"

    },
    //French
    "fr": {
        //STATIC
        "fpopup-connect-msg-inscription": "Un compte est nécessaire pour réaliser cette action",
        "privacy_policy": ["En continuant vous acceptez les ",
            "<a class=\"funderline\" onclick=\"window.open('http:\/\/www.flowappweb.com/terms_and_conditions.html', '_self', 'location=no')\">conditions d'utilisations</a> ",
            "et affirmez avoir lu et compris la ",
            "<a class=\"funderline\" onclick=\"window.open('http:\/\/www.flowappweb.com/privacy_policy.html', '_self', 'location=no')\">politique de confidentialité de FLOW</a>"
        ],
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
        "empty_comment": "Le commentaire est vide"
    }

};

//#TODO Faire traduction des places holder

