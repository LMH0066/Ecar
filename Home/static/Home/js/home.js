let public_deck_id;

let deck_options = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'" +
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

    let table = $('#deck-table').DataTable({
        "bLengthChange": false, //开关，是否显示每页显示多少条数据的下拉框
        // "searching": false,
        "ordering": false, // 禁止排序
        "columns": [
            {data: "name"},
            {data: "sharer"},
            {data: "modified"},
            {data: "notes"},
            {data: "option"},
            {data: "public_id", visible: false},
            {data: "deck_id", visible: false}
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

    $('#card-table').DataTable({
        "bLengthChange": false, //开关，是否显示每页显示多少条数据的下拉框
        "searching": false,
        "ordering": false, // 禁止排序
        "bInfo": false,
        "bAutoWidth": false,
        "columns": [
            {width: "45%", sClass: "td-front"},
            {width: "45%", sClass: "td-back"},
            {width: "10%", sClass: "td-options", visible: false}
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

    // $("#card-table").DataTable().Column[".td-options"].Visible = false;

    $('#deck-table tbody').on('click', 'tr', function () {
        let data = table.row(this).data();
        showDetail(data);
        // alert( 'You clicked on '+data[0]+'\'s row' );
    });

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
                    let row_data = {
                        "name": data[i]['deck_name'], "sharer": data[i]['deck_author'],
                        "modified": data[i]['c_time'], "notes": data[i]['star_num'],
                        "option": deck_options, "public_id": data[i]['public_deck_id'],
                        "deck_id": data[i]['deck_id']
                    };
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
    let tr = $(svg).parents("tr"),
        row_index = tr.index(),
        row_data = $('#deck-table').DataTable().row(row_index).data(),
        form_data = new FormData();
    form_data.append('public_id', row_data.public_id);
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
                let notes = tr.children('.notes').html();
                tr.children('.notes').html(parseInt(notes) + 1);
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
    form_data.append('public_id', row_data.public_id);
    $.ajax({
        url: "/deck/",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result['status']) {

            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

// 显示评论
function showDeckComments() {
    let $container = $('#comments-container .row');
    $container.empty();
    let form_data = new FormData();
    form_data.append('public_id', public_deck_id);
    $.ajax({
        url: "/ShowDeckComments",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result['status']) {
                let data = result['data'];
                for (let i = 0; i < data.length; i++) {
                    addComment(data[i]['user_avatar'], data[i]['user_name'],
                        data[i]['content'], data[i]['c_time'])
                }
            } else {
                $container.append($("<h1>" + result['data'] + "</h1>"));
            }
        },
        error: function () {
            Oops("");
        }
    })
}

// 显示卡片
function showDetail(data) {
    // console.log(data);
    public_deck_id = data.public_id;
    showCards(data['name'], data['deck_id']);
    $("#cardModal").modal('show');
}

// 评论
$('#btn-add-comment').on('click', function () {
    let form_data = new FormData();
    let input_content = $('#input-add-comment');
    if (input_content.val() === "") {
        Oops('The input field is empty');
        return;
    }
    form_data.append('context', input_content.val());
    $.ajax({
        url: "/CommentDeck",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result['status']) {
                input_content.val("");
                let data = result['data'];
                addComment(data['user_avatar'], data['user_name'],
                        data['content'], data['c_time'])
            } else {
                Oops(result['data']);
            }
        },
        error: function () {
            Oops("");
        }
    })
});

function addComment(user_avatar, user_name, content, c_time) {
    let $container = $('#comments-container .row');
    $container.append($("<div class='col-xl-9 mx-auto'>" +
        "                    <blockquote class='blockquote media-object'>" +
        "                        <div class='media'>" +
        "                            <div class='usr-img mr-2'>" +
        "                                <img alt='avatar' class='br-30'" +
        "                                     src='" + user_avatar + "'>" +
        "                            </div>" +
        "                            <div class='media-body align-self-center'>" +
        "                                <h4>" + user_name + "</h4>" +
        "                                <p class='d-inline'>" + content + "</p>" +
        "                            </div>" +
        "                        </div>" +
        "                        <small class='text-right'>" + c_time + "</small>" +
        "                    </blockquote>" +
        "                </div>"));
}