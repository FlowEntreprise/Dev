function signin_with_apple() {
    /////////////////// 2.0 ///////////////////////
    window.cordova.plugins.SignInWithApple.signin({
            requestedScopes: [0, 1]
        },
        function (credential) {
            console.log(credential)
            fetch('https://some-random-api.ml/img/fox')
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    let pseudo = credential.fullName.givenName + credential.fullName.familyName;
                    let fullname = credential.fullName.givenName + " " + credential.fullName.familyName;
                    let tokken = credential.user;
                    console.log(pseudo);
                    console.log(fullname);
                    console.log(tokken);
                    let user_data = {
                        username: pseudo,
                        full_name: fullname,
                        profile_picture: data.link,
                        bio: "Hey j'utilise FLOW",
                        id: tokken
                    }
                    console.log(user_data);
                    ServerManager.Connect(apiTypes.Apple, user_data);
                })
                .catch(error => console.error(error))
        },
        function (err) {
            console.error(err)
            console.log(JSON.stringify(err))
        }
    )
}