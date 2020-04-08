$("input[name='review_nums_vertical']").TouchSpin({
    verticalbuttons: true,
    buttondown_class: "btn btn-classic btn-outline-info",
    buttonup_class: "btn btn-classic btn-outline-danger"
});

function addTask() {
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
}

function $_taskAdd(getParent) {

    $('[data-btnfn="addTask"]').off('click').on('click', function (event) {
        let $_title = $('#s-task').val(),
            $_content = $('#s-text').val(),
            $_review_nums = $('#review_nums_vertical').val();
        let group_id = getParent.split('-')[1];
        let form_data = new FormData();
        form_data.append('group_id', group_id);
        form_data.append('title', $_title);
        form_data.append('content', $_content);
        form_data.append('review_nums', $_review_nums);
        $.ajax({
            url: "/group/CreateTask",
            type: "POST",
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (ret) {
                // console.log("test");
                if (ret['status']) {
                    insertTask(getParent, $_title, $_content,
                        ret['data']['c_time'], ret['data']['task_list_id']);
                    $('#addTaskModal').modal('hide');
                    $_taskEdit();
                    $_taskDelete();
                }
            },
            error: function () {
                Oops("");
            }
        });
    });
}

function insertTask($_getParent, title, content, c_time, task_list_id) {
    let $html = '' +
        '<div data-draggable="true" data-id="' + task_list_id + '" class="card task-text-progress" style="">' +
        '   <div class="card-body">' +
        '       <div class="task-header">' +
        '           <div class="">' +
        '               <h4 class="" data-taskTitle="' + title + '">' + title + '</h4>' +
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
        '               <p class="" data-taskText="' + content + '">' + content + '</p>' +
        '           </div>' +
        '           <div class="task-bottom">' +
        '               <div class="tb-section-1">' +
        '                   <span data-taskDate="' + c_time + '">' +
        '                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
        '                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        '                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">' +
        '                           <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
        '                           <line x1="16" y1="2" x2="16" y2="6"></line>' +
        '                           <line x1="8" y1="2" x2="8" y2="6"></line>' +
        '                           <line x1="3" y1="10" x2="21" y2="10"></line>' +
        '                       </svg> ' +
        '                   ' + c_time + '</span>' +
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
}

function $_taskDelete() {
    $('.card .s-task-delete').off('click').on('click', function (event) {
        event.preventDefault();

        let get_card_parent = $(this).parents('.card');

        $('#deleteConformation').modal('show');

        $('[data-remove="task"]').off('click').on('click', function (event) {
            event.preventDefault();
            /* Act on the event */
            let form_data = new FormData();
            form_data.append('task_list_id', get_card_parent.attr('data-id'));
            $.ajax({
                url: "/group/DeleteTaskList",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    // console.log("test");
                    if (ret['status']) {
                        get_card_parent.remove();
                        $('#deleteConformation').modal('hide');
                    }
                },
                error: function () {
                    Oops("");
                }
            });
        });
    })
}


function $_taskEdit() {
    $('.card .s-task-edit').off('click').on('click', function (event) {

        event.preventDefault();

        let $_outerThis = $(this),
            $_editBtn = $('[data-btnfn="editTask"]'),
            $_card = $_outerThis.parents('.card');

        $('.add-task-title').hide();
        $('.edit-task-title').show();

        $('[data-btnfn="addTask"]').hide();
        $_editBtn.show();

        let $_taskTitle = $_card.find('h4').attr('data-taskTitle');
        $('.task-text-progress #s-task').val($_taskTitle);

        let $_taskText = $_card.find('p').attr('data-taskText');
        $('.task-text-progress #s-text').val($_taskText);

        $('.task-text-progress .collapse').collapse('show');

        $_editBtn.off('click').on('click', function (event) {

            let $_title = $('#s-task').val(),
                $_content = $('#s-text').val(),
                $_review_nums = $("input[name='review_nums_vertical']").val(),
                form_data = new FormData();
            if ($_title === "") {
                Oops("title is empty");
                return;
            }
            if ($_review_nums === "") {
                $_review_nums = 0;
            }
            form_data.append('task_list_id', $_card.attr('data-id'));
            form_data.append('title', $_title);
            form_data.append('content', $_content);
            form_data.append('review_nums', $_review_nums);
            $.ajax({
                url: "/group/UpdateTaskList",
                type: "POST",
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (ret) {
                    // console.log("test");
                    if (ret['status']) {
                        $_card.find('h4').attr('data-taskTitle', $_title);
                        $_card.find('h4').html($_title);
                        $_card.find('p').attr('data-tasktext', $_content);
                        $_card.find('p').html($_content);
                        $('#addTaskModal').modal('hide');
                    }
                },
                error: function () {
                    Oops("");
                }
            });
        });
        $('#addTaskModal').modal('show');
    })
}

function addGroupTask(data) {
    let title = data['group_name'],
        group_id = data['group_id'];
    let $html = '' +
        '<div data-section="gid-' + group_id + '" class="task-list-container" data-connect="sorting">' +
        '   <div class="connect-sorting">' +
        '       <div class="task-container-header">' +
        '           <h6 class="s-heading" data-listTitle="' + title + '">' + title + '</h6>' +
        '       </div>' +
        '       <div class="connect-sorting-content" data-sortable="true"></div>' +
        '       <div class="add-s-task">' +
        '           <a class="addTask">' +
        '               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
        '                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        '                    stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">' +
        '                   <circle cx="12" cy="12" r="10"></circle>' +
        '                   <line x1="12" y1="8" x2="12" y2="16"></line>' +
        '                   <line x1="8" y1="12" x2="16" y2="12"></line>' +
        '               </svg> ' +
        '           Add Task</a>' +
        '       </div>' +
        '   </div>' +
        '</div>';
    $('.task-list-section').append($html);
    // console.log(data);
    for (let i = 0; i < data['tasks'].length; i++) {
        insertTask('gid-' + group_id, data['tasks'][i]['fields']['title'],
            data['tasks'][i]['fields']['content'], data['tasks'][i]['fields']['c_time'],
            data['tasks'][i]['pk']);
    }
}

function initTaskList() {
    $.ajax({
        url: "/group/GetTaskLists",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            // console.log("test");
            if (ret['status']) {
                // console.log(ret['data']);
                for (let i = 0; i < ret['data'].length; i++) {
                    addGroupTask(ret['data'][i]);
                }
            }
            addTask();
            $_taskEdit();
            $_taskDelete();
        },
        error: function () {
            Oops("");
        }
    })
}

$(function () {
    let sg_a = $('#sg_a');
    sg_a.attr("aria-expanded", true);
    sg_a.attr("data-active", true);
    $('#sg_ul').addClass("show");
    $('#assign_task_li').addClass("active");

    initTaskList();
});