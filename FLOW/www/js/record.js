var record_was_hold = false;
var recording = false;
var record_time = 0;

var start_time;
var after_record_initialised = false;

var new_block;

var pictureSource;
var destinationType;

var image64;
var patternKey;
var blob;
var audioURL;

let options = {
	quality: 75,
	widthRatio: 1,
	heightRatio: 1,
	targetWidth: 600,
	targetHeight: 600,
};

$$(".fflow-btn").on("click", function () {
	if (connected) {
		Popup("popup-record", true);
		$$(".frecord-btn").css({
			display: "flex",
		});
	} else {
		Popup("popup-connect", true, 60);
	}
});
$$(".fflow-btn").on("taphold", function () {
	if (connected) {
		console.log("Hold Record !");
		// app.popup('.popup-record');
		Popup("popup-record", true);
		$$(".frecord-btn").css({
			display: "flex",
		});
		$(".record-shadow")[0].style.display = "block";
		record_was_hold = true;
		startCapture();
	} else {
		Popup("popup-connect", true, 60);
	}
});
$$(".frecord-btn").on("taphold", function () {
	if (!recording && !record_was_hold) {
		console.log("Hold Record !");
		record_was_hold = true;
		startCapture();
	}
});
document.getElementById("popup-record").addEventListener("opened", function () {
	stopAllBlocksAudio();
	$$("#flow_number_of_sec").text("00");
	if (!debug_record) {
		pictureSource = navigator.camera.PictureSourceType;
		destinationType = navigator.camera.DestinationType;
	}
	let time_in_last_screen =
		Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
	facebookConnectPlugin.logEvent(
		"current_page", {
		page: current_page,
		duration: time_in_last_screen,
	},
		null,
		function () {
			console.log("fb current_page event success");
		},
		function () {
			console.log("fb current_page error");
		}
	);
	last_currentpage_timestamp = Math.floor(Date.now() / 1000);
	current_page = "record";

	// analytics.setCurrentScreen(current_page);

	$$(".frecord-btn").css({
		display: "flex",
	});
	$(".record-shadow")[0].style.display = "block";
	if (record_was_hold) {
		// $$('.frecord-btn').addClass('frecord-btn-active');
	}

	current_page = "record";
	facebookConnectPlugin.logEvent(
		"open_record", {},
		null,
		function () {
			console.log("fb event success");
		},
		function () {
			console.log("fb event error");
		}
	);
});
document.getElementById("popup-record").addEventListener("closed", function () {
	$$(".frecord-btn").css({
		display: "none",
	});
	$(".record-shadow")[0].style.display = "none";
	// stopCapture();
	let time_in_last_screen =
		Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
	facebookConnectPlugin.logEvent(
		"current_page", {
		page: current_page,
		duration: time_in_last_screen,
	},
		null,
		function () {
			console.log("fb current_page event success");
		},
		function () {
			console.log("fb current_page error");
		}
	);
	last_currentpage_timestamp = Math.floor(Date.now() / 1000);
	current_page = "home";

	// analytics.setCurrentScreen(current_page);

	record_was_hold = false;
	$(".frecord-btn")[0].classList.remove("frecord_loading_btn");
});

document
	.getElementById("popup-after-record")
	.addEventListener("opened", function () {
		image64 = null;
		all_tagged_users.length = 0;
		$(".fvalidate-after_btn.record")[0].style.pointerEvents = "auto";
		$(".fvalidate-after_btn.record")[0].setAttribute("style", "");
		$(".floading-spinner.loading-record-flow")[0].style.display = "none";
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
			page: current_page,
			duration: time_in_last_screen,
		},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		current_page = "after-record";

		// analytics.setCurrentScreen(current_page);
	});

document
	.getElementById("popup-after-record")
	.addEventListener("closed", function () {
		stopAllBlocksAudio();
		$(".fvalidate-after_btn.record")[0].style.pointerEvents = "auto";
		$(".fvalidate-after_btn.record")[0].setAttribute("style", "");
		$(".floading-spinner.loading-record-flow")[0].style.display = "none";
		record_was_hold = false;
		image64 = null;
		all_tagged_users.length = 0;
	});

