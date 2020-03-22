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
    let $progress_bar = $("#countdown");
    let time = $progress_bar.getRemainingTime();
    if (event.keyCode === 32) {
        // 按空格键
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
        $progress_bar.reset();
    } else if (event.keyCode === 39) {
        // 按右键
        $progress_bar.reset();
    }
}

function memoryRecord(card_id) {
    let form_data = new FormData();
    form_data.append('card_id', card_id);
    $.ajax({
        url: "/card/RemoveCard",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            if (ret.status) {
                // $(svg).parents('tr').remove();
                let table = $('#card-table').DataTable();
                table.row($(svg).parents('tr')).remove().draw();
                let card = findCardSelector(ret.data.deck_name);
                if (ret.data.card_amount > 0)
                    card.children("div:last").remove();
                let p = card.children().children('p');
                p.text(ret.data.card_amount + " cards");
            } else {
                Oops(ret.data);
            }
        },
        error: function () {
            Oops("");
        }
    })
}