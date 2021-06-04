$(document).ready(function(){         
    $(window).on("beforeunload", function(e) {
        $.ajax({
                url: '/account/tab_close/',
                method: 'GET',
            })
    });
});