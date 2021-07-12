// intialize emojipicker
setTimeout(function () {
    try {
        messinp.emojiPicker('toggle');
        messinp.emojiPicker('toggle');
    }
    catch (err){}
}, 1500);

$("#emojibutton").on('click', function (e){
    e.preventDefault();
    messinp.emojiPicker('toggle');
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
                        // noinspection JSUnfilteredForInLoop
                        let emoji = emojis_[j];
                        let temp = emoji.unicode.apple.split('-')
                        if (temp.includes(code)) {
                            if (temp.length === 2) {
                                i += 2;
                                let uni_ = uni;
                                uni = str.codePointAt(i);
                                code += '-' + uni.toString(16).toUpperCase();
                                for (let j in emojis_) {
                                    // noinspection JSUnfilteredForInLoop
                                    let emoji = emojis_[j];
                                    if (emoji.unicode.apple === code) {
                                        rep[index] = {};
                                        rep[index].shortcode = emoji.shortcode;
                                        rep[index].value = String.fromCodePoint(uni_, uni);
                                        rep[index].sub = 2;
                                        break;
                                    }
                                }
                                // continue; i do non't khow why :pain:
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
    let mess_id = parseInt(this.parentElement.parentElement.id.substring(5));
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

$(document).on('click', 'div.ballon > button[data-type="reply"]', reply_message);

let click_count = 0;
let dbl_timeout = 0;
$(document).on('click', 'li.chat-left, li.chat-right', function (event) {
    clearTimeout(dbl_timeout);
    click_count += 1;
    if (click_count === 2) {
        reply_message(event);
        click_count = 0;
    } else {
        dbl_timeout = setTimeout(function () {
            click_count = 0;
        }, 250);
    }
});

function reply_message(event){
    if (selecting){
        return;
    }
    let messid;
    if (event.currentTarget.tagName === "BUTTON") {
        messid = event.currentTarget.parentElement.parentElement.id;
    } else{
        messid = event.currentTarget.id;
    }

    $('.input-group-upper').remove();
    // noinspection EqualityComparisonWithCoercionJS
    if (reply_mess_id != 0){
        let mess = $(`#${reply_mess_id}`);
        mess.css("background", "");
        mess.css("border-left", "")
    }

    reply_mess_id = messid;
    let mess = $(`#${messid}`);
    mess.css("background", "#2e2e30");
    mess.css("border-left", "var(--primary) 0.25rem solid")

    let ele = $(".publisher")[0];
    // noinspection JSCheckFunctionSignatures   //TODO: DO SOMETHING WHILE SENDING
    let to_be_appeded = `<div style="position: relative; width: 100%;background: #111111;border-radius: 0.5rem 0.5rem 0 0; height: 2rem; display: flex; padding: 0.2rem 0.5rem; align-items: center;" class="input-group-upper" onclick="reply_message_scroll(event, ${messid})">
                        <span style="font-size: 0.9rem">Replying to </span>
                        <span style="font-size: 0.9rem; padding-left: 0.25rem;font-weight: bold; color: #888888">${messages_[current_room][messid].sender}</span>
                        <span class="reply-close" style="padding: 0.25rem 0.5rem; position: absolute; right: 0.25rem; font-size: 0.9rem;-webkit-text-stroke: 0.03rem rgba(22, 22, 22, 1);"><i class="fa fa-times"></i></span>
                     </div>`;
    ele.insertAdjacentHTML("beforebegin", to_be_appeded);
    $("#chat-message-input").focus();
}

function reply_message_scroll(event, messid){
    if (event.target.getAttribute('class') !== "reply-close" && event.target.getAttribute('class') !== "fa fa-times" && !selecting) {
        event.preventDefault();
        messid.scrollIntoView({behavior: "smooth", block: "center"});
        if (messid.id === reply_mess_id){
            return;
        }
        if (isElementInViewport(messid)) {
                setTimeout(function (){$(messid).css('background', '#2e2e2e')}, 200);
                setTimeout(function (){$(messid).css('background', '')}, 400);
        } else {
            $(".chat-box").on('scroll', function (e) {
                if (isElementInViewport(messid)) {
                    setTimeout(function () {$(messid).css('background', '#2e2e2e')}, 200);
                    setTimeout(function () {$(messid).css('background', '')}, 400);
                    $(this).off(e);
                    e.stopPropagation();
                }
            });
        }
    } else {
        $('.input-group-upper').remove();
        // noinspection EqualityComparisonWithCoercionJS
        if (reply_mess_id != 0) {
            let mess = $(`#${reply_mess_id}`);
            mess.css("background", "");
            mess.css("border-left", "")
        }
        reply_mess_id = 0;
    }
}

$(document).on('click', 'div.selected-user > div > span[data-type="delete"]', function (){
    let modal = $("#modal-confirm");
    let content = modal[0].children[0].children[0].children;
    content[0].innerHTML = 'Delete messages';
    content[1].innerHTML = 'Are you sure you want to delete selected messages?<br><br><span style="font-size: 0.75rem; font-weight: bold">Note: Only Messages Sent by you wlii be Deleted.</span>';
    modal.modal('show');
    let mess_ids = []
    selected_messages.forEach(function (ele_id) {
        if (messages_[current_room][ele_id].senderid === self) {
            mess_ids.push(parseInt(ele_id.substring(5)));
        }
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
        options.fadeOut(200, function (){
            options.css('visibility', 'hidden');
        });
    },150);
    selecting = false;
    selected_messages = [];
})


$(document).on('click', 'div.selected-user > div > span[data-type="copy"]', function (event){
    if (selected_messages.length > 0) {
        let result = "";
        let result_ = '';
        selected_messages.sort();
        selected_messages.forEach(function (mess_id) {
            let ele = document.getElementById(mess_id);
            if (ele.className === "chat-left"){
                result += '  <span style="text-align: left;">';
            } else{
                result += '  <span style="text-align: right;">';
            }
            let mess = ele.children[2].children;
            result += '    <span style="font-size: 0.75rem">' + mess[0].innerText + '</span><br>';
            result += '    <span style="font-size: 1rem">' + mess[1].innerText + '</span><br>';
            result += '    <span style="font-size: 0.75rem">' + mess[2].innerText + '</span><br>';
            result += "  </span><br>";

            result_ += mess[0].innerText + '\n';
            result_ += mess[1].innerText + '\n';
            result_ += mess[2].innerText + '\n';
        });
        function listener(e) {
            e.clipboardData.setData("text/html", result.substring(0, result.length-1));
            e.clipboardData.setData("text/plain", result_);
            e.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);

        let popup = $(event.currentTarget.children[0]);
        popup.css({visibility: 'visible'});
        popup.fadeIn();
        popup.css({'left': (event.currentTarget.parentElement.parentElement.clientWidth - popup[0].offsetWidth)/2 + 'px'});
        setTimeout(function (){
            popup.fadeOut(200);
            // $('div.selected-user > div > span[data-type="cancel"]').click();
        }, 1200);
    }
})

$('[contenteditable]').on('paste', function (event){
    if (!event.currentTarget.innerHTML){
        event.currentTarget.innerHTML = '&nbsp';
    }
});

$('#big-image-container').on('click', function (event){
    if (event.target === event.currentTarget){
        revert_big_image();
    }
});

const selecting_event = new Event('selecting');

$(document).on('mousedown touchstart', 'li.chat-right, li.chat-left', function(event) {
    if (event.type === 'mousedown'){
        if (event.which !== 1){
            return ;
        }
    }
    // noinspection EqualityComparisonWithCoercionJS
    if (reply_mess_id != 0){
        return;
    }

    if (!selecting) {
        timeoutId = setTimeout(function () {
            event.preventDefault();
            selecting = true;
            document.dispatchEvent(selecting_event);
                event.currentTarget.setAttribute('selected_', 'true');
                let ele = $(event.currentTarget);
                ele.css('background', 'rgba(51, 153, 255, 0.45)');
                selected_messages.push(event.currentTarget.id);
        }, 750);
    } else {
        if (event.type === 'touchstart'){
            timeoutId = setTimeout(function () {
                if (!event.currentTarget.getAttribute('selected_') || event.currentTarget.getAttribute('selected_') === 'false') {
                    event.currentTarget.setAttribute('selected_', 'true');
                    $(event.currentTarget).css('background', 'rgba(51, 153, 255, 0.45)');
                    selected_messages.push(event.currentTarget.id);
                } else {
                    event.currentTarget.setAttribute('selected_', 'false');
                    $(event.currentTarget).css('background', '');
                    const index = selected_messages.indexOf(event.currentTarget.id);
                    if (index > -1) {
                        selected_messages.splice(index, 1);
                    }
                }
            }, 500);
        }
        else {
            if (!event.currentTarget.getAttribute('selected_') || event.currentTarget.getAttribute('selected_') === 'false') {
                event.currentTarget.setAttribute('selected_', 'true');
                $(event.currentTarget).css('background', 'rgba(51, 153, 255, 0.45)');
                selected_messages.push(event.currentTarget.id);
            } else {
                event.currentTarget.setAttribute('selected_', 'false');
                $(event.currentTarget).css('background', '');
                const index = selected_messages.indexOf(event.currentTarget.id);
                if (index > -1) {
                    selected_messages.splice(index, 1);
                }
            }
        }
    }
}).on('mouseup mouseleave mousemove touchend touchcancel', function() {
    clearTimeout(timeoutId);
});

$('ul.chat-box.no-copy').on('scroll touchcancel touchend', function (){
    clearTimeout(timeoutId)
});


$(document).on('selecting', function (){
    $('li.chat-right > div.ballon, li.chat-left > div.ballon').css('visibility',  'hidden');
    let options = $('div.selected-user > div');
    options.css('visibility', 'visible');
    options.fadeIn(200);
});


$(document).on('click', 'li.users_person', function (event){
    try {
        $('li.users_person.active-user')[0].setAttribute('class', 'users_person');
    }catch {}
    // noinspection EqualityComparisonWithCoercionJS
    if (event.currentTarget.getAttribute('data-chat') != current_room) {
        event.currentTarget.setAttribute('class', 'users_person active-user');
        chatSocket.send(JSON.stringify({
            'room': event.currentTarget.getAttribute('data-chat'),
            'type_': 'switchroom'
        }));
    }
});

$(document).on('click', function(){
    if (!selecting && reply_mess_id === 0) {
        if (highlighted) {
            highlighted.style.background = "";
        }
    }
    highlighted = null;
    $('.ctx-menu').css('display', 'none');
});

$(document).on('contextmenu', 'li.chat-right', function (e){
    e.preventDefault();
    let sel = $('.ctx-menu');
    if (check_selecting_reply(sel, e)){
        return;
    }

    if (highlighted){
        highlighted.style.background = "";
    }
    highlighted = e.currentTarget;
    e.currentTarget.style.background = "#30302e";
    sel.css({display: 'inherit', left: 'min(' + e.pageX + 'px, calc(100% - 10.2rem))', top: 'min(' + e.pageY + 'px, calc(100% - 12.2rem))'});
    sel[0].innerHTML =  '<div class="ctx-option">'+
                            '<span class="ctx-option-icon fa fa-edit"></span><span class="ctx-option-name">Edit</span>'+
                        '</div>'+
                        '<hr>'+
                        '<div class="ctx-option">'+
                            '<span class="ctx-option-icon fa fa-copy"></span><span class="ctx-option-name">Copy</span>'+
                        '</div>'+
                        '<hr>'+
                        '<div class="ctx-option">'+
                            '<span class="ctx-option-icon fa fa-reply"></span><span class="ctx-option-name">Reply</span>'+
                        '</div>'+
                        '<hr>'+
                        '<div class="ctx-option-danger">'+
                            '<span class="ctx-option-icon fa fa-trash-alt"></span><span class="ctx-option-name">Delete</span>'+
                        '</div>';

    sel[0].children[0].onclick = function (){highlighted.children[1].children[0].click()};
    sel[0].children[2].onclick = function (){copy_single_message(highlighted)};
    sel[0].children[4].onclick = function (){reply_message({currentTarget: highlighted})};
    sel[0].children[6].onclick = function (){highlighted.children[1].children[1].click()};
});

$(document).on('contextmenu', 'li.chat-left', function (e){
    e.preventDefault();
    let sel = $('.ctx-menu');
    if (check_selecting_reply(sel, e)){
        return;
    }

    if (highlighted){
        highlighted.style.background = "";
    }
    highlighted = e.currentTarget;
    e.currentTarget.style.background = "#30302e";
    sel.css({display: 'inherit', left: 'min(' + e.pageX + 'px, calc(100% - 10.2rem))', top: 'min(' + e.pageY + 'px, calc(100% - 8.2rem))'});
    sel[0].innerHTML =  '<div class="ctx-option">'+
                            '<span class="ctx-option-icon fa fa-copy"></span><span class="ctx-option-name">Copy</span>'+
                        '</div>'+
                        '<hr>'+
                        '<div class="ctx-option" onclick="reply_message(' + {currentTarget: e.currentTarget} +')">'+
                            '<span class="ctx-option-icon fa fa-reply"></span><span class="ctx-option-name">Reply</span>'+
                        '</div>';
    sel[0].children[0].onclick = function (){copy_single_message(highlighted)};
    sel[0].children[2].onclick = function (){reply_message({currentTarget: highlighted})};
});

function check_selecting_reply(sel, e){
    let target = e.currentTarget;
    if (selecting) {
        sel.css({display: 'inherit', left: 'min(' + e.pageX + 'px, calc(100% - 10.2rem))', top: 'min(' + e.pageY + 'px, calc(100% - 12.2rem))'});
        sel[0].innerHTML = '<div class="ctx-option">' +
                '<span class="ctx-option-icon fa fa-copy"></span><span class="ctx-option-name">Copy</span>' +
            '</div>' +
            '<hr>' +
            '<div class="ctx-option">' +
                '<span class="ctx-option-icon fa fa-share"></span><span class="ctx-option-name">Forward</span>' +
            '</div>'+
            '<hr>'+
            '<div class="ctx-option-danger">' +
                '<span class="ctx-option-icon fa fa-trash-alt"></span><span class="ctx-option-name">Delete</span>' +
            '</div>' +
            '<hr>' +'<hr>' +
            '<div class="ctx-option-danger">' +
                '<span class="ctx-option-icon fa fa-times"></span><span class="ctx-option-name">Cancel</span>' +
            '</div>';

        let rel = $('.selected-user')[0].children[1];
        sel[0].children[0].onclick = function (){rel.children[0].click()};
        sel[0].children[2].onclick = function (){rel.children[2].click()};
        sel[0].children[4].onclick = function (){rel.children[1].click()};
        sel[0].children[7].onclick = function (){rel.children[3].click()};
        return true;
    }
    // noinspection EqualityComparisonWithCoercionJS
    if (reply_mess_id != 0) {
        if (e.currentTarget.id === reply_mess_id) {
            sel.css({
                display: 'inherit',
                left: 'min(' + e.pageX + 'px, calc(100% - 10.2rem))',
                top: 'min(' + e.pageY + 'px, calc(100% - 8.2rem))'
            });
            sel[0].innerHTML =
                '<div class="ctx-option">' +
                '<span class="ctx-option-icon fa fa-copy"></span><span class="ctx-option-name">Copy</span>' +
                '</div>' +
                '<hr>' + '<hr>' +
                '<div class="ctx-option-danger">' +
                '<span class="ctx-option-icon fa fa-times"></span><span class="ctx-option-name">Cancel</span>' +
                '</div>';

            sel[0].children[0].onclick = function (){copy_single_message(target)};
            sel[0].children[3].onclick = function (){$('.reply-close')[0].click()};
            return true;
        }else{
            sel.css({
                display: 'inherit',
                left: 'min(' + e.pageX + 'px, calc(100% - 10.2rem))',
                top: 'min(' + e.pageY + 'px, calc(100% - 10.2rem))'
            });
            sel[0].innerHTML =
                '<div class="ctx-option">' +
                '<span class="ctx-option-icon fa fa-copy"></span><span class="ctx-option-name">Copy</span>' +
                '</div>' +
                '<hr>' +
                '<div class="ctx-option">' +
                '<span class="ctx-option-icon fa fa-reply"></span><span class="ctx-option-name">Reply</span>' +
                '</div>' +
                '<hr>' + '<hr>' +
                '<div class="ctx-option-danger">' +
                '<span class="ctx-option-icon fa fa-times"></span><span class="ctx-option-name">Cancel</span>' +
                '</div>';
            sel[0].children[0].onclick = function (){copy_single_message(target)};
            sel[0].children[2].onclick = function (){reply_message({currentTarget: target})};
            sel[0].children[5].onclick = function (){$('.reply-close')[0].click()};
            return true;
        }
    }
}

$(document).on('contextmenu', 'ul.chat-box.no-copy', function (e){e.preventDefault()});

function copy_single_message(ele) {
    let str;
    ele = ele.children[2].children[1];
    ele = $(ele).clone()[0];

    try{if (ele.children[0].className === "chat-reply") {
        ele.innerHTML = ele.innerHTML.toString().replace(ele.children[0].outerHTML.toString(), "");
    }}
    catch{}
    str = ele.innerText;

    function listener(e) {
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }

    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}
