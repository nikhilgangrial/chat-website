
const roomName = JSON.parse(document.getElementById('room-name').textContent);
let messages = [];
let self = ""


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

        let message_to_be_appeded = "";
        // TODO: add user profile
        if (message.senderid === self){
            message_to_be_appeded = '<li class="chat-right" id="mess_' + message.id + '">\
                                        <div class="chat-text"><div class="chat-name">' + message.sender + '</div>' +
                                            message.message +
                                            '<div class="chat-hour">' + time_ + '<span class="fa fa-check-circle"></span></div>\
                                        </div>\
                                    </li>'
        }else{
            message_to_be_appeded = '<li class="chat-left" id="mess_' + message.id + '">\
                                        <div class="chat-avatar">\
                                            <img class="user-av" src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin">\
                                        </div>\
                                        <div class="chat-text"><div class="chat-name">' + message.sender + '</div>' +
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
    }
}



// requests messages from server
function get_messages(from=0){
    $.ajax({
        type:"POST",
        url: "/chat/" + roomName + "/",
        data: {
            'from': from
        },
        success: function(response)
        {
            console.log(response);
            self = response['self'];
            response['messages'].forEach(update_messages);
            }
        }
    )
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
        console.log(data);
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
        console.log(e);
        if (e.keyCode === 13 && !e.shiftKey) {  // enter, return
            document.querySelector('#chat-message-submit').click();
            const messageInputDom = document.querySelector('#chat-message-input');
            let message = messageInputDom.innerHTML.toString();
            console.log(message);
            message = message.replace(/<br>$/, "");
            message = message.replace(/<div><br><\/div>$/, "");
            console.log(message);
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.innerHTML = '';
        }
    };

    // Send button function
    document.querySelector('#chat-message-submit').onclick = function (e) {
        const messageInputDom = document.querySelector('#chat-message-input');
        let message = messageInputDom.innerHTML;
        console.log(message);
        message = message.replace(/<br>$/, "");
        message = message.replace(/<div><br><\/div>$/, "");
        console.log(message);
        chatSocket.send(JSON.stringify({
            'message': message.trim()
        }));
        messageInputDom.innerHTML = '';
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

var docWidth = document.documentElement.offsetWidth;
console.log(window.innerWidth);
[].forEach.call(document.querySelectorAll('*'), function(el) {
            if (el.offsetWidth > docWidth) {
                console.log(el);
                }
            }
    );

$('#file-group').on('click', function (){
    document.getElementById('file-select-button').click();
})
