var nameMonCompte;
var bioMonCompte;
var MyFlowBandeau;
var MyFollower;
var MyFollowing;
var privateID;
var indexMyFlow;
var indexMyLike;
var MyFlowAdd = true;
var MyLikeAdd = true;
var PPHasChanged = false;
$(".fnavMonCompte").css("transform", "translate3d(0vw, calc(7 * var(--custom-vh)), 0vh)");
$(".faccount")[0].addEventListener("touchstart", function () {
    if (connected) {
        Popup("popup-myaccount", true);
    } else {
        Popup("popup-connect", true, 60);
    }
});
document.getElementById("popup-myaccount").addEventListener("opened", function () {
    last_scroll = 0;
    current_page = "my-account";
    $(".faccount")[0].style.backgroundImage = "url('" + window.localStorage.getItem("user_profile_pic") + "')";
    $(".ftabsMonCompte")[0].style.display = "block";
    // $(".ftabsMonCompte")[0].setAttribute("style", "height:68% !important");
    $("scrollEvent").remove(".swiper-wrapper");
    $("#accountBannerScroll").css("transition-duration", "0.2s");
    $("#accountBannerScroll").css("transform", "translate3d(0vw, 0vh, 0vh)");
    $(".fnavMonCompte").removeClass("fnavMonCompteTransitionTop");
    $(".fnavMonCompte").addClass("fnavMonCompteTransitionDown");
    $(".ftabsMonCompte").css("transition-duration", "0.2s");
    var scrollTest = $(".scrollMyAccunt").scrollTop();
    $(".fnavMonCompte").css("transform", "translate3d(0vw, calc(7 * var(--custom-vh)), 0vh)");
    $(".ftabsMonCompte").css("transform", "translate3d(0vw, calc(-20 * var(--custom-vh)), 0vh)");
    boolScrollTop = true;
    $("#MyActivity").addClass("fblockMonComptePadding");

    stopAllBlocksAudio();
    let time_in_last_screen = Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
    facebookConnectPlugin.logEvent("current_page", {
        page: current_page,
        duration: time_in_last_screen
    }, null, function () {
        console.log("fb current_page event success")
    }, function () {
        console.log("fb current_page error")
    });
    last_currentpage_timestamp = Math.floor(Date.now() / 1000);


    // analytics.setCurrentScreen(current_page);

    indexMyFlow = 0;
    indexMyLike = 0;
    $("#MyActivity")[0].innerHTML = "";
    $("#MyLikes")[0].innerHTML = "";
    let loading_tl = document.createElement("div");
    loading_tl.className = "loading-spinner loading_myaccount";
    loading_tl.style.marginTop = "50%";
    $("#MyActivity")[0].appendChild(loading_tl);
    $("#MyLikes")[0].appendChild(loading_tl);
    $("#fnameMonCompte").html(nameMonCompte);
    $("#fbioMonCompte").html(bioMonCompte);
    var getFlow = {
        Index: indexMyFlow,
        PrivateId: window.localStorage.getItem("user_private_id")
    };
    ServerManager.GetMyFlow(getFlow);
    let data = {
        Index: indexMyLike,
        PrivateId: window.localStorage.getItem("user_private_id")
    };
    ServerManager.GetLikedFlows(data, true);

    var GetMyUserInfoNumber = {
        PrivateId: window.localStorage.getItem("user_private_id")
    };
    ServerManager.GetMyUserInfoNumber(GetMyUserInfoNumber);


    //console.log("init");
    nameMonCompte = window.localStorage.getItem("user_name");
    privateID = window.localStorage.getItem("user_private_id");
    bioMonCompte = window.localStorage.getItem("user_bio") || "";
    if (bioMonCompte.length > 57) bioMonCompte = bioMonCompte.substring(0, 57) + "...";
    $(".fflow-btn").css("display", "none");
    $(".flow-btn-shadow").css("display", "none");
    $("#fmyprofilPicture").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    $("#fnameMonCompte").html(nameMonCompte);
    $("#myprivateID").html("@" + privateID);
    $("#fbioMonCompte").html(bioMonCompte);
    $("#fgobackmonCompte").click(function () {
        Popup("popup-myaccount", false);
        //$(".flow-btn-shadow").css("display", "block");
    });

    var scroll_element = $("#tabMonCompte1");
    scroll_element[0].scrollTop = 0;
    checkScroll();
    $$('#tabMonCompte1').on('tab:show', function () {
        scroll_element = $("#tabMonCompte1");
        checkScroll();
    });

    $$('#tabMonCompte2').on('tab:show', function () {
        scroll_element = $("#tabMonCompte2");
        checkScroll();
    });

    // $$('#tabMonCompte3').on('tab:show', function () {
    //     scroll_element = $("#tabMonCompte3");
    //     checkScroll();
    // });

    var boolScrollTop = true;

    $(".scrollMyAccunt").scroll(function () {
        checkScroll();
    });

    function checkScroll() {
        let current_scroll = scroll_element.scrollTop() + scroll_element.innerHeight();
        if (current_scroll > last_scroll + 10 && last_scroll != 0) {
            // if (scroll_element[0].scrollHeight > document.body.clientHeight) {
            //console.log("94vh");
            // event.preventDefault();
            // event.stopPropagation();
            $("scrollEvent").remove(".swiper-wrapper");
            $("#accountBannerScroll").css("transform", "translate3d(0vw, -30vh, 0vh)");
            if (boolScrollTop) {
                // $(".ftabsMonCompte")[0].setAttribute("style", "height:94vh !important");


                $(".fnavMonCompte").removeClass("fnavMonCompteTransitionDown");
                $(".fnavMonCompte").addClass("fnavMonCompteTransitionTop");
                $(".fnavMonCompte").css("transform", "translate3d(0vw, -20vh, 0vh)");
                $(".ftabsMonCompte").css({
                    "transition-duration": "0.4s",
                    // "transform": "translate3d(0vw, -23vh, 0vh)"
                });
                boolScrollTop = false;
            }
            $("#MyActivity").removeClass("fblockMonComptePadding");
            $("scrollEvent").addClass(".swiper-wrapper");
            // }
        } else {
            if ((current_scroll < last_scroll - 10 && current_scroll < scroll_element[0].scrollHeight - 30) || current_scroll <= scroll_element.innerHeight()) {
                // event.preventDefault();
                // event.stopPropagation();
                if (boolScrollTop == false) {
                    // $(".ftabsMonCompte")[0].setAttribute("style", "height:68% !important");
                    $("scrollEvent").remove(".swiper-wrapper");
                    $("#accountBannerScroll").css("transition-duration", "0.2s");
                    $("#accountBannerScroll").css("transform", "translate3d(0vw, 0vh, 0vh)");
                    $(".fnavMonCompte").removeClass("fnavMonCompteTransitionTop");
                    $(".fnavMonCompte").addClass("fnavMonCompteTransitionDown");
                    // $(".ftabsMonCompte").css("transition-duration", "0.2s");
                    var scrollTest = $(".scrollMyAccunt").scrollTop();
                    $(".fnavMonCompte").css("transform", "translate3d(0vw, calc(7 * var(--custom-vh)), 0vh)");
                    // $(".ftabsMonCompte").css("transform", "translate3d(0vw, calc(2 * var(--custom-vh)), 0vh)");
                    $(".ftabsMonCompte").css({
                        "transition-duration": "0.2s",
                        // "transform": "translate3d(0vw, 2vh, 0vh)"
                    });
                    boolScrollTop = true;
                    $("#MyActivity").addClass("fblockMonComptePadding");
                }
            }
        }
        // position = scroll;
        last_scroll = current_scroll;
    }

    $('#fmyprofilPicture').click(function () {
        $("#fmybigProfilPictureContainer").css({
            "transform": "scale(1)",
            "opacity": "1",
            "pointer-events": "auto"
        });
    });



    $("#returnmyProfilPicture").click(function () {
        $("#fmybigProfilPictureContainer").css({
            "transform": "scale(0.4)",
            "opacity": "0",
            "pointer-events": "none"
        });
    });

    $("#fmybigProfilPicture").css({
        "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
    });
    var profilePicture = document.createElement('img');
    profilePicture.setAttribute('src', window.localStorage.getItem("user_profile_pic"));

    profilePicture.addEventListener('load', function () {
        var vibrant = new Vibrant(profilePicture);
        var swatches = vibrant.swatches();
        $("#fmybigProfilPictureContainer").css("background-color", swatches.Muted.getHex());
    });

    $("#feditProfil").click(function () {
        in_editprofile = true;
        PPHasChanged = false;
        $("#feditProfilePopupContainer").css("opacity", "1");
        $("#editProfilePopup").css({
            "transform": "scale(1)",
            "opacity": "1",
            "pointer-events": "auto"
        });
        $("#feditProfilePopupContainer").css("pointer-events", "auto");
        $("#fprofilPicturePopup").css({
            "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
        });
        $("#fprofilPicturePopup")[0].onclick = function () {
            GetPhotoFromGallery(true);
        }
        $("#editProfileName").val(nameMonCompte);
        $("#feditBio").val(bioMonCompte);
    });

    $("#tabMonCompte1").scroll(function () {
        var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
        if (MyFlowAdd == true) {
            if (Math.round($(this).scrollTop()) >= limit * 0.75 && indexMyFlow > 0) {
                MyFlowAdd = false;
                var addMyFlow = {
                    Index: indexMyFlow,
                    PrivateId: window.localStorage.getItem("user_private_id")
                };
                ServerManager.GetMyFlow(addMyFlow);
            }
        }

    });

    $("#tabMonCompte2").scroll(function () {
        var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
        if (MyLikeAdd == true) {
            if (Math.round($(this).scrollTop()) >= limit * 0.75 && indexMyLike > 0) {
                MyLikeAdd = false;
                var data = {
                    Index: indexMyLike,
                    PrivateId: window.localStorage.getItem("user_private_id")
                };
                ServerManager.GetLikedFlows(data, true);
            }
        }

    });
    // first_open_myaccount = false;
    // }
});

