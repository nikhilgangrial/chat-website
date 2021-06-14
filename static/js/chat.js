const roomName = JSON.parse(document.getElementById('room-name').textContent);
let messages = [];
let self = ""


// checks if messages dows not exist in existing messages and appends it in chat log
function closest_message(key){
    const closest = messages.reduce((a, b) => {
        return Math.abs(b - key) < Math.abs(a - key) ? b : a;
    })
    return closest;
}

function update_messages(message, i=0){
    if (messages.indexOf(message.id) === -1){

        let classes = "message ";
        if (message.senderid === self){
            classes += "self ";
        }else{
            classes += "other ";
        }
        let id_ = "mess_" + message.id;

        if (messages.length === 0){
            document.getElementById("chat-log").innerHTML += "<div class='" + classes +"' id='" + id_ + "'>" + message.sender + " " + message.senderid + "<br>" + message.message + "</div>";
        } else {
            let min = Math.min.apply(null, messages);
            let max = Math.max.apply(null, messages);
            if (message.id > max) {
                let mess = document.getElementById("mess_"+max);
                mess.insertAdjacentHTML("afterend", "<div class='" + classes +"' id='" + id_ + "'>" + message.sender + " " + message.senderid + "<br>" + message.message + "</div>")
            } else if (message.id < min) {
                let mess = document.getElementById("mess_"+min);
                mess.insertAdjacentHTML("beforebegin", "<div class='" + classes +"' id='" + id_ + "'>" + message.sender + " " + message.senderid + "<br>" + message.message + "</div>")
            } else{
                let closest = closest_message(message.id);
                if (closest > message.id){
                    let mess = document.getElementById("mess_"+closest);
                    mess.insertAdjacentHTML("beforebegin", "<div class='" + classes +"' id='" + id_ + "'>" + message.sender + " " + message.senderid + "<br>" + message.message + "</div>")
                } else{
                    let mess = document.getElementById("mess_"+closest);
                    mess.insertAdjacentHTML("afterend", "<div class='" + classes +"' id='" + id_ + "'>" + message.sender + " " + message.senderid + "<br>" + message.message + "</div>")
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
            update_messages({'sender': data.username, 'senderid': data.userid, 'message': data.message, 'id': data.messageid});
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
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }
    };

    // Send button function
    document.querySelector('#chat-message-submit').onclick = function (e) {
        const messageInputDom = document.querySelector('#chat-message-input');
        const message = messageInputDom.value;
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        messageInputDom.value = '';
    };
}

connect();