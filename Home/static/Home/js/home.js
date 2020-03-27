$('#input-search').on('keyup', function () {
    let table = $('#deck-table').DataTable();
    table.columns(0).search($(this).val()).draw();
    // let rex = new RegExp($(this).val(), 'i'),
    //     $items = $('.searchable-container .items');
    // $items.hide();
    // $items.filter(function () {
    //     return rex.test($(this).text());
    // }).show();
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
