// 通过deck_name找到元素
function findCardSelector(deck_name) {
    let h3 = $("h3:contains('" + deck_name + "')").map(function () {
        if ($(this).text() === deck_name)
            return this;
    });
    return h3.parents('.card');
}

// 搜索功能
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
        html: "Please input deck name or link" +
            "<input id='deck-info1' class='swal2-input' placeholder='DeckName OR ShareCode' type='text' style='display: flex;'>" +
            "<input id='deck-info2' class='swal2-input' placeholder='SharePassword' type='text' style='display: none;'>" +
            "<div class='custom-control custom-checkbox'>" +
            "    <input type='checkbox' class='custom-control-input' id='customCheck' onclick='showDeckInfo()'>" +
            "    <label class='custom-control-label' for='customCheck'>Is Link</label>" +
            "</div>",
        showCancelButton: true,
        cancelButtonText: "cancel",
        closeOnConfirm: false,
        padding: '2em',
    }).then(function (result) {
        let deck_info1 = $('#deck-info1').val(),
            deck_info2 = $('#deck-info2').val();
        let create_by_link = $('.custom-control-input').is(':checked');
        if (result.value) {
            createDeck(create_by_link, deck_info1, deck_info2);
        }
    });
});

//实现点击id为customCheck的checkbox时，输入框的变化
function showDeckInfo() {
    let create_by_link = $('.custom-control-input').is(':checked');
    if (create_by_link) {
        $('#deck-info2').show();
    } else {
        $('#deck-info2').hide();
    }
}

// 初始化
$(function () {
    let deck_a = $('#deck_a');
    deck_a.attr("aria-expanded", true);
    deck_a.attr("data-active", true);
    showDecks();
    initCardTable();
});

// 在页面上添加卡组
function addDeck(deck_id, deck_name, amount, need_review_amout) {
    let divElement = document.createElement("div");
    let show_amount = amount > 4 ? 4 : amount;
    let deck_html = $("<div class='col-xl-3 col-lg-3 col-md-6 col-sm-6 items' style='--cards:" + show_amount + ";'>" +
        "                  <div class='card'>" +
        "                      <div class='child' data-target='#cardModal' data-toggle='modal'" +
        "                       onclick='showCards(" + deck_id + ")' id='" + deck_id + "'>" +
        "                          <h3>" + deck_name + "</h3>" +
        "                          <p>" + amount + " cards(" + need_review_amout + ")</p>" +
        "                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' onclick='deleteDeck(this)'" +
        "                          viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' " +
        "                          stroke-linecap='round' stroke-linejoin='round' class='deck-option bs-popover rounded'" +
        "                          data-content='Delete'>" +
        "                              <polyline points='3 6 5 6 21 6'></polyline>" +
        "                              <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>" +
        "                              <line x1='10' y1='11' x2='10' y2='17'></line>" +
        "                              <line x1='14' y1='11' x2='14' y2='17'></line></svg>" +
        "                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' onclick='reviewDeck(this)'" +
        "                          viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' " +
        "                          stroke-linecap='round' stroke-linejoin='round' class='deck-option bs-popover rounded'" +
        "                          data-content='Review'>" +
        "                              <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>" +
        "                              <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path></svg>" +
        "                          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' onclick='shareDeck(" + deck_id + ")'" +
        "                          viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' " +
        "                          stroke-linecap='round' stroke-linejoin='round' class='deck-option bs-popover rounded'" +
        "                          data-content='Share'>" +
        "                            <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'></path>" +
        "                            <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'></path>" +
        "                          </svg>" +
        "                        </div>" +
        "                    </div>" +
        "              </div>"
    );
    $('.deck-container').append(deck_html);
    //精确查找到所在卡组
    let card = findCardSelector(deck_name);
    for (let i = 0; i < show_amount - 1; i++)
        card.append($("<div class='child'></div>"));
    $('.deck-option').popover({
        template: '<div class="popover popover-danger" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        trigger: 'hover',
        placement: 'top'
    });
}

