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

    $("#countdown").progressBarTimer({
        timeLimit: 8, //total number of actual seconds
        warningThreshold: 2, //seconds remaining triggering switch to warning color
        autoStart: false, // start the countdown automatically
        onFinish: function () {
            console.log("complete")
        }, //invoked once the timer expires
        baseStyle: '', //bootstrap progress bar style at the beginning of the timer
        warningStyle: 'bg-danger', //bootstrap progress bar style in the warning phase
        smooth: true, // should the timer be smooth or stepping
        completeStyle: 'bg-danger' //bootstrap progress bar style at completion of timer
    });

    let key_flag = false, is_key_down = false;
    document.onkeydown = function () {
        if (key_flag || is_key_down)
            return;
        is_key_down = true;
        keyMonitor($("#countdown"));
        key_flag = true;
        setTimeout(function () {
            is_key_down = false;
        }, 800);       //一秒内不能重复点击
    };
    document.onkeyup = function () {
        key_flag = false;
    };
});