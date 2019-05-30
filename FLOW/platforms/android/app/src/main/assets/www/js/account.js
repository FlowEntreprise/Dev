var follow = true;
var followYou = true;
var privateID;

function fInitialisationAccount(privateID) {
    this.privateID = privateID;
    console.log(this.privateID);
}

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
