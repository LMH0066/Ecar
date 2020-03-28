let other_options = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'" +
    "                   viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'" +
    "                   stroke-linecap='round' stroke-linejoin='round' onclick='starDeck(this)'" +
    "                   class='feather feather-heart deck-btn'>" +
    "                    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12" +
    "                       5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06" +
    "                       1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>" +
    "                </svg>" +
    "                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'" +
    "                   viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'" +
    "                   stroke-linecap='round' stroke-linejoin='round'" +
    "                   class='feather feather-download deck-btn'>" +
    "                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>" +
    "                    <polyline points='7 10 12 15 17 10'></polyline>" +
    "                    <line x1='12' y1='15' x2='12' y2='3'></line>" +
    "                </svg>";

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
            {sClass: "name"},
            {sClass: "sharer"},
            {sClass: "modified"},
            {sClass: "notes"},
            {sClass: "option"},
            {sClass: "public_id", visible: false}
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
    showDecks();
});

//初始化引入所有卡组
function showDecks() {
    $.ajax({
        url: "/GetPublicDeck",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result['status']) {
                let $table = $('#deck-table').DataTable(),
                    data = result['data'];
                for (let i = data.length - 1; i >= 0; i--) {
                    let row_data = [data[i]['deck_name'], data[i]['deck_author'], data[i]['c_time'],
                        data[i]['star_num'], other_options, data[i]['public_deck_id']];
                    $table.row.add(row_data).draw();
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

//点赞卡组
function starDeck(svg) {
    //拿到点击的行号
    let row_index = $(svg).parents("tr").index();
    let row_data = $('#deck-table').DataTable().row(row_index).data();
    let form_data = new FormData();
    form_data.append('public_id', row_data[5]);
    $.ajax({
        url: "/StarDeck",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.status) {
                console.log("success")
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
