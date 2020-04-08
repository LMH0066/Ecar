import json
import time
from itertools import chain
from django.core import serializers
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from Deck.models import Deck
from Login.models import User
from StudyGroup.models import StudyGroup, Chat, Task, TaskList

from Deck.views import get_more_decks


def go_forum(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'StudyGroup/forum.html')


def go_task_list(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'StudyGroup/task_list.html')


def go_assign_task(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'StudyGroup/assign_task.html')


# 获得所有学习小组
@csrf_exempt
def get_study_group(request):
    decks = get_more_decks(request)
    my_study_group = []
    for deck in decks:
        study_groups = StudyGroup.objects.filter(deck_id=deck.deck_id)
        if study_groups.exists():
            study_group = study_groups.first()
            my_study_group.append(
                {'group_id': study_group.group_id, 'group_name': study_group.group_name,
                 'people_num': study_group.people_num, 'deck_name': deck.name, 'deck_id': deck.deck_id}
            )

    ret = {'status': True, 'data': my_study_group}
    return HttpResponse(json.dumps(ret))


# 获取小组成员
@csrf_exempt
def get_group_members(request):
    user_name = request.session['username']
    group_id = request.POST.get('group_id')
    ret = {'status': True}
    study_group = StudyGroup.objects.get(group_id=group_id)
    deck = Deck.objects.get(deck_id=study_group.deck_id)
    creator = deck.creator
    admins = deck.admins.difference(creator)
    staffs = deck.staffs.difference(admins)
    people = chain(creator, admins, staffs)
    my_people = []
    for person in people:
        if person.avatar:
            author_avatar = serializers.serialize("json", person.avatar)
            author_avatar = json.loads(author_avatar)
        else:
            author_avatar = "/static/images/avatar.jpg"
        my_people.append(
            {'user_name': person.user_name, 'user_avatar': author_avatar}
        )
    ret['data'] = my_people
    return HttpResponse(json.dumps(ret))


# 获取聊天记录
@csrf_exempt
def get_chats(request):
    group_id = request.POST.get('group_id')
    request.session['group_id'] = group_id

    ret = {'status': True}
    chats = Chat.objects.filter(Q(group_id=group_id)).order_by('c_time')
    if chats.exists():
        ret['data'] = return_chat(request, chats)
    else:
        ret['status'] = False
        ret['data'] = 'No Chats'
    return HttpResponse(json.dumps(ret))


# 聊天
@csrf_exempt
def chat_group(request):
    user = User.objects.get(user_name=request.session['username'])
    study_group = StudyGroup.objects.get(group_id=request.session['group_id'])
    content = request.POST.get('content')
    new_chat = Chat(from_user=user, content=content, group=study_group)
    new_chat.save()

    if user.avatar:
        author_avatar = serializers.serialize("json", user.avatar)
        author_avatar = json.loads(author_avatar)
    else:
        author_avatar = "/static/images/avatar.jpg"

    ret = {'status': True, 'data': {
        'user_name': user.user_name, 'user_avatar': author_avatar, 'chat_id': new_chat.chat_id,
        'content': new_chat.content, 'c_time': new_chat.c_time.strftime('%Y-%m-%d %H:%M:%S')}}
    return HttpResponse(json.dumps(ret))


@csrf_exempt
def update_chat_message(request):
    study_group = StudyGroup.objects.get(group_id=request.session['group_id'])
    chat_id = request.POST.get('chat_id')
    if chat_id == 'undefined':
        chats = study_group.chat_set.all()
    else:
        chats = study_group.chat_set.filter(chat_id__gt=chat_id)
    if chats:
        all_chats = return_chat(request, chats)
        return HttpResponse(json.dumps({'status': True, 'data': all_chats}))
    else:
        return HttpResponse(json.dumps({'status': False}))


@csrf_exempt
def return_chat(request, chats):
    user_name = request.session['username']
    all_chats = []
    for chat in chats:
        user = chat.from_user
        from_is_me = False
        if user.user_name == user_name:
            from_is_me = True
        if user.avatar:
            author_avatar = serializers.serialize("json", user.avatar)
            author_avatar = json.loads(author_avatar)
        else:
            author_avatar = "/static/images/avatar.jpg"
        all_chats.append(
            {'user_name': user.user_name, 'user_avatar': author_avatar,
             'content': chat.content, 'c_time': chat.c_time.strftime('%Y-%m-%d %H:%M:%S'),
             'from_is_me': from_is_me, 'chat_id': chat.chat_id}
        )
    return all_chats


# 设为importance
@csrf_exempt
def update_task_importance(request):
    task_id = User.objects.get('task_id')
    task = Task.objects.get(task_id=task_id)
    task.is_importance = True
    task.save()
    ret = {'status': True,
           'data': {'task_id': task.task_id, 'title': task.title, 'content': task.content, 'c_time': task.c_time}}
    return HttpResponse(json.dumps(ret))


