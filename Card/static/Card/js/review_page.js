$(function () {
    $('#container').addClass("sidebar-closed");         //隐藏侧边栏
    let review_card_a = $('#review_card_a');
    review_card_a.attr("aria-expanded", true);
    review_card_a.attr("data-active", true);
    $('.cards').commentCards();
    document.onkeydown = function () {
        keyMonitor()
    };
});


function keyMonitor() {
    if (event.keyCode === 32) {
        let $card_current = $('.card--current');
        if ($card_current.children('.card-front').hasClass('showBack')) {
            $card_current.children('.card-front').removeClass('showBack');
            $card_current.children('.card-back').removeClass('showFront');
        } else {
            $card_current.children('.card-front').addClass('showBack');
            $card_current.children('.card-back').addClass('showFront');
        }
    }
}