document
	.getElementById("popup-after-story-record")
	.addEventListener("opened", function () {
		$(".fvalidate-after_btn.story")[0].style.pointerEvents = "auto";
		$(".fvalidate-after_btn.story")[0].setAttribute("style", "");
		$(".floading-spinner.loading-story")[0].style.display = "none";
	});
document
	.getElementById("popup-after-story-record")
	.addEventListener("closed", function () {
		stopAllBlocksAudio();
		$(".fvalidate-after_btn.story")[0].style.pointerEvents = "auto";
		$(".fvalidate-after_btn.story")[0].setAttribute("style", "");
		$(".floading-spinner.loading-story")[0].style.display = "none";
	});

// $$('.popup-story-record').on('popup:open', function () {
//     $$('.story_flow_duration').text("00");
//     current_page = "record-story";
// });
document
	.getElementById("popup-story-record")
	.addEventListener("opened", function () {
		stopAllBlocksAudio();
		$$(".story_flow_duration").text("00");
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
			page: current_page,
			duration: time_in_last_screen,
		},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		current_page = "record-story";

		// analytics.setCurrentScreen(current_page);
	});

$(".fclose_record")[0].addEventListener("touchend", function () {
	if (recording) {
		console.log("stop recording");
		stopCapture(false);
	}
	Popup("popup-record", false);
	$(".frecord-btn")[0].classList.remove("frecord_loading_btn");
});

$(".fclose_story_record")[0].addEventListener("touchend", function () {
	if (recording) {
		console.log("stop recording");
		stopCapture(false);
	}
	Popup("popup-story-record", false);
	$(".frecord-btn")[0].classList.remove("frecord_loading_btn");
});

$$(".frecord-btn").on("click", function () {
	if (recording) {
		console.log("stop recording");
		// if (record_time > 2) {
		//     stopCapture(true);
		// } else {
		//     stopCapture(false);
		// }
		stopCapture(true);
	} else if (!record_was_hold) {
		console.log("start recording");
		startCapture();
	}
});

$$("body").on("touchend", function () {
	if (recording && record_was_hold) {
		// if (record_time > 2) {
		//     stopCapture(true);
		// } else {
		//     stopCapture(false);
		// }
		stopCapture(true);
	}
});

$$(".frestart-after_btn").on("touchend", function () {
	console.log("restart record");
	record_was_hold = false;
	if (current_page == "after-record") {
		// app.closeModal('.popup-after-record');
		Popup("popup-after-record", false);
		// app.popup('.popup-record');
		Popup("popup-record", true);

		facebookConnectPlugin.logEvent(
			"restart_record_flow", {},
			null,
			function () {
				console.log("fb event success");
			},
			function () {
				console.log("fb event error");
			}
		);
	} else {
		closeStoryRecord();
		// app.popup('.popup-story-record');
		Popup("popup-story-record", true);

		facebookConnectPlugin.logEvent(
			"restart_record_story", {},
			null,
			function () {
				console.log("fb event success");
			},
			function () {
				console.log("fb event error");
			}
		);
	}
});

$$(".fcancel-after_btn").on("touchend", function () {
	if (current_page == "after-record") {
		Popup("popup-after-record", false);
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
			page: current_page,
			duration: time_in_last_screen,
		},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		current_page = "home";

		// analytics.setCurrentScreen(current_page);
	} else {
		Popup("popup-after-story-record", false);
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
			page: current_page,
			duration: time_in_last_screen,
		},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		current_page = "home";

		// analytics.setCurrentScreen(current_page);
	}
});

