var follow = true;
var followYou = true;

function manageFollow()
{
    if(follow)
    {
        $("#fFollowButtunAccount").addClass("activeButtunFollow");
        $("#fFollowButtunAccount").text("FOLLOWING");
    }
    else
    {
        $("#fFollowButtunAccount").removeClass("activeButtunFollow");
        $("#fFollowButtunAccount").text("FOLLOW");
    }
}

function manageFollowYou()
{
    if(followYou)
    {
        $("#fFollowYouButtunAccount").css("display", "block");
    }
    else
    {
        $("#fFollowYouButtunAccount").css("display", "none");
    }
}

app.onPageInit('login-screen', function (page) {    
    manageFollow();
    manageFollowYou();
    $("#fFollowButtunAccount").click(function(){
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
