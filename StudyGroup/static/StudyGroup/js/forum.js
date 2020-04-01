$(function () {
    let sg_a = $('#sg_a');
    sg_a.attr("aria-expanded",true);
    sg_a.attr("data-active",true);
    $('#sg_ul').addClass("show");
    $('#forum_li').addClass("active");
    getStudyGroup();
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
    $('.people').append($("" +
        "<div class='person' data-chat='group_"+ data['group_id'] +"' onclick='showChat(this)'>" +
        "   <div class='user-info'>" +
        "       <div class='f-body'>" +
        "           <div class='meta-info'>" +
        "               <span class='user-name' data-name='"+ data['group_name'] +"'>" + data['group_name'] + "</span>" +
        "           </div>" +
        "           <span class='preview'>deck name: "+ data['deck_name'] +"</span>" +
        "       </div>" +
        "   </div>" +
        "</div>"));
    $('#chat-conversation-box-scroll').append($("" +
        "<div class='chat' data-chat='group_"+ data['group_id'] +"'></div>"));
}