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

$('.todo-item input[type="checkbox"]').click(function () {
    if ($(this).is(":checked")) {
        $(this).parents('.todo-item').addClass('todo-task-done');
    } else if ($(this).is(":not(:checked)")) {
        $(this).parents('.todo-item').removeClass('todo-task-done');
    }
    dynamicBadgeNotification('completedList');
});

$('.important').click(function () {
    if (!$(this).parents('.todo-item').hasClass('todo-task-important')) {
        $(this).parents('.todo-item').addClass('todo-task-important');
        $(this).html('Back to List');
    } else if ($(this).parents('.todo-item').hasClass('todo-task-important')) {
        $(this).parents('.todo-item').removeClass('todo-task-important');
        $(this).html('Important');
        $(".list-actions#all-list").trigger('click');
    }
    dynamicBadgeNotification('importantList');
});

$('.action-dropdown .dropdown-menu .delete.dropdown-item').click(function () {
    if (!$(this).parents('.todo-item').hasClass('todo-task-trash')) {

        let getTodoParent = $(this).parents('.todo-item');
        let getTodoClass = getTodoParent.attr('class');

        let getFirstClass = getTodoClass.split(' ')[1];
        let getSecondClass = getTodoClass.split(' ')[2];
        let getThirdClass = getTodoClass.split(' ')[3];

        if (getFirstClass === 'all-list') {
            getTodoParent.removeClass(getFirstClass);
        }
        if (getSecondClass === 'todo-task-done' || getSecondClass === 'todo-task-important') {
            getTodoParent.removeClass(getSecondClass);
        }
        if (getThirdClass === 'todo-task-done' || getThirdClass === 'todo-task-important') {
            getTodoParent.removeClass(getThirdClass);
        }
        $(this).parents('.todo-item').addClass('todo-task-trash');
    } else if ($(this).parents('.todo-item').hasClass('todo-task-trash')) {
        $(this).parents('.todo-item').removeClass('todo-task-trash');
    }
    dynamicBadgeNotification('allList');
    dynamicBadgeNotification('completedList');
    dynamicBadgeNotification('importantList');
});

$('.action-dropdown .dropdown-menu .permanent-delete.dropdown-item').on('click', function (event) {
    event.preventDefault();
    if ($(this).parents('.todo-item').hasClass('todo-task-trash')) {
        $(this).parents('.todo-item').remove();
    }
});

$('.action-dropdown .dropdown-menu .revive.dropdown-item').on('click', function (event) {
    event.preventDefault();
    if ($(this).parents('.todo-item').hasClass('todo-task-trash')) {
        let getTodoParent = $(this).parents('.todo-item');
        let getTodoClass = getTodoParent.attr('class');
        let getFirstClass = getTodoClass.split(' ')[1];
        $(this).parents('.todo-item').removeClass(getFirstClass);
        $(this).parents('.todo-item').addClass('all-list');
        $(this).parents('.todo-item').hide();
    }
    dynamicBadgeNotification('allList');
    dynamicBadgeNotification('completedList');
    dynamicBadgeNotification('importantList');
});

$(function () {
    let sg_a = $('#sg_a');
    sg_a.attr("aria-expanded", true);
    sg_a.attr("data-active", true);
    $('#sg_ul').addClass("show");
    $('#task_list_li').addClass("active");

    dynamicBadgeNotification('allList');
    dynamicBadgeNotification('completedList');
    dynamicBadgeNotification('importantList');
});