import json

from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from Deck.models import Deck
from Login.models import User


# 访问卡组页面
def go_deck(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'Deck/deck.html')


# 删除卡组
@csrf_exempt
def delete_deck(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    deck_name = request.POST.get('deck_name')
    user = User.objects.get(user_name=request.session['username'])
    deck = user.deck_set.get(name=deck_name)
    ret = {'status': True}
    # 需要creator权限
    if user.user_id == deck.creator.user_id:
        deck.delete()
    else:
        ret['status'] = False
        ret['data'] = 'Insufficient permissions'
    return HttpResponse(json.dumps(ret))


# 创建卡组
@csrf_exempt
def create_deck(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    new_deck_name = request.POST.get('deck_name')

    ret = {'status': True}
    # 获取该用户创建的所有卡组
    user = User.objects.get(user_name=request.session['username'])
    decks = user.deck_set.all()
    # 判断该用户是否已经创过相应的卡组了,如果有，返回添加失败的信息
    for deck in decks:
        if deck.name == new_deck_name:
            ret['status'] = False
            ret['data'] = "Already has a set of Deck with the same name"
            return HttpResponse(json.dumps(ret))

    new_deck = Deck(name=new_deck_name, creator=user)
    new_deck.save()
    return HttpResponse(json.dumps(ret))


# 获取与用户有关的所有卡组
@csrf_exempt
def get_decks(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    user_name = request.session['username']
    # 获取该用户创建的所有卡组 creator_decks, admin_decks, staff_decks
    user = User.objects.get(user_name=user_name)
    decks = user.deck_set.all()
    decks_name = []
    decks_amount = []
    for deck in decks:
        decks_name.append(deck.name)
        decks_amount.append(deck.amount)
    ret = {'status': True, 'data': {'decks_name': decks_name, 'decks_amount': decks_amount}}
    return HttpResponse(json.dumps(ret))


# 测试，返回多种权限的deck
@csrf_exempt
def get_more_decks(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    user_name = request.session['username']
    # 获取该用户创建的所有卡组 creator_decks, admin_decks, staff_decks
    user = User.objects.get(user_name=user_name)
    creator_decks = user.deck_set.all()
    admin_decks = user.AdminsToDeck.all().difference(creator_decks)
    staff_decks = user.StaffsToDeck.all().difference(admin_decks).difference(creator_decks)
    return HttpResponse(json.dumps({'status': True}))
