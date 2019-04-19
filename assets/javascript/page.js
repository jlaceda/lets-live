// scroll down to list
$("#down").on('click', function (event) {
    $(document.body).animate({
        'scrollTop': $('#list').offset().top
    }, 1000);
    $("#down").hide();
    $("#up").show();
});

// scroll to top 
$("#up").on('click', function (event) {
    $(document.body).animate({
        scrollTop:0
    }, 1000);
    $("#up").hide();
    $("#down").show();
});

// go back to first page when clicked
$(".navbar-brand").on("click",function(event){
    window.location.reload();
})
