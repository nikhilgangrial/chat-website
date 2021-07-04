var caret_position_mes=0;

// intialize emojipicker
setTimeout(function () {
    try {
        mes_inp.emojiPicker('toggle');
        mes_inp.emojiPicker('toggle');
    }
    catch (err){}
}, 1500);

$("#emojibutton").click(function (e){
    e.preventDefault();
    mes_inp.emojiPicker('toggle');
});


// parse message before send
function parse_before_send() {
    let mess = $("#chat-message-input")[0];
    let rep = {};
    let index = 0;
    mess.childNodes.forEach(function (node) {
        if (node.nodeType === 3) {
            let str = node.nodeValue;
            str.replace(/&nbsp/, " ");
            str.replace(/&gt/, ">");
            str.replace(/&lt/, "<");
            str.replace(/&amp/, "&");
            str.replace(/&apos/, "'");
            str.replace(/&quot/, "\"");

            for (let i = 0; i < str.length; i++) {
                let uni = str.codePointAt(i);
                let code = uni.toString(16).toUpperCase().toString();
                if (code.length >= 4) {

                    for (let j in emojis_) {
                        let emoji = emojis_[j];
                        let temp = emoji.unicode.apple.split('-')
                        if (temp.includes(code)) {
                            // noinspection JSUnfilteredForInLoop
                            if (temp.length === 2) {
                                i += 2;
                                let uni_ = uni;
                                uni = str.codePointAt(i);
                                code += '-' + uni.toString(16).toUpperCase();
                                for (let j in emojis_) {
                                    let emoji = emojis_[j];
                                    if (emoji.unicode.apple === code) {
                                        rep[index] = {};
                                        rep[index].shortcode = emoji.shortcode;
                                        rep[index].value = String.fromCodePoint(uni_, uni);
                                        rep[index].sub = 2;
                                        break;
                                    }
                                }
                                continue;
                            } else {
                                rep[index] = {};
                                rep[index].shortcode = emoji.shortcode;
                                rep[index].value = String.fromCodePoint(uni);
                                index += 1;
                                i++;
                                break;
                            }
                        }
                    }
                }
                index += 1;
                if (str[i] === ' '){
                    index += 5;
                } else if (str[i] === '&'){
                    index += 4;
                } else if (str[i] === '>' || str[i] === '<') {
                    index += 3;
                }
            }
        } else {
            index += node.outerHTML.length;
        }
    });
    let extra = 0
    for (let ind in rep) {
        let sub = 0;
        if (rep[ind].sub){
            sub = 2;
        }

        let replacement = '<div style="width: 1.5rem; height: 1.5rem;display: inline-block; color: transparent" contenteditable="false" class="emoji-' + rep[ind].shortcode + '">' + rep[ind].value + '</div>';
        let str = mess.innerHTML;
        mess.childNodes.forEach(function (){

        });

        ind = parseInt(ind);
        mess.innerHTML = str.substring(0, ind + extra) + replacement + str.substring(ind + extra + 2 + sub);

        extra += replacement.length - 2;
    }
}

$(document).on('click', 'div.ballon > button[data-type="delete"]', function (){
    let mess_id = parseInt(this.parentNode.parentNode.id.substring(5));
    let modal = $("#modal-confirm");
    let content = modal[0].children[0].children[0].children;
    content[0].innerHTML = 'Delete message';
    content[1].innerHTML = 'Are you sure you want to delete this message?';
    modal.modal('show');
    var modalConfirm = function(callback) {
        $("#modal-confirm-yes").on("click", function () {
            $("#modal-confirm").modal('hide');
            callback(true);
            $("#modal-confirm-no").off();
            $("#modal-confirm-yes").off();
        });

        $("#modal-confirm-no").on("click", function () {
            $("#modal-confirm").modal('hide');
            callback(false);
            $("#modal-confirm-no").off();
            $("#modal-confirm-yes").off();
        });
    }

    modalConfirm(function(confirm) {
        if (confirm) {
            chatSocket.send(JSON.stringify({
                'mess_id': mess_id,
                'type_': 'delete'
            }));
        } else {
        }
    });
});


$(document).on('click', 'div.ballon > button[data-type="reply"]', function (){
    console.log("relply " + this.parentNode.parentNode.id);
});


$(document).on('click', 'div.selected-user > div > span[data-type="delete"]', function (){
    let modal = $("#modal-confirm");
    let content = modal[0].children[0].children[0].children;
    content[0].innerHTML = 'Delete messages';
    content[1].innerHTML = 'Are you sure you want to delete selected messages?<br><br><span style="font-size: 0.75rem; font-weight: bold">Note: Only Messages Sent by you wlii be Deleted.</span>';
    modal.modal('show');
    let mess_ids = []
    selected_messages.forEach(function (ele_id) {
        if (messages_[ele_id].sender_id === self) {
            mess_ids.push(parseInt(ele_id.substring(5)));
        }
        console.log("here");
    });
    var modalConfirm = function(callback) {
        $("#modal-confirm-yes").on("click", function () {
            $("#modal-confirm").modal('hide');
            callback(true);
            $("#modal-confirm-no").off();
            $("#modal-confirm-yes").off();
        });

        $("#modal-confirm-no").on("click", function () {
            $("#modal-confirm").modal('hide');
            callback(false);
            $("#modal-confirm-no").off();
            $("#modal-confirm-yes").off();
        });
    }

    modalConfirm(function(confirm) {
        if (confirm) {
            chatSocket.send(JSON.stringify({
                'mess_ids': mess_ids,
                'type_': 'delete_multi'
            }));
            $('div.selected-user > div > span[data-type="cancel"]').click();
        } else {
        }
    });
})


