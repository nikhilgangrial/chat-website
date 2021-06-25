$.mobile.loading().hide();

let like_post = debounce( function (event){
    console.log(event);
}, 100, true);

$(document).on("swipeleft", "div.post_container", debounce(show_next_photo, 200, true));
$(document).on("click", "img.post_container_next, video.post_conainer_post", function (event){
    show_next_photo({currentTarget: event.currentTarget.parentNode.children[3]})
});

$(document).on("swiperight", "div.post_container", debounce(show_prev_photo, 200, true));
$(document).on("click", "img.post_container_prev, video.post_conainer_post", function (event){
    show_prev_photo({currentTarget: event.currentTarget.parentNode.children[3]})
});

$("img.post_container_post, video.post_container_post").on("load", function (event){
    width_heght_calculator(event.currentTarget);
});

$(document).on("wheel", "div.post_container", debounce(photocontainer_scrollhandler, 200, true));

$(document).on("dblclick", "div.post_container", like_post);

$("video.post_container_post").on("visible", function (event){
    event.currentTarget.play();
});


$(document).on("doubletap", "div.post_container", like_post);

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

function width_heght_calculator(ele){
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    console.log(vw, vh);
    if (ele.tagName == "IMG") {
        if (ele.naturalWidth >= ele.naturalHeight) {
            ele.setAttribute("style", "width: 41vw; height: auto");
        } else {
            console.log(ele.naturalHeight, ele.naturalWidth);
            let height = 0;
            if (ele.naturalWidth/ ele.naturalHeight >= 0.48235294117647058823529411764706){
                height = (ele.naturalWidth/ele.naturalHeight)*41;
            } else{
                height = 81;
            }
            ele.setAttribute("style", "width: auto; height: " + height + "vh");
        }
    } else {
        if (ele.videoWidth >= ele.videoHeight) {
            ele.setAttribute("style", "width: 41vw; height: auto");
        } else {
            console.log(ele.videoHeight, ele.videoWidth);
            ele.setAttribute("style", "width: auto; min-height: 41vw; max-height: 85vh");
        }
    }
}

function photocontainer_scrollhandler(event) {
    if (event.originalEvent.deltaX > 0) {
        show_next_photo(event);
    } else if (event.originalEvent.deltaX < 0) {
        show_prev_photo(event);
    }
}

function delay_hide_show(eleh, elev, classes, time){
    function hider(){
        eleh.setAttribute('class', classes + " hidden");
        elev.setAttribute('class', classes + " visible");
        if (elev.tagName === "VIDEO") {
            console.log(elev.parentNode.parentNode);
            elev.parentNode.parentNode.children[2].setAttribute("class", "post_container_play");
        }
    }
    setTimeout(hider, time);
}

function show_next_photo(event){
    let ele = event.currentTarget;
    let cur = parseInt(ele.getAttribute("cur"));
    if (cur < ele.children.length-1) {
        delay_hide_show(ele.children[cur], ele.children[cur+1], "post_container_post", 500);
        if (ele.children[cur].tagName === "VIDEO") {
            console.log(ele.parentNode);
            ele.parentNode.children[2].setAttribute("class", "post_container_play hidden");
        }
        cur += 1;
        width_heght_calculator(ele.children[cur]);
        ele.children[cur].setAttribute("class", "post_container_post visible");
        ele.children[cur-1].scrollIntoView({behavior: 'auto', block: 'nearest', inline: 'start'});
        ele.setAttribute("cur", cur);
        ele.children[cur].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'start'});

        ele.parentNode.children[0].setAttribute("class", "post_container_prev");
        if (cur === ele.children.length-1){
            ele.parentNode.children[1].setAttribute("class", "post_container_next hidden");
        }
    }
}

function show_prev_photo(event){
    let ele = event.currentTarget;
    let cur = parseInt(ele.getAttribute("cur"));
    if (cur > 0) {
        delay_hide_show(ele.children[cur], ele.children[cur-1], "post_container_post", 500);
        if (ele.children[cur].tagName === "VIDEO") {
            console.log(ele.parentNode);
            ele.parentNode.children[2].setAttribute("class", "post_container_play hidden");
        }
        cur -= 1;
        width_heght_calculator(ele.children[cur]);
        ele.children[cur].setAttribute("class", "post_container_post visible");
        ele.children[cur+1].scrollIntoView({block: 'nearest', inline: 'start'});
        ele.setAttribute("cur", cur);
        ele.children[cur].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'start'});

        ele.parentNode.children[1].setAttribute("class", "post_container_next");
        if (cur === 0){
            ele.parentNode.children[0].setAttribute("class", "post_container_prev hidden");
        }
    }
}
