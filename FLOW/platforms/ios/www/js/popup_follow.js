var all_users_block = [];
var my_followers = false;
var all_tagged_users = [];
//block qui correspond à utilisateur de la liste des followers et follwing
function block_user(follow_list, target, data) //follow_list true correspond au block user de la liste des utilisateur que l'on peu identifier dans un commentaire
{
  var block_user = this; //
  //var profilePicLink = src_profile_img + param_profile_img;
  var profilePicLink = data.ProfilePicture;
  this.block_user = document.createElement('div');
  follow_list == false ? this.block_user.className = 'f_block_user' : this.block_user.className = 'f_block_user_tag';
  if (target == "followers") {
    $(".popup_followers_container").append(this.block_user);
  }

  if (target == "followings") {
    $(".popup_followings_container").append(this.block_user);
  }

  if (target == "identification") {

    $(".popup_identification_container").append(this.block_user);
  }

  if (follow_list == true) {
    $(this.block_user).on('click', function () {
      $('#finput_comment').focus();
      string_input_comment = string_input_comment.slice(0, string_input_comment.lastIndexOf("@") + 1);
      $("#finput_comment").val(string_input_comment + data.PrivateId + " ");
      $('.regex-example').highlightWithinTextarea({
        highlight: /@[^ ]+/gi
      });
      let data_user = {
        private_Id: "@" + data.PrivateId,
        RegisterId: data.RegisterId,
        LastOs: data.LastOs
      };
      all_tagged_users.push(data_user);
      Popup("popup-identification", false, -5);

    });
  }

  this.fphoto_block_user = document.createElement('div');
  this.fphoto_block_user.className = 'f_user_photo';
  this.fphoto_block_user.style.backgroundImage = "url('" + profilePicLink + "')";
  this.block_user.appendChild(this.fphoto_block_user);

  $(this.fphoto_block_user).on('click', function () {

    let data_user = {
      private_Id: data.PrivateId,
      user_private_Id: window.localStorage.getItem("user_private_id")
    };
    go_to_account(data_user);
  });

  this.f_user_fullname = document.createElement('label');
  this.f_user_fullname.className = 'f_user_fullname';
  this.f_user_fullname.innerText = data.FullName;
  this.block_user.appendChild(this.f_user_fullname);

  this.f_user_private_id = document.createElement('label');
  this.f_user_private_id.className = 'f_user_private_id';
  this.f_user_private_id.innerText = "@" + data.PrivateId;
  this.block_user.appendChild(this.f_user_private_id);
  if (follow_list == false) {

    $(this.f_user_private_id).removeClass("f_user_private_id").addClass("f_user_private_id_identification");
    // this.f_user_bio = document.createElement('label'); //bio
    // this.f_user_bio.className = 'f_user_bio';
    // this.f_user_bio.innerText = data.Bio;
    // this.block_user.appendChild(this.f_user_bio);

    if (data.PrivateId != window.localStorage.getItem("user_private_id")) {
      this.following_button = document.createElement('div'); //
      this.following_button.className = 'following_button';
    }

    $(this.following_button).on('click', function () {

      let data_user = {
        PrivateId: data.PrivateId,
        type: "block_user_follow",
        block_user: block_user

      };
      ServerManager.ActionFollow(data_user);

    });

    if (data.YouFollowHim == "true") {
      $(this.following_button).addClass("activeButtunFollow");
      $(this.following_button).text("ABONNÉ");
    } else if (data.PrivateId != window.localStorage.getItem("user_private_id")) {
      $(this.following_button).removeClass("activeButtunFollow");
      this.following_button.innerText = "S'ABONNER";
    }
    if (this.following_button) {
      this.block_user.appendChild(this.following_button);
    }
  }
  console.log(data.HeFollowYou, my_followers);
  if (data.HeFollowYou == "true" && my_followers == false) {
    this.follow_you_button = document.createElement('div');
    this.follow_you_button.className = "follow_you_button";
    this.block_user.appendChild(this.follow_you_button);
  } else {
    // this.f_user_fullname.style.top = "calc(2.5 * var(--custom-vh))";
    // this.f_user_private_id.style.top = "calc(5 * var(--custom-vh))";
  }


}

//-----------------------------------click affichage followers------------------------------------


