
function extralargescreen() {
    if (window.innerHeight > 1080) {
        document.children[0].setAttribute("style", "font-size: " + (window.innerHeight / 1080) + "em;");
    }else if (window.innerHeight < 577) {
        document.children[0].setAttribute("style", "font-size: " + (window.innerWidth / 577) + "em;");
    }
    else {
        document.children[0].setAttribute("style", "font-size: 1em");
    }
    setTimeout(extralargescreen, 1000);
}

setTimeout(extralargescreen, 1000);