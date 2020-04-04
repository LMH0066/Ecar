$("input[name='review_nums_vertical']").TouchSpin({
    verticalbuttons: true,
    buttondown_class: "btn btn-classic btn-outline-info",
    buttonup_class: "btn btn-classic btn-outline-danger"
});

$('.addTask').on('click', function (event) {
    event.preventDefault();
    let getParentElement = $(this).parents('[data-connect="sorting"]').attr('data-section');
    $('.edit-task-title').hide();
    $('.add-task-title').show();
    $('[data-btnfn="addTask"]').show();
    $('[data-btnfn="editTask"]').hide();
    $('.addTaskAccordion .collapse').collapse('hide');

    $('#s-task').val('');
    $('#s-text').val('');
    $('#review_nums_vertical').val('');
    $('#addTaskModal').modal('show');
    $_taskAdd(getParentElement);
});

function $_taskAdd(getParent) {

    $('[data-btnfn="addTask"]').off('click').on('click', function (event) {

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth()); //January is 0!
        let yyyy = today.getFullYear();

        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        today = dd + ' ' + monthNames[mm] + ', ' + yyyy;

        let $_getParent = getParent;

        let $_task = document.getElementById('s-task').value;
        let $_taskText = document.getElementById('s-text').value;

        let $html = '' +
            '<div data-draggable="true" class="card task-text-progress" style="">' +
            '   <div class="card-body">' +
            '       <div class="task-header">' +
            '           <div class="">' +
            '               <h4 class="" data-taskTitle="' + $_task + '">' + $_task + '</h4>' +
            '           </div>' +
            '           <div class="">' +
            '               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
            '                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
            '                    stroke-linejoin="round" class="feather feather-edit-2 s-task-edit">' +
            '                   <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>' +
            '               </svg>' +
            '           </div>' +
            '       </div>' +
            '       <div class="task-body">' +
            '           <div class="task-content">' +
            '               <p class="" data-taskText="' + $_taskText + '">' + $_taskText + '</p>' +
            '           </div>' +
            '           <div class="task-bottom">' +
            '               <div class="tb-section-1">' +
            '                   <span data-taskDate="' + today + '">' +
            '                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
            '                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            '                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">' +
            '                           <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
            '                           <line x1="16" y1="2" x2="16" y2="6"></line>' +
            '                           <line x1="8" y1="2" x2="8" y2="6"></line>' +
            '                           <line x1="3" y1="10" x2="21" y2="10"></line>' +
            '                       </svg> ' +
            '                   ' + today + '</span>' +
            '               </div>' +
            '               <div class="tb-section-2">' +
            '                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
            '                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            '                        stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 s-task-delete">' +
            '                       <polyline points="3 6 5 6 21 6"></polyline>' +
            '                       <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>' +
            '                       <line x1="10" y1="11" x2="10" y2="17"></line>' +
            '                       <line x1="14" y1="11" x2="14" y2="17"></line>' +
            '                   </svg>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';

        $("[data-section='" + $_getParent + "'] .connect-sorting-content").append($html);

        $('#addTaskModal').modal('hide');

        $_taskEdit();
        $_taskDelete();
    });
}

function $_taskDelete() {
    $('.card .s-task-delete').off('click').on('click', function (event) {
        event.preventDefault();

        let get_card_parent = $(this).parents('.card');

        $('#deleteConformation').modal('show');

        $('[data-remove="task"]').on('click', function (event) {
            event.preventDefault();
            /* Act on the event */
            get_card_parent.remove();
            $('#deleteConformation').modal('hide');
        });

    })
}


