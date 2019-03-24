var follow = true;
var followYou = true;

function manageFollow()
{
    if(follow)
    {
        $("#fFollowButtunAcount").addClass("activeButtunFollow");
        $("#fFollowButtunAcount").text("FOLLOWING");
    }
    else
    {
        $("#fFollowButtunAcount").removeClass("activeButtunFollow");
        $("#fFollowButtunAcount").text("FOLLOW");
    }
}

function manageFollowYou()
{
    if(followYou)
    {
        $("#fFollowYouButtunAcount").css("display", "block");
    }
    else
    {
        $("#fFollowYouButtunAcount").css("display", "none");
    }
}

app.onPageInit('login-screen', function (page) {    
    manageFollow();
    manageFollowYou();
    $("#fFollowButtunAcount").click(function(){
        if(follow)
        {
            follow = false;
        }
        else
        {
            follow = true;
        }
        manageFollow();
    });
}); 