$$(".fvalidate-after_btn").on("touchend", function () {
	if (current_page == "after-record") {
		if ($(".finput_description").val().replace(/\s+/g, "").length > 0) {
			var data = {
				PrivatedId: window.localStorage.getItem("user_private_id"),
				Title: "",
				Image: image64 ? image64 : patternKey,
				Description: $(".finput_description").val(),
				Tags: [],
				Sound: appState.blob64,
				Duration: record_time,
				Time: "0",
			};
			console.log(data);
			// Socket.client.send("Flow", "AddFlow", data); --OLD
			// floading-spinner loading-record-flow
			$(".fvalidate-after_btn.record")[0].style.pointerEvents = "none";
			$(".fvalidate-after_btn.record")[0].setAttribute(
				"style",
				"background: linear-gradient(to bottom, #1A84EF, #FF0054)"
			);
			$(".floading-spinner.loading-record-flow")[0].style.display = "block";
			setTimeout(function () {
				console.log("add flow");
				console.log(data);
				ServerManager.AddFlow(data, all_tagged_users);
				/* TEST CHRIS*/
				let DataFirebase = {
					content: blob64,
					name: Date.now(),
					chat_id: current_block_chat.chat_id
				};
				//ServerManager.UploadAudioToFirebase(DataFirebase);
				let sayHello = firebase.functions().httpsCallable('UploadVoiceNote');
				sayHello({
					FirebaseEnvironment: FirebaseEnvironment,
					time: Date.now(),
					sound: blob64
				});
				/* FIN TEST CHRIS*/

				facebookConnectPlugin.logEvent(
					"record_flow", {
					// private_id: data.PrivatedId,
					// description: data.Description,
					duration: data.Duration,
				},
					null,
					function () {
						console.log("fb record flow event success");
					},
					function () {
						console.log("fb record flow event error");
					}
				);
			}, 100);
			image64 = null;
			patternKey = null;
		} else {
			//alert("La description d'un Flow ne peut pas être vide");
			navigator.notification.alert(
				"La description d'un Flow ne peut pas être vide",
				alertDismissed,
				"Information"
			);
			$(".finput_description").focus();
		}
	} else {
		let storydata = {
			PrivatedId: window.localStorage.getItem("user_private_id"),
			Sound: appState.blob64,
			Duration: record_time,
			Color: last_story_color,
			Time: "0",
		};
		console.log("Send story to server");
		$(".fvalidate-after_btn.story")[0].style.pointerEvents = "none";
		$(".fvalidate-after_btn.story")[0].setAttribute(
			"style",
			"background: linear-gradient(to bottom, #1A84EF, #FF0054)"
		);
		$(".floading-spinner.loading-story")[0].style.display = "block";

		setTimeout(function () {
			ServerManager.AddStory(storydata);

			facebookConnectPlugin.logEvent(
				"upload_story", {
				duration: storydata.Duration,
			},
				null,
				function () {
					console.log("fb event success");
				},
				function () {
					console.log("fb event error");
				}
			);
		}, 100);
	}
});

$$(".fcamera-after").on("click", function () {
	TakePhoto(onPhotoDataSuccess);
});
$$(".fgallery-after").on("click", function () {
	GetPhotoFromGallery();
});

function UpdateRecordIndicator() {
	record_time = (Date.now() - start_time) / 1000;
	if (current_page == "record") {
		$$("#flow_number_of_sec").text(format(Math.round(record_time)));
	} else if (current_page == "record-story") {
		$$("#flow_story_number_of_sec").text(format(Math.round(record_time)));
	}

	if (recording && record_time <= 15) {
		setTimeout(function () {
			if (recording) {
				let value = Math.round(6.73 * record_time);
				if (current_page == "record" || current_page == "record-story") {
					$$(".frecord_indicator").css({
						"stroke-dasharray": value + " 100",
					});
				} else if (current_page == "story") {
					let css =
						"rgba(0, 0, 0, 0) conic-gradient(white 0deg, white " +
						value +
						"%, transparent 0deg, transparent 100%) repeat scroll 0% 0% / auto padding-box border-box";
					$(".fstory_addcomment_loading").css({
						opacity: 0.5,
						background: css,
					});
				}
				UpdateRecordIndicator();
			}
		}, 100);
	} else {
		stopCapture(true);
	}
}

function CloseAfterRecord() {
	// app.closeModal('.popup-after-record');
	Popup("popup-after-record", false);
	let time_in_last_screen =
		Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
	facebookConnectPlugin.logEvent(
		"current_page", {
		page: current_page,
		duration: time_in_last_screen,
	},
		null,
		function () {
			console.log("fb current_page event success");
		},
		function () {
			console.log("fb current_page error");
		}
	);
	last_currentpage_timestamp = Math.floor(Date.now() / 1000);
	current_page = "home";

	// analytics.setCurrentScreen(current_page);

	TLCurrentIndex = 0;
	ServerManager.GetTimeline(0);
}

