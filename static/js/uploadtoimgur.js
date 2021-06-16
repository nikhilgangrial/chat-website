
document.getElementById("upload_button").setAttribute("onclick", "postToImgur()");

function postToImgur() {
    var formdata = new FormData();
    console.log($("input[type=file]"));
    formdata.append("image", $("input[type=file]").get(0).files[0]);
    $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        datatype: "json",
        headers: {
            "Authorization": "Client-ID c08f2a8d367a13c",
        },
        data: formdata,
        success: function(response) {
        console.log(response);
        var photo = response.data.link;
        var photo_hash = response.data.deletehash;
        },
        cache: false,
        contentType: false,
        processData: false
    });
}