function liked_flow_get_block_and_blocked_users(data_liked_flow, mine) {
    ServerManager.GetBlockedUsers(data_liked_flow, "liked_flow", mine);
}

$("#fcloseProfilPopup").click(function () {
    in_editprofile = false;
    closeEditProfile();
});

$("#feditProfilePopupContainer").click(function () {
    in_editprofile = false;
    closeEditProfile();
});

function closeEditProfile() {
    if ($.trim($("#editProfileName").val()) != "") {
        if ($("#editProfileName").val() != nameMonCompte || $("#feditBio").val() != bioMonCompte || PPHasChanged) {
            let updateEditProfile = {
                FullName: $("#editProfileName").val(),
                Biography: $("#feditBio").val(),
            };
            console.log(window.localStorage.getItem("user_profile_pic"));
            if (!window.localStorage.getItem("user_profile_pic").includes("https") && window.localStorage.getItem("user_profile_pic").length > 0) {
                updateEditProfile.Image = window.localStorage.getItem("user_profile_pic");
            }
            ServerManager.UpdateProfile(updateEditProfile);
        }
        $("#feditProfilePopupContainer").css("opacity", "0");
        $("#editProfilePopup").css({
            "transform": "scale(0.4)",
            "opacity": "0",
            "pointer-events": "none"
        });
        $("#feditProfilePopupContainer").css("pointer-events", "none");
    }
}

