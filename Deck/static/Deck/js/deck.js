//搜索功能
$('#input-search').on('keyup', function () {
    let rex = new RegExp($(this).val(), 'i');
    let items = $('.searchable-container .items');
    items.hide();
    items.filter(function () {
        return rex.test($(this).text());
    }).show();
});

$('#btn-add-deck').on('click', function () {
  swal({
      title: 'Saved succesfully',
      padding: '2em'
    })
});

$(function () {
    let deck_a = $('#deck_a');
    deck_a.attr("aria-expanded",true);
    deck_a.attr("data-active",true);
});