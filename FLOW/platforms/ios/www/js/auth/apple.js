function signin_with_apple() {
    window.cordova.plugins.SignInWithApple.signin({
            requestedScopes: [0, 1]
        },
        function (succ) {
            console.log(succ)
            fetch('https://some-random-api.ml/img/fox')
                .then(response => response.json())
                .then(data => {
                    console.log(data) // Prints result from `response.json()` in getRequest
                    let pseudo = succ.fullName.givenName + succ.fullName.familyName;
                    let fullname = succ.fullName.givenName + " " + succ.fullName.familyName;
                    let tokken = succ.identityToken.split(".")[0];
                    console.log(pseudo);
                    console.log(fullname);
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