function UpdateProfile(profileName, profileBio, profilePicture) {
    $("#fnameMonCompte").html(profileName);
    window.localStorage.setItem("user_name", profileName);
    $("#fbioMonCompte").html(profileBio);
    window.localStorage.setItem("user_bio", profileBio);
    nameMonCompte = profileName;
    bioMonCompte = profileBio;
    if (profilePicture) {
        window.localStorage.setItem("user_profile_pic", profilePicture)
        $("#fmyprofilPicture").css({
            "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
        });
        $(".faccount").css({
            "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
        });
    }
}

function ShowMyFlow(flow) {
    //console.log("SHOW MY FLOW");
    //console.log(flow);
    if ($(".loading_myaccount")) $(".loading_myaccount").remove();

    if (Array.isArray(flow.Data) == false || flow.Data.length == 0) {
        MyFlowAdd = false;
        if (indexMyFlow == 0) {
            let no_flows = document.createElement("label");
            no_flows.className = "empty_content";
            no_flows.innerHTML = "Aucun flow publié";
            $("#MyActivity")[0].appendChild(no_flows);
        }
        // window.alert("Plus de flow a recupt");
    } else {
        // flow.Data.reverse();
        var countFlow = 0;
        for (let i = 0; i < flow.Data.length; i++) {
            countFlow++;
            let data = flow.Data[i];
            var image_link = undefined;
            var pattern_key = undefined;
            if (data.Background.PatternKey == undefined) {
                const src_img = 'https://' + flow.LinkBuilder.Hostname + ':' + flow.LinkBuilder.Port + '/images/' + data.Background.name + '?';
                const param_img = `${flow.LinkBuilder.Params.hash}=${data.Background.hash}&${flow.LinkBuilder.Params.time}=${data.Background.timestamp}`;
                image_link = src_img + param_img;
            } else {
                pattern_key = data.Background.PatternKey;
            }

            const src_flow = 'https://' + flow.LinkBuilder.Hostname + ':' + flow.LinkBuilder.Port + '/flows/' + data.Audio.name + '?';
            const param_flow = `${flow.LinkBuilder.Params.hash}=${data.Audio.hash}&${flow.LinkBuilder.Params.time}=${data.Audio.timestamp}`;
            const flow_link = src_flow + param_flow;

            const src_profile_img = 'https://' + flow.LinkBuilder.Hostname + ':' + flow.LinkBuilder.Port + '/images/' + data.ProfilPicture.name + '?';
            const param_profile_img = `${flow.LinkBuilder.Params.hash}=${data.ProfilPicture.hash}&${flow.LinkBuilder.Params.time}=${data.ProfilPicture.timestamp}`;
            var profilePicLink = src_profile_img + param_profile_img;
            //console.log(profilePicLink);
            //console.log(image_link);
            let block_params = {
                parent_element: $("#MyActivity"),
                afterblock: false,
                ObjectId: data.ObjectId,
                audioURL: flow_link,
                duration: data.Duration,
                patternKey: pattern_key,
                imageURL: image_link,
                title: data.Title,
                description: data.Description,
                pseudo: data.PrivateId,
                account_imageURL: profilePicLink,
                IsLike: data.IsLike,
                IsComment: data.IsComment,
                Likes: data.Likes,
                ObjectId: data.ObjectId,
                PrivateId: data.PrivateId,
                Times: data.Time,
                Comments: data.Comments,
                RegisterId: data.RegisterId,
                LastOs: data.LastOs
            };
            var new_block = new block(block_params);
            all_blocks.push(new_block);
            if (i == 0 && indexMyFlow == 0) new_block.block_flow.style.marginTop = "calc(27 * var(--custom-vh))";
            //console.log("Pop Flow");
            //console.log(new_block);
        }
        if (countFlow < 5) {
            indexMyFlow++;
            MyFlowAdd = false;
            // let tick_tl = document.createElement("div");
            // tick_tl.className = "tick_icon";
            // $("#MyActivity")[0].appendChild(tick_tl);
        } else {
            indexMyFlow++;
            MyFlowAdd = true;
            let loading_tl = document.createElement("div");
            loading_tl.className = "loading-spinner loading_myaccount";
            $("#MyActivity")[0].appendChild(loading_tl);
        }
    }
}