$("#ffollowersBandeau,#ffollowersmyBandeauChiffre,#ffollowersBandeauChiffre").on('click', function (event) {
  let target = $(event.target);
  console.log(target);
  if (target.is("#ffollowersmyBandeauChiffre") || target.is("#fMyfollowersBandeau")) {
    my_followers = true;
  } else {
    my_followers = false;
  }
  console.log(my_followers);
  let data_followers = {
    PrivateId: privateIDAccount,
    Index: 0,
    follow_list: false
  };
  if (current_page == "my-account") {

    data_followers.PrivateId = window.localStorage.getItem("user_private_id");
  } else {
    data_followers.PrivateId = privateIDAccount;
  }

  CanRefreshFollowersList = true;
  FollowersListCurrentIndex = 0;
  console.log("show folower of users");
  console.log(data_followers);
  ServerManager.GetFollowerOfUser(data_followers);
  Popup("popup-followers", true, 30);

});

document.getElementById("popup-followers").addEventListener("closed", function () {
  $(".popup_followers_container")[0].innerHTML = "";
});

var CanRefreshFollowersList = true;
var FollowersListCurrentIndex = 0;
$(".popup_followers_container").scroll(function () {
  var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
  if (CanRefreshFollowersList == true) {
    if (Math.round($(this).scrollTop()) >= limit * 0.75) {
      CanRefreshFollowersList = false;
      console.log("Get followers on Server");
      console.log("FollowersListCurrentIndex : " + FollowersListCurrentIndex);
      let data_followers_scroll = {
        PrivateId: privateIDAccount,
        Index: FollowersListCurrentIndex,
        follow_list: false
      };
      if (current_page == "my-account" || current_page == "home") {
        data_followers_scroll.PrivateId = window.localStorage.getItem("user_private_id");
      } else {
        data_followers_scroll.PrivateId = privateIDAccount;
      }
      ServerManager.GetFollowerOfUser(data_followers_scroll);
    }
  }
});


function UpdateFollowersList(data, follow_list) {
  console.log("updating Followers list...");
  // console.log(data.Data);
  if (Array.isArray(data)) {
    //$(".popup_followers_container").html("");
    setTimeout(function () {
      if ($(".loading_tl")) $(".loading_tl").remove();
      if (FollowersListCurrentIndex == 0) {
        $(".popup_followers_container")[0].innerHTML = "";
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".popup_followers_container")[0].appendChild(loading_tl);
      }
      for (let i = 0; i < data.length; i++) {
        let user = new block_user(follow_list, "followers", data[i]);
        all_users_block.push(user);
      }
      FollowersListCurrentIndex++;
      if ($(".loading_tl")) $(".loading_tl").remove();
      console.log("user updated !");
      pullToRefreshEnd();
      if (data.length < 10) {
        CanRefreshFollowersList = false;
        let tick_tl = document.createElement("div");
        tick_tl.className = "tick_icon";
        $(".popup_followers_container")[0].appendChild(tick_tl);
      } else {
        CanRefreshFollowersList = true;
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".popup_followers_container")[0].appendChild(loading_tl);
      }
    }, 500);
  } else {
    StopRefreshTL();
  }
}


//-------------------------------click affichage following----------------------------
$("#ffollowingBandeau,#ffollowingmyBandeauChiffre,#ffollowingBandeauChiffre").on('click', function (event) {
  let target = $(event.target);
  console.log("la target est :" + target);
  if (target.is("#ffollowingsmyBandeauChiffre") || target.is("#fMyfollowingsBandeau")) {
    my_followings = true;
  } else {
    my_followers = false;
  }
  let data_followings = {
    PrivateId: privateIDAccount,
    Index: 0,
    follow_list: false
  };
  if (current_page == "my-account") {

    data_followings.PrivateId = window.localStorage.getItem("user_private_id");
  } else {
    data_followings.PrivateId = privateIDAccount;
  }

  CanRefreshfollowingsList = true;
  followingsListCurrentIndex = 0;
  console.log("show folower of users");
  console.log(data_followings);
  ServerManager.GetFollowingOfUser(data_followings);
  Popup("popup-followings", true, 30);

});

document.getElementById("popup-followings").addEventListener("closed", function () {
  $(".popup_followings_container")[0].innerHTML = "";
});

