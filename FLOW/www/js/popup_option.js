var element_to_copy;
var element_to_delete = {};

function delete_flow_from_bdd(element) {
    element_to_copy = "flow_tittle";
    $("#label_copy_button").text("copier le titre du flow");
    $("#label_report_button").text("signaler le flow");
    $("#label_delete_button").text("supprimer le flow");
    Popup("popup-option", true, 85);

    if (window.localStorage.getItem("user_private_id") == element.privateID) {
        Popup("popup-option", true, 80);
        element_to_delete.type = "flow";
        element_to_delete.element = element;
        $("#delete_button").css("display", "block");
    }
}

function delete_flow_from_html(element) {
    for (var i = 0; i < all_blocks.length; i++) {
        if (element.ObjectId == all_blocks[i].ObjectId) {
            all_blocks.splice(i, 1);
            element.block_flow.remove();
            Popup("popup-option", false);
            Popup("popup-specifique", false);
        }
    }
}

function delete_comment_from_bdd(element) {
    element_to_copy = "comment";
    $("#label_copy_button").text("copier le commentaire");
    $("#label_report_button").text("signaler le commentaire");
    $("#label_delete_button").text("supprimer le commentaire");
    Popup("popup-option", true, 85);

    if (window.localStorage.getItem("user_private_id") == element.private_Id) {
        Popup("popup-option", true, 80);
        element_to_delete.type = "comment";
        element_to_delete.element = element;
        $("#delete_button").css("display", "block");
    }
}

function delete_comment_from_html(element) {
    let nb_comment_in_current_flow_block = 0;
    let nb_comment;
    let nb_flow_comment;
    for (var i = 0; i < current_flow_block.all_comment_blocks.length; i++) {
        if (current_flow_block.all_comment_blocks[i].private_Id == window.localStorage.getItem("user_private_id")) {
            nb_comment_in_current_flow_block++;
        }
        if (element.Id == current_flow_block.all_comment_blocks[i].Id) {
            current_flow_block.all_comment_blocks.splice(i, 1);
            element.fblock_comment.remove();
            nb_comment = parseInt($(".fcomment_number").text()) - 1;
            nb_flow_comment = parseInt($(current_flow_block.ftxt_impression_comment).text() - 1);
            nb_comment == 0 ? $(".fcomment_number").text(nb_comment + " commentaire") : $(".fcomment_number").text(nb_comment + " commentaires");
            $(current_flow_block.ftxt_impression_comment).text(nb_flow_comment);
            if (nb_comment_in_current_flow_block == 1) {
                $(current_flow_block.fimg_impression_comment).attr('src', 'src/icons/Comment.png');
            }
            Popup("popup-option", false);
        }

    }
}

$("#report_button").on("touchend", function () {
    if (element_to_copy == "flow_tittle") { // element_to_copy c'est juste l'elem selectionné
        if (confirm("voulez-vous vraiment signaler ce flow ?")) {
            Popup("popup-option", false);
            let data = {
                additionalData:
                {
                    type: "report_flow",
                    ObjectId: current_flow_block.ObjectId
                }
            };
            ServerManager.AddReportFlow(data);
        }
    }
    if (element_to_copy == "comment") { // element_to_copy c'est juste l'elem selectionné
        if (confirm("voulez-vous vraiment signaler ce commentaire ?")) {
            Popup("popup-option", false);
            let data = {
                additionalData:
                {
                    type: "report_comment"
                }
            };
            in_app_notif(data);
        }
    }
});

$("#copy_button").on("touchend", function () {
    if (element_to_copy == "flow_tittle") {
        copyToClipboard($(current_flow_block.fpost_description).text());
        Popup("popup-option", false);
    }
    if (element_to_copy == "comment") {
        copyToClipboard(current_comment_block.fcomment_text);
        Popup("popup-option", false);
    }
});

$("#delete_button").on("touchend", function () {
    if (element_to_delete) {
        if (element_to_delete.type == "flow") {
            if (confirm("voullez-vous vraiment supprimer ce flow ?")) {
                Popup("popup-option", false);
                let data = {
                    additionalData:
                    {
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
        } else {
            if (confirm("voullez-vous vraiment supprimer ce commentaire ?")) {
                Popup("popup-option", false);
                let data = {
                    additionalData:
                    {
                        type: "delete_comment"
                    }
                };
                let data_delete_comment = {
                    //element: element,
                    ObjectId: element_to_delete.element.Id
                };
                ServerManager.DeleteComment(data_delete_comment, element_to_delete.element);
                in_app_notif(data);
            }
        }
    } else {
        alert("Une erreur est survenue lors de la suppression de cet élément");
    }
});



document.getElementById("popup-option").addEventListener("opened", function () {
    in_options = true;
});
document.getElementById("popup-option").addEventListener("closed", function () {
    in_options = false;
    $("#delete_button").css("display", "none");
});