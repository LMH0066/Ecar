import json

from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.core import serializers

from Card.models import Card, MemoryInfo
from Deck.models import Deck, DeckInfo
from Login.models import User
import datetime


# 访问卡片复习页面
def go_review(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'Card/review.html')


# 通过deck获得相应卡片
@csrf_exempt
def get_cards(request):
    deck_name = request.POST.get('deck_name')
    user = User.objects.get(user_name=request.session['username'])
    deck = user.deck_set.get(name=deck_name)
    request.session['deck_id'] = deck.deck_id
    ret = {'status': True}
    if deck.amount == 0:
        ret['status'] = False
    else:
        cards = deck.card_set.all()
        cards_front_text = []
        cards_back_text = []
        for i in cards:
            cards_front_text.append(i.q_text)
            cards_back_text.append(i.ans_text)
        ret['data'] = {'front_text': cards_front_text, 'back_text': cards_back_text}
    return HttpResponse(json.dumps(ret))


# 增加卡片
@csrf_exempt
def add_card(request):
    front_text = request.POST.get('front_text')
    back_text = request.POST.get('back_text')
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    user = User.objects.get(user_name=request.session['username'])
    ret = {'status': True}
    # 需要admin以上权限
    if (user.user_id == deck.creator.user_id or
            user in deck.admins.all()):
        # 判断是否有重名卡片
        cards = deck.card_set.all()
        for card in cards:
            if card.q_text == front_text:
                ret['status'] = False
                ret['data'] = 'Already has a Card with the same question'
                return HttpResponse(json.dumps(ret))
        new_card = Card(q_text=front_text, ans_text=back_text, deck=deck)
        new_card.save()
        new_memory_info = MemoryInfo(user_id=User.objects.get(user_name=request.session['username']).user_id,
                                     card_id=new_card.card_id)
        new_memory_info.save()
        deck.amount = deck.amount + 1
        deck.save()
        ret['data'] = {'deck_name': deck.name, 'card_amount': deck.amount}
    else:
        ret['status'] = False
        ret['data'] = 'Insufficient permissions'
    return HttpResponse(json.dumps(ret))


# 删除卡片
@csrf_exempt
def remove_card(request):
    front_text = request.POST.get('front_text')
    user = User.objects.get(user_name=request.session['username'])
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    card = Card.objects.get(deck_id=deck.deck_id, q_text=front_text)
    ret = {'status': True}
    # 需要admin以上权限
    if (user.user_id == card.deck.creator.user_id or
            user in card.deck.admins.all()):
        Card.objects.filter(card_id=card.card_id).delete()
        if deck.amount > 1:
            if deck.need_review_nums >= deck.amount:
                deck.need_review_nums = deck.amount - 1;
            deck.amount -= 1
            deck.save()
            ret['data'] = {'deck_name': deck.name, 'card_amount': deck.amount}
        else:
            ret['status'] = False
            ret['data'] = 'No Card To Remove'
    else:
        ret['status'] = False
        ret['data'] = 'Insufficient permissions'
    return HttpResponse(json.dumps(ret))


# 是否有管理者或以上的身份
@csrf_exempt
def apply_permission(request):
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    user = User.objects.get(user_name=request.session['username'])
    # 需要admin以上权限
    if (user.user_id == deck.creator.user_id or
            user in deck.admins.all()):
        return HttpResponse(json.dumps({'status': True}))
    else:
        return HttpResponse(json.dumps({'status': False, 'data': 'Insufficient permissions'}))


# 修改卡片
@csrf_exempt
def modify_card(request):
    front_text = request.POST.get('front_text')
    new_front_text = request.POST.get('new_front_text')
    new_back_text = request.POST.get('new_back_text')
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    ret = {'status': True}
    cards = deck.card_set.all()
    if front_text == new_front_text:
        cards.filter(q_text=front_text).update(ans_text=new_back_text)
    else:
        for card in cards:
            if card.q_text == new_front_text:
                ret['status'] = False
                ret['data'] = 'Already has a Card with the same question'
                return HttpResponse(json.dumps(ret))
    cards.filter(q_text=front_text).update(q_text=new_front_text, ans_text=new_back_text)
    return HttpResponse(json.dumps(ret))


