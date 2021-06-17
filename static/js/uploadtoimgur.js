window.uploadPhotos = function(url){
    // Read in file
    for (let ii=0; ii<event.target.files.length; ii++) {
        var file = event.target.files[ii];

        // Ensure it's an image
        if (file.type.match(/image.*/) && file.type !== 'image/gif') {
            console.log('An image has been loaded');

            // Load the image
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                var image = new Image();
                image.onload = function (imageEvent) {

                    // Resize the image
                    var canvas = document.createElement('canvas'),
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
                    var dataUrl = canvas.toDataURL(file.type);
                    var resizedImage = dataURLToBlob(dataUrl);
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
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}
/* End Utility function to convert a canvas to a BLOB      */

/* Handle image resized events */
$(document).on("imageResized", function (event) {
    var data = new FormData();
    data.append('type', 'file');
    data.append('disable_audio', '0');
    //data.append('description', "");
    data.append('title', 'hmmm');
    if (event.blob && event.url) {
        data.append('image', event.blob);
    }
    else {
        data.append(event.file.type.split('/')[0], event.file);
    }
    $.ajax({
        url: event.url,
        data: data,
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        authorization: {
            "Token": '4b65ba39c8d6db6b5cb5865dd03803529de38e90'
        },
        headers: {
            "Authorization": "Client_ID c08f2a8d367a13c",
            },
        success: function(response){
            console.log(response);
            var photo = response.data.link;
            var photo_hash = response.data.deletehash;
            if (response.data.type.split('/')[0] === 'image') {
                document.body.innerHTML = "<img src='" + photo + "'>\n" + document.body.innerHTML;
            } else{
                document.body.innerHTML = "<video src='" + photo + "'>\n" + document.body.innerHTML;
            }
        },
        error: function (res){
            console.log(res);
        }
    });
});