document.getElementById("popup-myaccount").addEventListener("closed", function () {
    $(".ftabsMonCompte")[0].style.display = "none";
    $(".fflow-btn").css("display", "block");
    $(".flow-btn-shadow").css("display", "block");
    $(".fflow-btn").css("z-index", "1");
    $(".flow-btn-shadow").css("z-index", "0");
    let time_in_last_screen = Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
    facebookConnectPlugin.logEvent("current_page", {
        page: current_page,
        duration: time_in_last_screen
    }, null, function () {
        console.log("fb current_page event success")
    }, function () {
        console.log("fb current_page error")
    });
    last_currentpage_timestamp = Math.floor(Date.now() / 1000);
    current_page = "home";

    // analytics.setCurrentScreen(current_page);

    stopAllBlocksAudio();
});

function ShowMyLikedFlows(flow, data_block_user) {
    console.log("SHOW MY FLOW");
    console.log(flow);
    if (Array.isArray(flow.Data) == false || flow.Data.length == 0) {
        MyLikeAdd = false;
        if (indexMyLike == 0) {
            let no_flows = document.createElement("label");
            no_flows.className = "empty_content";
            no_flows.innerHTML = "Aucun flow aimé";
            $("#MyLikes")[0].appendChild(no_flows);
        }
        if ($(".loading_myaccount")) $(".loading_myaccount").remove();
        // window.alert("Plus de flow a recupt");
    } else {
        console.log("several liked flows");
        // flow.Data.reverse();
        let countFlow = 0;
        let unique_block_user;

        if (data_block_user) {
            unique_block_user = data_block_user.Data.UserBlocked.concat(data_block_user.Data.BlockedByUser);
            unique_block_user = unique_block_user.filter((item, pos) => unique_block_user.indexOf(item) === pos);
        }

        for (let i = 0; i < flow.Data.length; i++) {

            countFlow++;
            let data = flow.Data[i];
            var image_link = undefined;
            var pattern_key = undefined;
            if (data.Background.PatternKey == undefined) {
                image_link = data.Background;
            } else {
                pattern_key = data.Background.PatternKey;
            }
            const flow_link = data.Audio;
            console.log(flow_link);
            var profilePicLink = data.ProfilePicture;
            //console.log(profilePicLink);
            //console.log(image_link);
            if (unique_block_user && unique_block_user.length > 0) {
                for (let i_unique_block_user in unique_block_user) {
                    if (unique_block_user[i_unique_block_user] != data.PrivateId) {

                        let block_params = {
                            parent_element: $("#MyLikes"),
                            afterblock: false,
                            ObjectId: data.ObjectId,
                            audioURL: flow_link,
                            duration: data.Duration,
                            patternKey: pattern_key,
                            imageURL: image_link,
                            title: data.Title,
                            description: data.Description,
                            pseudo: data.PrivateId,
                            account_imageURL: profilePicLink,
                            IsLike: data.IsLike,
                            IsComment: data.IsComment,
                            Likes: data.Likes,
                            ObjectId: data.ObjectId,
                            PrivateId: data.PrivateId,
                            Times: data.Time,
                            Comments: data.Comments,
                            RegisterId: data.RegisterId,
                        };
                        let new_block = new block(block_params);
                        all_blocks.push(new_block);
                        if (i == 0 && indexMyLike == 0) new_block.block_flow.style.marginTop = "calc(27 * var(--custom-vh))";
                        if ($(".loading_myaccount")) $(".loading_myaccount").remove();

                        //console.log("Pop Flow");
                        //console.log(new_block);
                    }
                }
            } else {

                let block_params = {
                    parent_element: $("#MyLikes"),
                    afterblock: false,
                    ObjectId: data.ObjectId,
                    audioURL: flow_link,
                    duration: data.Duration,
                    patternKey: pattern_key,
                    imageURL: image_link,
                    title: data.Title,
                    description: data.Description,
                    pseudo: data.PrivateId,
                    account_imageURL: profilePicLink,
                    IsLike: data.IsLike,
                    IsComment: data.IsComment,
                    Likes: data.Likes,
                    ObjectId: data.ObjectId,
                    PrivateId: data.PrivateId,
                    Times: data.Time,
                    Comments: data.Comments,
                    RegisterId: data.RegisterId,
                };
                let new_block = new block(block_params);
                all_blocks.push(new_block);
                if (i == 0) new_block.block_flow.style.marginTop = "calc(27 * var(--custom-vh))";
                if ($(".loading_myaccount")) $(".loading_myaccount").remove();

                //console.log("Pop Flow");
                //console.log(new_block);
            }
        }
        console.log(countFlow);
        if (countFlow < 5) {
            indexMyLike++;
            MyLikeAdd = false;
            // let tick_tl = document.createElement("div");
            // tick_tl.className = "tick_icon";
            // $("#MyLikes")[0].appendChild(tick_tl);
        } else {
            indexMyLike++;
            MyLikeAdd = true;
            let loading_tl = document.createElement("div");
            loading_tl.className = "loading-spinner loading_myaccount";
            $("#MyLikes")[0].appendChild(loading_tl);
        }
    }
}