function PlayRipple(element, className) {
	element.removeClass(className);
	setTimeout(function () {
		element.addClass(className);
	}, 10);
}

function format(number) {
	return number < 10 ? "0" + number.toString() : number.toString();
}

$$(".frecord-btn").on("touchstart", function () {
	PlayRipple($$(this), "fripple-record");
});

$$(".fflow-btn").on("touchstart", function () {
	PlayRipple($$(this), "fripple-record");
});

function Save(blob) {
	// blob = wavblob.slice(0, wavblob.size, "audio/opus; codecs=opus");
	$(".frecord-btn")[0].classList.remove("frecord_loading_btn");
	// worker.terminate();

	// var audioURL = window.URL.createObjectURL(blob);

	console.log("current page : " + current_page);

	if (current_page == "record") {
		Popup("popup-record", false);
		Popup("popup-after-record", true);

		if (!after_record_initialised) {
			var mySwiper4 = app.swiper(".swiper-4", {
				pagination: ".swiper-4 .swiper-pagination",
				spaceBetween: 0,
				slidesPerView: 3,
			});

			mySwiper4.on("slideChangeStart", function () {
				var target = "#" + $(".swiper-slide-next").attr("target");
				app.showTab(target);
			});
			after_record_initialised = true;
			let time_in_last_screen =
				Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
			facebookConnectPlugin.logEvent(
				"current_page", {
				page: current_page,
				duration: time_in_last_screen,
			},
				null,
				function () {
					console.log("fb current_page event success");
				},
				function () {
					console.log("fb current_page error");
				}
			);
			last_currentpage_timestamp = Math.floor(Date.now() / 1000);
			current_page = "after-record";
			console.log("after record");

			// analytics.setCurrentScreen(current_page);
		}
		$(".after-record-block-container").html("");
		let block_params = {
			parent_element: $(".after-record-block-container"),
			afterblock: true,
			audioURL: audioURL,
			duration: record_time,
			patternKey: null,
			imageURL: null,
			title: "",
			description: "",
			pseudo: window.localStorage.getItem("user_name"),
			account_imageURL: window.localStorage.getItem("user_profile_pic"),
		};
		new_block = new block(block_params);
		all_blocks.push(new_block);
		// $(".frandom-color-btn").on("touchend", function() {new_block.randomColorGradient()});
		patternKey = new_block.patternKey;
		appState.patternKey = patternKey;
		appState.recordTime = record_time;
		appState.blob = blob;
		// appState.flow_title = $(".finput_title").val();
		appState.flow_description = $(".finput_description").val();
		var reader = new FileReader();
		reader.readAsDataURL(blob);


		reader.onloadend = function () {
			blob64 = reader.result;
			appState.blob64 = reader.result.replace("data:audio/wav;base64,", "");
			// appState.blob64 = reader.result;
			//console.log(appState.blob64);
		};

		setTimeout(() => {
			new_block.finput_description.focus();
			console.log(new_block.finput_description);
			new_block.finput_description.addEventListener("blur", function () {
				if (in_identification) {
					$(".after-record-block-container").css("margin-top", "-30vh");
				}
			});
		}, 500);
	} else if (current_page == "record-story") {
		Popup("popup-story-record", false);
		Popup("popup-after-story-record", true);
		$(".after-story-record-block-container").html("");
		let block_params = {
			parent_element: $(".after-story-record-block-container"),
			afterblock: true,
			audioURL: audioURL,
			duration: record_time,
			patternKey: null,
			imageURL: null,
			title: "",
			description: "",
			pseudo: window.localStorage.getItem("user_name"),
			account_imageURL: window.localStorage.getItem("user_profile_pic"),
			storyAfterBlock: true,
		};
		new_block = new block(block_params);
		all_blocks.push(new_block);
		patternKey = new_block.patternKey;
		appState.patternKey = patternKey;
		appState.recordTime = record_time;
		appState.blob = blob;
		// appState.flow_title = $(".finput_title").val();
		appState.flow_description = $(".finput_description").val();
		let time_in_last_screen =
			Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
		facebookConnectPlugin.logEvent(
			"current_page", {
			page: current_page,
			duration: time_in_last_screen,
		},
			null,
			function () {
				console.log("fb current_page event success");
			},
			function () {
				console.log("fb current_page error");
			}
		);
		last_currentpage_timestamp = Math.floor(Date.now() / 1000);
		current_page = "after-story-record";

		// analytics.setCurrentScreen(current_page);

		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			blob64 = reader.result;
			appState.blob64 = reader.result.replace("data:audio/wav;base64,", "");
			// appState.blob64 = reader.result;
			console.log(appState.blob64);
		};

		setTimeout(() => {
			new_block.finput_description.focus();
		}, 500);
	} else if (current_page == "story") {
		console.log("recorded story comment");
		// $(".fstory_addcomment_confirmation")[0].style.opacity = 1;
		// $(".fstory_addcomment_btn")[0].style.opacity = 0;
		// $(".fstory_addcomment_btn")[0].style.backgroundImage = "url(\"src/icons/Record.png\")";
		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			blob64 = reader.result;
			appState.blob64 = reader.result.replace("data:audio/wav;base64,", "");
			console.log(appState.blob64);

			let story_comment = {
				ObjectId: story_data[story_index].data[storyFlow_index].id,
				// PrivatedId: window.localStorage.getItem("user_private_id"),
				Sound: appState.blob64,
				Duration: record_time,
			};

			console.log(story_comment);
			console.log("Send story comment to server");

			ServerManager.AddStoryComment(story_comment);

			// analytics.logEvent("upload_story_comment", {
			//     private_id: story_comment.PrivatedId,
			//     duration: story_comment.Duration
			// });

			facebookConnectPlugin.logEvent(
				"upload_story_comment", {
				duration: story_comment.Duration,
			},
				null,
				function () {
					console.log("fb record sotry comment event success");
				},
				function () {
					console.log("fb record sotry comment error");
				}
			);
		};

		// $(".fstory_addcomment_cancel")[0].style.opacity = 0.5;
		// $(".fstory_addcomment_cancel")[0].style.pointerEvents = "none";
		// $(".fstory_addcomment_confirm")[0].style.pointerEvents = "none";
		$(".fstory_addcomment_btn")[0].style.backgroundImage =
			'url("src/icons/loading_circle.gif")';
		$(".fstory_addcomment_btn")[0].style.pointerEvents = "none";
		// $(".fstory_addcomment_confirmation")[0].style.opacity = 0;
		// $(".fstory_addcomment_btn")[0].style.opacity = 1;
	}
}

