function login_insta() {
    console.log('enter login');
    $.oauth2({
        auth_url: 'https://api.instagram.com/oauth/authorize',
        token_url: 'https://api.instagram.com/oauth/access_token',
        response_type: 'code',
        logout_url: 'https://instagram.com/accounts/logout',
        client_id: '214136126569106',
        client_secret: '5d3bac15974e3a4f702237844c10a3c1',
        redirect_uri: 'https://www.flowappweb.com/',
        other_params: {
            scope: 'user_profile'
        }
    }, function (token, response) {
        //makeAPICalls(token);
        //alert(token);
        console.log(token);
        console.log(response);
        getData(token);
        $(".loading_connect").css({
            "opacity": "1",
            "pointer-events": "auto"
        });
    }, function (error, response) {
        $(".loading_connect").css({
            "opacity": "0",
            "pointer-events": "none"
        });
        // alert(error);
        console.log(error);
        //alert(error);
    });
}

function getData(accessToken) {
    console.log(accessToken);
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://api.instagram.com/v1/users/self/?access_token=" + accessToken,
        success: function (reponse) {
            console.log(reponse);
            var user_name = reponse.data.username;
            var full_name = reponse.data.full_name;
            var media = reponse.data.counts['media'];
            var follows = reponse.data.counts['follows'];
            var followed_by = reponse.data.counts['followed_by'];
            var bio = reponse.data.bio;
            var is_business = reponse.data.is_business;
            var Ppicture = reponse.data.profile_picture;
            var Id = reponse.data.id;
            // var test = {Name:user_name,Full:full_name,Picture:Ppicture};

            // alert('nombre de media: '+media);
            // alert('follow: '+follows);
            // alert('follower: '+followed_by);
            // var picture = document.getElementById('profile_picture');
            // picture.append('<img src="Ppicture">')
            // $("#info_user").append("<p>le nom de l'utilisateur est: "+full_name+"</p>")
            // $("#info_user").append("<p>le user name est : "+user_name+"</p>")
            // $("#info_user").append("<img src="+Ppicture+">");
            // $("#info_user").append("<p>il possede un compte pro: "+is_business+"</p>");
            // $("#info_user").append("<p>la biographie de l'user est: "+bio+"</p>")
            var txt = full_name + " --- " + Ppicture + " --- " + bio + " --- " + Id + " --- " + bio;
            //document.getElementById('infos').innerHTML = txt;
            //Transport(socket, reponse, "instagram");
            // Socket.client.send('Inscription','Instagram',reponse.data); -- OLD
            ServerManager.Connect(apiTypes.Instagram, reponse.data);
            //alert(txt);
        },
        error: function (response) {
            // console.log("Connection error : ");
            console.log(response);
            $(".loading_connect").css({
                "opacity": "0",
                "pointer-events": "none"
            });
        }
    });
}

// var test;
//     test = window.open('https://api.instagram.com/oauth/authorize/?client_id=c45b4c4cbad345f59ffaa62a91fd932d&redirect_uri=index.html&response_type=token', '_self', 'location=yes');
//     test.addEventListener('loadstart', function(location) { 
//         console.log("loadstart fired");
//         alert(JSON.stringify(location)); 
//     });

//http://localhost:8000/