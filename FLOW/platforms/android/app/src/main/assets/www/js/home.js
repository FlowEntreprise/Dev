var ptrContent = $$('.pull-to-refresh-content');
// Add 'refresh' listener on it
ptrContent.on('ptr:refresh', function (e) {
  // Emulate 2s loading
  console.log("refreshing...")
  setTimeout(function () {
    // When loading done, we need to reset it
    console.log("refreshed !");
    $("#ptr_arrow").css("opacity", "0");
    app.pullToRefreshDone();
    // Socket.client.send("Flow", "GetFlowById", "5c98edb4939cf639919d0aba"); --OLD
    ServerManager.GetFlowById("5cd89b7802e2bf07d888ada5");
    RefreshStories();
    // var new_block = new block($(".list-block"), false, null, 89);
    // all_blocks.push(new_block);
  }, 1000);
});

ptrContent.on('ptr:pullstart', function (e) {
  console.log("pull start");
  $("#ptr_arrow").css("opacity", "1");

});

ptrContent.on('ptr:pullend', function (e) {
  console.log("pull end");
  $("#ptr_arrow").css("opacity", "0");
});

/******************************* TO DELETE **************************/


function PopFlow(data) {
  var image_link = undefined;
  var pattern_key = undefined;
  if (data.Background.PatternKey == undefined) {
    const src_img = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.Background.name + '?';
    const param_img = `${data.LinkBuilder.Params.hash}=${data.Background.hash}&${data.LinkBuilder.Params.time}=${data.Background.timestamp}`;
    image_link = src_img + param_img;
  } else {
    pattern_key = data.Background.PatternKey;
  }

  const src_flow = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/flows/' + data.Audio.name + '?';
  const param_flow = `${data.LinkBuilder.Params.hash}=${data.Audio.hash}&${data.LinkBuilder.Params.time}=${data.Audio.timestamp}`;
  const flow_link = src_flow + param_flow;

  const src_profile_img = 'http://' + data.LinkBuilder.Hostname + ':' + data.LinkBuilder.Port + '/images/' + data.ProfilPicture.name + '?';
  const param_profile_img = `${data.LinkBuilder.Params.hash}=${data.ProfilPicture.hash}&${data.LinkBuilder.Params.time}=${data.ProfilPicture.timestamp}`;
  var profilePicLink = src_profile_img + param_profile_img;
  console.log(profilePicLink);
  console.log(image_link);
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
    account_imageURL: profilePicLink
  };
  var new_block = new block(block_params);
  all_blocks.push(new_block);


  // var new_block_top50 = new block($("#top50"), false, flow_link, data.Duration, pattern_key, image_link, data.Title, data.Description, data.Pseudo, profilePicLink);
  // all_blocks.push(new_block_top50);

  // var new_block_sport = new block($("#sport"), false, flow_link, data.Duration, pattern_key, image_link, data.Title, data.Description, data.Pseudo, profilePicLink);
  // all_blocks.push(new_block_sport);

  // var new_block_music = new block($("#music"), false, flow_link, data.Duration, pattern_key, image_link, data.Title, data.Description, data.Pseudo, profilePicLink);
  // all_blocks.push(new_block_music);



  console.log("Pop Flow");
  console.log(new_block);
}
/* 
**************** RECUPERER FLOW AUDIO FROM BASE64 *********************

base64string = "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";
var contentType = 'audio/opus';
var blob = b64toBlob(base64string, contentType);
var blobUrl = URL.createObjectURL(blob);

playSound(blobUrl);

function playSound(url) {
    var a = new Audio(url);
    a.play();
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
 */
/********************************************************************/
$("input").focus(function() {
  console.log("an input was focused");
  DisableImmersiveMode();
});

$("input").blur(function() {
  console.log("an input was out focused");
  EnableImmersiveMode();
});

function DisableImmersiveMode() {
  // setTimeout(function () {
    // StatusBar.show();
    // StatusBar.overlaysWebView(true);
    // StatusBar.backgroundColorByHexString('#00000000');
    // StatusBar.styleDefault();
    // console.log("reset status bar");
    console.log("Exit Immersive Mode");
    AndroidFullScreen.showSystemUI(successFunction, errorFunction);
    setTimeout(function () {
      AndroidFullScreen.showUnderStatusBar(successFunction, errorFunction);
    }, 500);
    StatusBar.styleDefault();
    _root.style.setProperty("--custom-vh2", 3 *_myvar + "px");
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
    AndroidFullScreen.setSystemUiVisibility(AndroidFullScreen.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | AndroidFullScreen.SYSTEM_UI_FLAG_LAYOUT_STABLE, successFunction, errorFunction);
    StatusBar.styleDefault();
    _root.style.setProperty("--custom-vh2", "0px");
  // }, 100);

}

$( "#target" ).focus(function() {
  alert( "Handler for .focus() called." );
});

function successFunction() {
  console.info("It worked!");
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
