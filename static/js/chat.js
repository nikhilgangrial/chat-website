
let messages = {};
let messages_ = {};
let current_room = '123';
let self = ""
let loading_messages = false;
let caret_position_mes=0;
let timeoutId = 0;
let selecting = false;
let selected_messages = [];
let chats = []
let chats_ = {}
let reply_mess_id = 0;
let edit_mess_id = 0;
let highlighted = null;

mobileAndTabletCheck = function() {
  let check = false;
  (function(a){// noinspection RegExpRedundantEscape,RegExpSingleCharAlternation
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

let mobile = mobileAndTabletCheck();


function isElementInViewport (el) {

    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    try {
        let rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    } catch { return false;}
}

// checks if messages dows not exist in existing messages and appends it in chat log
function closest_message(key){
    return messages[current_room].reduce((a, b) => {
        return Math.abs(b - key) < Math.abs(a - key) ? b : a;
    });
}

function update_messages(message){
    if (!messages[current_room]) {
        messages[current_room] = [];
        messages_[current_room] = {};
    }

    if (messages[current_room].indexOf(message.id) === -1){

        let time_ = parseDate(new Date(message.sent_at));

        let scroll_to_view = false;
        let message_to_be_appeded;

        let style = '';
        if (selecting === true){
            style = 'style="visibility: hidden;"';
        }
        if (message.senderid === self){

            let seen = 'hidden';
            let time_seen = ""
            if (Boolean(message.seen_at) && message.seen_at !== 'None'){
                seen = '';
                time_seen = parseDate(new Date(message.seen_at));
            }
            message_to_be_appeded = '<li class="chat-right" id="mess_' + message.id + '">\
                                       <div class="time-seen-at">' + time_seen + '</div>\
                                       <div class="ballon" ' + style + '>\
                                            <button data-type="edit" style="background: #252528;">\
                                                <i class="fa fa-edit"></i>\
                                            </button>\
                                            <button data-type="delete" class="btn-danger">\
                                                <i class="fa fa-trash-alt"></i>\
                                            </button>\
                                            <button data-type="more" style="background: #252528">\
                                                <i class="fa fa-ellipsis-v"></i>\
                                            </button>\
                                       </div>\
                                       <div class="chat-text no-copy">\
                                           <div class="chat-name no-copy">' + message.sender + '</div>\
                                           <div class="no-copy">' + message.message + '</div>\
                                           <div class="chat-hour">' + time_ + '&nbsp;<span ' + seen + ' class="fa fa-check-circle"></span></div>\
                                       </div>\
                                    </li>'
        }
        else{
            let av;
            if (message.profile && message.profile !== ""){
                av = '<img class="user-av" src="' + message.profile + '" alt="">';
            } else{
                av = '<span style="font-size: 2.5rem;" class="user-av fa fa-user-circle"></span>';
            }
            message_to_be_appeded = '<li class="chat-left" id="mess_' + message.id + '">\
                                        <div class="chat-avatar">\
                                            ' + av + '\
                                        </div>\
                                        <div class="ballon" '+ style +'>\
                                            <button data-type="reply" style="background: #252528;">\
                                                <i class="fa fa-reply"></i>\
                                            </button>\
                                        </div>\
                                        <div class="chat-text no-copy">\
                                            <div class="chat-name no-copy">' + message.sender + '</div>\
                                            <div class="no-copy">' + message.message + '</div>\
                                            <div class="chat-hour">' + time_ + '</div>\
                                        </div>\
                                    </li>'
        }

        if (messages[current_room].length === 0){
            document.getElementById("chat-log").innerHTML += message_to_be_appeded;
        } else {
            let min = Math.min.apply(null, messages[current_room]);
            let max = Math.max.apply(null, messages[current_room]);
            if (message.id > max) {
                let mess = document.getElementById("mess_"+max);
                if (isElementInViewport(mess) || message.senderid === self){
                    scroll_to_view = true
                }
                mess.insertAdjacentHTML("afterend", message_to_be_appeded);
                if (messages_[current_room]['mess_' + max].senderid === message.senderid){
                    mess.nextElementSibling.setAttribute('style', 'margin-top: -1.15rem!important;');
                    mess.nextElementSibling.children[2].setAttribute('style', 'padding-top: 0.4rem!important;');
                    mess.nextElementSibling.children[2].children[0].setAttribute('style', 'display: none!important;');
                    if (message.senderid !== self){
                        mess.nextElementSibling.children[0].setAttribute('style', 'visibility: hidden;')
                    }
                }
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
        messages[current_room].push(message.id);
        messages_[current_room]['mess_' + message.id] = {
            'id': message.id,
            'message': message.message,
            'senderid': message.senderid,
            'sender': message.sender,
            'sent_at': message.sent_at,
            'seen_at': message.seen_at,
            'profile': message.profile,
        }

        if (scroll_to_view){
            document.getElementById('mess_' + message.id).scrollIntoView({block: "start", inline: "start", behavior: "smooth"});
        }
    }
}

// requests messages from server
function get_messages(from=0){
    loading_messages = true;
    $.ajax({
        type:"POST",
        url: "/chat/" + current_room + "/",
        data: {
            'from': from
        },
        success: function(response)
        {
            document.getElementById("chat-spinner").setAttribute('style', 'display: none!important');
            self = response['self'];
            current_room = response['room'];
            response['messages'].reverse();
            response['messages'].forEach(update_messages);
            if (from === 0){
                setTimeout(function () {
                    let max = Math.max.apply(null, messages[current_room]);
                    let mess = $("#mess_" + max)[0];
                    try{mess.scrollIntoView({behavior: "smooth"});}catch{}
                    setTimeout(function (){$(".publisher-input").focus();}, 1200);
                }, 50);
            }
            setTimeout(function () {
                loading_messages = false;
            }, 1500);
        }
    });
}

let chatSocket = null;

function connect() {
    // connects to server
    if (location.protocol === "https:"){
        chatSocket = new WebSocket('wss://' + window.location.host + '/ws/chat/' +  current_room +'/');
    } else {
         chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + current_room + '/');
    }
    //wss on secure network ws on insecure

    // request latest 50 messages when connected to server
    chatSocket.onopen = function () {
        chatSocket.send(JSON.stringify({
            'type_': 'load_chats'
        }));
        get_messages();
    };

    // handles received message
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.type_ === 'message'){
            update_messages({'sender': data.username, 'senderid': data.userid, 'message': data.message, 'id': data.messageid, 'sent_at': data.sent_at, 'seen_at': data.seen_at});
        }
        else if (data.type_ === "deleted"){
            remove_message(data.messageid);
        }
        else if (data.type_ === "deleted_multi"){
            data.message_ids.forEach(function (mess_id) {
                remove_message(mess_id);
            });
        }
        else if (data.type_ === "edit"){

        }
        else if (data.type_ === "delivery_report"){
            $("#mess_" + data.messageid + " > div.time-seen-at")[0].innerHTML = parseDate(new Date(data.seen_at + " UTC"));
            $("#mess_" + data.messageid + " > div.chat-text.no-copy > div.chat-hour > span.fa.fa-check-circle")[0].hidden = false;
            messages_[current_room]['mess_' +data.messageid].seen_at = data.seen_at;
        }
        else if (data.type_ === "switchroom"){
            $('div.selected-user > span > span.name')[0].innerHTML = chats_[data.room].title;
            $('.reply-close').click();
            $('span[data-type="cancel"]').click();
            messages[current_room] = [];
            document.getElementById("chat-log").innerHTML = '<br>\
                                                                     <div id="chat-spinner" class="d-flex justify-content-center">\
                                                                        <div style="margin-bottom: 2rem;" class="spinner-border" role="status">\
                                                                            <span class="sr-only">Loading...</span>\
                                                                        </div>\
                                                                     </div>';

            current_room = data.room;
            if (messages_[current_room]){
                for (let i in messages_[current_room])
                {
                    // noinspection JSUnfilteredForInLoop
                    update_messages(messages_[current_room][i]);
                }
            }
            get_messages();
        }
        else if (data.type_ === "load_chats"){
            chats = eval(data['chats']);
            let container = document.getElementsByClassName("users")[0];
            chats.forEach(function (chat){
                chats_[chat.chatid] = chat;
                let av;
                if (chat.av !== ""){
                    av = '<img class="user-av" src="' + chat.av + '" alt="">';
                } else{
                    av = '<span style="font-size: 2.5rem;" class="user-av fa fa-user-circle"></span>';
                }
                container.innerHTML += '<li class="users_person" data-chat="' + chat.chatid +'">\
                                            <div class="user">'
                                                + av + '\
                                                <span class="status ' + chat.status + '"></span>\
                                            </div>\
                                            <p class="name-time" style="margin-bottom: 0!important;">\
                                                <span class="name">' + chat.title +'</span>\
                                                <span class="time">06/07/2021</span>\
                                            </p>\
                                        </li>'
            //                           TODO: ADD LAST MESSAGE TIME
            });
        }
    };

    // reconnects on unexpected disconnect
    chatSocket.onclose = function () {
        setTimeout(function () {
            connect();
        }, 2000);
    };

    // key bind Send on Enter
    document.querySelector('#chat-message-input').focus();

    $(document).on('keydown', '#chat-message-input', function (e) {
        if (!mobile && (e.keyCode === 13 && !e.shiftKey)) {
            e.preventDefault();
            const messageInputDom = document.querySelector('#chat-message-input');
            messageInputDom.innerHTML = messageInputDom.innerHTML.replace(/<div><br><\/div>$/, "");
            parse_before_send();
            send_message(messageInputDom);
        }
    });

    // if empty div in input
    $(document).on('keyup', '#chat-message-input', function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
            const messageInputDom = document.querySelector('#chat-message-input');
            if (messageInputDom.innerHTML === "<br>" || messageInputDom.innerHTML === "<div></div>"){
                messageInputDom.innerHTML = "";
            }
        }
    });

    // Send button function
    $(document).on('click', '#chat-message-submit', function () {
        const messageInputDom = document.querySelector('#chat-message-input');
        parse_before_send();
        send_message(messageInputDom);
        messageInputDom.focus();
    });
}

