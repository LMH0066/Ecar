$(function () {
    $('#container').addClass("sidebar-closed");         //隐藏侧边栏
    let review_card_a = $('#review_card_a');
    review_card_a.attr("aria-expanded", true);
    review_card_a.attr("data-active", true);
    $('.cards').append($("<li class='card'>" +
        "                     <div class='card-front'>" +
        "                         <h1>Really?</h1>" +
        "                         <br/>" +
        "                     </div>" +
        "                     <div class='card-back'>" +
        "                         <h1>Really?</h1>" +
        "                         <br/>" +
        "                     </div>" +
        "                 </li>"));
    $('.cards').commentCards();
    let key_flag = false, is_key_down = false;
    document.onkeydown = function () {
        if (key_flag || is_key_down)
            return;
        is_key_down = true;
        keyMonitor();
        key_flag = true;
        setTimeout(function () {
            is_key_down = false;
        }, 800);       //一秒内不能重复点击
    };
    document.onkeyup = function () {
        key_flag = false;
    };
});