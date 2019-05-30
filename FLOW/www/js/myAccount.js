var nameMonCompte;
var bioMonCompte;
var mainView = app.addView('.view-main');
var MyFlowBandeau;
var MyFollower;
var MyFollowing;
var privateID;
var indexAlexis;
var MyFlowAdd = true;

app.onPageInit('login-screen', function (page) {
    indexAlexis = 0;
    $(".ftabsMonCompte")[0].setAttribute("style", "height:68% !important");
    var getFlow = {
        Index : indexAlexis,
        PrivateId : window.localStorage.getItem("user_private_id")
    };
    ServerManager.GetMyFlow(getFlow);

    var getInfosUser = {
        PrivateId: window.localStorage.getItem("user_private_id")
    };
    ServerManager.GetMyUserInfo(getInfosUser);


    //console.log("init");
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
    $("#fbioMonCompte").append(bioMonCompte);

    $("#fgobackmonCompte").click(function () {
        mainView.back();
        $(".fflow-btn").css("display", "block");
    });

    var scroll_element = $("#tabMonCompte1");
    checkScroll();
    $$('#tabMonCompte1').on('tab:show', function () {
        scroll_element = $("#tabMonCompte1");
        checkScroll();
    });

    $$('#tabMonCompte2').on('tab:show', function () {
        scroll_element = $("#tabMonCompte2");
        checkScroll();
    });

    $$('#tabMonCompte3').on('tab:show', function () {
        scroll_element = $("#tabMonCompte3");
        checkScroll();
    });

    var boolScrollTop = true;

    $(".scrollMyAccunt").scroll(function () {
        checkScroll();
    });

    function checkScroll() {
        var scroll = scroll_element.scrollTop();
        if (scroll >= 143 && $(".ftabsMonCompte")[0].style.height == "68%") {
            //console.log("94vh");
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
            $("#MyActivity").removeClass("fblockMonComptePadding");
            $("scrollEvent").addClass(".swiper-wrapper");
        } else {
            if (scroll < 100 && $(".ftabsMonCompte")[0].style.height == "94vh") {
                event.preventDefault();
                event.stopPropagation();
                if (boolScrollTop == false) {
                    $(".ftabsMonCompte")[0].setAttribute("style", "height:68% !important");
                    $("scrollEvent").remove(".swiper-wrapper");
                    $("#accountBannerScroll").css("transition-duration", "0.2s");
                    $("#accountBannerScroll").css("transform", "translate3d(0vw, 0vh, 0vh)");
                    $(".fnavMonCompte").removeClass("fnavMonCompteTransitionTop");
                    $(".fnavMonCompte").addClass("fnavMonCompteTransitionDown");
                    $(".ftabsMonCompte").css("transition-duration", "0.2s");
                    var scrollTest = $(".scrollMyAccunt").scrollTop();
                    $(".fnavMonCompte").css("transform", "translate3d(0vw, 7vh, 0vh)");
                    $(".ftabsMonCompte").css("transform", "translate3d(0vw, 2vh, 0vh)");
                    boolScrollTop = true;
                    $("#MyActivity").addClass("fblockMonComptePadding");
                }
            }
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
        //console.log(swatches);
        $("#fbigProfilPictureContainer").css("background-color", swatches.Muted.getHex());
    });

    $("#returnProfilPicture").click(function () {
        $("#fbigProfilPictureContainer").css("transform", "scale(0)");
        //console.log("ok");
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
                //console.log("Profile name:" +updateEditProfile.FullName);
                //console.log("Profile bio:" +updateEditProfile.Biography);
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
                //console.log("Profile name:" +updateEditProfile.FullName);
                //console.log("Profile bio:" +updateEditProfile.Biography);
                ServerManager.UpdateProfile(updateEditProfile);
            }
            $("#feditProfilePopupContainer").css("opacity", "0");
            $("#editProfilePopup").css("transform", "scale(0)");
            $("#feditProfilePopupContainer").css("pointer-events", "none");
        }
    });

    $("#tabMonCompte1").scroll(function() {
        console.log("MyflowAdd = " + MyFlowAdd);
        var $this = $(this);
        var $results = $("#MyActivity");
        var limit = Math.max(   $this[0].scrollHeight, 
                                $this[0].offsetHeight, 
                                $results[0].clientHeight, 
                                $results[0].scrollHeight, 
                                $results[0].offsetHeight );
        if(MyFlowAdd == true ) {
            if (Math.round($this.scrollTop() + $this.height()) == limit) {
                MyFlowAdd = false;
                var addMyFlow = {
                    Index : indexAlexis,
                    PrivateId : window.localStorage.getItem("user_private_id")
                };
                //console.log(addMyFlow);
                ServerManager.GetMyFlow(addMyFlow);
            }
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
    //console.log("SHOW MY FLOW");
    //console.log(flow);
    if(Array.isArray(flow.Data) == false)
    { 
        MyFlowAdd = false;
        // window.alert("Plus de flow a recupt");
    }
    else 
    {
        // flow.Data.reverse();
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
            //console.log(profilePicLink);
            //console.log(image_link);
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
            
            //console.log("Pop Flow");
            //console.log(new_block);
        }
        if(countFlow < 5)
        {
            indexAlexis ++;
            MyFlowAdd = false;
            //console.log("index" + indexAlexis);
            // window.alert("< 5 donc stop");
        }
        else
        {
            indexAlexis ++;
            MyFlowAdd = true;
            //console.log("index" + indexAlexis);
        }
    }
}

function ShowMyInfosUser(data) {
    console.log(data.NbFollowing);
    MyFlowBandeau = data.NbFlow;
    MyFollower = data.NbFollower;
    MyFollowing = data.NbFollowing;
    $("#ffLowBandeauChiffre").append(MyFlowBandeau);
    $("#ffollowersBandeauChiffre").append(MyFollower);
    $("#ffollowingBandeauChiffre").append(MyFollowing);
}    