connect();


function send_message(messageInputDom) {
    check_for_reply(messageInputDom);
    let message = messageInputDom.innerHTML.toString();
    message = message.replaceAll(":pain:", '<img style="width: 1.5rem; height: 1.29rem;display: inline-block; color: transparent;" alt="" src="https://i.imgur.com/sYDyc6L.png" contenteditable="false">')
    message = message.replace(/<br>$/, "");
    message = message.replace(/<div><br><\/div>$/, "");
    message = message.replace(/&bnsp;$/, "");
    chatSocket.send(JSON.stringify({
        'message': message.trim(),
        'type_': 'message',
    }));
    messageInputDom.innerHTML = '';
}

function check_for_reply(messageInputDom){
    // noinspection EqualityComparisonWithCoercionJS
    if (reply_mess_id != 0){
        messageInputDom.innerHTML = `<div class="chat-reply" onclick="reply_message_scroll(event, ${reply_mess_id});">`+
                                    `  <div class="name">${messages_[current_room][reply_mess_id].sender}</div>`+
                                    `   ${messages_[current_room][reply_mess_id].message}`+
                                    `</div>${messageInputDom.innerHTML}`;
        $('.reply-close').click();
    }
}

function extralargescreen() {
    if (window.innerHeight > 1080) {
        document.children[0].setAttribute("style", "font-size: " + (window.innerHeight / 970) + "em;");
    }
    else {
        document.children[0].setAttribute("style", "font-size: 1.1em");
    }
}

