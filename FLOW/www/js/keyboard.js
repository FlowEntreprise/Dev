function hideMessenger() {
    NativeKeyboard.hideMessenger({
        animated: true
    });
}

function updateMessenger() {
    var options = {
        text: "This is the updated text! ",
        showKeyboard: true,
        caretIndex: 10 // caret is set at end of text if not specified
    };
    NativeKeyboard.updateMessenger(
        options,
        // optional success and error handlers
        function () {},
        function () {});
}

function showMessengerKeyboard() {
    NativeKeyboard.showMessengerKeyboard(function () {}, function () {});
}

function showMessenger() {
    var options = {
        onSubmit: function (text) {
            console.log("onSubmit: " + text);
            appendMessage(text);
        },
        onKeyboardWillShow: function (height) {
            console.log("keyboard will show, height is: " + height);
            //appendMessage("keyboard will show, height is: " + height);
        },
        onKeyboardDidShow: function (height) {
            console.log("keyboard shows, height is: " + height);
            //appendMessage("keyboard shows, height is: " + height);
        },
        onMessengerBarHeightChanged: function (height) {
            console.log("messenger bar height changed to: " + height);
            //appendMessage("keyboard shows, height is: " + height);
        },
        onKeyboardWillHide: function () {
            console.log("keyboard will hide");
        },
        onKeyboardDidHide: function () {
            console.log("keyboard did hide");
        },
        onTextChanged: function (newText) {
            console.log("text changed to: " + newText);
            //appendMessage(newText);
        },
        onContentHeightChanged: function (heightDiff) {
            console.log("content height changed by: " + heightDiff);
        },
        showKeyboard: true,
        type: "twitter", // iOS only, default (default) | decimalpad | phonepad | numberpad | namephonepad | number | email | twitter | url | alphabet | search | ascii
        appearance: "light", // iOS only,  light (default) | dark
        secure: false, // iOS only,  default false, disables things like Emoji and Predicive text entry
        autocorrectionEnabled: false, // on iOS this hides the 'predictive text' bar
        scrollToBottomAfterMessengerShows: true,
        autoscrollElement: document.getElementById("messages"), // default unset
        keepOpenAfterSubmit: true, // default false
        animated: true,
        text: "This has been prefilled",
        placeholder: 'Type your message..',
        placeholderColor: "#DDDDDD",
        suppressSuggestions: true, // default true
        textViewBackgroundColor: "#F6F6F6",
        backgroundColor: "#F6F6F6", // default #F7F7F7
        textViewBorderColor: "#777777", // iOS only
        maxChars: 140, // setting this > 0 will make the counter show up on iOS (and ignore input on Android, for now)
        counterStyle: 'countdownreversed', // iOS only currently, note that 'none' still shows a counter in case maxChars is set
        textColor: '#555555',
        // this button is best suited for picking media (camera / cameraroll / last image) from an actionsheet
        leftButton: {
            type: 'ionicon', // or 'text' (Android only currently) or 'fontawesome'
            value: '\uf48a', // http://ionicons.com/ - right-click and inspect the :before value (don't forget the \uf !)
            //color: '#ff0000', // default blue on iOS, grey on Android
            textStyle: 'normal', // if type is 'text', you can set this to 'normal' (default), 'bold', 'italic'
            disabledWhenTextEntered: false, // default false
            onPress: function () {
                if (window.plugins && window.plugins.actionsheet) {
                    window.plugins.actionsheet.show({
                        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
                        buttonLabels: ['Take Photo or Video', 'Use Last Photo Taken', 'Choose From Library'],
                        addCancelButtonWithLabel: 'Cancel'
                    }, function (index) {
                        if (index != 4) { // which is 'cancel'
                            console.log("Picked index " + index + ".. you'll need to implement the rest yourself ;)");
                        }
                    });
                } else {
                    alert("Left button pressed - if you install cordova-plugin-actionsheet you'll see a nice ActionSheet in this demo.");
                }
            }
        },
        rightButton: {
            type: 'text', // or 'fontawesome' or 'ionicon', default 'text'
            value: 'Send', // 'fa-battery-quarter', // '\uf2c3', // 'Send', // default 'Send'
            textStyle: 'bold', // 'normal' (default), 'bold', 'italic'
            //color: '#FF0000', // default iOS blue
            onPress: function () {
                console.log("Right button was pressed - text was passed to 'onSubmit' if provided.");
            }
        }
    };
    var onSuccess = function () {
        console.log("Show Messenger succeeded!");
    };
    var onError = function (message) {
        console.log("Got error message: " + message);
    };
    NativeKeyboard.showMessenger(options, onSuccess, onError);
}

function toggleChat() {
    if (chatShowing) {
        hideMessenger();
    } else {
        showMessenger();
    }
    chatShowing = !chatShowing;
}
var chatShowing = true;
if (chatShowing) {
    document.addEventListener('deviceready', showMessenger, false);
}
//setTimeout(function() {
//    NativeKeyboard.hideMessengerKeyboard();
//}, 5000);