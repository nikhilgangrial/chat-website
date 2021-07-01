window.uploadPhotos = function(url){
    // Read in file
    for (let ii=0; ii<event.target.files.length; ii++) {
        let file = event.target.files[ii];

        // Ensure it's an image
        if (file.type.match(/image.*/) && file.type !== 'image/gif') {
            console.log('An image has been loaded');

            // Load the image
            let reader = new FileReader();
            reader.onload = function (readerEvent) {
                let image = new Image();
                image.onload = function (imageEvent) {

                    // Resize the image
                    let canvas = document.createElement('canvas'),
                        max_size = 1280,// TODO : pull max size from a site config
                        width = image.width,
                        height = image.height;
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                    let dataUrl = canvas.toDataURL(file.type);
                    let resizedImage = dataURLToBlob(dataUrl);
                    $.event.trigger({
                        type: "imageResized",
                        blob: resizedImage,
                        url: url
                    });
                }
                image.src = readerEvent.target.result;
            }
            reader.readAsDataURL(file);
        } else {
            $.event.trigger({
                type: "imageResized",
                blob: false,
                url: url,
                file: file,
            });
        }
    }
};

/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    let BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        let parts = dataURL.split(',');
        let contentType = parts[0].split(':')[1];
        let raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    let parts = dataURL.split(BASE64_MARKER);
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}
/* End Utility function to convert a canvas to a BLOB      */

/* Handle image resized events */
$(document).on("imageResized", function (event) {
    let formdata = new FormData();
    formdata.append('disable_audio', '0');
    formdata.append('title', "");
    formdata.append('description', "");
    if (event.blob && event.url) {
        formdata.append('type', 'file');
        formdata.append('image', event.blob);
    }
    else {
        console.log(event.file.type.split('/')[0])
        formdata.append('type', 'file');
        formdata.append(event.file.type.split('/')[0], event.file);

        if (event.file.type.split('/')[0] === "video"){
            upload_to_server(formdata);
            return;
        }

    }
    console.log("uploading");
    $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        mimeType: "multipart/form-data",
        'headers': {
            "Authorization": "Client-ID c08f2a8d367a13c",
        },
        crossDomain: true,
        dataType: 'json',
        data: formdata,
        success: function(response){
            console.log(response);
            let photo = response.data.link;
            document.getElementById("chat-message-input").innerHTML += "<img data-enlargeable src='" + photo + "'><br>";
        },
        error: function (res){
            console.log(res);
        },
        'contentType': false,
        'processData': false
    });
});


function upload_to_server(formdata){
    $.ajax({
        url: '/chat/upload/',
        method: "POST",
        data: formdata,
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        success: function (response){
            let jsonObj = JSON.parse(response)
            console.log(jsonObj);
            let video = jsonObj.response.data
            document.getElementById("chat-message-input").innerHTML = "<video loop controls><source src='" + video.link + "' type='" + video.type +"'></video><br>" + document.body.innerHTML;
        },
        error: function (response){
            console.log(response);
        }
    });
}