function signin_with_apple() {
    window.cordova.plugins.SignInWithApple.signin({
            requestedScopes: [0, 1]
        },
        function (succ) {
            console.log(succ)
            alert(JSON.stringify(succ))
        },
        function (err) {
            console.error(err)
            console.log(JSON.stringify(err))
        }
    )
}