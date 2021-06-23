$.mobile.loading().hide();

let like_post = debounce( function (event){
    console.log(event);
}, 100, true);

$(document).on("swipeleft", "div.post_container", debounce(show_next_photo, 200, true));
$(document).on("click", "img.post_container_next", function (event){
    show_next_photo({currentTarget: event.currentTarget.parentNode.children[2]})
});

$(document).on("swiperight", "div.post_container", debounce(show_prev_photo, 200, true));
$(document).on("click", "img.post_container_prev", function (event){
    show_prev_photo({currentTarget: event.currentTarget.parentNode.children[2]})
});

$(document).on("wheel", "div.post_container", debounce(photocontainer_scrollhandler, 200, true));

$(document).on("dblclick", "div.post_container", like_post);

$("video.post_container_post").on("click", function (event){
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
    }
    setTimeout(hider, time);
}

function show_next_photo(event){
    let ele = event.currentTarget;
    let cur = parseInt(ele.getAttribute("cur"));
    if (cur < ele.children.length-1) {
        delay_hide_show(ele.children[cur], ele.children[cur+1], "post_container_post", 500);
        cur += 1;
        ele.children[cur].setAttribute("class", "post_container_post visible");
        ele.children[cur-1].scrollIntoView({block: 'nearest', inline: 'start'});
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
        cur -= 1;
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
