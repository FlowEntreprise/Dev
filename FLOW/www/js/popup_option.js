var element_to_copy;
var element_to_delete = {};


function delete_block_conversation(data) // affiche la popup option pour supprime une conversation
{
    element_to_copy = "block_conversation";
    $("#label_delete_button").text(`${language_mapping[device_language][delete_conversation]}`);
    $("#report_button").css("display", "none");
    $("#delete_button").css("display", "table");
    Popup("popup-option", true, 85.5);
}

function display_option_for_message(data) { // affiche la popup option pour supprime un message
    element_to_copy = "dm";
    $("#label_copy_button").text(`${language_mapping[device_language][copy_message]}`);
    $("#label_report_button").text(`${language_mapping[device_language][report_message]}`);
    $("#label_delete_button").text(`${language_mapping[device_language][delete_message]}`);
    $("#delete_button").css("display", "none");
    $("#report_button").css("display", "table");
    Popup("popup-option", true, 85.5);

    if (data.block_message.className.includes("my_block_message")) {
        element_to_delete.type = "dm";
        element_to_delete.element = data;
        $("#delete_button").css("display", "table");
        $("#report_button").css("display", "none");
    }

}

function delete_flow_from_bdd(element) { // affiche la popup option
    element_to_copy = "flow_tittle";
    $("#label_copy_button").text(`${language_mapping[device_language]['btn_copy_flow_title']}`);
    $("#label_report_button").text(`${language_mapping[device_language]['btn_report_flow']}`);
    $("#label_delete_button").text(`${language_mapping[device_language]['btn_delete_flow']}`);
    $("#delete_button").css("display", "none");
    $("#report_button").css("display", "table");
    Popup("popup-option", true, 85.5);

    if (window.localStorage.getItem("user_private_id") == element.privateID) {
        element_to_delete.type = "flow";
        element_to_delete.element = element;
        $("#delete_button").css("display", "table");
        $("#report_button").css("display", "none");
    }
}

function delete_flow_from_html(element) {
    for (var i = 0; i < all_blocks.length; i++) {
        if (element.ObjectId == all_blocks[i].ObjectId) {
            all_blocks.splice(i, 1);
            element.block_flow.remove();
            Popup("popup-option", false);
            Popup("popup-specifique", false);
            if (!showingFDJ && in_flowoftheday) {
                GetRandomFlow();
            }
        }
    }
}

function delete_comment_from_bdd(element, is_a_response) { //affiche la popup option delete les comments et les response
    element_to_copy = "comment";
    $("#label_copy_button").text(`${language_mapping[device_language]['btn_copy_commentaire_title']}`);
    $("#label_report_button").text(`${language_mapping[device_language]['btn_report_commentaire']}`);
    $("#label_delete_button").text(`${language_mapping[device_language]['btn_delete_commentaire']}`);
    $("#delete_button").css("display", "none");
    $("#report_button").css("display", "table");
    Popup("popup-option", true, 85.5);

    if (window.localStorage.getItem("user_private_id") == element.private_Id) {
        if (is_a_response == true) {
            element_to_delete.type = "response";
            element_to_delete.element = element;
        } else {
            element_to_delete.type = "comment";
            element_to_delete.element = element;
        }
        $("#delete_button").css("display", "table");
        $("#report_button").css("display", "none");
    }
}


function delete_comment_from_html(element) {
    let nb_comment_in_current_flow_block = 0;
    let nb_comment = parseInt($(".fcomment_number").text());

    for (var i = 0; i < current_flow_block.all_comment_blocks.length; i++) {
        if (current_flow_block.all_comment_blocks[i].private_Id == window.localStorage.getItem("user_private_id")) {
            nb_comment_in_current_flow_block++;
        }
        if (element.ObjectId == current_flow_block.all_comment_blocks[i].ObjectId) {
            current_flow_block.all_comment_blocks.splice(i, 1);
            element.fblock_comment.remove();
            nb_comment = nb_comment - 1;
            nb_comment <= 1 ? $(".fcomment_number").text(nb_comment + ` ${language_mapping[device_language]['single_comment']}`) : $(".fcomment_number").text(nb_comment + ` ${language_mapping[device_language]['multi_comment']}`);
            $(current_flow_block.ftxt_impression_comment).text(nb_comment);
            if (nb_comment == 0) {
                $(current_flow_block.fimg_impression_comment).attr('src', 'src/icons/Comment.png');
            }
            Popup("popup-option", false);
        }

    }
}


function delete_response_from_html(element) {
    let nb_response = current_comment_block.nombre_de_reponses;

    for (var i = 0; i < current_comment_block.all_response_blocks.length; i++) {
        if (element.ObjectId == current_comment_block.all_response_blocks[i].ObjectId) {
            current_comment_block.all_response_blocks.splice(i, 1);
            element.fblock_response.remove();
            nb_response = nb_response - 1;
            let initial_response_number = current_comment_block.nombre_de_reponses;
            current_comment_block.nombre_de_reponses =
                current_comment_block.nombre_de_reponses + 1;
            let nombre_de_reponses_apres_ajout = initial_response_number - (current_comment_block.response_current_index * 10) + 1
            if (current_comment_block.response_current_index == 0) {
                nombre_de_reponses_apres_ajout = current_comment_block.nombre_de_reponses;
            }
            if (nb_response == 0) {
                $(current_comment_block.fblock_comment_label_afficher_les_reponses).css({
                    "opacity": "0",
                    "pointer-events": "none"
                });
            } else {
                $(current_comment_block.fblock_comment_label_afficher_les_reponses).text(`${language_mapping[device_language]['show_responses']} (${nb_response})`);
                $(current_comment_block.label_afficher_plus_de_reponses).text(`${language_mapping[device_language]['show_more']} (${nombre_de_reponses_apres_ajout})`);
            }
            Popup("popup-option", false);
        }

    }
}


