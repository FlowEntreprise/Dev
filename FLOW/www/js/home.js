
var ptrContent = $$('.pull-to-refresh-content');
// Add 'refresh' listener on it
ptrContent.on('ptr:refresh', function (e) {
  // Emulate 2s loading
  console.log("refreshing...");
  stopAllBlocksAudio();
  TLCurrentIndex = 0;
  ServerManager.GetTimeline(0);
  ServerManager.GetStory();
});


ptrContent.on('ptr:pullstart', function (e) {
  console.log("pull start");
  $("#ptr_arrow").css("opacity", "1");

});

ptrContent.on('ptr:pullend', function (e) {
  console.log("pull end");
  $("#ptr_arrow").css("opacity", "0");
});
$(".fhome-btn").on("click", function () {
  // var home_scrolling = false;
  if (current_page == "home") {
    let element = document.getElementById("tab1");
    // element.onscroll = function() {
    //     home_scrolling = true;
    // };
    let last_scrollTop = element.scrollTop;
    const scrollToTop = () => {
      const c = element.scrollTop;
      if (c > 0 && c <= last_scrollTop) {
        window.requestAnimationFrame(scrollToTop);
        element.scrollTo(0, c - c / 8);
        last_scrollTop = c;
      }
    };
    scrollToTop();
  }
});

function pullToRefreshEnd() {
  console.log("refreshed !");
  $("#ptr_arrow").css("opacity", "0");
  app.pullToRefreshDone();
}

let CanRefreshTL = true;
let TLCurrentIndex = 0;
$("#tab1").scroll(function () {
  var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
  if (CanRefreshTL == true) {
    if (Math.round($(this).scrollTop()) >= limit * 0.75) {
      CanRefreshTL = false;
      console.log("Get Flow on Server");
      console.log("TLCurrentIndex : " + TLCurrentIndex);
      ServerManager.GetTimeline(TLCurrentIndex);
    }
  }
});


function PopFlow(data, LinkBuilder) {
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
  // console.log(profilePicLink);
  // console.log(image_link);
  let block_params = {
    parent_element: $(".list-block"),
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

function UpdateTimeline(data) {
  console.log("updating timeline...");
  stopAllBlocksAudio();
  // console.log(data.Data);
  if (Array.isArray(data.Data)) {
    setTimeout(function () {
      if ($(".loading_tl")) $(".loading_tl").remove();
      if (TLCurrentIndex == 0) {
        $(".list-block")[0].innerHTML = "";
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".list-block")[0].appendChild(loading_tl);
      }
      for (let i = 0; i < data.Data.length; i++) {
        PopFlow(data.Data[i], data.LinkBuilder);
      }
      if ($(".loading_tl")) $(".loading_tl").remove();
      console.log("timeline updated !");
      pullToRefreshEnd();
      TLCurrentIndex++;
      if (data.Data.length < 5) {
        CanRefreshTL = false;
        let tick_tl = document.createElement("div");
        tick_tl.className = "tick_icon";
        $(".list-block")[0].appendChild(tick_tl);
      } else {
        CanRefreshTL = true;
        let loading_tl = document.createElement("div");
        loading_tl.className = "loading_circle loading_tl";
        $(".list-block")[0].appendChild(loading_tl);
      }
    }, 500);
  } else {
    StopRefreshTL();
  }
}

function StopRefreshTL() {
  if ($(".loading_tl")) $(".loading_tl").remove();
  CanRefreshTL = false;
  CanRefreshFollowList = false;
  pullToRefreshEnd();
}

$(".finput_comment").focus(function () {
  console.log("an input was focused");
  // DisableImmersiveMode();
});

$(".finput_comment").blur(function () {
  console.log("an input was out focused");
  // EnableImmersiveMode();
});

function DisableImmersiveMode() {
  // setTimeout(function () {
  // StatusBar.show();
  // StatusBar.overlaysWebView(true);
  // StatusBar.backgroundColorByHexString('#00000000');
  // StatusBar.styleDefault();
  // console.log("reset status bar");
  console.log("Exit Immersive Mode");
  // $(".ftop_bar")[0].style.opacity = 0;
  setTimeout(function () {
    _root.style.setProperty("--custom-vh2", 3.7 * _myvar + "px");
  }, 50);
  AndroidFullScreen.showSystemUI(successFunction, errorFunction);
  StatusBar.styleDefault();
  // }, 100);

}

function EnableImmersiveMode() {
  // setTimeout(function () {
  // StatusBar.show();
  // StatusBar.overlaysWebView(true);
  // StatusBar.backgroundColorByHexString('#00000000');
  // StatusBar.styleDefault();
  // console.log("reset status bar");
  console.log("Enable Immersive Mode");
  // $(".ftop_bar")[0].style.opacity = 0;
  setTimeout(function () {
    _root.style.setProperty("--custom-vh2", "0px");
  }, 50);
  AndroidFullScreen.setSystemUiVisibility(AndroidFullScreen.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | AndroidFullScreen.SYSTEM_UI_FLAG_LAYOUT_STABLE, successFunction, errorFunction);
  StatusBar.styleDefault();
  // }, 100);

}

$("#target").focus(function () {
  console.log("Handler for .focus() called.");
});

function successFunction() {
  let d = new Date();
  console.log("end_time : " + d.getMilliseconds);
  console.info("It worked!");
  // setTimeout(function () {
  //   // $(".ftop_bar")[0].style.opacity = 1;
  //   // StatusBar.overlaysWebView(true);

  // }, 200);
}

function errorFunction(error) {
  console.error(error);
}

function trace(value) {
  console.log(value);
}
var _root = document.documentElement;
var _myvar = window.innerHeight / 100;
_root.style.setProperty("--custom-vh", _myvar + "px");
_root.style.setProperty("--custom-vh2", "0px");    
