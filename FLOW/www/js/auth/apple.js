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
                    let user_data = {
                        username: succ.fullName.givenName + succ.fullName.familyName,
                        full_name: succ.fullName.givenName + " " + succ.fullName.familyName,
                        profile_picture: data.link,
                        bio: "Hey j'utilise FLOW",
                        id: succ.identityToken
                    }
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