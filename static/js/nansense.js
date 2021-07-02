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
    let sub = 1;
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
                let code = uni.toString(16).toUpperCase();
                if (code.length > 4) {
                    for (let j in emojis_) {
                        let emoji = emojis_[j];
                        if (code == emoji.unicode.apple) {
                            rep[index] = {};
                            rep[index].shortcode = emoji.shortcode;
                            rep[index].value = String.fromCodePoint(uni);
                            rep[index].sub = sub;
                            break;
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
        ind = parseInt(ind);
        let replacement = '<div style="width: 1.5rem; height: 1.5rem;display: inline-block; color: transparent" contenteditable="false" class="emoji-' + rep[ind].shortcode + '">' + rep[ind].value + '</div>';

        let str = mess.innerHTML;
        mess.childNodes.forEach(function (){

        });

        mess.innerHTML = str.substring(0, ind + extra) + replacement + str.substring(ind + extra + 2);
        extra += replacement.length - 2;
    }
    console.log(mess.outerHTML);
}

$(document).on('click', 'div.ballon > button[data-type="delete"]', function (){
    console.log(this.parentNode.parentNode.id);
    $("#modal-confirm").modal('show');
    var modalConfirm = function(callback) {
        $("#modal-confirm-yes").on("click", function () {
            $("#modal-confirm").modal('hide');
            callback(true);
        });

        $("#modal-confirm-no").on("click", function () {
            $("#modal-confirm").modal('hide');
            callback(false);
        });
    }

    modalConfirm(function(confirm) {
        if (confirm) {
            //Acciones si el usuario confirma
            alert("YES");
        } else {
            //Acciones si el usuario no confirma
            alert("NO");
        }
    });
});