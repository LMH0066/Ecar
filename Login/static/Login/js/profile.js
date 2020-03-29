let btn_delete_deck = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'" +
    "fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' onclick='deletePublicDeck(this)'" +
    "stroke-linejoin='round' class='card-btn'>" +
    "<polyline points='3 6 5 6 21 6'></polyline>" +
    "<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>" +
    "<line x1='10' y1='11' x2='10' y2='17'></line>" +
    "<line x1='14' y1='11' x2='14' y2='17'></line></svg>";

$(function () {
    let user_a = $('#user_a');
    user_a.attr("aria-expanded",true);
    user_a.attr("data-active",true);
    $('#user_ul').addClass("show");
    $('#profile_li').addClass("active");

    getAuthorDeck();
    initCardTable();
});

function getAuthorDeck() {
    $.ajax({
        url: "/GetAuthorDeck",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result['status']) {
                for (let i = 0; i < result['data'].length; i++) {
                    showDeck(result['data'][i]);
                }
            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

function showDeck(data) {
    let $deck_box = $('.bio-deck-box .row');
    $deck_box.append($("<div class='col-12 col-xl-6 col-lg-12 mb-xl-5 b-deck'" +
        "                  onclick='showCards(" + data['deck_name'] + ", " + data['deck_id'] + ")'" +
        "                  data-target='#cardModal' data-toggle='modal'>" +
        "                   <div class='d-flex b-skills'>" +
        "                       <div>" +
        "                       </div>" +
        "                       <div class=''>" +
        "                           <h5>" + data['deck_name'] + "</h5>" +
        "                           <p>Stars：" + data['star_num'] + "</p>" +
        "                           <p>Card Amount：" + data['card_amount'] + "</p>" +
        "                           <p>Last modified：" + data['c_time'] + "</p>" +
        "                           <p hidden class='public_id'>" + data['public_deck_id'] + "</p>" +
                                    btn_delete_deck +
        "                       </div>" +
        "                   </div>" +
        "               </div>"));

}

function deletePublicDeck(svg) {
    let ev = window.event || arguments.callee.caller.arguments[0];
    if (window.event) ev.cancelBubble = true;
    else {
        ev.stopPropagation();
    }

    let public_id = $(svg).parent().children('.public_id').html();
    swal({
        title: 'Sure?',
        type: 'info',
        html: 'Are you sure to delete it?',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<i class="flaticon-checked-1"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
            '<i class="flaticon-cancel-circle"></i> Cancel',
        cancelButtonAriaLabel: 'Thumbs down',
        padding: '2em'
    }).then(function (result) {
        if (result.value) {
            let form_data = new FormData();
            form_data.append('public_id', public_id);
            $.ajax({
                url: "/DeletePublicDeck",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    if (ret.status) {
                        $(svg).parents('.b-deck').remove()
                    } else {
                        Oops(ret.data);
                    }
                },
                error: function () {
                    Oops("");
                }
            })
        }
    })
}