// 创建卡组
function createDeck(create_by_link, deck_info1, deck_info2) {
    let form_data = new FormData(),
        url;
    if (create_by_link) {
        form_data.append('share_code', deck_info1);
        form_data.append('share_password', deck_info2);
        url = "ShareDeck";
    } else {
        form_data.append('deck_name', deck_info1);
        url = "CreateDeck";
    }
    $.ajax({
        url: "/deck/" + url,
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {
                swal("Good job!", "Successfully add!", "success");
                addDeck(result['data']['deck_id'], result['data']['deck_name'], result['data']['deck_amount']);
            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

// 删除卡组
function deleteDeck(svg) {
    let ev = window.event || arguments.callee.caller.arguments[0];
    if (window.event) ev.cancelBubble = true;
    else {
        ev.stopPropagation();
    }

    let deck_id = $(svg).parent().attr('id');
    console.log(deck_id);
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
            form_data.append('deck_id', deck_id);
            $.ajax({
                url: "/deck/DeleteDeck",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    if (ret['status']) {
                        $(svg).parents('.items').remove()
                    } else {
                        Oops(ret['data']);
                    }
                },
                error: function () {
                    Oops("");
                }
            })
        }
    })
}

// 卡组复习
function reviewDeck(svg) {
    let ev = window.event || arguments.callee.caller.arguments[0];
    if (window.event) ev.cancelBubble = true;
    else {
        ev.stopPropagation();
    }

    let p_text = $(svg).parent().children('p').html();
    let review_amount = p_text.match(/\((.+?)\)/g)[0];
    review_amount = review_amount.substring(1, review_amount.length - 1);
    if (review_amount === "0") {
        Oops("There are no cards need review");
        return;
    }

    let deck_id = $(svg).parent().attr("id");
    let reviewWindow = window.open("/card/review_card");
    reviewWindow.onload = function () {
        let form_data = new FormData();
        form_data.append('deck_id', deck_id);
        $.ajax({
            url: "/card/GetMemoryCar",
            type: "POST",
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (ret) {
                if (ret["status"]) {
                    let $cards = reviewWindow.$('.cards');
                    for (let i = 0; i < ret["data"].length; i++) {
                        let fields = ret["data"][i]["fields"];
                        $cards.append($("<li class='card' id='" + ret["data"][i]["pk"] + "'>" +
                            "                <div class='card-front'>" +
                            "                    <h1>Review Card " + (i + 1) + " </h1>" +
                            "                    <br/>" +
                            "                    <h3>" + fields["q_text"] + "</h3>" +
                            "                </div>" +
                            "                <div class='card-back'>" +
                            "                    <h1>Review Card " + (i + 1) + " </h1>" +
                            "                    <br/>" +
                            "                    <h3>" + fields["ans_text"] + "</h3>" +
                            "                </div>" +
                            "            </li>"));
                    }
                    $cards.commentCards();
                    // reviewWindow.console.log(ret["data"]);
                } else {
                    Oops(ret.data);
                }
            },
            error: function () {
                Oops("");
            }
        })
    };
}

// showDecks()中用于判断哪个卡组需要复习的卡片更多
function compareByReviewNums(property) {
    return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    }
}
// 显示所有卡组
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
                data.sort(compareByReviewNums('review_nums'));
                for (let i = 0; i < data.length; i++) {
                    addDeck(data[i].deck_id, data[i].deck_name, data[i].card_amount, data[i].review_nums);
                }
                setInterval(updateDeck, 1000);
            } else
                Oops("");
        },
        error: function () {
            Oops("");
        }
    })
}

function updateDeck() {
    $.ajax({
        url: "/deck/ShowDecks",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {
                let data = result.data,
                    $container = $('.deck-container');
                for (let i = 0; i < data.length; i++) {
                    let $deck = $container.find('.child[id=' + data[i]['deck_id'] + ']');
                    $deck.children('p').text(data[i]['card_amount'] + " cards(" + data[i]['review_nums'] + ")");
                }
            }
        }
    })
}