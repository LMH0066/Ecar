$('.input-search').on('keyup', function () {
    let rex = new RegExp($(this).val(), 'i');
    $('.todo-box .todo-item').hide();
    $('.todo-box .todo-item').filter(function () {
        return rex.test($(this).text());
    }).show();
});

let $btns = $('.list-actions').click(function () {
    if (this.id === 'all-list') {
        let $el = $('.' + this.id).fadeIn();
        $('#ct > div').not($el).hide();
    } else if (this.id === 'todo-task-trash') {
        let $el = $('.' + this.id).fadeIn();
        $('#ct > div').not($el).hide();
    } else {
        let $el = $('.' + this.id).fadeIn();
        $('#ct > div').not($el).hide();
    }
    $btns.removeClass('active');
    $(this).addClass('active');
});

function dynamicBadgeNotification(setTodoCategoryCount) {
    let todoCategoryCount = setTodoCategoryCount;

    // Get Parents Div(s)
    let get_ParentsDiv = $('.todo-item');
    let get_TodoAllListParentsDiv = $('.todo-item.all-list');
    let get_TodoCompletedListParentsDiv = $('.todo-item.todo-task-done');
    let get_TodoImportantListParentsDiv = $('.todo-item.todo-task-important');

    // Get Parents Div(s) Counts
    let get_TodoListElementsCount = get_TodoAllListParentsDiv.length;
    let get_CompletedTaskElementsCount = get_TodoCompletedListParentsDiv.length;
    let get_ImportantTaskElementsCount = get_TodoImportantListParentsDiv.length;

    // Get Badge Div(s)
    let getBadgeTodoAllListDiv = $('#all-list .todo-badge');
    let getBadgeCompletedTaskListDiv = $('#todo-task-done .todo-badge');
    let getBadgeImportantTaskListDiv = $('#todo-task-important .todo-badge');


    if (todoCategoryCount === 'allList') {
        if (get_TodoListElementsCount === 0) {
            getBadgeTodoAllListDiv.text('');
            return;
        }
        if (get_TodoListElementsCount > 9) {
            getBadgeTodoAllListDiv.css({
                padding: '2px 0px',
                height: '25px',
                width: '25px'
            });
        } else if (get_TodoListElementsCount <= 9) {
            getBadgeTodoAllListDiv.removeAttr('style');
        }
        getBadgeTodoAllListDiv.text(get_TodoListElementsCount);
    } else if (todoCategoryCount === 'completedList') {
        if (get_CompletedTaskElementsCount === 0) {
            getBadgeCompletedTaskListDiv.text('');
            return;
        }
        if (get_CompletedTaskElementsCount > 9) {
            getBadgeCompletedTaskListDiv.css({
                padding: '2px 0px',
                height: '25px',
                width: '25px'
            });
        } else if (get_CompletedTaskElementsCount <= 9) {
            getBadgeCompletedTaskListDiv.removeAttr('style');
        }
        getBadgeCompletedTaskListDiv.text(get_CompletedTaskElementsCount);
    } else if (todoCategoryCount === 'importantList') {
        if (get_ImportantTaskElementsCount === 0) {
            getBadgeImportantTaskListDiv.text('');
            return;
        }
        if (get_ImportantTaskElementsCount > 9) {
            getBadgeImportantTaskListDiv.css({
                padding: '2px 0px',
                height: '25px',
                width: '25px'
            });
        } else if (get_ImportantTaskElementsCount <= 9) {
            getBadgeImportantTaskListDiv.removeAttr('style');
        }
        getBadgeImportantTaskListDiv.text(get_ImportantTaskElementsCount);
    }
}

// $('.mail-menu').on('click', function (event) {
//     $('.tab-title').addClass('mail-menu-show');
//     $('.mail-overlay').addClass('mail-overlay-show');
// });
//
// $('.mail-overlay').on('click', function (event) {
//     $('.tab-title').removeClass('mail-menu-show');
//     $('.mail-overlay').removeClass('mail-overlay-show');
// });
//
// $('.tab-title .nav-pills a.nav-link').on('click', function (event) {
//     $(this).parents('.mail-box-container').find('.tab-title').removeClass('mail-menu-show');
//     $(this).parents('.mail-box-container').find('.mail-overlay').removeClass('mail-overlay-show')
// });

