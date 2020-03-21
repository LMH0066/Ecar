$(function () {
    $('#container').addClass("sidebar-closed");         //隐藏侧边栏
    let review_card_a = $('#review_card_a');
    review_card_a.attr("aria-expanded", true);
    review_card_a.attr("data-active", true);
    $('.cards').append($("<li class='card'>" +
        "                     <div class='card-front'>" +
        "                         <h1>Really?</h1>" +
        "                         <br/>" +
        "                     </div>" +
        "                     <div class='card-back'>" +
        "                         <h1>Really?</h1>" +
        "                         <br/>" +
        "                     </div>" +
        "                 </li>"));
    $('.cards').commentCards();
    document.onkeydown = function () {
        keyMonitor()
    };
});