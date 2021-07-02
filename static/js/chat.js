
const roomName = JSON.parse(document.getElementById('room-name').textContent);
let messages = [];
let self = ""
let loading_messages = false;

mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

let mobile = mobileAndTabletCheck();

function isElementInViewport (el) {

    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

// checks if messages dows not exist in existing messages and appends it in chat log
function closest_message(key){
    let closest = messages.reduce((a, b) => {
        return Math.abs(b - key) < Math.abs(a - key) ? b : a;
    })
    return closest;
}

function update_messages(message, i=0){
    if (messages.indexOf(message.id) === -1){

        let time_ = (new Date(message.sent_at)).toLocaleTimeString(undefined, {hour12:true, timeZone: 'Asia/Kolkata', timeStyle: 'short'});

        let scroll_to_view = false;
        let message_to_be_appeded = "";
        // TODO: add user profile
        if (message.senderid === self){
            message_to_be_appeded = '<li class="chat-right all-copy" id="mess_' + message.id + '">\
                                        <div class="chat-text text-copy"><div class="chat-name">' + message.sender + '</div>' +
                                            message.message +
                                            '<div class="chat-hour">' + time_ + '<span class="fa fa-check-circle"></span></div>\
                                        </div>\
                                    </li>'
        }else{
            message_to_be_appeded = '<li class="chat-left all-copy" id="mess_' + message.id + '">\
                                        <div class="chat-avatar">\
                                            <img class="user-av" src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin">\
                                        </div>\
                                        <div class="chat-text text-copy"><div class="chat-name">' + message.sender + '</div>' +
                                            message.message +
                                            '<div class="chat-hour">' + time_ + '<span class="fa fa-check-circle"></span></div>\
                                        </div>\
                                    </li>'
        }

        if (messages.length === 0){
            document.getElementById("chat-log").innerHTML = message_to_be_appeded;
        } else {
            let min = Math.min.apply(null, messages);
            let max = Math.max.apply(null, messages);
            if (message.id > max) {
                let mess = document.getElementById("mess_"+max);
                if (isElementInViewport(mess) || message.senderid === self){
                    scroll_to_view = true
                }
                mess.insertAdjacentHTML("afterend", message_to_be_appeded);
            } else if (message.id < min) {
                let mess = document.getElementById("mess_"+min);
                mess.insertAdjacentHTML("beforebegin", message_to_be_appeded);
            } else{
                let closest = closest_message(message.id);
                if (closest > message.id){
                    let mess = document.getElementById("mess_"+closest);
                    mess.insertAdjacentHTML("beforebegin", message_to_be_appeded);
                } else{
                    let mess = document.getElementById("mess_"+closest);
                    mess.insertAdjacentHTML("afterend", message_to_be_appeded);
                }
            }
        }
        messages.push(message.id);
        if (scroll_to_view){
            document.getElementById('mess_' + message.id).scrollIntoView();
        }
    }
}



// requests messages from server
function get_messages(from=0){
    loading_messages = true;
    $.ajax({
        type:"POST",
        url: "/chat/" + roomName + "/",
        data: {
            'from': from
        },
        success: function(response)
        {
            self = response['self'];
            response['messages'].forEach(update_messages);
            if (from === 0){
                let max = Math.max.apply(null, messages);
                let mess = $("#mess_"+max)[0];
                mess.scrollIntoView({behavior: "smooth"});
            }
            setTimeout(function () {
                loading_messages = false;
            }, 1500);
        }
    });
}


function connect() {
    // connects to server
    if (location.protocol === "https:"){
        var chatSocket = new WebSocket('wss://' + window.location.host + '/ws/chat/' + roomName + '/');
    } else {
         var chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + roomName + '/');
    }
    //wss on secure network ws on insecure


    // request latest 50 messages when connected to server
    chatSocket.onopen = function (e) {
        get_messages();
    }


    // handles received message
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.type_ === 'message'){
            update_messages({'sender': data.username, 'senderid': data.userid, 'message': data.message, 'id': data.messageid, 'sent_at': data.sent_at});
        }
    };

    // reconnects on unexpected disconnect
    chatSocket.onclose = function (e) {
        setTimeout(function () {
            connect();
        }, 2000);
    };

    // key bind Send on Enter
    document.querySelector('#chat-message-input').focus();
    document.querySelector('#chat-message-input').onkeyup = function (e) {
        e.preventDefault();
        if (!mobile && (e.keyCode === 13 && !e.shiftKey)) {  // TODO: remove <br> when enter is pressed in between
            const messageInputDom = document.querySelector('#chat-message-input');
            messageInputDom.innerHTML = messageInputDom.innerHTML.replace(/<div><br><\/div>$/, "");
            parse_before_send();
            let message = messageInputDom.innerHTML.toString();
            message = message.replace(/<br>$/, "");
            message = message.replace(/<div><br><\/div>$/, "");
            message = message.replace(/&times;$/, "");
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.innerHTML = '';
        }
    };

    // Send button function
    document.querySelector('#chat-message-submit').onclick = function (e) {
        const messageInputDom = document.querySelector('#chat-message-input');
        parse_before_send();
        let message = messageInputDom.innerHTML;
        message = message.replace(/<br>$/, "");
        message = message.replace(/<div><br><\/div>$/, "");
        chatSocket.send(JSON.stringify({
            'message': message.trim()
        }));
        messageInputDom.innerHTML = '';
        messageInputDom.focus();
    };
}

connect();

function extralargescreen() {
    if (window.innerHeight > 1080) {
        document.children[0].setAttribute("style", "font-size: " + (window.innerHeight / 1080) + "em;");
    }else if (window.innerHeight < 577) {
        document.children[0].setAttribute("style", "font-size: " + (window.innerWidth / 577) + "em;");
    }
    else {
        document.children[0].setAttribute("style", "font-size: 1em");
    }
}

setTimeout(extralargescreen, 1000);


$('#file-group').on('click', function (){
    document.getElementById('file-select-button').click();
})

$(".chat-box").on('resize scroll', function (){
    let min = Math.min.apply(null, messages);
    let mess = document.getElementById("mess_"+min);
    if (!loading_messages && isElementInViewport(mess)){
        loading_messages = true;
        get_messages(min);
    }
});


// function to enlarge image when clicked
$(document).on('click', 'img', function () {
    let exp = document.getElementById("expandedImg")
    let bottom = document.getElementById("open-orignal-link")

    exp.src =  this.src;
    bottom.href = this.src;

    document.getElementById("big-image-container").hidden = false;
    document.getElementById("big-image-container").setAttribute('style', 'opacity: 1');
    document.getElementById("main-content").setAttribute('style', "filter: blur(0.75rem);pointer-events: none");
    document.getElementById("main-content").setAttribute('disabled', "true");

});

function revert_big_image(){
    document.getElementById("big-image-container").hidden = true;
    document.getElementById("big-image-container").setAttribute('style', 'opacity: 0');
    document.getElementById("main-content").setAttribute('style', "filter: blur(0); pointer-events: inherit");
    document.getElementById("main-content").setAttribute('disabled', "false");
}
