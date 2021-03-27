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
            console.log("fb current_page event success");
        },
        function () {
            console.log("fb current_page error");
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