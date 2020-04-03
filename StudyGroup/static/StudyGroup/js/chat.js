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
    }
});

$('.hamburger, .chat-system .chat-box .chat-not-selected p').on('click', function (event) {
    $(this).parents('.chat-system').find('.user-list-box').toggleClass('user-list-box-show')
});

function getChats(findChat) {
    let group_id = findChat.split('_')[1];
    let form_data = new FormData();
    form_data.append('group_id', group_id);
    $.ajax({
        url: "/group/GetChats",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            if (ret['status']) {
                // 清空
                let chat_container = $('#chat-conversation-box-scroll .chat[data-chat = ' + findChat + ']');
                chat_container.empty();
                // console.log(chat_container);
                let data = ret['data'];
                for (let i = 0; i < data.length; i++) {
                    let $messageHtml;
                    if (data[i]['from_is_me']) {
                        $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble me">' + data[i]['content'] + '</div>';
                    } else {
                        $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble you">' + data[i]['content'] + '</div>';
                    }
                    $('.mail-write-box').parents('.chat-system').find('.active-chat').append($messageHtml);
                }
                const getScrollContainer = document.querySelector('.chat-conversation-box');
                getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
            }
        },
        error: function () {
            Oops("");
        }
    })
}

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
        getChats(findChat);
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
    let form_data = new FormData();
    form_data.append('content', content);
    $.ajax({
        url: "/group/ChatGroup",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            if (ret['status']) {
                let $messageHtml = '<div data-chat-id="' + ret['data']['chat_id'] + '" class="bubble me">' + content + '</div>';
                chatInput.parents('.chat-system').find('.active-chat').append($messageHtml);
                const getScrollContainer = document.querySelector('.chat-conversation-box');
                getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
                chatInput.val('');
            } else {
                Oops(ret['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

function updateChat() {
    let $chat = $('.active-chat');
    if ($chat.length > 0) {
        let chat_id = $chat.children("div:last-child").attr('data-chat-id');
        let form_data = new FormData();
        form_data.append('chat_id', chat_id);
        $.ajax({
            url: "/group/UpdateChatMessage",
            type: "POST",
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (ret) {
                if (ret['status']) {
                    let data = ret['data'];
                    for (let i = 0; i < data.length; i++) {
                        let $messageHtml;
                        if (data[i]['from_is_me']) {
                            $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble me">' + data[i]['content'] + '</div>';
                        } else {
                            $messageHtml = '<div data-chat-id="' + data[i]['chat_id'] + '" class="bubble you">' + data[i]['content'] + '</div>';
                        }
                        $('.mail-write-box').parents('.chat-system').find('.active-chat').append($messageHtml);
                    }
                    const getScrollContainer = document.querySelector('.chat-conversation-box');
                    getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
                }
            },
            error: function () {
                Oops("");
            }
        })
    }
}