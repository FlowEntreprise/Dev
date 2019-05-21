var nameMonCompte;
var bioMonCompte;
var mainView = app.addView('.view-main');
var FlowBandeau = 12;
var Follower = 305;
var Following = 250;
var privateID;

app.onPageInit('login-screen', function (page) {
    $(".ftabsMonCompte")[0].setAttribute("style", "height:68% !important");
    var getFlow = {
        Index : 0,
        PrivateId : window.localStorage.getItem("user_private_id")
    };
    ServerManager.GetMyFlow(getFlow);
    // for (var i = 0; i < 10; i++) {
    //     let block_params = {
    //         parent_element: $("#MyActivity"),
    //         afterblock: false,
    //         audioURL: null,
    //         duration: 89,
    //     };
    //     var new_block = new block(block_params);
    //     //var new_block = new block($("#MyActivity"), false, null, 89);
    //     all_blocks.push(new_block);
    // }

    // for (var y = 0; y < 10; y++) {
    //     let block_params = {
    //         parent_element: $("#MyLikes"),
    //         afterblock: false,
    //         audioURL: null,
    //         duration: 89,
    //     };
    //     var new_block = new block(block_params);
    //     all_blocks.push(new_block);
    //     console.log(new_block);
    // }

    console.log("init");
    nameMonCompte = window.localStorage.getItem("user_name");
    privateID = window.localStorage.getItem("user_private_id");
    bioMonCompte = window.localStorage.getItem("user_bio") || "";
    $(".fflow-btn").css("display", "none");
    $(".flow-btn-shadow").css("display", "none");
    $("#fprofilPicture").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    $("#fnameMonCompte").html(nameMonCompte);
    $("#privateID").html(privateID);
    $("#ffLowBandeauChiffre").append(FlowBandeau);
    $("#ffollowersBandeauChiffre").append(Follower);
    $("#ffollowingBandeauChiffre").append(Following);
    $("#fbioMonCompte").append(bioMonCompte);

    $("#fgobackmonCompte").click(function () {
        mainView.back();
        $(".fflow-btn").css("display", "block");
    });

    // var position = $(".scrollMyAccunt").scrollTop();

    // $$('#tabMonCompte2').on('tab:show', function () 
    // {
    //     position = $(".scrollMyAccunt").scrollTop();
    //     scroll = $(".scrollMyAccunt").scrollTop();
    // });
    var scroll_element = $("#tabMonCompte1");
    checkScroll();
    $$('#tabMonCompte1').on('tab:show', function () {
        // position = $(".scrollMyAccunt").scrollTop();
        scroll_element = $("#tabMonCompte1");
        checkScroll();
    });

    $$('#tabMonCompte2').on('tab:show', function () {
        // position = $(".scrollMyAccunt").scrollTop();
        scroll_element = $("#tabMonCompte2");
        checkScroll();
    });

    $$('#tabMonCompte3').on('tab:show', function () {
        // position = $(".scrollMyAccunt").scrollTop();
        scroll_element = $("#tabMonCompte3");
        checkScroll();
    });

    var boolScrollTop = true;

    $(".scrollMyAccunt").scroll(function () {
        checkScroll();
    });

    function checkScroll() {
        var scroll = scroll_element.scrollTop();
        //console.log(scroll);
        console.log($(".ftabsMonCompte")[0].style.height);
        if (scroll >= 143 && $(".ftabsMonCompte")[0].style.height == "68%") {
            console.log("94vh");
            // if (event.cancelable) {
            //     event.preventDefault();
            // } else {
            event.preventDefault();
            event.stopPropagation();
            $("scrollEvent").remove(".swiper-wrapper");
            $("#accountBannerScroll").css("transform", "translate3d(0vw, -30vh, 0vh)");
            if (boolScrollTop) {
                $(".ftabsMonCompte")[0].setAttribute("style", "height:94vh !important");

                
                $(".fnavMonCompte").removeClass("fnavMonCompteTransitionDown");
                $(".fnavMonCompte").addClass("fnavMonCompteTransitionTop");
                $(".ftabsMonCompte").css("transition-duration", "0.4s");
                $(".fnavMonCompte").css("transform", "translate3d(0vw, -20vh, 0vh)");
                $(".ftabsMonCompte").css("transform", "translate3d(0vw, -23vh, 0vh)");
                boolScrollTop = false;
            }
            // $(".ftabsMonCompte").css("top", "8vh");
            $("#MyActivity").removeClass("fblockMonComptePadding");
            $("scrollEvent").addClass(".swiper-wrapper");
            // $("#AccountTabSize.style").attr("top", "5vh");
            // }
        } else {
            // if (event.cancelable) {
            //     event.preventDefault();
            //     // swiping = true;
            // } else {
                console.log($(".ftabsMonCompte")[0].style.height);
            if (scroll < 100 && $(".ftabsMonCompte")[0].style.height == "94vh") {
                console.log("68%");
                event.preventDefault();
                event.stopPropagation();
                // $(".fnavMonCompte").css("top", "-6vh");
                if (boolScrollTop == false) {
                    $(".ftabsMonCompte")[0].setAttribute("style", "height:68% !important");
                    $("scrollEvent").remove(".swiper-wrapper");
                    $("#accountBannerScroll").css("transition-duration", "0.2s");
                    $("#accountBannerScroll").css("transform", "translate3d(0vw, 0vh, 0vh)");
                    $(".fnavMonCompte").removeClass("fnavMonCompteTransitionTop");
                    $(".fnavMonCompte").addClass("fnavMonCompteTransitionDown");
                    $(".ftabsMonCompte").css("transition-duration", "0.2s");
                    //$(".scrollMyAccunt").scrollTop("10");
                    var scrollTest = $(".scrollMyAccunt").scrollTop();
                    //console.log(scrollTest);
                    $(".fnavMonCompte").css("transform", "translate3d(0vw, 7vh, 0vh)");
                    $(".ftabsMonCompte").css("transform", "translate3d(0vw, 2vh, 0vh)");
                    boolScrollTop = true;
                    $("#MyActivity").addClass("fblockMonComptePadding");
                    // $("scrollEvent").addClass("swiper-wrapper");
                }
                // $(".ftabsMonCompte").css("top", "8vh");

                // $("#AccountTabSize.style").attr("top", "5vh");
            }

            // }
        }
        position = scroll;
    }

    $('#fprofilPicture').click(function () {
        $("#fbigProfilPictureContainer").css("transform", "scale(1)");
    });

    $("#fbigProfilPicture").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    var profilePicture = document.createElement('img');
    // var profilePicture = window.localStorage.getItem("user_profile_pic");
    profilePicture.setAttribute('src', window.localStorage.getItem("user_profile_pic"));

    profilePicture.addEventListener('load', function () {
        var vibrant = new Vibrant(profilePicture);
        var swatches = vibrant.swatches();
        console.log(swatches);
        $("#fbigProfilPictureContainer").css("background-color", swatches.Muted.getHex());
    });

    $("#returnProfilPicture").click(function () {
        $("#fbigProfilPictureContainer").css("transform", "scale(0)");
        console.log("ok");
    });

    $("#feditProfil").click(function () {
        //$("#editProfilePopup").css("transform", "scale(1)");
        $("#feditProfilePopupContainer").css("opacity", "1");
        $("#editProfilePopup").css("transform", "scale(1)");
        $("#feditProfilePopupContainer").css("pointer-events", "auto");
        $("#fprofilPicturePopup").css({
            "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
        });
        $("#editProfileName").val(nameMonCompte);
        $("#feditBio").val(bioMonCompte);
    });

    $("#fcloseProfilPopup").click(function () {
        if($.trim($("#editProfileName").val()) != "") 
        {
            if($("#editProfileName").val() != nameMonCompte || $("#feditBio").val() != bioMonCompte)
            {
                var updateEditProfile =  {
                    FullName : $("#editProfileName").val(),
                    Biography: $("#feditBio").val()
                };
                console.log("Profile name:" +updateEditProfile.FullName);
                console.log("Profile bio:" +updateEditProfile.Biography);
                ServerManager.UpdateProfile(updateEditProfile);
            }
            $("#feditProfilePopupContainer").css("opacity", "0");
            $("#editProfilePopup").css("transform", "scale(0)");
            $("#feditProfilePopupContainer").css("pointer-events", "none");
        }
    });

    $("#feditProfilePopupContainer").click(function() {
        if($.trim($("#editProfileName").val()) != "") 
        {
            if($("#editProfileName").val() != nameMonCompte || $("#feditBio").val() != bioMonCompte)
            {
                var updateEditProfile =  {
                    FullName : $("#editProfileName").val(),
                    Biography: $("#feditBio").val()
                };
                console.log("Profile name:" +updateEditProfile.FullName);
                console.log("Profile bio:" +updateEditProfile.Biography);
                ServerManager.UpdateProfile(updateEditProfile);
            }
            $("#feditProfilePopupContainer").css("opacity", "0");
            $("#editProfilePopup").css("transform", "scale(0)");
            $("#feditProfilePopupContainer").css("pointer-events", "none");
        }
    });
});

