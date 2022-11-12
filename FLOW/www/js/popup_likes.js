let likes_index = 0;
let CanRefreshLikes = true;

$(".fblock_likes_content").scroll(function () {
    var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
    if (CanRefreshLikes == true) {

        if (Math.round($(this).scrollTop()) >= limit * 0.75 && likes_index > 0) {
            CanRefreshLikes = false;
            console.log("Get Likes");
            console.log("Likes index : " + likes_index);

            let ObjectId = current_flow_block.ObjectId ? current_flow_block.ObjectId : current_flow_block.additionalData.sender_info.IdFlow;
            let data = {
                Index: likes_index,
                ObjectId: ObjectId,
            };
            ServerManager.GetFlowLikes(data);
        }
    }
});