function precisionRound(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

var siriWave = new SiriWaveRecord({
	container: document.getElementById("wave-container"),
	width: 300,
	height: 300,
	style: "ios",
	color: "1A84EF",
	cover: true,
	lerpSpeed: 1,
	story: false,
});
siriWave.start();
siriWave.speed = 0;
siriWave.amplitude = 0;

var siriWaveStory = new SiriWaveRecord({
	container: $(".story-record-wave")[0],
	width: 300,
	height: 300,
	style: "ios",
	color: "1A84EF",
	cover: true,
	lerpSpeed: 1,
	story: false,
});
siriWaveStory.start();
siriWaveStory.speed = 0;
siriWaveStory.amplitude = 0;

////////////////////////////////////////////////////////////////

function Lerp(value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
}
var smoothVolume = 0;
var smoothValue = 0;
var sound_data = [];

function drawCurveAnim() {
	if (sound_data.length > 0) {
		let length = 255;
		let total = 0;
		for (var i = 0; i < length; i++) {
			let val = Math.abs(sound_data[i]) * 3270;
			if (val > 1) {
				total += val;
			}
		}
		var average = Math.min(30, total / length);
		var smoothValue = average;
		if (smoothValue < average) {
			smoothValue += 3;
		} else if (smoothValue > average) {
			smoothValue -= 1.5;
		}
		smoothValue = Math.max(2, smoothValue);
		smoothVolume = Lerp(smoothVolume, smoothValue, 0.25);
		// $$('#flow_number_of_sec').text(Math.round(smoothVolume));
		if (current_page == "record") {
			if (recording) {
				if (window.cordova.platformId == "android") {
					siriWave.amplitude = Math.round(smoothVolume) * 0.02 + 0.1;
					siriWave.speed = 0.2;
				} else {
					siriWave.amplitude = Math.round(smoothVolume) * 0.015 + 0.1;
					siriWave.speed = 0.16;
				}
			} else {
				siriWave.amplitude = 0;
				siriWave.speed = 0;
			}
		} else {
			if (recording) {
				if (window.cordova.platformId == "android") {
					siriWaveStory.amplitude = Math.round(smoothVolume) * 0.02 + 0.1;
					siriWaveStory.speed = 0.2;
				} else {
					siriWaveStory.amplitude = Math.round(smoothVolume) * 0.015 + 0.1;
					siriWaveStory.speed = 0.16;
				}
			} else {
				siriWaveStory.amplitude = 0;
				siriWaveStory.speed = 0;
			}
		}
	}

	requestAnimationFrame(drawCurveAnim);
}

drawCurveAnim();

function TakePhoto(callback) {
	console.log("take photo");
	if (window.cordova.platformId == "android") {
		var permissions = cordova.plugins.permissions;
		var list = [
			permissions.CAMERA,
			//permissions.WRITE_EXTERNAL_STORAGE
		];

		function error() {
			//alert('Permission photo non acordée');
			navigator.notification.alert(
				"Permission photo non acordée",
				alertDismissed,
				"Information"
			);
		}

		function success(status) {
			if (!status.hasPermission) error();
			else {
				//alert("success");
				capturePhoto(callback);
			}
		}

		permissions.hasPermission(permissions.CAMERA, function (status) {
			if (status.hasPermission) {
				//alert("success");
				capturePhoto(callback);
			} else {
				permissions.requestPermissions(list, success, error);
			}
		});
	} else {
		capturePhoto(callback);
		if (window.localStorage.getItem("ios_photos_init") != "true") {
			$(".ios_camera_auth")[0].style.display = "block";
		}
	}
}

function GetPhotoFromGallery(is_profile_picture) {
	console.log("get photo from gallery");
	if (window.cordova.platformId == "android") {
		var permissions = cordova.plugins.permissions;
		var list = [permissions.READ_EXTERNAL_STORAGE];

		function error() {
			//alert('Permission galerie photo non accordée');
			navigator.notification.alert(
				"Permission galerie photo non accordée",
				alertDismissed,
				"Information"
			);
		}

		function success(status) {
			if (!status.hasPermission) error();
			else {
				//alert("success");
				getPhoto(is_profile_picture);
			}
		}

		permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function (
			status
		) {
			if (status.hasPermission) {
				//alert("success");
				getPhoto(is_profile_picture);
			} else {
				permissions.requestPermissions(list, success, error);
			}
		});
	} else {
		getPhoto(is_profile_picture);
		if (window.localStorage.getItem("ios_photos_init") != "true") {
			$(".ios_camera_auth")[0].style.display = "block";
		}
	}
}

