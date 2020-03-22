import json

from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from Deck.models import Deck, DeckInfo
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
    new_deck_info = DeckInfo(deck=new_deck, user=user)
    new_deck_info.save()
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
    my_decks = []
    for deck in decks:
        review_nums = deck.need_review_nums - DeckInfo.objects.get(user__user_id=user.user_id,
                                                                   deck__deck_id=deck.deck_id).now_review_nums
        my_decks.append(
            {'deck_id': deck.deck_id, 'deck_name': deck.name, 'card_amount': deck.amount, 'review_nums': review_nums})
    ret = {'status': True, 'data': my_decks}
    return HttpResponse(json.dumps(ret))


# 修改卡组每日记忆数
@csrf_exempt
def set_need_review_nums(request):
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    new_nums = request.POST.get('review_nums')
    max_nums = deck.amount
    ret = {'status': True}
    if new_nums <= max_nums:
        if new_nums < max_nums:
            deck.amount = new_nums
            deck.save()
    else:
        ret['status'] = False
        ret['data'] = "Review nums greater than deck amount"
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