@csrf_exempt
def get_memory_card(request):
    ret = {'status': True}
    memory_cards = []
    user_name = request.session['username']
    deck_id = request.POST.get('deck_id')
    deck = Deck.objects.get(deck_id=deck_id)
    if deck.amount == 0:
        ret['status'] = False
        ret['data'] = "Deck have no card"
        return HttpResponse(json.dumps(ret))
    review_nums = deck.need_review_nums - DeckInfo.objects.get(user__user_name=user_name,
                                                               deck__deck_id=deck_id).now_review_nums
    infos = MemoryInfo.objects.filter(user__user_name=user_name,
                                      card__deck__deck_id=deck_id,
                                      review_time__lte=datetime.date.today(),
                                      memory_times__gt=0).order_by('?')
    # 复习
    if infos.exists():
        for info in infos:
            memory_cards.append(info.card)
    # 新卡片
    else:

        max_nums = MemoryInfo.objects.filter(user__user_name=user_name,
                                             card__deck__deck_id=deck_id,
                                             memory_times=0).count()
        if review_nums > max_nums:
            infos = MemoryInfo.objects.filter(user__user_name=user_name,
                                              card__deck__deck_id=deck_id,
                                              memory_times=0).order_by('?')
        else:
            infos = MemoryInfo.objects.filter(user__user_name=user_name,
                                              card__deck__deck_id=deck_id,
                                              memory_times=0).order_by('?')[:review_nums]
        if infos.exists():
            for info in infos:
                memory_cards.append(info.card)
        else:
            ret['status'] = False
            ret['data'] = "No Card To Learn"
            return HttpResponse(json.dumps(ret))
    memory_cards = serializers.serialize("json", memory_cards)
    ret = {'status': True, 'data': json.loads(memory_cards)}
    return HttpResponse(json.dumps(ret))


@csrf_exempt
def forget_card(request):
    user_name = request.session['username']
    memory_info = MemoryInfo.objects.get(card_id=request.POST.get('card_id'), user__user_name=user_name)
    memory_info.now_correct_times = 0
    memory_info.now_error_times += 1
    memory_info.save()
    # 返回false, 表示这个词还没复习结束
    return HttpResponse(json.dumps({'status': False}))


@csrf_exempt
def remember_card(request):
    user_name = request.session['username']
    card_id = request.POST.get('card_id')
    memory_info = MemoryInfo.objects.get(card_id=card_id, user__user_name=user_name)
    deck_id = Deck.objects.get(card__card_id=card_id).deck_id
    memory_info.now_correct_times += 1
    if memory_info.now_correct_times >= memory_info.need_correct_times:
        deck_info = DeckInfo.objects.get(user__user_name=user_name, deck_id=deck_id)
        # 清零
        memory_info.now_correct_times = 0
        memory_info.last_memory_time = datetime.date.today()
        time_interval = datetime.timedelta(days=max(4 - memory_info.now_error_times, 1))
        memory_info.review_time = datetime.date.today() + time_interval
        # 本日新记忆卡片数增长
        if memory_info.memory_times == 0:
            deck_info.now_review_nums += 1
        if memory_info.now_error_times == 0:
            memory_info.need_correct_times /= 2
        # 卡片完全记忆数增长
        if memory_info.need_correct_times == 0:
            memory_info.is_memory_over = True
            memory_info.memory_times += 1
            deck_info.memory_count += 1
        deck_info.save()
        memory_info.save()
        # 返回true, 表示这个词今天复习结束
        return HttpResponse(json.dumps({'status': True}))
    memory_info.save()
    # 返回false, 表示这个词还没复习结束
    return HttpResponse(json.dumps({'status': False}))