function ShowMyInfosUser(data) {
    console.log(data.NbFollowing);
    MyFlowBandeau = data.NbFlow;
    MyFollower = data.NbFollower;
    MyFollowing = data.NbFollowing;
    $("#fflowmyBandeauChiffre").html(MyFlowBandeau);
    $("#ffollowersmyBandeauChiffre").html(MyFollower);
    $("#ffollowingmyBandeauChiffre").html(MyFollowing);
}

$(".disconnect_btn")[0].addEventListener("touchstart", function () {
    $("#feditProfilePopupContainer").css("opacity", "0");
    $("#editProfilePopup").css("transform", "scale(0)");
    $("#feditProfilePopupContainer").css("pointer-events", "none");
    DisconnectUser();
});

function onProfilePhotoDataSuccess(imageData) {
    // console.log("PP picture success");
    // console.log(imageData);
    // $(".ios_camera_auth")[0].style.display = "none";
    // window.localStorage.setItem("ios_photos_init", "true");

    var options = {
        url: imageData, // required.
        ratio: "1/1", // required. (here you can define your custom ration) "1/1" for square images
        title: "Crop image", // optional. android only. (here you can put title of image cropper activity) default: Image Cropper
        autoZoomEnabled: true // optional. android only. for iOS its always true (if it is true then cropper will automatically adjust the view) default: true
    };

    appState.takingPicture = false;
    appState.imageUri = imageData;

    window.plugins.k.imagecropper.open(options, function (data) {
        // its return an object with the cropped image cached url, cropped width & height, you need to manually delete the image from the application cache.
        console.log(data);
        //$scope.croppedImage = data;
        // new_block.ftop_part.style.backgroundImage = "url('" + data.imgPath + "')";
        toDataUrl(data.imgPath, function (b64) {
            // image64 = b64;
            // console.log(b64)
            PPHasChanged = true;
            window.localStorage.setItem("user_profile_pic", b64);
            $("#fprofilPicturePopup").css({
                "background-image": "url('" + window.localStorage.getItem("user_profile_pic") + "')"
            });

        });
    }, function (error) {
        console.log(error);
    });
}