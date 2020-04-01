$('.search > input').on('keyup', function () {
    let rex = new RegExp($(this).val(), 'i');
    $('.people .person').hide();
    $('.people .person').filter(function () {
        return rex.test($(this).text());
    }).show();
});

$('.user-list-box .person').on('click', function (event) {
    if ($(this).hasClass('.active')) {
        return false;
    } else {
        let findChat = $(this).attr('data-chat');
        let personName = $(this).find('.user-name').text();
        let hideTheNonSelectedContent = $(this).parents('.chat-system').find('.chat-box .chat-not-selected').hide();
        let showChatInnerContent = $(this).parents('.chat-system').find('.chat-box .chat-box-inner').show();

        if (window.innerWidth <= 767) {
            $('.chat-box .current-chat-user-name .name').html(personName.split(' ')[0]);
        } else if (window.innerWidth > 767) {
            $('.chat-box .current-chat-user-name .name').html(personName);
        }
        getChats(findChat);
        $('.chat').removeClass('active-chat');
        $('.user-list-box .person').removeClass('active');
        $('.chat-box .chat-box-inner').css('height', '100%');
        $(this).addClass('active');
        $('.chat[data-chat = ' + findChat + ']').addClass('active-chat');
    }
    if ($(this).parents('.user-list-box').hasClass('user-list-box-show')) {
        $(this).parents('.user-list-box').removeClass('user-list-box-show');
    }
    $('.chat-meta-user').addClass('chat-active');
    $('.chat-box').css('height', 'calc(100vh - 232px)');
    $('.chat-footer').addClass('chat-active');

    const ps = new PerfectScrollbar('.chat-conversation-box', {
        suppressScrollX: true
    });

    const getScrollContainer = document.querySelector('.chat-conversation-box');
    getScrollContainer.scrollTop = 0;
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
        $messageHtml = '<div class="bubble me">' + chatMessageValue + '</div>';
        let appendMessage = $(this).parents('.chat-system').find('.active-chat').append($messageHtml);
        const getScrollContainer = document.querySelector('.chat-conversation-box');
        getScrollContainer.scrollTop = getScrollContainer.scrollHeight;
        let clearChatInput = chatInput.val('');
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
                let chat_container = $('#chat-conversation-box-scroll .chat[data-chat = ' + findChat + ']');
                console.log(ret['data']);
                for (let i = 0; i < ret['data'].length; i++) {

                }
            } else {
                Oops(ret['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}