function onPhotoDataSuccess(imageData) {
	$(".ios_camera_auth")[0].style.display = "none";
	window.localStorage.setItem("ios_photos_init", "true");

	var options = {
		url: imageData, // required.
		ratio: "6/4", // required. (here you can define your custom ration) "1/1" for square images
		title: "Crop image", // optional. android only. (here you can put title of image cropper activity) default: Image Cropper
		autoZoomEnabled: true, // optional. android only. for iOS its always true (if it is true then cropper will automatically adjust the view) default: true
	};

	appState.takingPicture = false;
	appState.imageUri = imageData;

	window.plugins.k.imagecropper.open(
		options,
		function (data) {
			// its return an object with the cropped image cached url, cropped width & height, you need to manually delete the image from the application cache.
			console.log(data);
			//$scope.croppedImage = data;
			new_block.ftop_part.style.backgroundImage = "url('" + data.imgPath + "')";
			toDataUrl(data.imgPath, function (b64) {
				image64 = b64;
			});
		},
		function (error) {
			console.log(error);
		}
	);
	//new_block.ftop_part.style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')";
}

function capturePhoto(callback) {
	console.log("take photo");
	appState.takingPicture = true;

	// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
	navigator.camera.getPicture(callback, onFail, {
		quality: 75,
		allowEdit: false,
		destinationType: Camera.DestinationType.FILE_URI,
		correctOrientation: true, //Corrects Android orientation quirks
	});
}

