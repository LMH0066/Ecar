$(function () {
    $('#container').addClass("sidebar-closed");         //隐藏侧边栏
    let review_card_a = $('#review_card_a');
    review_card_a.attr("aria-expanded", true);
    review_card_a.attr("data-active", true);
    $('.cards').commentCards();
});