function dropdownAjax($_item, operation) {
    let form_data = new FormData();
    form_data.append('task_id', $_item.attr('data-id'));
    form_data.append('operation', operation);
    $.ajax({
        url: "/group/UpdateTask",
        type: "POST",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (ret) {
            // console.log("test");
            if (ret['status']) {
                // console.log("test");
                let data = ret['data'];
                $_item.attr('data-ready-delete', data['is_ready_delete']);
                $_item.attr('data-importance', data['is_importance']);
                $_item.attr('data-accomplish', data['is_accomplish']);
            }
        },
        error: function () {
            Oops("");
        }
    })
}

function checkCheckbox() {
    $('.todo-item input[type="checkbox"]').click(function () {
        let $_item = $(this).parents('.todo-item');
        if ($(this).is(":checked")) {
            dropdownAjax($_item, "accomplish");
            $_item.addClass('todo-task-done');
        } else if ($(this).is(":not(:checked)")) {
            dropdownAjax($_item, "not_accomplish");
            $_item.removeClass('todo-task-done');
        }
        dynamicBadgeNotification('completedList');
    });
}
function importantDropdown() {
    $('.important').click(function () {
        let $_item = $(this).parents('.todo-item');
        if (!$_item.hasClass('todo-task-important')) {
            dropdownAjax($_item, "importance");
            $_item.addClass('todo-task-important');
            $(this).html('Back to List');
        } else if ($_item.hasClass('todo-task-important')) {
            dropdownAjax($_item, "not_importance");
            $_item.removeClass('todo-task-important');
            $(this).html('Important');
            $(".list-actions#all-list").trigger('click');
        }
        dynamicBadgeNotification('importantList');
    });
}

function deleteDropdown() {
    $('.action-dropdown .dropdown-menu .delete.dropdown-item').click(function () {
        let getTodoParent = $(this).parents('.todo-item');
        if (!getTodoParent.hasClass('todo-task-trash')) {
            dropdownAjax(getTodoParent, "delete");
            let getTodoClass = getTodoParent.attr('class');

            let getFirstClass = getTodoClass.split(' ')[1];
            let getSecondClass = getTodoClass.split(' ')[2];
            let getThirdClass = getTodoClass.split(' ')[3];

            if (getFirstClass === 'all-list') {
                getTodoParent.removeClass(getFirstClass);
            }
            if (getSecondClass === 'todo-task-done' || getSecondClass === 'todo-task-important') {
                getTodoParent.removeClass(getSecondClass);
                // getTodoParent.find('input[type="checkbox"]').attr("checked", false);
            }
            if (getThirdClass === 'todo-task-done' || getThirdClass === 'todo-task-important') {
                getTodoParent.removeClass(getThirdClass);
            }
            getTodoParent.addClass('todo-task-trash');
        } else if (getTodoParent.hasClass('todo-task-trash')) {
            dropdownAjax(getTodoParent, "not_delete");
            getTodoParent.removeClass('todo-task-trash');
        }
        dynamicBadgeNotification('allList');
        dynamicBadgeNotification('completedList');
        dynamicBadgeNotification('importantList');
    });
}

function deletePermanentlyDropdown() {
    $('.action-dropdown .dropdown-menu .permanent-delete.dropdown-item').on('click', function (event) {
        event.preventDefault();
        let $_item = $(this).parents('.todo-item');
        if ($_item.hasClass('todo-task-trash')) {
            dropdownAjax($_item, "delete");
            $_item.remove();
        }
    });
}

function reviveMailDropdown() {
    $('.action-dropdown .dropdown-menu .revive.dropdown-item').on('click', function (event) {
        event.preventDefault();
        if ($(this).parents('.todo-item').hasClass('todo-task-trash')) {
            let getTodoParent = $(this).parents('.todo-item');
            dropdownAjax(getTodoParent, "not_delete");
            let getTodoClass = getTodoParent.attr('class');
            let getFirstClass = getTodoClass.split(' ')[1];
            getTodoParent.removeClass(getFirstClass);
            getTodoParent.addClass('all-list');
            if (getTodoParent.attr('data-importance') === "true")
                getTodoParent.addClass('todo-task-important');
            if (getTodoParent.attr('data-accomplish') === "true")
                getTodoParent.addClass('todo-task-done');
            $(this).parents('.todo-item').hide();
        }
        dynamicBadgeNotification('allList');
        dynamicBadgeNotification('completedList');
        dynamicBadgeNotification('importantList');
    });
}