$("#report_button").on("touchend", function () {
    if (element_to_copy == "flow_tittle") { // element_to_copy c'est juste l'elem selectionné
        navigator.notification.confirm(`${language_mapping[device_language]['flow_report_confirmation']}`, function (id) {
            if (id == 1) {
                Popup("popup-option", false);
                let data = {
                    additionalData: {
                        type: "report_flow",
                        ObjectId: current_flow_block.ObjectId
                    }
                };
                ServerManager.AddReportFlow(data);
            }
        }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`])

    }
    if (element_to_copy == "comment") { // element_to_copy c'est juste l'elem selectionné
        navigator.notification.confirm(`${language_mapping[device_language]['commentaire_report_confirmation']}`, function (id) {
            console.log(id);
            if (id == 1) {
                Popup("popup-option", false);
                let data = {
                    additionalData: {
                        type: "report_comment"
                    }
                };
                in_app_notif(data);
            }
        }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]);
    }

    if (element_to_copy == "dm") { // element_to_copy c'est juste l'elem selectionné
        navigator.notification.confirm(`${language_mapping[device_language]['message_report_confirmation']}`, function (id) {
            console.log(id);
            if (id == 1) {
                Popup("popup-option", false);
                let data = {
                    additionalData: {
                        type: "report_dm"
                    }
                };
                in_app_notif(data);
            }
        }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]);
    }

});

$("#copy_button").on("touchend", function () {
    if (element_to_copy == "flow_tittle") {
        cordova.plugins.clipboard.copy($(current_flow_block.fpost_description).$(current_block_playing.fpost_description).prop('title'));
        Popup("popup-option", false);
    }
    if (element_to_copy == "comment") {
        cordova.plugins.clipboard.copy(current_comment_block.Comment_text);
        Popup("popup-option", false);
    }
    if (element_to_copy == "response") {
        cordova.plugins.clipboard.copy(current_response_block.response_text);
        Popup("popup-option", false);
    }
    if (element_to_copy == "dm")
        cordova.plugins.clipboard.copy(current_block_message.block_message_text);
    Popup("popup-option", false);
});

$("#delete_button").on("touchend", function () {
    if (element_to_delete) {
        if (element_to_delete.type == "flow") {
            navigator.notification.confirm(`${language_mapping[device_language]['flow_delete_confirmation']}`, function (id) {
                if (id == 1) {
                    Popup("popup-option", false);
                    let data = {
                        additionalData: {
                            type: "delete_flow"
                        }
                    };
                    let data_delete_flow = {
                        //element: element,
                        ObjectId: element_to_delete.element.ObjectId
                    };
                    ServerManager.DeleteFlow(data_delete_flow, element_to_delete.element);
                    in_app_notif(data);
                }
            }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]);
        }
        if (element_to_delete.type == "comment") {
            navigator.notification.confirm(`${language_mapping[device_language]['commentaire_delete_confirmation']}`, function (id) {
                if (id == 1) {
                    Popup("popup-option", false);
                    let data = {
                        additionalData: {
                            type: "delete_comment"
                        }
                    };
                    let data_delete_comment = {
                        //element: element,
                        ObjectId: element_to_delete.element.ObjectId
                    };
                    ServerManager.DeleteComment(data_delete_comment, element_to_delete.element);
                    in_app_notif(data);
                }
            }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]);
        }

        if (element_to_delete.type == "response") {
            navigator.notification.confirm(`${language_mapping[device_language]['reponse_delete_confirmation']}`, function (id) {
                if (id == 1) {
                    Popup("popup-option", false);
                    let data = {
                        additionalData: {
                            type: "delete_comment"
                        }
                    };
                    let data_delete_comment = {
                        //element: element,
                        ObjectId: element_to_delete.element.ObjectId,
                        CommentObjectId: current_comment_block.ObjectId
                    };
                    ServerManager.DeleteResponse(data_delete_comment, element_to_delete.element);
                    in_app_notif(data);
                }
            }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]);
        }

        if (element_to_delete.type == "dm") {
            navigator.notification.confirm(`${language_mapping[device_language]['message_delete_confirmation']}`, function (id) {
                if (id == 1) {
                    Popup("popup-option", false);
                    current_block_message.chat_id = current_block_chat.chat_id;
                    if (current_block_message.audio_url.length || current_block_message.image_url) {
                        getPathStorageFromUrl(current_block_message);
                    } else {
                        ServerManager.Delete_text_message(current_block_message);
                    }
                }
            }, "Confirmation", [`${language_mapping[device_language]['yes']}`, `${language_mapping[device_language]['cancel']}`]);
        }

    } else {
        //alert("Une erreur est survenue lors de la suppression de cet élément");
        navigator.notification.alert(`${language_mapping[device_language]['error_while_deleting']}`, alertDismissed, "Information");

    }
});



document.getElementById("popup-option").addEventListener("opened", function () {
    in_options = true;
});
document.getElementById("popup-option").addEventListener("closed", function () {
    in_options = false;
    $("#delete_button").css("display", "none");
});