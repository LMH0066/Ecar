$('.search > input').on('keyup', function () {
    let rex = new RegExp($(this).val(), 'i');
    $('.people .person').hide();
    $('.people .person').filter(function () {
        return rex.test($(this).text());
    }).show();
});

const ps = new PerfectScrollbar('.people', {
    suppressScrollX: true
});

$('.mail-write-box').on('keydown', function (event) {
    let $messageHtml;
    if (event.key === 'Enter') {
        let chatInput = $(this);
        let chatMessageValue = chatInput.val();
        if (chatMessageValue === '') {
            return;
        }
        sendChat(chatMessageValue, chatInput);
        chatInput.val('');
    }
});

$('.hamburger, .chat-system .chat-box .chat-not-selected p').on('click', function (event) {
    $(this).parents('.chat-system').find('.user-list-box').toggleClass('user-list-box-show')
});
// 用于判断是否正在轮循updateChat()
let updateVal;

// 第一次获取聊天信息
// function getChats(findChat) {
//     if (updateVal) {
//         clearInterval(updateVal);
//     }
//     let group_id = findChat.split('_')[1];
//     let form_data = new FormData();
//     form_data.append('group_id', group_id);
//     $.ajax({
//         url: "/group/GetChats",
//         type: "POST",
//         data: form_data,
//         cache: false,
//         contentType: false,
//         processData: false,
//         dataType: "json",
//         success: function (ret) {
//             if (ret['status']) {
//                 // 清空
//                 let chat_container = $('#chat-conversation-box-scroll .chat[data-chat = ' + findChat + ']');
//                 chat_container.empty();
//                 // console.log(chat_container);
//                 let data = ret['data'];
//                 for (let i = 0; i < data.length; i++) {
//                     let $messageHtml;
//                     if (data[i]['from_is_me']) {
//                         $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble me">' + data[i]['content'] + '</div>';
//                     } else {
//                         $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble you">' + data[i]['content'] + '</div>';
//                     }
//                     $('.mail-write-box').parents('.chat-system').find('.active-chat').append($messageHtml);
//                 }
//                 const getScrollContainer = document.querySelector('.chat-conversation-box');
//                 getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
//             }
//             updateVal = setInterval(updateChat, 1000);
//         },
//         error: function () {
//             Oops("");
//         }
//     })
// }

function showChat(div) {
    // console.log($(div).hasClass('active'));
    if ($(div).hasClass('active')) {
        return false;
    } else {
        let findChat = $(div).attr('data-chat');
        let personName = $(div).find('.user-name').text();
        let hideTheNonSelectedContent = $(div).parents('.chat-system').find('.chat-box .chat-not-selected').hide();
        let showChatInnerContent = $(div).parents('.chat-system').find('.chat-box .chat-box-inner').show();

        if (window.innerWidth <= 767) {
            $('.chat-box .current-chat-user-name .name').html(personName.split(' ')[0]);
        } else if (window.innerWidth > 767) {
            $('.chat-box .current-chat-user-name .name').html(personName);
        }
        // getChats(findChat);
        WebSocketTest(findChat);
        $('.chat').removeClass('active-chat');
        $('.user-list-box .person').removeClass('active');
        $('.chat-box .chat-box-inner').css('height', '100%');
        $(div).addClass('active');
        $('.chat[data-chat = ' + findChat + ']').addClass('active-chat');
    }
    if ($(div).parents('.user-list-box').hasClass('user-list-box-show')) {
        $(div).parents('.user-list-box').removeClass('user-list-box-show');
    }
    $('.chat-meta-user').addClass('chat-active');
    $('.chat-box').css('height', 'calc(100vh - 232px)');
    $('.chat-footer').addClass('chat-active');

    const ps = new PerfectScrollbar('.chat-conversation-box', {
        suppressScrollX: true
    });

    const getScrollContainer = document.querySelector('.chat-conversation-box');
    getScrollContainer.scrollTop = 0;
}

function sendChat(content, chatInput) {
    window.s.send(content);
    // let form_data = new FormData();
    // form_data.append('content', content);
    // $.ajax({
    //     url: "/group/ChatGroup",
    //     type: "POST",
    //     data: form_data,
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     dataType: "json",
    //     success: function (ret) {
    // if (ret['status']) {
    //     let $messageHtml = '<div data-chat-id="' + ret['data']['chat_id'] + '" class="bubble me">' + content + '</div>';
    //     chatInput.parents('.chat-system').find('.active-chat').append($messageHtml);
    //     const getScrollContainer = document.querySelector('.chat-conversation-box');
    //     getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
    //     chatInput.val('');
    // } else {
    //     Oops(ret['data']);
    // }
    //     },
    //     error: function () {
    //         Oops("");
    //     }
    // })
}

// function updateChat() {
//     let $chat = $('.active-chat');
//     if ($chat.length > 0) {
//         let chat_id = $chat.children("div:last-child").attr('data-chat-id');
//         let form_data = new FormData();
//         form_data.append('chat_id', chat_id);
//         $.ajax({
//             url: "/group/UpdateChatMessage",
//             type: "POST",
//             data: form_data,
//             cache: false,
//             contentType: false,
//             processData: false,
//             dataType: "json",
//             success: function (ret) {
//                 if (ret['status']) {
//                     let data = ret['data'];
//                     for (let i = 0; i < data.length; i++) {
//                         let $messageHtml;
//                         if (data[i]['from_is_me']) {
//                             $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble me">' + data[i]['content'] + '</div>';
//                         } else {
//                             $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble you">' + data[i]['content'] + '</div>';
//                         }
//                         $('.mail-write-box').parents('.chat-system').find('.active-chat').append($messageHtml);
//                     }
//                     const getScrollContainer = document.querySelector('.chat-conversation-box');
//                     getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
//                 }
//             },
//             error: function () {
//                 Oops("");
//             }
//         })
//     }
// }


function WebSocketTest(findChat) {
    let chat_container = $('#chat-conversation-box-scroll .chat[data-chat = ' + findChat + ']');
    chat_container.empty();
    if ("WebSocket" in window) {
        let group_id = findChat.split('_')[1];
        if (window.s) {
            window.s.close()
        }
        let ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
        // 打开一个 web socket
        let ws = new WebSocket(ws_scheme + "://" + window.location.host + "/group/ChatWebsocket/" + userName);

        ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            // console.log("准备信息");
            ws.send(group_id);
            // console.log("发送信息")
        };

        ws.onmessage = function (evt) {
            // console.log("接收信息")
            let ret = JSON.parse(evt.data);
            // console.log(ret);
            // console.log(chat_container);
            for (let i = 0; i < ret.length; i++) {
                let $messageHtml;
                if (ret[i]['from_is_me']) {
                    $messageHtml = '<div data-chat-id="' + ret[i]['chat_id'] + '" class="bubble me">' + ret[i]['content'] + '</div>';
                } else {
                    $messageHtml = '<div data-chat-id="' + ret[i]['chat_id'] + '" class="bubble you">' + ret[i]['content'] + '</div>';
                }
                $('.mail-write-box').parents('.chat-system').find('.active-chat').append($messageHtml);
            }
            const getScrollContainer = document.querySelector('.chat-conversation-box');
            getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
        };

        ws.onclose = function () {
            console.log("连接关闭")
            // 关闭 websocket
            // alert("连接已关闭...");
        };

        if (ws.readyState === WebSocket.OPEN) ws.onopen();
        window.s = ws;
    } else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
}