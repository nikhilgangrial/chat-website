
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
            if (response.data.type.split('/')[0] == 'image') {
                document.body.innerHTML = "<img src='" + photo + "'>\n" + document.body.innerHTML;
            } else{
                document.body.innerHTML = "<video src='" + photo + "'>\n" + document.body.innerHTML;
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
}