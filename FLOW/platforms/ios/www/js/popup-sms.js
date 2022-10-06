var all_contacts = [];
var all_phone_numbers = [];
var input = document.querySelector("#mobile-number");
var canDisplayVerificationCodeInput = false;
var firestoreDocRefId;
var CanRefreshContactList = true;
var ContactListCurrentIndex = 0;
var intlTelInputInstance = intlTelInput(input, {
    dropdownContainer: document.querySelector("#popup_sms_content"),
    geoIpLookup: function (callback) {
        $.get('https://ipinfo.io', function () { }, "jsonp").always(function (resp) {
            var countryCode = (resp && resp.country) ? resp.country : "";
            callback(countryCode);
            init();
        });
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/utils.js" // just for formatting/placeholders etc
});

function init() {
    $(".selected-flag").css("width", "150px");
    $(".selected-flag").append($("<div id='country-name'>" + name + "</div>").css({
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "right": "0",
        "width": "100",
        "display": "flex",
        "align-items": "center",
        "overflow": "hidden",
        "white-space": "nowrap"
    }));
    $("#mobile-number").css({ "padding-left": "150px", "width": "300px" });
    showCountryAndCode();
}

$(".country-list li").click(function () {
    showCountryAndCode();
});

function showCountryAndCode() {
    setTimeout(() => {
        let name = $("li.active span.country-name").text();
        name = name.indexOf('(') > 0 ? name.substr(0, name.indexOf('(') - 1) : name;
        const code = $("li.active span.dial-code").text();
        $("#country-name").text(name);
        $("#mobile-number").val(code + " ");
    }, 0);
}


$("#btn_valider_numero").on("click", function () {

    $(".loading_phone_number").css("display", "block");
    if (canDisplayVerificationCodeInput == false) {
        let user_phone_number = intlTelInputInstance.getNumber();
        if (!intlTelInputInstance.isValidNumber()) {
            $(".loading_phone_number").css("display", "none");
            $("#erreur_numero").css("opacity", "1");
            setTimeout(() => {
                $("#erreur_numero").css("opacity", "0");
            }, 3000);
        }
        else {
            let data = {
                PhoneNumber: user_phone_number,
                verificationCode: Math.floor(Math.random() * (999999 - 111111)) + 111111
            };
            ServerManager.sendSmsVerificationCode(data);
            // bien separé le country code du numero dans la string
        }
    }
    else {
        let user_input_verification_code_value = $("#verification_code").val().trim();
        let data = {
            id: firestoreDocRefId,
            user_input_verification_code_value: user_input_verification_code_value
        };
        ServerManager.checkSmsVerificationCode(data);
    }
});

function check_user_verification_code_is_valide() {
    $("#mobile_number_form").css("display", "none");
    $(".loading_phone_number").css("display", "none");
    canDisplayVerificationCodeInput = true;
    $("#verification_code").css("display", "block");
}

function checkIfUserCodeMatchFirestoreCode(data) {
    let selected_country_data = intlTelInputInstance.getSelectedCountryData().dialCode;
    if (data.body.slice(-6) === data.user_input_verification_code_value) {
        let data1 = {
            PhoneNumber: data.to.replace(`${selected_country_data}`, `${selected_country_data} `)

        };
        ServerManager.UpdatePhoneNumber(data1);
        getContactAlreadyOnFLow();
    }
    else {
        $("#erreur_numero").css("opacity", "1");
        setTimeout(() => {
            $("#erreur_numero").css("opacity", "0");
        }, 3000);
    }
}

function onSuccess(contacts) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].phoneNumbers) {
            let phoneNumber = contacts[i].phoneNumbers[0].value;
            if (phoneNumber && phoneNumber.startsWith('+') && contacts[i].name.formatted) {
                all_phone_numbers.push(phoneNumber.replace(/[^0-9+]/g, ''));

                all_contacts.push({ "name": contacts[i].name.formatted.trim(), "phoneNumber": phoneNumber.replace(/[^0-9+]/g, '') });
            }
        }
        if (i == (contacts.length - 1)) {
            let data = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: ContactListCurrentIndex,
                ContactList: all_phone_numbers
            };
            ServerManager.GetUserFromContactList(data);
        }

    }
}

function onError(contactError) {
    alert('onError!');
}

function getContactAlreadyOnFLow() {
    Popup("popup-contact-on-flow", true, 30);
    var ContactOptions = new ContactFindOptions();
    ContactOptions.filter = "";
    ContactOptions.multiple = true;
    filter = ["displayName", "name"];
    navigator.contacts.find(filter, onSuccess, onError, ContactOptions);
}


$(".list_contact_on_flow").scroll(function () {
    var limit = $(this)[0].scrollHeight - $(this)[0].clientHeight;
    if (CanRefreshContactList == true) {
        FirebasePlugin.logEvent("page_scroll", {content_type: "page_view", item_id: "list_contact"});
        if (Math.round($(this).scrollTop()) >= limit * 0.75) {
            CanRefreshContactList = false;
            //console.log("Get followers on Server");
            //console.log("ContactListCurrentIndex : " + ContactListCurrentIndex);
            let data = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: ContactListCurrentIndex,
                ContactList: all_phone_numbers
            };
            ServerManager.GetUserFromContactList(data);
        }
    }
});

