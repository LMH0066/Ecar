let userName, email, avatar;

function initDate() {
    //message_edit.html
    $('#email_setting').val(email);
    $('#user_name_setting').val(userName);

    if (avatar === "/media/" || avatar === "") {
        avatar = "/static/images/avatar.jpg";
    }
    $('.my-avatar').attr("src", avatar);
    $('.my-name').text(userName);
    $('.my-email').append(email);
    $('.my-email').attr("href", "mailto:" + email);
}

//获取个人信息
function AccessPersonalInformation() {
    $.ajax({
        url: '/auth/AccessInformation',
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'JSON',
        success: function (result) {
            //result.status为真则有搜索到数据
            if (result.status) {
                userName = result.data.userName;
                email = result.data.email;
                avatar = result.data.avatar;
                initDate();
            }
        }
    })
}

$(function () {
    AccessPersonalInformation();
});

// 报错提示
function Oops(info) {
    swal({
        type: 'error',
        title: 'Oops...',
        text: info,
        padding: '2em'
    })
}