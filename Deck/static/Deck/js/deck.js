function findCardSelector(deck_name) {
    let h3 = $("h3:contains('" + deck_name + "')").map(function () {
        if ($(this).text() === deck_name)
            return this;
    });
    let card = h3.parents('.card');
    return card;
}

//搜索功能
$('#input-search').on('keyup', function () {
    let rex = new RegExp($(this).val(), 'i');
    let items = $('.searchable-container .items');
    items.hide();
    items.filter(function () {
        return rex.test($(this).text());
    }).show();
});
// 点击添加卡组的按钮后
$('#btn-add-deck').on('click', function () {
    swal({
        title: "Add Deck",
        text: "name?",
        input: 'text',
        showCancelButton: true,
        cancelButtonText: "cancel",
        closeOnConfirm: false,
        padding: '2em',
    }).then(function (result) {
        if (result.value) {
            let form_data = new FormData();
            form_data.append('deck_name', result.value);
            $.ajax({
                url: "/deck/CreateDeck",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    if (ret.status) {
                        swal("Good job!", "Successfully add!", "success");
                        addDeck(result.value, 0);
                    } else {
                        swal({
                            type: 'error',
                            title: 'Oops...',
                            text: ret.data,
                            padding: '2em'
                        })
                    }
                },
                error: function () {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        padding: '2em'
                    })
                }
            })
        }
    });
});
// 点击添加卡片的按钮后
$('#btn-add-card').on('click', function () {
    let form_data = new FormData();
    let input_front = $('#input-add-front'), input_back = $('#input-add-back');
    form_data.append('front_text', input_front.val());
    form_data.append('back_text', input_back.val());
    $.ajax({
        url: "/card/addCard",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {
                let table = $('#card-table').DataTable();
                table.row.add([input_front.val(), input_back.val()]).draw();
                input_front.val("");
                input_back.val("");
                let card = findCardSelector(result.data.deck_name);
                if (result.data.card_amount < 5)
                    card.append($("<div class='child'></div>"));
                let p =card.children().children('p');
                p.text(result.data.card_amount + " cards");
                let test = card.parent().css('--cards');
                // alert(test)
            }
        },
        error: function () {
            swal({
                type: 'error',
                title: 'Oops...',
                padding: '2em'
            })
        }
    })
});

$(function () {
    let deck_a = $('#deck_a');
    deck_a.attr("aria-expanded", true);
    deck_a.attr("data-active", true);
    showDecks();
    $('#card-table').DataTable({
        "bLengthChange": false, //开关，是否显示每页显示多少条数据的下拉框
        "searching": false,
        "ordering": false, // 禁止排序
        "columns": [
            {"frontDataType": "dom-text", type: 'string'},
            {"orderDataType": "dom-text", type: 'string'},
        ],
        "oLanguage": {
            "oPaginate": {
                "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
                "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
            },
            "sInfo": "Showing page _PAGE_ of _PAGES_",
            "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
            "sSearchPlaceholder": "Search...",
            "sLengthMenu": "Results :  _MENU_",
        },
        "stripeClasses": [],
        "pageLength": 6
    });
});

function addDeck(deck_name, amount) {
    let divElement = document.createElement("div");
    let deck_html = $("<div class='col-xl-3 col-lg-3 col-md-6 col-sm-6 items' style='--cards:" + amount + ";'>\n" +
        "                  <div class='card'>\n" +
        "                      <div class='child' data-target='#cardModal' data-toggle='modal' onclick='showCards(" + deck_name + ")'>\n" +
        "                          <h3>" + deck_name + "</h3>\n" +
        "                          <p>" + amount + " cards</p>\n" +
        "                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' onclick='deleteDeck(this)'" +
        "                          viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' " +
        "                          stroke-linecap='round' stroke-linejoin='round' class='feather feather-trash-2 delete-deck'>" +
        "                              <polyline points='3 6 5 6 21 6'></polyline>" +
        "                              <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>" +
        "                              <line x1='10' y1='11' x2='10' y2='17'></line>" +
        "                              <line x1='14' y1='11' x2='14' y2='17'></line></svg>" +
        "                        </div>\n" +
        "                    </div>\n" +
        "              </div>"
        )
    ;
    $('.deck-container').append(deck_html);
    //精确查找到所在卡组
    let card = findCardSelector(deck_name);
    for (let i = 0; i < amount - 1 && 5; i++)
        card.append($("<div class='child'></div>"));
}

function deleteDeck(svg) {
    let ev = window.event || arguments.callee.caller.arguments[0];
    if (window.event) ev.cancelBubble = true;
    else {
        ev.stopPropagation();
    }

    let deck_name = $(svg).prev().prev().html();
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
            form_data.append('deck_name', deck_name);
            $.ajax({
                url: "/deck/DeleteDeck",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    if (ret.status) {
                        $(svg).parents('.items').remove()
                    } else {
                        swal({
                            type: 'error',
                            title: 'Oops...',
                            text: ret.data,
                            padding: '2em'
                        })
                    }
                },
                error: function () {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        padding: '2em'
                    })
                }
            })
        }
    })
}

function showDecks() {
    $.ajax({
        url: "/deck/ShowDecks",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {
                let data = result.data;
                for (let i = 0; i < data.decks_name.length; i++) {
                    addDeck(data.decks_name[i], data.decks_amount[i]);
                }
            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    padding: '2em'
                })
            }
        },
        error: function () {
            swal({
                type: 'error',
                title: 'Oops...',
                padding: '2em'
            })
        }
    })
}

function showCards(deck_name) {
    $('#cardModalCenterTitle').html(deck_name);
    let form_data = new FormData();
    form_data.append('deck_name', deck_name);
    $.ajax({
        url: "/card/ShowCards",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {
                // 卡组有卡片
                let data = result.data;
                let table = $('#card-table').DataTable();
                table.clear();
                for (let i = 0; i < data.front_text.length; i++) {
                    table.row.add([data.front_text[i], data.back_text[i]]).draw();
                }
            } else {
                // 卡组没卡片
                // alert("data")
            }
        },
        error: function () {
            swal({
                type: 'error',
                title: 'Oops...',
                padding: '2em'
            })
        }
    })
}