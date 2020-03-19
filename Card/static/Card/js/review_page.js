$.fn.commentCards = function () {
    return this.each(function () {
        let $this = $(this),
            $cards = $this.find('.card'),
            $current = $cards.filter('.card--current'),
            $next;
        $cards.on('click', function () {
            if (!$current.is(this)) {
                $cards.removeClass('card--current card--out card--next');
                $current.addClass('card--out');
                $current = $(this).addClass('card--current');
                $next = $current.next();
                $next = $next.length ? $next : $cards.first();
                $next.addClass('card--next');
            }
        });
        if (!$current.length) {
            $current = $cards.last();
            $cards.first().trigger('click');
        }
        $this.addClass('cards--active');
    })
};

$(function () {
    $('#container').addClass("sidebar-closed");         //隐藏侧边栏
    let review_card_a = $('#review_card_a');
    review_card_a.attr("aria-expanded", true);
    review_card_a.attr("data-active", true);
    $('.cards').commentCards();
});