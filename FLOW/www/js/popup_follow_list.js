var all_users_block = [];
var my_followers;
//block qui correspond à utilisateur de la liste des followers et follwing
function block_user(follow_list, data) //follow_list true correspond au block user de la liste des utilisateur que l'on peu identifier dans un commentaire
{
  var block_user = this; //
  let src_profile_img = 'https://api.flowappweb.com:/images/' + data.ProfilPicture.name + '?';
  let param_profile_img = `${"qr"}=${data.ProfilPicture.hash}&${"rx"}=${data.ProfilPicture.timestamp}`;
  let profilePicLink = src_profile_img + param_profile_img;

  this.block_user = document.createElement('div');
  follow_list == false ? this.block_user.className = 'f_block_user' : this.block_user.className = 'f_block_user_tag';
  $(".flow_follow_list_container").append(this.block_user);

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

    this.f_user_bio = document.createElement('label'); //bio
    this.f_user_bio.className = 'f_user_bio';
    this.f_user_bio.innerText = data.Bio;
    this.block_user.appendChild(this.f_user_bio);

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
      $(this.following_button).text("FOLLOWING");
    } else {
      $(this.following_button).removeClass("activeButtunFollow");
      this.following_button.innerText = "Follow";
    }
    this.block_user.appendChild(this.following_button);
  }

  if (data.HeFollowYou == "true" && my_followers == false) {
    this.follow_you_button = document.createElement('img');
    this.follow_you_button.src = "src/icons/follow_you.png";
    this.follow_you_button.className = "follow_you_icon";
    this.block_user.appendChild(this.follow_you_button);
  }


}

//click affichage followers
$("#ffollowersBandeau,#ffollowersmyBandeauChiffre,#ffollowersBandeauChiffre").on('click', function (event) {
  $(".popup_follow_list_title").text("Followers");  
  $(".flow_follow_list_container").html("");
  var target = $( event.target );
  if ( target.is( "#ffollowersmyBandeauChiffre" ) ) {
    my_followers = true;
  }
  else
  {
    my_followers = false;
  }
  var data_followers = {
    PrivateId: privateIDAccount,
    Index: 0
  };
  if (current_page == "my-account") {

    data_followers.PrivateId = window.localStorage.getItem("user_private_id");
  }
  ServerManager.GetFollowerOfUser(data_followers);
  Popup("popup-follow-list", true, 30);

});

//click affichage following
$("#ffollowingBandeau,#ffollowingmyBandeauChiffre,#ffollowingBandeauChiffre").on('click', function () { //
  $(".popup_follow_list_title").text("Followings");
  $(".flow_follow_list_container").html("");  
  var data_following = {
    PrivateId: privateIDAccount,
    Index: 0
  };
  if (current_page == "my-account") {

    data_following.PrivateId = window.localStorage.getItem("user_private_id");
  }
  ServerManager.GetFollowingOfUser(data_following);
  Popup("popup-follow-list", true, 30);

});


let CanRefreshFollowList = true;
let FollowListCurrentIndex = 0;
$(".flow_follow_list_container").scroll(function () {
  var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
  if (CanRefreshFollowList == true) {
    if (Math.round($(this).scrollTop()) >= limit * 0.75) {
      CanRefreshFollowList = false;
      console.log("Get followers on Server");
      console.log("FollowListCurrentIndex : " + FollowListCurrentIndex);
      ServerManager.GetFollowerOfUser(FollowListCurrentIndex);
      ServerManager.GetFollowingOfUser(FollowListCurrentIndex);
    }
  }
});


function UpdateUsersList(data) {
  console.log("updating users list...");
  // console.log(data.Data);
  if (Array.isArray(data)) {
    setTimeout(function () {
      if ($(".loading_tl")) $(".loading_tl").remove();
      if (FollowListCurrentIndex == 0) {
        $(".flow_follow_list_container")[0].innerHTML = "";
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".flow_follow_list_container")[0].appendChild(loading_tl);
      }
      for (let i = 0; i < data.length; i++) {
        let user = new block_user(false, data[i]);
        all_users_block.push(user);
      }
      if ($(".loading_tl")) $(".loading_tl").remove();
      console.log("timeline updated !");
      pullToRefreshEnd();
      FollowListCurrentIndex++;
      if (data.length < 11) {
        CanRefreshFollowList = false;
        let tick_tl = document.createElement("div");
        tick_tl.className = "tick_icon";
        $(".flow_follow_list_container")[0].appendChild(tick_tl);
      } else {
        CanRefreshFollowList = true;
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".flow_follow_list_container")[0].appendChild(loading_tl);
      }
    }, 500);
  } else {
    StopRefreshTL();
  }
}