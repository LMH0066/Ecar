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
        if ($cards.length === 1) {
            $current = $next = $cards.first();
            $current.addClass('card--current');
            $current.addClass('card--next');
        } else {
            $current = $cards.last();
            $cards.first().trigger('click');
        }
        $this.addClass('cards--active');
    })
};

function keyMonitor() {
    // let count;
    // if (count > 0) {
    //     console.log("太快");
    //     return;
    // }
    // let timer = setInterval(function () {
    //     if (count > 0) {
    //         count = count - 1;
    //     } else {
    //         count = 60;
    //         clearInterval(timer)
    //     }
    // }, 1000);
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