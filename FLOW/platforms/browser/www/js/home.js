var ptrContent = $$('.pull-to-refresh-content');

// Add 'refresh' listener on it
ptrContent.on('ptr:refresh', function (e) {
    // Emulate 2s loading
    console.log("refreshing...")
    setTimeout(function () {
        // When loading done, we need to reset it
        console.log("refreshed !");
        $("#ptr_arrow").css("opacity", "0");
        app.pullToRefreshDone();
        ConnectUser();
    }, 1000);
});

ptrContent.on('ptr:pullstart', function (e) {
    console.log("pull start");
    $("#ptr_arrow").css("opacity", "1");

});

ptrContent.on('ptr:pullend', function (e) {
    console.log("pull end");
    $("#ptr_arrow").css("opacity", "0");
});