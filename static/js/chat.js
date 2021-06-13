const roomName = JSON.parse(document.getElementById('room-name').textContent);
let messages = [];


// checks if messages dows not exist in existing messages and appends it in chat log
function update_messages(message, i){
    if (messages.indexOf(message.id) === -1){
        let log = document.getElementById("chat-log");
        log.value = message.sender + " " + message.senderid + "\n" + message.message + "\n" + log.value;
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
            document.querySelector('#chat-log').value += (data.username + ' ');
            document.querySelector('#chat-log').value += (data.userid + '\n');
            document.querySelector('#chat-log').value += (data.message + '\n');
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