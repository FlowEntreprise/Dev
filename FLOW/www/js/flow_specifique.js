function flow_specifique(data, show_comment, type, data_specifique, all_data) { //show comment permet de savoir si les commentaires doivent etre affichées
    //type : un commentaire ou une reponse
    //data_specifique : les datas pour afficher un commentaire specifique ou une reponse specifique
    Popup("popup-specifique", true);
    $(".flow_specifique_container")[0].innerHTML = "";
    let block_params = {
        parent_element: $(".flow_specifique_container"),
        afterblock: false,
        audioURL: data.Audio,
        duration: data.Duration,
        imageURL: data.Background,
        title: data.Title,
        description: data.Description,
        pseudo: data.PrivateId,
        account_imageURL: data.ProfilePicture,
        ObjectId: data.ObjectId,
        PrivateId: data.PrivateId,
        Times: data.Time,
        IsLike: data.IsLike,
        IsComment: data.IsComment,
        Likes: data.Likes,
        Comments: data.Comments,
        RegisterId: data.RegisterId,
    };
    //block_params.description = block_params.description.replace(/@[^ ]+/gi, '<span class="flow_tagged_users">$&</span>');
    var new_block = new block(block_params);
    all_blocks.push(new_block);
    if (show_comment == true) $(new_block.fimg_impression_comment).click();
    if (type == "comment") {
        comment_specifique(data_specifique.Data, type, all_data);
    }

    if (type == "response") {
        comment_specifique(all_data.Data.comment, type, all_data);
    }
    console.log("Pop Flow");
    console.log(new_block);

}


function flow_for_comment_specifique(type, response) {
    if (type == "comment") {
        let data_flow = {
            IdFlow: response.Data.IdFlow
        };
        ServerManager.GetSingle(data_flow, true, type, response);
    }
    else {

        flow_specifique(response.Data.flow, true, type, response.Data.response, response);
    }

}

function comment_specifique(response, type, all_data) {

    let comment_data = {
        PrivateId: response.PrivateId,
        ProfilePicture: response.ProfilePicture,
        Comment: response.Comment,
        Comment_text: response.Comment,
        Like_number: response.Likes,
        Time: response.Time,
        IsLike: response.IsLike,
        IdComment: response.IdComment,
        RegisterId: response.RegisterId,
        LastOs: response.LastOs,
        Flow_block_id: response.IdFlow,
        Responses: response.Responses //nombre de reponses
    };

    comment_data.Comment = comment_data.Comment.replace(/@[^ ]+/gi, '<span class="tagged_users">$&</span>');
    for (let i = 0; i < current_flow_block.all_comment_blocks.length; i++) {
        if (current_flow_block.all_comment_blocks[i].ObjectId == comment_data.IdComment) {
            console.log("l'objectId est le meme");
            $(current_flow_block.all_comment_blocks[i].fblock_comment).remove();
        }
    }
    commentaire_unique = new block_comment(comment_data, true);
    current_flow_block.all_comment_blocks.push(commentaire_unique);
    if (type == "comment") {
        $(commentaire_unique.fblock_comment).css("background-color", "#1A84EF26");
    }
    if (type == "response") {
        if (Number.isInteger(all_data.Data.rank.rank / 10) && all_data.Data.rank.rank != 0) {
            response_current_index = (all_data.Data.rank.rank / 10) - 1;
        }
        else {
            response_current_index = Math.trunc(all_data.Data.rank.rank / 10);
        }
        response_current_index > 0 ? response_current_desc_index = response_current_index - 1 : response_current_desc_index = 0;
        id_response_specifique = all_data.Data.response.IdResponse;
        nombre_de_reponses_precedent = response_current_index * 10;
        $(commentaire_unique.fblock_comment_label_afficher_les_reponses).click();
        if (response_current_index > 0) {
            $(commentaire_unique.fblock_comment_label_reponses_precedentes).css("display", "block");
        }
    }

}

function flow_and_comment_for_response_specifique(response) {
    flow_for_comment_specifique("response", response);
}


document.getElementById("popup-specifique").addEventListener("opened", function () {
    $(loading_before_popup_specifique).remove();
    in_specifique = true;
    response_current_index = 0;
    id_response_specifique = undefined;
});
document.getElementById("popup-specifique").addEventListener("closed", function () {
    commentaire_unique = null;
    in_specifique = false;
    response_current_index = 0;
    id_response_specifique = undefined;
    you_have_to_prepend_response_specifique = false;
    if (current_flow_block) {

        current_flow_block.all_comment_blocks.length = 0
    }
    if (current_comment_block) {

        current_comment_block.all_response_blocks.length = 0
    }
    stopAllBlocksAudio();
});


