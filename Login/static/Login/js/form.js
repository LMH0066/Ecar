$('.toggle').on('click', function () {
    $('.container').stop().addClass('active');
});

$('.close').on('click', function () {
    $('.container').stop().removeClass('active');
});

function check(form) {
    let value = form.email.value;
    let apos = value.indexOf("@");
    let dotpos = value.lastIndexOf(".");
    if (apos < 1 || dotpos - apos < 2) {
        form.email.focus();
        alert("邮箱格式错误");
        return false
    } else {
        return true
    }
}