var follow = true;
var followYou = true;
var privateIDAccount;
var nameCompte;
var bioCompte;
var mainView = app.addView('.view-main');
var FlowBandeau;
var Follower;
var Following;
var indexAccount;
var accountFlowAdd = true;
var UserFlowAdd = true;
var profilePicLink;
// var CanRefreshUser = true;
// var UserCurrentIndex = 0;

app.onPageInit('login-screen2', function (page) {    
    $(".ftabsAccount")[0].setAttribute("style", "height:68% !important");
    $(".fflow-btn").css("display", "none");
    $(".flow-btn-shadow").css("display", "none");
    var scroll_element = $("#tabCompte1");
    checkScrollAccount();
    $$('#tabCompte1').on('tab:show', function () {
        scroll_element = $("#tabCompte1");
        checkScrollAccount();
    });

    $$('#tabCompte2').on('tab:show', function () {
        scroll_element = $("#tabCompte2");
        checkScrollAccount();
    });

    var boolScrollTop = true;

    $(".scrollAccunt").scroll(function () {
        checkScrollAccount();
    });

    $("#fFollowButtunAccount").click(function(){
        console.log(privateIDAccount);
        var ActionFollow = {
            PrivateId : privateIDAccount
        };
        ServerManager.ActionFollow(ActionFollow);
        console.log(ActionFollow);
        manageFollow();
    });
    $('#fprofilPicture').click(function () {
        $("#fbigProfilPictureContainer").css("transform", "scale(1)");
    });

    

    $("#returnProfilPicture").click(function () {
        $("#fbigProfilPictureContainer").css("transform", "scale(0)");
        //console.log("ok");
    });

    function checkScrollAccount() {
        var scroll = scroll_element.scrollTop();
        if (scroll >= 143 && $(".ftabsAccount")[0].style.height == "68%") {
            // console.log("94vh");
            event.preventDefault();
            event.stopPropagation();
            $("scrollEventAccount").remove(".swiper-wrapper");
            $("#accountBannerScrollAccount").css("transform", "translate3d(0vw, -30vh, 0vh)");
            if (boolScrollTop) {
                $(".ftabsAccount")[0].setAttribute("style", "height:94vh !important");
    
                
                $(".fnavAccount").removeClass("fnavAccountTransitionDown");
                $(".fnavAccount").addClass("fnavAccountTransitionTop");
                $(".ftabsAccount").css("transition-duration", "0.4s");
                $(".fnavAccount").css("transform", "translate3d(0vw, -20vh, 0vh)");
                $(".ftabsAccount").css("transform", "translate3d(0vw, -23vh, 0vh)");
                boolScrollTop = false;
            }
            $("#UserActivity").removeClass("fblockAccountPadding");
            $("scrollEventAccount").addClass(".swiper-wrapper");
        } else {
            if (scroll < 100 && $(".ftabsAccount")[0].style.height == "94vh") {
                // console.log('NTM');
                event.preventDefault();
                event.stopPropagation();
                if (boolScrollTop == false) {
                    $(".ftabsAccount")[0].setAttribute("style", "height:68% !important");
                    $("scrollEventAccount").remove(".swiper-wrapper");
                    $("#accountBannerScrollAccount").css("transition-duration", "0.2s");
                    $("#accountBannerScrollAccount").css("transform", "translate3d(0vw, 0vh, 0vh)");
                    $(".fnavAccount").removeClass("fnavAccountTransitionTop");
                    $(".fnavAccount").addClass("fnavAccountTransitionDown");
                    $(".ftabsAccount").css("transition-duration", "0.2s");
                    var scrollTest = $(".scrollAccunt").scrollTop();
                    $(".fnavAccount").css("transform", "translate3d(0vw, 7vh, 0vh)");
                    $(".ftabsAccount").css("transform", "translate3d(0vw, 2vh, 0vh)");
                    boolScrollTop = true;
                    $("#UserActivity").addClass("fblockAccountPadding");
                }
            }
        }
        position = scroll;
    }

    $("#fgobackCompte").click(function () {
        //$(".flow-btn-shadow").css("display", "block");
        privateIDAccount = "";
        profilePicLink = "";
        bioCompte = "";
        nameCompte = "";
        $(".fflow-btn").css("display", "block");
        mainView.back();
    });

    $("#tabCompte1").scroll(function () {
        var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
        if ( UserFlowAdd == true) {
            if (Math.round($(this).scrollTop()) >= limit * 0.75) {
                UserFlowAdd = false;
                var addUserFlow = {
                    Index : indexAccount,
                    PrivateId : privateIDAccount 
                };
                ServerManager.GetUserFlow(addUserFlow);
            } 
        }
    });
});