$(document).on('click', 'div.selected-user > div > span[data-type="cancel"]', function (){
    let mess = $('li.chat-left, li.chat-right');
    mess.attr('selected_', 'false');
    mess.css('background', '');
    $('li.chat-right > div.ballon, li.chat-left > div.ballon').css('visibility',  '');
    let options = $('div.selected-user > div');
    setTimeout(function () {
        options.css('visibility', 'hidden');
        options.css('animation', '');
    },150);
    selecting = false;
    selected_messages = [];
})


$(document).on('click', 'div.selected-user > div > span[data-type="copy"]', function (e){
    if (selected_messages.length > 0) {
        let result = "<div style='width: 100%; height: auto; position: relative;'>\n";
        let result_ = '';
        selected_messages.forEach(function (mess_id) {
            let ele = document.getElementById(mess_id);
            if (ele.className === "chat-left"){
                result += '  <div style="position: absolute; left: 0; text-align: left; max-width: 70%;">\n';
            } else{
                result += '  <div style="position: absolute; right: 0; text-align: right; max-width: 70%;">\n';
            }
            let mess = ele.children[2].children;
            result += '    <div style="font-size: 12px">' + mess[0].innerHTML + '</div>\n';
            result += '    <div style="font-size: 12px">' + mess[1].innerText + '</div>\n';
            result += '    <div style="font-size: 12px">' + mess[2].innerText + '</div>\n';
            result += "  </div>\n";

            result_ += mess[0].innerHTML + '\n';
            result_ += mess[1].innerText + '\n';
            result_ += mess[2].innerText + '\n';
        });
        result += "</div>";
        function copyToClipboard(text) {
            const elem = document.createElement('textarea');
            elem.value = text;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
        }
        copyToClipboard(result);
        console.log(result);
        console.log(result_);
        e.preventDefault();
    }
})


$('[contenteditable]').on('paste', function (event){
    if (!event.currentTarget.innerHTML){
        event.currentTarget.innerHTML = '&nbsp';
    }
});

$(document).on('copy', function (event){
    console.log(event);
    console.log(window.getSelection());
});

$('#big-image-container').on('click', function (event){
    if (event.target === event.currentTarget){
        revert_big_image();
    }
});


var timeoutId = 0;
let selecting = false;
let selected_messages = [];

const selecting_event = new Event('selecting');

$(document).on('mousedown touchstart', 'li.chat-right, li.chat-left', function(event) {
    console.log(event);
    if (event.type === 'mousedown'){
        if (event.which !== 1){
            return ;
        }
    }
    if (!selecting) {
        timeoutId = setTimeout(function () {
            console.log(event.target);
            selecting = true;
            document.dispatchEvent(selecting_event);
            if (!event.currentTarget.getAttribute('selected_') || event.currentTarget.getAttribute('selected_') === 'false') {
                event.currentTarget.setAttribute('selected_', 'true');
                event.currentTarget.setAttribute('style', 'background: rgba(51, 153, 255, 0.45)');
                selected_messages.push(event.currentTarget.id);
            } else {
                event.currentTarget.setAttribute('selected_', 'false');
                event.currentTarget.setAttribute('style', '');
                const index = selected_messages.indexOf(event.currentTarget.id);
                if (index > -1) {
                    selected_messages.splice(index, 1);
                }
            }
        }, 750);
    } else {
        console.log(event.currentTarget.getAttribute('selected_'));
        if (!event.currentTarget.getAttribute('selected_') || event.currentTarget.getAttribute('selected_') === 'false') {
            event.currentTarget.setAttribute('selected_', 'true');
            event.currentTarget.setAttribute('style', 'background: rgba(51, 153, 255, 0.45)');
            selected_messages.push(event.currentTarget.id);
        } else {
            event.currentTarget.setAttribute('selected_', 'false');
            event.currentTarget.setAttribute('style', '');
            const index = selected_messages.indexOf(event.currentTarget.id);
            if (index > -1) {
                selected_messages.splice(index, 1);
            }
        }
    }
}).on('mouseup mouseleave mousemove touchend touchleave', function() {
    clearTimeout(timeoutId);
});


$(document).on('selecting', function (){
    $('li.chat-right > div.ballon, li.chat-left > div.ballon').css('visibility',  'hidden');
    let options = $('div.selected-user > div');
    options.css('visibility', 'visible');
    options.css('animation', 'linear .2s fadeIn 1');
});
