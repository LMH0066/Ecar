$('#input-search').on('keyup', function () {
    let table = $('#deck-table').DataTable();
    table.columns(0).search($(this).val()).draw();
});

$(function () {
    let deck_a = $('#plaza_a');
    deck_a.attr("aria-expanded", true);
    deck_a.attr("data-active", true);

    $('#deck-table').DataTable({
        "bLengthChange": false, //开关，是否显示每页显示多少条数据的下拉框
        // "searching": false,
        // dom:'lBrtip',
        "ordering": false, // 禁止排序
        "columns": [
            {data: "name"},
            {data: "sharer"},
            {data: "modified"},
            {data: "notes"},
            {data: "option"},
            {data: "id", visible: false}
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
        "lengthMenu": [7, 10, 20, 50],
        "pageLength": 8
    });
    // 隐藏datatable自带的搜索框
    $('#deck-table_filter').hide();
});

//初始化引入所有卡组
function showDecks() {
    $.ajax({
        url: "/deck/",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {

            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

//点赞卡组
function starDeck(svg) {
    //拿到点击的行号
    let row_index = $(svg).parents("tr").index();
    let row_data = $('#deck-table').DataTable().row(row_index).data();
    let form_data = new FormData();
    form_data.append('deck_id', row_data.id);
    $.ajax({
        url: "/deck/",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {

            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

//下载卡组
function downloadDeck(svg) {
    //拿到点击的行号
    let row_index = $(svg).parents("tr").index();
    let row_data = $('#deck-table').DataTable().row(row_index).data();
    let form_data = new FormData();
    form_data.append('deck_id', row_data.id);
    $.ajax({
        url: "/deck/",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {

            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}