setTimeout(extralargescreen, 1000);


$('#file-group').on('click', function (){
    document.getElementById('file-select-button').click();
})

$('#chat-bottom-scroll').on('click', function (event){
    event.currentTarget.nextElementSibling.scrollTo({top: event.currentTarget.nextElementSibling.scrollHeight, behavior: "smooth"});
});

$(".chat-box").on('resize scroll', function (){
    let min = Math.min.apply(null, messages[current_room]);
    let mess_min = document.getElementById("mess_"+min);

    let max = Math.max.apply(null, messages[current_room]);
    let mess_max = document.getElementById("mess_"+max);
    if (isElementInViewport(mess_max)){
        $('#chat-bottom-scroll').css('visibility', 'hidden');
    }else{
        $('#chat-bottom-scroll').css('visibility', 'visible');
    }

    if (!loading_messages && isElementInViewport(mess_min)){
        loading_messages = true;
        document.getElementById("chat-spinner").setAttribute("style", "");
        get_messages(min);
    }
});


// function to enlarge image when clicked
$(document).on('click', 'img[data-enlargeable]', function () {
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

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
}

const isYesterday = (someDate) => {
  const yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  return someDate.getDate() === yesterday.getDate() &&
      someDate.getMonth() === yesterday.getMonth() &&
      someDate.getFullYear() === yesterday.getFullYear();
}

function parseDate(date){
    let time = date.toLocaleTimeString(undefined, {hour12:true, timeZone: 'Asia/Kolkata', timeStyle: 'short'});
    if (isToday(date)){
        time = 'Today at ' + time;
    } else if (isYesterday(date)){
        time = 'Yesterday at ' + time;
    }   else{
        time = date.toLocaleDateString('en-GB', {timeZone: 'Asia/Kolkata', });
    }
    return time;
}


function remove_message(messid){
    let ele = document.getElementById("mess_" + messid);
    try{
        if (ele.children[2].children[0].innerHTML === ele.nextElementSibling.children[2].children[0].innerHTML &&
        ele.children[2].children[0].getAttribute('style') !== 'display: none!important;'){
            ele.nextElementSibling.children[2].children[0].setAttribute('style', '');
            ele.nextElementSibling.children[2].setAttribute('style', '');
            $(ele.nextElementSibling).css('margin-top', '');
            if (messages_[current_room][ele.id].senderid !== self){
                ele.nextElementSibling.children[0].setAttribute('style', '');
            }
        }
    } catch (err){} // do noting on error
    ele.remove();
    const index = messages[current_room].indexOf(parseInt(messid));
    if (index > -1) {
        messages[current_room].splice(index, 1);
        delete messages_[current_room]['mess_' + messid];
    }
}