function getPhoto(is_profile_picture) {
	if (is_profile_picture) {
		navigator.camera.getPicture(onProfilePhotoDataSuccess, onFail, {
			quality: 75,
			allowEdit: false,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
		});
	} else {
		// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
			quality: 75,
			allowEdit: false,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
		});
	}
}

function onFail(message) {
	appState.takingPicture = false;
	$(".ios_camera_auth")[0].style.display = "none";
	window.localStorage.setItem("ios_photos_init", "true");
	console.log(message);
	// alert('Failed because: ' + message);
}

function toDataUrl(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		var reader = new FileReader();
		reader.onloadend = function () {
			callback(reader.result);
		};
		reader.readAsDataURL(xhr.response);
	};
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.send();
}

function closeStoryRecord() {
	Popup("popup-after-story-record", false);
	let time_in_last_screen =
		Math.floor(Date.now() / 1000) - last_currentpage_timestamp;
	facebookConnectPlugin.logEvent(
		"current_page", {
		page: current_page,
		duration: time_in_last_screen,
	},
		null,
		function () {
			console.log("fb current_page event success");
		},
		function () {
			console.log("fb current_page error");
		}
	);
	current_page = "home";
	last_currentpage_timestamp = Math.floor(Date.now() / 1000);

	// analytics.setCurrentScreen(current_page);

	console.log("close story record");
	$(".frecord-btn")[0].classList.remove("frecord_loading_btn");
}

/*----------------------------------------------- */
/*-------------- NEW AUDIO RECORD --------------- */
/*----------------------------------------------- */

// Capture configuration object
var captureCfg = {};

// Audio Buffer
var audioDataBuffer = [];
/**
 * Called continuously while AudioInput capture is running.
 */
function onAudioInputCapture(evt) {
	try {
		if (evt && evt.data) {
			// Add the chunk to the buffer
			let data = Array.from(evt.data);
			audioDataBuffer = audioDataBuffer.concat(data);
			// wave(data);
			sound_data = data;
			// console.log(Array.from(evt.data));
			// wave(Array.from(evt.data));
		} else {
			console.log("Unknown audioinput event: " + JSON.stringify(evt));
		}
	} catch (ex) {
		console.log("onAudioInputCapture ex: " + ex);
	}
}

/**
 * Called when a plugin error happens.
 */
function onAudioInputError(error) {
	console.log("onAudioInputError event recieved: " + JSON.stringify(error));
}

var mediaRecorder;
/**
 * Start capturing audio.
 */
var startCapture = function () {
	// siriWave.amplitude = (20 * 0.02) + 0.1;
	// siriWave.speed = 0.2;
	try {
		if (window.audioinput && !window.audioinput.isCapturing()) {
			captureCfg = {
				sampleRate: 16000,
				bufferSize: 2048,
				concatenateMaxChunks: 10,
				// format: window.audioinput.FORMAT.PCM_16BIT,
				audioSourceType: audioinput.AUDIOSOURCE_TYPE.DEFAULT,
			};

			///////////////////////////////
			console.log("Microphone input starting...");
			recording = true;
			audioDataBuffer = [];
			start_time = Date.now();
			$$(".frecord_indicator").css({
				display: "block",
			});
			UpdateRecordIndicator();
			window.audioinput.start(captureCfg);
			$(".frecord-btn")[0].style.background =
				'url("src/icons/stop_icon.png") center center/3.5vh no-repeat, linear-gradient(#1A84EF, #FF0054)';
			console.log("Microphone input started!");
		}
	} catch (e) {
		console.log("startCapture exception: " + e);
	}
};

/**
 * Stop the capture, encode the captured audio to WAV and show audio element in UI.
 */
