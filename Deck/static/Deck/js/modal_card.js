let btn_delete_card = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'" +
    "fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' onclick='deleteCard(this)'" +
    "stroke-linejoin='round' class='card-btn' style='float:right'>" +
    "<polyline points='3 6 5 6 21 6'></polyline>" +
    "<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>" +
    "<line x1='10' y1='11' x2='10' y2='17'></line>" +
    "<line x1='14' y1='11' x2='14' y2='17'></line></svg>";

let btn_modify_card = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'" +
    "fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' onclick='modifyCard(this)'" +
    "stroke-linejoin='round' class='card-btn' style='float:right'>" +
    "<path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'></path></svg>";

let btn_modify_ok = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'" +
    "fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'" +
    "stroke-linejoin='round' class='modify-btn btn-modify-ok' style='float:right' display='none'>" +
    "<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>" +
    "<polyline points='22 4 12 14.01 9 11.01'></polyline></svg>";

let btn_modify_cancel = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'" +
    "fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'" +
    "stroke-linejoin='round' class='modify-btn btn-modify-cancel' style='float:right' display='none'>" +
    "<circle cx='12' cy='12' r='10'></circle>" +
    "<line x1='15' y1='9' x2='9' y2='15'></line>" +
    "<line x1='9' y1='9' x2='15' y2='15'></line></svg>";

let other_options = btn_delete_card + btn_modify_card + btn_modify_ok + btn_modify_cancel;
// 是否正在修改卡片
let card_modifying = false;
// 权限
let admins_permission = false;

// 点击添加卡片的按钮后
$('#btn-add-card').on('click', function () {
    if (!admins_permission) {
        Oops('You don\'t have permission.');
        return;
    }
    let form_data = new FormData();
    let input_front = $('#input-add-front'), input_back = $('#input-add-back');
    if (input_front.val() === "" || input_back.val() === "") {
        Oops('The input field is empty');
        return;
    }
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
            if (result['status']) {
                let table = $('#card-table').DataTable();
                table.row.add([input_front.val(), input_back.val(), other_options]).draw();
                input_front.val("");
                input_back.val("");
                let card = findCardSelector(result['data']['deck_name']);
                if (result['data']['card_amount'] < 5)
                    card.append($("<div class='child'></div>"));
                let p = card.children().children('p');
                p.text(result['data']['card_amount'] + " cards");
            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
});

// 删除卡片
function deleteCard(svg) {
    if (!admins_permission) {
        Oops('You don\'t have permission.');
        return;
    }
    let front_text = $(svg).parents('tr').children('.td-front').html();
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
            form_data.append('front_text', front_text);
            $.ajax({
                url: "/card/RemoveCard",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    if (ret['status']) {
                        // $(svg).parents('tr').remove();
                        let table = $('#card-table').DataTable();
                        table.row($(svg).parents('tr')).remove().draw();
                        let card = findCardSelector(ret['data']['deck_name']);
                        if (ret['data']['card_amount'] > 0)
                            card.children("div:last").remove();
                        let p = card.children().children('p');
                        p.text(ret['data']['card_amount'] + " cards");
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

// 修改卡片
function modifyCard(svg) {
    // 如果正在修改，提示报错
    if (card_modifying) {
        Oops('You are modifying other Card');
        return;
    }
    if (!admins_permission) {
        Oops('You don\'t have permission.');
        return;
    }
    card_modifying = true;
    let back_td = $(svg).parents('tr').children('.td-back');
    let front_td = $(svg).parents('tr').children('.td-front');
    let front_text = front_td.html();
    let back_text = back_td.html();

    let front_input = $("<input type='text' class='form-control' id='front-input'>");
    front_input.val(front_text);
    front_td.html("");
    front_td.append(front_input);
    let back_input = $("<input type='text' class='form-control' id='back-input'>");
    back_input.val(back_text);
    back_td.html("");
    back_td.append(back_input);

    let tr = front_td.parent();
    let hidden_svg = tr.find('svg:hidden');
    let visible_svg = tr.find('svg:visible');
    hidden_svg.show();
    visible_svg.hide();

    $('.btn-modify-ok').unbind("click");
    $('.btn-modify-cancel').unbind("click");

    $('.btn-modify-ok').on("click", function () {
        let form_data = new FormData();
        form_data.append('new_front_text', front_input.val());
        form_data.append('front_text', front_text);
        form_data.append('new_back_text', back_input.val());
        $.ajax({
            url: "/card/ModifyCard",
            type: "POST",
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (result) {
                if (result.status) {
                    front_td.html(front_input.val());
                    back_td.html(back_input.val());
                    hidden_svg.hide();
                    visible_svg.show();
                    card_modifying = false;
                } else
                    Oops(result.data)
            },
            error: function () {
                Oops("");
            }
        });
    });

    $('.btn-modify-cancel').on("click", function () {
        front_td.html(front_text);
        back_td.html(back_text);
        hidden_svg.hide();
        visible_svg.show();
        card_modifying = false;
    })
}

// 显示所有卡片
function showCards(deck_id) {
    card_modifying = false;
    let form_data = new FormData();
    form_data.append('deck_id', deck_id);
    let table = $('#card-table').DataTable();
    $.ajax({
        url: "/card/ShowCards",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            let data = result['data'];
            $('#cardModalCenterTitle').html(data['deck_name']);
            if (result['status']) {
                // 卡组有卡片
                table.clear();
                for (let i = 0; i < data['front_text'].length; i++) {
                    table.row.add([data['front_text'][i], data['back_text'][i], other_options]).draw();
                }
            } else {
                // 卡组没卡片
                table.clear().draw();
            }
            applyPermission();
        },
        error: function () {
            table.clear().draw();
            Oops("");
        }
    })
}

// 查询权限，修改admins_permission
function applyPermission() {
    $.ajax({
        url: "/card/ApplyPermission",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            admins_permission = !!result.status;
        },
        error: function () {
            admins_permission = false;
        }
    });
}

function initCardTable() {
    $('#card-table').DataTable({
        "bLengthChange": false, //开关，是否显示每页显示多少条数据的下拉框
        "searching": false,
        "ordering": false, // 禁止排序
        "bInfo": false,
        "bAutoWidth": false,
        "columns": [
            {width: "45%", sClass: "td-front"},
            {width: "45%", sClass: "td-back"},
            {width: "10%", sClass: "td-options"}
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
}

$(function () {

});