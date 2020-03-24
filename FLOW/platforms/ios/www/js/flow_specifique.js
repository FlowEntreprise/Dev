
function flow_specifique(data, LinkBuilder) {

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

    var new_block = new block(block_params);
    all_blocks.push(new_block);

    console.log("Pop Flow");
    console.log(new_block);


}

   