function fInitialisationAccount(privateId) {
    privateIDAccount = privateId;
    indexAccount = 0;
    var getFlow = {
        Index : indexAccount,
        PrivateId : privateIDAccount
    };
    ServerManager.GetUserFlow(getFlow);

    var getInfosUserNumber = {
        PrivateId: privateIDAccount
    };
    ServerManager.getInfosUserNumber(getInfosUserNumber);
    var getUserInfoAccount = {
        PrivateId: privateIDAccount
    };
    ServerManager.GetUserInfo(getUserInfoAccount);
    // console.log("privateIDAccount = " + privateIDAccount);
}

function manageFollow()
{
    if(follow)
    {
        $("#fFollowButtunAccount").addClass("activeButtunFollow");
        $("#fFollowButtunAccount").text("FOLLOWING");
    }
    else
    {
        $("#fFollowButtunAccount").removeClass("activeButtunFollow");
        $("#fFollowButtunAccount").text("FOLLOW");
    }
}

function manageFollowYou()
{
    if(followYou)
    {
        $("#fFollowYouButtunAccount").css("display", "block");
    }
    else
    {
        $("#fFollowYouButtunAccount").css("display", "none");
    }
}

function ShowUserProfile(response) {
    console.log(response);  
    bioCompte = response.Data.Bio;
    nameCompte = response.Data.FullName;
    followYou = response.Data.HeFollowYou;
    follow = response.Data.HeFollowYou;
    manageFollow();
    manageFollowYou();
    $("#fbioCompte").append(bioCompte);
    $("#fnameCompte").html(nameCompte);
    $("#privateID").html("@" + privateIDAccount);
    const src_profile_img = 'https://' + response.LinkBuilder.Hostname + ':' + response.LinkBuilder.Port + '/images/' + response.Data.ProfilePicture.name + '?';
    const param_profile_img = `${response.LinkBuilder.Params.hash}=${response.Data.ProfilePicture.hash}&${response.LinkBuilder.Params.time}=${response.Data.ProfilePicture.timestamp}`;
    profilePicLink = src_profile_img + param_profile_img;
    $("#fprofilPicture").css({
        "background-image": "url('" + profilePicLink +"')"
    });    
    $("#fbigProfilPicture").css({
        "background-image": "url('" +  profilePicLink + "')"
    });
    var profilePicture = document.createElement('img');
    // var profilePicture = window.localStorage.getItem("user_profile_pic");
    profilePicture.setAttribute('src', profilePicLink);

    profilePicture.addEventListener('load', function () {
        var vibrant = new Vibrant(profilePicture);
        var swatches = vibrant.swatches();
        //console.log(swatches);
        $("#fbigProfilPictureContainer").css("background-color", swatches.Muted.getHex());
    });
}

function ShowInfosUserNumber(data) {
    // console.log(data);
    FlowBandeau = data.NbFlow;
    Follower = data.NbFollower;
    Following = data.NbFollowing;
    $("#ffLowBandeauChiffre").append(FlowBandeau);
    $("#ffollowersBandeauChiffre").append(Follower);
    $("#ffollowingBandeauChiffre").append(Following);
} 

function ShowUserFlow(flow) {
    // console.log(UserFlowAdd);
    // console.log("------------------ show -----------------");
    // console.log(flow);
    if(Array.isArray(flow.Data) == false)
    { 
        UserFlowAdd = false;
    }
    else 
    {
        var countFlow = 0;
        for (let i = 0; i < flow.Data.length; i++) {
            countFlow ++;
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
            let block_params = {
                parent_element: $("#UserActivity"),
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
        }
        if(countFlow < 5)
        {
            indexAccount ++;
            UserFlowAdd = false;
        }
        else
        {
            indexAccount ++;
            UserFlowAdd = true;
        }
    }
}

function ActionFollow(response) {
    if(response.Follow !== undefined) {
        follow = true;
        manageFollow();
    }
    else if(response.UnFollow !== undefined) {
        follow = false;
        manageFollow();
    }
    else {
        console.log(response);
    }
}