var CanRefreshfollowingsList = true;
var followingsListCurrentIndex = 0;
$(".popup_followings_container").scroll(function () {
  var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
  if (CanRefreshfollowingsList == true) {
    if (Math.round($(this).scrollTop()) >= limit * 0.75) {
      CanRefreshfollowingsList = false;
      console.log("Get followings on Server");
      console.log("followingsListCurrentIndex : " + followingsListCurrentIndex);
      let data_followings_scroll = {
        PrivateId: privateIDAccount,
        Index: followingsListCurrentIndex,
        follow_list: false
      };
      if (current_page == "my-account" || current_page == "home") {
        data_followings_scroll.PrivateId = window.localStorage.getItem("user_private_id");
      } else {
        data_followings_scroll.PrivateId = privateIDAccount;
      }
      ServerManager.GetFollowingOfUser(data_followings_scroll);
    }
  }
});


function UpdatefollowingsList(data, follow_list) {
  console.log("updating followings list...");
  // console.log(data.Data);
  if (Array.isArray(data)) {
    //$(".popup_followings_container").html("");
    setTimeout(function () {
      if ($(".loading_tl")) $(".loading_tl").remove();
      if (followingsListCurrentIndex == 0) {
        $(".popup_followings_container")[0].innerHTML = "";
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".popup_followings_container")[0].appendChild(loading_tl);
      }
      for (let i = 0; i < data.length; i++) {
        let user = new block_user(follow_list, "followings", data[i]);
        all_users_block.push(user);
      }
      followingsListCurrentIndex++;
      if ($(".loading_tl")) $(".loading_tl").remove();
      console.log("user updated !");
      pullToRefreshEnd();
      if (data.length < 10) {
        CanRefreshfollowingsList = false;
        let tick_tl = document.createElement("div");
        tick_tl.className = "tick_icon";
        $(".popup_followings_container")[0].appendChild(tick_tl);
      } else {
        CanRefreshfollowingsList = true;
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".popup_followings_container")[0].appendChild(loading_tl);
      }
    }, 500);
  } else {
    StopRefreshTL();
  }
}


//---------------------------Identifications----------------------------------------


document.getElementById("popup-identification").addEventListener("closed", function () {
  $(".popup_identification_container")[0].innerHTML = "";
  CanRefreshIdentificationList = true;
  IdentificationListCurrentIndex = 0;
});
var CanRefreshIdentificationList = true;
var IdentificationListCurrentIndex = 0;
$(".popup_identification_container").scroll(function () {
  var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
  //IdentificationListCurrentIndex = 0;
  if (CanRefreshIdentificationList == true) {
    if (Math.round($(this).scrollTop()) >= limit * 0.75) {
      CanRefreshIdentificationList = false;
      console.log("Get Identification on Server");
      console.log("IdentificationListCurrentIndex : " + IdentificationListCurrentIndex);
      let data_Identification_scroll = {
        PrivateId: privateIDAccount,
        Index: IdentificationListCurrentIndex,
        follow_list: true
      };
      if (current_page == "my-account" || current_page == "home") {
        data_Identification_scroll.PrivateId = window.localStorage.getItem("user_private_id");
      } else {
        data_Identification_scroll.PrivateId = privateIDAccount;
      }
      console.log("t'es dans le scroll des identification");
      ServerManager.GetFollowingOfUser(data_Identification_scroll);
    }
  }
});


function UpdateIdentificationList(data, follow_list, search) {
  console.log("updating Identification list...");
  // console.log(data.Data);
  if (Array.isArray(data)) {
    //$(".popup_Identification_container").html("");
    setTimeout(function () {
      if ($(".loading_tl")) $(".loading_tl").remove();
      if (IdentificationListCurrentIndex == 0) {
        $(".popup_identification_container")[0].innerHTML = "";
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".popup_identification_container")[0].appendChild(loading_tl);
      }
      for (let i = 0; i < data.length; i++) {
        let user = new block_user(follow_list, "identification", data[i]);
        all_users_block.push(user);
      }
      if ($(".loading_tl")) $(".loading_tl").remove();
      console.log("user updated !");
      pullToRefreshEnd();
      let search_lenght;
      if (search == "yes_search") {
        search_lenght = 5;
      } else {
        search_lenght = 10;
        IdentificationListCurrentIndex++;
      }
      if (data.length < search_lenght) {
        CanRefreshIdentificationList = false;
        let tick_tl = document.createElement("div");
        tick_tl.className = "tick_icon";
        $(".popup_identification_container")[0].appendChild(tick_tl);
      } else {
        CanRefreshIdentificationList = true;
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".popup_identification_container")[0].appendChild(loading_tl);
      }
    }, 500);
  } else {
    StopRefreshTL();
  }
}