# 设为unimportance
@csrf_exempt
def update_task_unimportance(request):
    task_id = User.objects.get('task_id')
    task = Task.objects.get(task_id=task_id)
    task.is_importance = False
    task.save()
    ret = {'status': True,
           'data': {'task_id': task.task_id, 'title': task.title, 'content': task.content, 'c_time': task.c_time}}
    return HttpResponse(json.dumps(ret))


# 设为accomplish
@csrf_exempt
def update_task_accomplish(request):
    task_id = User.objects.get('task_id')
    task = Task.objects.get(task_id=task_id)
    task.is_accomplish = True
    task.save()
    ret = {'status': True,
           'data': {'task_id': task.task_id, 'title': task.title, 'content': task.content, 'c_time': task.c_time}}
    return HttpResponse(json.dumps(ret))


# 设为fail
@csrf_exempt
def update_task_fail(request):
    task_id = User.objects.get('task_id')
    task = Task.objects.get(task_id=task_id)
    task.is_accomplish = False
    task.save()
    ret = {'status': True,
           'data': {'task_id': task.task_id, 'title': task.title, 'content': task.content, 'c_time': task.c_time}}
    return HttpResponse(json.dumps(ret))


# 删除task
@csrf_exempt
def delete_task(request):
    task_id = User.objects.get('task_id')
    task = Task.objects.get(task_id=task_id)
    task.delete()
    ret = {'status': True}
    return HttpResponse(json.dumps(ret))


# 获取用户所有task
@csrf_exempt
def get_tasks(request):
    user_name = request.session['username']
    user = User.objects.get(user_name=user_name)
    tasks = user.task_set.all()
    my_tasks = []
    for task in tasks:
        my_tasks.append(
            {'task_id': task.task_id, 'title': task.title, 'content': task.content, 'is_importance': task.is_importance,
             'is_accomplish': task.is_accomplish, 'c_time': task.c_time}
        )
    ret = {'status': True, 'data': my_tasks}
    return HttpResponse(json.dumps(ret))


@csrf_exempt
def get_task_lists(request):
    user_name = request.session['username']
    user = User.objects.get(user_name=user_name)
    creator_decks = user.deck_set.filter(is_public=False)
    admin_decks = user.AdminsToDeck.filter(is_public=False).difference(creator_decks)
    decks = chain(creator_decks, admin_decks)
    groups = []
    for deck in decks:
        group = StudyGroup.objects.filter(deck_id=deck.deck_id)
        if group:
            group = group[0]
            task_list = group.tasklist_set.all()
            task_list = serializers.serialize("json", task_list)
            task_list = json.loads(task_list)
            groups.append({"group_id": group.group_id, "group_name": group.group_name,
                           "tasks": task_list})
    return HttpResponse(json.dumps({'status': True, 'data': groups}))


# 管理员添加task
@csrf_exempt
def create_task(request):
    group_id = request.POST.get('group_id')
    title = request.POST.get('title')
    content = request.POST.get('content')
    review_nums = request.POST.get('review_nums')

    group = StudyGroup.objects.get(group_id=group_id)
    task_list = TaskList(group=group, title=title, content=content, review_nums=review_nums)
    task_list.save()
    deck = Deck.objects.get(deck_id=group.deck_id)
    users = chain(deck.admins.all(), deck.staffs.all())
    Task(user=deck.creator, task_list=task_list).save()
    for user in users:
        task = Task(user=user, task_list=task_list)
        task.save()
    ret = {'status': True,
           'data': {'task_list_id': task_list.task_list_id,
                    'c_time': task_list.c_time.strftime('%Y-%m-%d %H:%M:%S')}}
    return HttpResponse(json.dumps(ret))


# 修改task
@csrf_exempt
def update_task(request):
    task_id = User.objects.get('task_id')
    new_title = request.POST.get('title')
    new_content = request.POST.get('content')
    task = Task.objects.get(task_id=task_id)
    task.title = new_title
    task.content = new_content
    task.save()
    ret = {'status': True,
           'data': {'task_id': task.task_id, 'title': task.title, 'content': task.content, 'c_time': task.c_time}}
    return HttpResponse(json.dumps(ret))


# 管理员删除学习小组的task
@csrf_exempt
def delete_task_list(request):
    task_list_id = request.POST.get('task_list_id')
    TaskList.objects.get(task_list_id=task_list_id).delete()
    return HttpResponse(json.dumps({'status': True}))


# 管理员修改学习小组的task
@csrf_exempt
def update_task_list(request):
    task_list_id = request.POST.get('task_list_id')
    title = request.POST.get('title')
    content = request.POST.get('content')
    review_nums = request.POST.get('review_nums')
    task_list = TaskList.objects.get(task_list_id=task_list_id)
    task_list.title = title
    task_list.content = content
    task_list.review_nums = review_nums
    task_list.save()
    return HttpResponse(json.dumps({'status': True}))
