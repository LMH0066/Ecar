$(function () {
    let sg_a = $('#sg_a');
    sg_a.attr("aria-expanded",true);
    sg_a.attr("data-active",true);
    $('#sg_ul').addClass("show");
    $('#forum_li').addClass("active");
    getStudyGroup();
    initCardTable();
});

function getStudyGroup() {
    $.ajax({
        url: "/group/GetStudyGroup",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            if (ret['status']) {
                for (let i = 0; i < ret['data'].length; i++) {
                    addGroup(ret['data'][i]);
                }
                setInterval(updateChat, 1000);
            } else {
                Oops(ret['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

function addGroup(data) {
    // console.log(data);
    $('.people').append($("" +
        "<div class='person' data-deck-id='"+ data['deck_id'] +"'" +
        " data-chat='group_"+ data['group_id'] +"' onclick='showChat(this)'>" +
        "   <div class='user-info'>" +
        "       <div class='f-body'>" +
        "           <div class='meta-info'>" +
        "               <span class='user-name' data-name='"+ data['group_name'] +"'>" + data['group_name'] + "</span>" +
        "           </div>" +
        "           <span data-deck-name='"+ data['deck_name'] +"'" +
        "            class='preview deck-name'>deck name: "+ data['deck_name'] +"</span>" +
        "       </div>" +
        "   </div>" +
        "</div>"));
    $('#chat-conversation-box-scroll').append($("" +
        "<div class='chat' data-chat='group_"+ data['group_id'] +"'></div>"));
}

function showGroupCards() {
    let $group = $('.user-list-box .person').filter('.active');
    let deck_id = $group.attr('data-deck-id'),
        deck_name = $group.find('.deck-name').attr('data-deck-name');
    showCards(deck_id);
}

function deckShare() {
    let $group = $('.user-list-box .person').filter('.active');
    let deck_id = $group.attr('data-deck-id');
    shareDeck(deck_id);
}