function UpdateProfile (profileName, profileBio) {
    $("#fnameMonCompte").html(profileName);
    window.localStorage.setItem("user_name", profileName);
    $("#fbioMonCompte").html(profileBio);
    window.localStorage.setItem("user_bio", profileBio);
    nameMonCompte = profileName;
    bioMonCompte = profileBio;
}

function ShowMyFlow(flow) {
    console.log(flow);
    for (let i = 0; i < flow.Data.length; i++) {
        let data = flow.Data[i];
        var image_link = undefined;
        var pattern_key = undefined;
        if (data.Background.PatternKey == undefined) {
            const src_img = 'http://' + flow.LinkBuilder.Hostname + ':' + flow.LinkBuilder.Port + '/images/' + data.Background.name + '?';
            const param_img = `${flow.LinkBuilder.Params.hash}=${data.Background.hash}&${flow.LinkBuilder.Params.time}=${data.Background.timestamp}`;
            image_link = src_img + param_img;
        } else {
            pattern_key = data.Background.PatternKey;
        }
        
        const src_flow = 'http://' + flow.LinkBuilder.Hostname + ':' + flow.LinkBuilder.Port + '/flows/' + data.Audio.name + '?';
        const param_flow = `${flow.LinkBuilder.Params.hash}=${data.Audio.hash}&${flow.LinkBuilder.Params.time}=${data.Audio.timestamp}`;
        const flow_link = src_flow + param_flow;
        
        const src_profile_img = 'http://' + flow.LinkBuilder.Hostname + ':' + flow.LinkBuilder.Port + '/images/' + data.ProfilPicture.name + '?';
        const param_profile_img = `${flow.LinkBuilder.Params.hash}=${data.ProfilPicture.hash}&${flow.LinkBuilder.Params.time}=${data.ProfilPicture.timestamp}`;
        var profilePicLink = src_profile_img + param_profile_img;
        console.log(profilePicLink);
        console.log(image_link);
        let block_params = {
            parent_element: $("#MyActivity"),
            afterblock: false,
            audioURL: flow_link,
            duration: data.Duration,
            patternKey: pattern_key,
            imageURL: image_link,
            title: data.Title,
            description: data.Description,
            pseudo: data.PrivateId,
            account_imageURL: profilePicLink
        };
        var new_block = new block(block_params);
        all_blocks.push(new_block);
        
        console.log("Pop Flow");
        console.log(new_block);
    }
}
// var image_link = undefined;
//     var pattern_key = undefined;
//     if (data.Background.PatternKey == undefined) {
//         const src_img = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.Background.name + '?';
//         const param_img = `${data.LinkBuilder.Params.hash}=${data.Background.hash}&${data.LinkBuilder.Params.time}=${data.Background.timestamp}`;
//         image_link = src_img + param_img;
//     } else {
//         pattern_key = data.Background.PatternKey;
//     }
    
//     const src_flow = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/flows/' + data.Audio.name + '?';
//     const param_flow = `${data.LinkBuilder.Params.hash}=${data.Audio.hash}&${data.LinkBuilder.Params.time}=${data.Audio.timestamp}`;
//     const flow_link = src_flow + param_flow;
    
//     const src_profile_img = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.ProfilPicture.name + '?';
//     const param_profile_img = `${data.LinkBuilder.Params.hash}=${data.ProfilPicture.hash}&${data.LinkBuilder.Params.time}=${data.ProfilPicture.timestamp}`;
//     var profilePicLink = src_profile_img + param_profile_img;
//     console.log(profilePicLink);
//     console.log(image_link);
//     let block_params = {
//         parent_element: $(".list-block"),
//         afterblock: false,
//         audioURL: flow_link,
//         duration: data.Duration,
//         patternKey: pattern_key,
//         imageURL: image_link,
//         title: data.Title,
//         description: data.Description,
//         pseudo: data.PrivateId,
//         account_imageURL: profilePicLink
//     };
//     var new_block = new block(block_params);
//     all_blocks.push(new_block);
    
//     console.log("Pop Flow");
//     console.log(new_block);