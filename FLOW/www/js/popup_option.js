var element_to_copy;
function delete_flow_from_bdd(element) {
    element_to_copy = "flow_tittle";
    $("#label_copy_button").text("copier le titre du flow");
    $("#label_delete_button").text("supprimer le flow");
    Popup("popup-option", true, 90);

    if (window.localStorage.getItem("user_private_id") == element.privateID) {
        Popup("popup-option", true, 85);
        $("#delete_button").css("display", "block");
        $("#delete_button").on("click", function () {
            let data_delete_flow =
            {
                //element: element,
                ObjectId: element.ObjectId
            };
            ServerManager.DeleteFlow(data_delete_flow, element);
        });
    }
}

function delete_flow_from_html(element) {
    for (var i = 0; i < all_blocks.length; i++) {
        if (element.ObjectId == all_blocks[i].ObjectId) {
            all_blocks.splice(i, 1);
            element.block_flow.remove();
            Popup("popup-option", false);
        }
    }
}

function delete_comment_from_bdd(element) {
    element_to_copy = "comment";
    $("#label_copy_button").text("copier le commentaire");
    $("#label_delete_button").text("supprimer le commentaire");
    Popup("popup-option", true, 90);

    if (window.localStorage.getItem("user_private_id") == element.private_Id) {
        Popup("popup-option", true, 85);
        $("#delete_button").css("display", "block");
        $("#delete_button").on("click", function () {
            let data_delete_comment =
            {
                //element: element,
                ObjectId: element.Id
            };
            ServerManager.DeleteComment(data_delete_comment, element);
        });
    }
}

function delete_comment_from_html(element) {
    for (var i = 0; i < current_flow_block.all_comment_blocks.length; i++) {
        if (element.Id == current_flow_block.all_comment_blocks[i].Id) {
            current_flow_block.all_comment_blocks.splice(i, 1);
            element.fblock_comment.remove();
            Popup("popup-option", false);
        }
    }
}

$("#copy_button").on("click", function () {
    if (element_to_copy == "flow_tittle") {
        copyToClipboard($(current_flow_block.fpost_description).text());
        Popup("popup-option", false);
    }
    if (element_to_copy == "comment") {
        copyToClipboard(current_comment_block.fcomment_text);
        Popup("popup-option", false);
    }
});


document.getElementById("popup-option").addEventListener("closed", function () {
    $("#delete_button").css("display", "none");

});