var stopCapture = function (save) {
	record_was_hold = false;
	$(".frecord-btn")[0].style.background =
		'url("src/icons/Record.png") center center/3.5vh no-repeat, linear-gradient(#1A84EF, #FF0054)';
	$$(".frecord_indicator").css({
		display: "none",
		"stroke-dasharray": "0 100",
	});
	$$("#flow_number_of_sec").text("00");
	$$("#flow_story_number_of_sec").text("00");

	if (current_page == "story") {
		$(".fstory_addcomment_loading")[0].style.opacity = 0;
		$(".fstory_addcomment_btn")[0].style.backgroundImage =
			'url("src/icons/loading_circle.gif")';
	}

	// try {
	if (window.audioinput && window.audioinput.isCapturing()) {
		if (window.audioinput) {
			// mediaRecorder.stop();
			window.audioinput.stop();
			recording = false;
		}
		if (save) {
			$(".frecord-btn")[0].classList.add("frecord_loading_btn");
			console.log("Encoding WAV...");
			var encoder = new WavAudioEncoder(
				window.audioinput.getCfg().sampleRate,
				window.audioinput.getCfg().channels
			);
			encoder.encode([audioDataBuffer]);
			console.log("Encoding WAV finished");
			var blob = encoder.finish("audio/wav");

			console.log("BLOB created");

			audioURL = window.URL.createObjectURL(blob);

			// EncodeOpus(blob);
			Save(blob);
		} else if (current_page == "story") {
			$(".fstory_addcomment_btn")[0].style.backgroundImage =
				'url("src/icons/Record.png")';
		}
	}
};

// MOVED TO INDEX.JS FOR IOS
// var onDeviceReady = function () {
//     if (window.cordova && window.audioinput) {
//         // Subscribe to audioinput events
//         //
//         window.addEventListener('audioinput', onAudioInputCapture, false);
//         window.addEventListener('audioinputerror', onAudioInputError, false);

//         console.log("cordova-plugin-audioinput successfully initialised");
//     } else {
//         console.log("cordova-plugin-audioinput not found!");
//     }
// };

// document.addEventListener('deviceready', onDeviceReady, false);

/**
 *
 * @param onSuccess
 * @param onDenied
 * @param onError
 */
var getMicrophonePermission = function (onSuccess, onDenied, onError) {
	window.audioinput.checkMicrophonePermission(function (hasPermission) {
		try {
			if (hasPermission) {
				if (onSuccess) onSuccess();
			} else {
				window.audioinput.getMicrophonePermission(function (
					hasPermission,
					message
				) {
					try {
						if (hasPermission) {
							if (onSuccess) onSuccess();
						} else {
							if (onDenied)
								onDenied("User denied permission to record: " + message);
						}
					} catch (ex) {
						if (onError)
							onError("Start after getting permission exception: " + ex);
					}
				});
			}
		} catch (ex) {
			if (onError) onError("getMicrophonePermission exception: " + ex);
		}
	});
};

function EncodeOpus(blob) {
	createWorker();
	console.log(blob);
	var f = blob;
	var fr = new FileReader();
	fr.onloadend = function () {
		var args = [f.name, "encoded.opus"];
		var inData = {};
		inData[f.name] = new Uint8Array(fr.result);
		var outData = {
			"encoded.opus": {
				MIME: "audio/ogg",
			},
		};
		worker.postMessage({
			command: "encode",
			args: args,
			outData: outData,
			fileData: inData,
		});
	};
	console.log(f);
	fr.readAsArrayBuffer(f);
}

function createWorker() {
	worker = new Worker("http://127.0.0.1:8080/OpusEncoder/EmsWorkerProxy.js");

	// Listen for messages by the worker
	worker.onmessage = function (e) {
		if (e.data && e.data.reply === "progress") {
			vals = e.data.values;
			if (vals[1]) {
				// ... push the progress bar forward
				console.log((vals[0] / vals[1]) * 100);
			}
		} else if (e.data && e.data.reply === "done") {
			console.log(100);
			for (fileName in e.data.values) {
				// window.URL.createObjectURL(e.data.values[fileName].blob);
				Save(e.data.values[fileName].blob);
			}
		}
	};
}

/* not used
function opus2wav() {
	var opustowavWorker = new Worker('http://127.0.0.1:8080/Opus2Wav/opustowavworker.js');
	opustowavWorker.onmessage = function (message) {
		if (message.data.status === "done") {
			console.log(message.data.result);
			document.getElementById("player").src = message.data.result;
			document.getElementById("player").style.display = "block";
			killWorker();
		} else if (message.data.status === "message") {
			document.getElementById("message").innerHTML = message.data.result;
			console.log(message.data.result);
		}
	};
}

function killWorker() {
	opustowavWorker.terminate();
}
*/