$(function () {
    let sg_a = $('#sg_a');
    sg_a.attr("aria-expanded", true);
    sg_a.attr("data-active", true);
    $('#sg_ul').addClass("show");
    $('#task_list_li').addClass("active");

    dynamicBadgeNotification('allList');
    dynamicBadgeNotification('completedList');
    dynamicBadgeNotification('importantList');

    getTasks();
});

function getTasks() {
    $.ajax({
        url: "/group/GetTasks",
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
                    insertTask(ret['data'][i]);
                }
                checkCheckbox();
                importantDropdown();
                deleteDropdown();
                deletePermanentlyDropdown();
                reviveMailDropdown();

                dynamicBadgeNotification('allList');
                dynamicBadgeNotification('completedList');
                dynamicBadgeNotification('importantList');
            }
        },
        error: function () {
            Oops("");
        }
    })
}

function insertTask(data) {
    // console.log(data);
    let task_class = "",
        important_html = "Important",
        done_html = "";
    if (data['is_ready_delete']) {
        task_class = "todo-task-trash";
    } else {
        if (data['is_importance']) {
            task_class += "todo-task-important ";
            important_html = 'Back to List';
        }
        if (data['is_accomplish']) {
            task_class += "todo-task-done ";
            done_html = "checked";
        }
    }
    let $_html = "" +
        "<div class='todo-item all-list "+ task_class +"' data-ready-delete='"+ data['is_ready_delete'] +"'" +
        "     data-importance='"+ data['is_importance'] +"' data-accomplish='"+ data['is_accomplish'] +"'" +
        "     data-id='"+ data['task_id'] +"'>" +
        "   <div class='todo-item-inner'>" +
        "       <div class='n-chk text-center'>" +
        "           <label class='new-control new-checkbox checkbox-primary'>" +
        "               <input "+ done_html +" type='checkbox' class='new-control-input inbox-chkbox'>" +
        "               <span class='new-control-indicator'></span>" +
        "           </label>" +
        "       </div>" +
        "       <div class='todo-content'>" +
        "           <h5 class='todo-heading' data-todoHeading='"+ data['title'] +"'>"+ data['title'] +"</h5>" +
        "           <p class='meta-date'>"+ data['c_time'] +"</p>" +
        "           <p class='todo-text'>"+ data['content'] +"</p>" +
        "       </div>" +
        "       <div class='action-dropdown custom-dropdown-icon'>" +
        "           <div class='dropdown'>" +
        "               <a class='dropdown-toggle' href='#' role='button' id='dropdownMenuLink-7'" +
        "                  data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>" +
        "                   <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'" +
        "                        viewBox='0 0 24 24' fill='none' stroke='currentColor'" +
        "                        stroke-width='2' stroke-linecap='round' stroke-linejoin='round'" +
        "                        class='feather feather-more-vertical'>" +
        "                       <circle cx='12' cy='12' r='1'></circle>" +
        "                       <circle cx='12' cy='5' r='1'></circle>" +
        "                       <circle cx='12' cy='19' r='1'></circle>" +
        "                   </svg>" +
        "               </a>" +
        "               <div class='dropdown-menu' aria-labelledby='dropdownMenuLink-7'>" +
        "                   <a class='important dropdown-item'" +
        "                      href='javascript:void(0);'>"+ important_html +"</a>" +
        "                   <a class='dropdown-item delete' href='javascript:void(0);'>Delete</a>" +
        "                   <a class='dropdown-item permanent-delete' href='javascript:void(0);'>Permanent" +
        "                      Delete</a>" +
        "                   <a class='dropdown-item revive' href='javascript:void(0);'>Revive" +
        "                      Task</a>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        "   </div>" +
        "</div>";
    $('.todo-box-scroll').append($_html);
}