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
    console.log(mess.childNodes);
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

            console.log(str);
            for (let i = 0; i < str.length; i++) {
                let uni = str.codePointAt(i);
                let code = uni.toString(16).toUpperCase().toString();
                if (code.length >= 4) {
                    for (let j in emojis_) {
                        let emoji = emojis_[j];
                        let temp = emoji.unicode.apple.split('-')
                        if (temp.includes(code)) {
                            if (temp.length === 2) {
                                i += 2;
                                let uni_ = uni;
                                uni = str.codePointAt(i);
                                code += '-' + uni.toString(16).toUpperCase();
                                console.log(code);
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
                                break;
                            }
                        }
                    }
                }
                index += 1;
                console.log(str[i]);
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
    console.log(rep);
    let extra = 0
    for (let ind in rep) {
        let sub = 0;
        if (rep[ind].sub){
            sub = 2;
        }
        ind = parseInt(ind);
        let replacement = '<div style="width: 1.5rem; height: 1.5rem;display: inline-block; color: transparent" contenteditable="false" class="emoji-' + rep[ind].shortcode + '">' + rep[ind].value + '</div>';

        let str = mess.innerHTML;
        mess.childNodes.forEach(function (){

        });

        mess.innerHTML = str.substring(0, ind + extra) + replacement + str.substring(ind + extra + 2 + sub);
        extra += replacement.length - 2;
    }
    console.log(mess.outerHTML);
}

$(document).on('click', 'div.ballon > button[data-type="delete"]', function (){
    let mess_id = parseInt(this.parentNode.parentNode.id.substring(5));
    $("#modal-confirm").modal('show');
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