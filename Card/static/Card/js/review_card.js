let review_start = false;
$.fn.commentCards = function () {
    return this.each(function () {
        let $this = $(this),
            $cards = $this.find('.card'),
            $current = $cards.filter('.card--current'),
            $next;
        $cards.on('click', function () {
            if (review_start) {
                $cards = $this.find('.card');
                $current = $cards.filter('.card--current');
            }
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


function reviewNext($cards, $next) {
    if ($cards.length === 1) {
        swal({
            type: 'success',
            title: 'End of the review...',
            padding: '2em'
        });
        return false;
    }
    $next = $next.length ? $next : $cards.first();
    $next.trigger('click');
    return true;
}

function keyMonitor($progress_bar) {
    let $cards = $('.cards').find('.card'),
        $current = $cards.filter('.card--current'),
        $next = $current.next();
    let time = $progress_bar.progressBarTimer().getRemainingTime();

    if (!review_start) {
        review_start = true;
        if (reviewNext($cards, $next)) {
            $progress_bar.progressBarTimer().start();
            setTimeout(function () {
                $current.remove();
            }, 700);
        }
        return;
    }

    if (event.keyCode === 32) {
        // 按空格键
        $progress_bar.progressBarTimer().stop();
        let $card_current = $('.card--current');
        if ($card_current.children('.card-front').hasClass('showBack')) {
            $card_current.children('.card-front').removeClass('showBack');
            $card_current.children('.card-back').removeClass('showFront');
        } else {
            $card_current.children('.card-front').addClass('showBack');
            $card_current.children('.card-back').addClass('showFront');
        }
    } else if (event.keyCode === 37) {
        // 按左键
        $progress_bar.progressBarTimer().reset();
        if (reviewNext($cards, $next)) {
            $progress_bar.progressBarTimer().start();
            memoryRecord($current.attr('id'), "ForgetCard");
        }
    } else if (event.keyCode === 39) {
        // 按右键
        $progress_bar.progressBarTimer().reset();
        if (reviewNext($cards, $next)) {
            $progress_bar.progressBarTimer().start();
            memoryRecord($current.attr('id'), "RememberCard")
        }
    }
}

function memoryRecord(card_id, behavior) {
    let form_data = new FormData();
    form_data.append('card_id', card_id);
    $.ajax({
        url: "/card/" + behavior,
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            if (ret.status) {
                let $card = $('.cards').find('.card[id=' + card_id + ']');
                setTimeout(function () {
                    $card.remove();
                }, 700);
            }
        },
        error: function () {
            Oops("");
        }
    })
}