
document.getElementById("upload_button").setAttribute("onclick", "postToImgur()");

function postToImgur() {
    var files = $("input[type=file]").get(0).files;
    console.log(files);
    for (var i = 0; i < files.length; i++) {
        upload(files[i]);
    }
}

function upload(file){
    let formdata = new FormData();
    formdata.append(file.type.split('/')[0], file);
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