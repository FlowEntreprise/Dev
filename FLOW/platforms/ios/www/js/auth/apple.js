function signin_with_apple() {
    // SignInWithApple.request({
    //     requestedScopes: [SignInWithApple.Scope.Email, SignInWithApple.Scope.FullName],
    // }).then(function (credential) {
    //     console.info(credential)
    //     fetch('https://some-random-api.ml/img/fox')
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data)
    //             let pseudo = credential.fullName.givenName + credential.fullName.familyName;
    //             let fullname = credential.fullName.givenName + " " + credential.fullName.familyName;
    //             let tokken = credential.user;
    //             alert("1 " + credential);
    //             alert("2 " + credential.fullName);
    //             alert("3 " + credential.fullName.givenName);
    //             alert("4 " + credential.email);
    //             alert("5 " + credential.userId);
    //             console.log(pseudo);
    //             console.log(fullname);
    //             console.log(tokken);
    //             let user_data = {
    //                 username: pseudo,
    //                 full_name: fullname,
    //                 profile_picture: data.link,
    //                 bio: "Hey j'utilise FLOW",
    //                 id: tokken
    //             }
    //             console.log(user_data);
    //             ServerManager.Connect(apiTypes.Apple, user_data);
    //         })
    //         .catch(error => console.error(error))
    // })
    window.cordova.plugins.SignInWithApple.signin({
            requestedScopes: [0, 1]
        },
        function (succ) {
            console.log(succ)
            alert(JSON.stringify(succ))
        },
        function (err) {
            console.error(err)
            alert.log(JSON.stringify(err))
        }
    )
}