function $_taskEdit() {
    $('.card .s-task-edit').off('click').on('click', function (event) {

        event.preventDefault();

        let $_outerThis = $(this);

        $('.add-task-title').hide();
        $('.edit-task-title').show();

        $('[data-btnfn="addTask"]').hide();
        $('[data-btnfn="editTask"]').show();

        if ($(this).parents('.card').hasClass('img-task')) {

            let $_taskTitle = $_outerThis.parents('.card').find('h4').attr('data-taskTitle');
            let get_value_title = $('.task-image #s-image-task').val($_taskTitle);
            $('.task-image .collapse').collapse('show');

        } else if ($(this).parents('.card').hasClass('simple-title-task')) {

            let $_taskTitle = $_outerThis.parents('.card').find('h4').attr('data-taskTitle');
            let get_value_title = $('.task-simple #s-simple-task').val($_taskTitle);
            $('.task-simple .collapse').collapse('show');

        } else if ($(this).parents('.card').hasClass('task-text-progress')) {

            let $_taskTitle = $_outerThis.parents('.card').find('h4').attr('data-taskTitle');
            let get_value_title = $('.task-text-progress #s-task').val($_taskTitle);

            let $_taskText = $_outerThis.parents('.card').find('p:not(".progress-count")').attr('data-taskText');
            let get_value_text = $('.task-text-progress #s-text').val($_taskText);

            let $_taskProgress = $_outerThis.parents('.card').find('div.progress-bar').attr('data-progressState');
            let get_value_progress = $('#progress-range-counter').val($_taskProgress);
            let get_value_progressHtml = $('.range-count-number').html($_taskProgress);
            let get_value_progressDataAttr = $('.range-count-number').attr('data-rangecountnumber', $_taskProgress);

            $('.task-text-progress .collapse').collapse('show');
        }

        $('[data-btnfn="editTask"]').off('click').on('click', function (event) {
            let $_innerThis = $(this);

            if ($_outerThis.parents('.card').hasClass('img-task')) {

                let $_task = document.getElementById('s-image-task').value;
                let $_taskDataAttr = $_outerThis.parents('.card').find('h4').attr('data-taskTitle', $_task);
                let $_taskTitle = $_outerThis.parents('.card').find('h4').html($_task);

            } else if ($_outerThis.parents('.card').hasClass('simple-title-task')) {

                let $_task = document.getElementById('s-simple-task').value;
                let $_taskDataAttr = $_outerThis.parents('.card').find('h4').attr('data-taskTitle', $_task);
                let $_taskTitle = $_outerThis.parents('.card').find('h4').html($_task);

            } else if ($_outerThis.parents('.card').hasClass('task-text-progress')) {

                let $_taskValue = document.getElementById('s-task').value;
                let $_taskTextValue = document.getElementById('s-text').value;
                let $_taskProgressValue = $('.range-count-number').attr('data-rangeCountNumber');

                let $_taskDataAttr = $_outerThis.parents('.card').find('h4').attr('data-taskTitle', $_taskValue);
                let $_taskTitle = $_outerThis.parents('.card').find('h4').html($_taskValue);
                let $_taskTextDataAttr = $_outerThis.parents('.card').find('p:not(".progress-count")').attr('data-tasktext', $_taskTextValue);
                let $_taskText = $_outerThis.parents('.card').find('p:not(".progress-count")').html($_taskTextValue);

                let $_taskProgressStyle = $_outerThis.parents('.card').find('div.progress-bar').attr('style', "width: " + $_taskProgressValue + "%");
                let $_taskProgressDataAttr = $_outerThis.parents('.card').find('div.progress-bar').attr('data-progressState', $_taskProgressValue);
                let $_taskProgressAriaAttr = $_outerThis.parents('.card').find('div.progress-bar').attr('aria-valuenow', $_taskProgressValue);
                let $_taskProgressProgressCount = $_outerThis.parents('.card').find('.progress-count').html($_taskProgressValue + "%");
            }

            $('#addTaskModal').modal('hide');
            let setDate = $('.taskDate').html('');
            $('.taskDate').hide();
        });
        $('#addTaskModal').modal('show');
    })
}

$(function () {
    let sg_a = $('#sg_a');
    sg_a.attr("aria-expanded", true);
    sg_a.attr("data-active", true);
    $('#sg_ul').addClass("show");
    $('#assign_task_li').addClass("active");

    $_taskEdit();
    $_taskDelete();
});