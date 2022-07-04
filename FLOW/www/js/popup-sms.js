var all_contacts = [];
var input = document.querySelector("#mobile-number");
var canDisplayVerificationCodeInput = false;
var firestoreDocRefId;
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
            if (phoneNumber && phoneNumber.startsWith('+')) {
                all_contacts.push(phoneNumber.replace(/[^0-9+]/g, ''));
            }
        }
        if (i == (contacts.length - 1)) {
            let data = {
                PrivateId: window.localStorage.getItem("user_private_id"),
                Index: 0,
                ContactList: all_contacts
            };
            ServerManager.GetUserFromContactList(data);
        }

    }
}

function onError(contactError) {
    alert('onError!');
}

function getContactAlreadyOnFLow() {
    var ContactOptions = new ContactFindOptions();
    ContactOptions.filter = "";
    ContactOptions.multiple = true;
    filter = ["displayName", "name"];
    navigator.contacts.find(filter, onSuccess, onError, ContactOptions);
}