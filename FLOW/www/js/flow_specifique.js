function flow_specifique(data, LinkBuilder, show_comment, type, data_specifique, data_position) { //show comment permet de savoir si les commentaires doivent etre affichées
    //type : un commentaire ou une reponse
    //data_specifique : les datas pour afficher un commentaire specifique ou une reponse specifique
    Popup("popup-specifique", true);
    $(".flow_specifique_container")[0].innerHTML = "";
    var image_link = undefined;
    var pattern_key = undefined;
    if (data.Background.PatternKey == undefined) {
        const src_img = 'https://' + LinkBuilder.Hostname + ':' + LinkBuilder.Port + '/images/' + data.Background.name + '?';
        const param_img = `${LinkBuilder.Params.hash}=${data.Background.hash}&${LinkBuilder.Params.time}=${data.Background.timestamp}`;
        image_link = src_img + param_img;
    } else {
        pattern_key = data.Background.PatternKey;
    }

    const src_flow = 'https://' + LinkBuilder.Hostname + ':' + LinkBuilder.Port + '/flows/' + data.Audio.name + '?';
    const param_flow = `${LinkBuilder.Params.hash}=${data.Audio.hash}&${LinkBuilder.Params.time}=${data.Audio.timestamp}`;
    const flow_link = src_flow + param_flow;

    const src_profile_img = 'https://' + LinkBuilder.Hostname + ':' + LinkBuilder.Port + '/images/' + data.ProfilPicture.name + '?';
    const param_profile_img = `${LinkBuilder.Params.hash}=${data.ProfilPicture.hash}&${LinkBuilder.Params.time}=${data.ProfilPicture.timestamp}`;
    var profilePicLink = src_profile_img + param_profile_img;

    let block_params = {
        parent_element: $(".flow_specifique_container"),
        afterblock: false,
        audioURL: flow_link,
        duration: data.Duration,
        patternKey: pattern_key,
        imageURL: image_link,
        title: data.Title,
        description: data.Description,
        pseudo: data.PrivateId,
        account_imageURL: profilePicLink,
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
        comment_specifique(data_specifique, type, data_specifique);
    }

    if (type == "response") {
        let data_single_comment =
        {
            ObjectId: data_specifique.Data.IdComment
        };
        ServerManager.GetSingleComment(data_single_comment, "response", data_specifique, data_position);

    }
    console.log("Pop Flow");
    console.log(new_block);
    set_all_notifs_to_seen();

}


function flow_for_comment_specifique(type, response, data_position) {

    let data_flow = {
        IdFlow: response.Data.IdFlow
    };
    ServerManager.GetSingle(data_flow, true, type, response, data_position);

}

function comment_specifique(response, type, data_response, data_position) {

    const src_profile_img = 'https://' + response.LinkBuilder.Hostname + ':' + response.LinkBuilder.Port + '/images/' + response.Data.ProfilePicture.name + '?';
    const param_profile_img = `${response.LinkBuilder.Params.hash}=${response.Data.ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data.ProfilePicture.timestamp}`;
    let profilePicLink = src_profile_img + param_profile_img;

    let comment_data = {
        PrivateId: response.Data.PrivateId,
        ProfilePicture: profilePicLink,
        Comment: response.Data.Comment,
        Comment_text: response.Data.Comment,
        Like_number: response.Data.Likes,
        Time: response.Data.Time,
        IsLike: response.Data.IsLike,
        IdComment: response.Data.IdComment,
        RegisterId: response.Data.RegisterId,
        LastOs: response.Data.LastOs,
        Flow_block_id: response.Data.IdFlow,
        Responses: response.Data.Responses //nombre de reponses
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
        response_current_index = Math.trunc(data_position.rank / 10);
        response_current_index > 0 ? response_current_desc_index = response_current_index - 1 : response_current_desc_index = 0;
        id_response_specifique = data_response.Data.IdResponse;
        nombre_de_reponses_precedent = response_current_index * 10;
        $(commentaire_unique.fblock_comment_label_afficher_les_reponses).click();
        if (response_current_index > 0) {
            $(commentaire_unique.fblock_comment_label_reponses_precedentes).css("display", "block");
        }
        /* let data = {
             ObjectId: current_comment_block.ObjectId,
             Index: response_current_index
         };
         ServerManager.GetCommentResponse(data, data_response);*/
    }

}

function flow_and_comment_for_response_specifique(response, data_position) {
    flow_for_comment_specifique("response", response, data_position);
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