function UpdateContactList(data_not_unique, follow_list) {
    //console.log("updating Followers list...");
    // //console.log(data.Data);
    
    if(data_not_unique.length == 0)
    {
        for (let i = 0; i < all_contacts.length; i++) {
            let user = new block_user(follow_list, "contactList", all_contacts[i],true);
            all_users_block.push(user);
        }
        
        CanRefreshContactList = false;
        return;
    }
    
    let data = Array.from(new Set(data_not_unique.map(el => JSON.stringify(el)))).map(el => JSON.parse(el));
    
    if (data.length == 0 && ContactListCurrentIndex == 0) {
        let no_friends = document.createElement("h2");
        no_friends.id = "no_friends";
        no_friends.className = " language";
        no_friends.innerText = `${language_mapping[device_language]['no_friends']}`;
        $(".list_contact_on_flow").html("");
        $(".list_contact_on_flow")[0].appendChild(no_friends);
    }

    if (Array.isArray(data) && data.length > 0) {
        //$(".list_contact_on_flow").html("");
        setTimeout(function () {
            if ($(".loading_phone_number")) $(".loading_phone_number").remove();
            if (ContactListCurrentIndex == 0) {
                $(".list_contact_on_flow")[0].innerHTML = "";
                let loading_phone_number = document.createElement("div");
                loading_phone_number.className = "loading-spinner loading_phone_number";
                $(".list_contact_on_flow")[0].appendChild(loading_phone_number);
            }
            for (let i = 0; i < data.length; i++) {
                let user = new block_user(follow_list, "contactList", data[i]);
                all_users_block.push(user);
            }
            ContactListCurrentIndex++;
            if ($(".loading_phone_number")) $(".loading_phone_number").remove();
            //console.log("user updated !");
            pullToRefreshEnd();
            if (data.length < 10) {
                
                
                for (let i = 0; i < all_contacts.length; i++) {
                    let user = new block_user(follow_list, "contactList", all_contacts[i],true);
                    all_users_block.push(user);
                }
                
                CanRefreshContactList = false;
                // let tick_tl = document.createElement("div");
                // tick_tl.className = "tick_icon";
                // $(".list_contact_on_flow")[0].appendChild(tick_tl);
            } else {
                CanRefreshContactList = true;
                let loading_phone_number = document.createElement("div");
                loading_phone_number.className = "loading-spinner loading_phone_number";
                $(".list_contact_on_flow")[0].appendChild(loading_phone_number);
            }
        }, 500);
    } else {
        StopRefreshTL();
    }
}

document
    .getElementById("popup-contact-on-flow")
    .addEventListener("closed", function () {
        $(".list_contact_on_flow")[0].innerHTML = "";
        CanRefreshContactList = true;
        ContactListCurrentIndex = 0;
        all_contacts.length = 0;
        all_phone_numbers.length = 0;
        FirebasePlugin.logEvent("popup_closed", {content_type: "page_view", item_id: "popup-contact-on-flow"});
    });

document
    .getElementById("popup-contact-on-flow")
    .addEventListener("opened", function () {
        let loading_contact_list = document.createElement("div");
        loading_contact_list.className = "loading-spinner loading_contact_list";
        $(".list_contact_on_flow")[0].appendChild(loading_contact_list);
        FirebasePlugin.logEvent("popup_oppened", {content_type: "page_view", item_id: "popup-contact-on-flow"});
    });


function askIfUserWantToVerifyPhoneNumber() {
    let getMyUserInfoAccount = {
        PrivateId: window.localStorage.getItem("user_private_id"),
    };
    ServerManager.GetUserInfo(getMyUserInfoAccount, true);
}

function checkIfUserPhoneNumberIsAlreadyVerified(data) {
    if (data.Data.PhoneNumber != null) {
        //getContactAlreadyOnFLow();
    }
    else {
        Popup("popup-sms", true, 20);
    }
}

$("#ignorer_numero").on("click", function () {
    Popup('popup-sms', false);
    window.localStorage.setItem("last_time_phone_number_verification_was_asked", Date.now());
});

$("#explore_find_friends").on("click", function () {
    getContactAlreadyOnFLow();
});

document.getElementById("popup-sms").addEventListener("closed", function () {
    FirebasePlugin.logEvent("popup_closed", {content_type: "page_view", item_id: "popup-sms"});
});

document.getElementById("popup-sms").addEventListener("opened", function () {
    FirebasePlugin.logEvent("popup_oppened", {content_type: "page_view", item_id: "popup-sms"});
});


function send_invite_sms(number) {
        //var number = document.getElementById('numberTxt').value.toString(); /* iOS: ensure number is actually a string */
        //var message = document.getElementById('messageTxt').value;

        //CONFIGURATION
         let = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: ''  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without opening any other app, require : android.permission.SEND_SMS and android.permission.READ_PHONE_STATE
            }
        };

        let success = function () { alert('Message sent successfully'); };
        let error = function (e) { alert('Message Failed:' + e); };
        sms.send(number.toString(), `${language_mapping[device_language]['join_flow']}`, options, success, error);
    }

