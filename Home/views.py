from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import json

from Card.models import Card, MemoryInfo
from Deck.models import Deck
from Login.models import User
from .models import PublicDecks, Comment


# Create your views here.
def go_home(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'Home/home.html')


# 增加卡组到广场
@csrf_exempt
def publish_deck(request):
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    ret = {'status': True}
    # copy卡组信息
    new_deck = Deck(name=deck.name, amount=deck.amount, creator=deck.creator, is_public=True)
    new_deck.save()
    cards = Card.objects.filter(deck=deck)
    # copy卡片信息
    for card in cards:
        new_card = Card(q_text=card.q_text, q_img=card.q_img, ans_text=card.ans_text,
                        ans_img=card.ans_img, deck=new_deck)
        new_card.save()
    # 创建public信息
    new_public_deck = PublicDecks(deck_id=new_deck.deck_id, author=deck.creator)
    new_public_deck.save()
    # ret['data'] = {'public_deck_id': new_public_deck.public_id, 'star_num': new_public_deck.star_num,
    #                'comment_num': new_public_deck.comment_num, 'c_time': new_public_deck.c_time,
    #                'deck_id': new_deck.deck_id, 'deck_name': new_deck.name,
    #                'card_amount': new_deck.amount}
    return HttpResponse(json.dumps(ret))


# 删除广场卡组
@csrf_exempt
def delete_public_deck(request):
    public_deck = PublicDecks.objects.get(public_id=request.session['public_id'])
    ret = {'status': True}
    Deck.objects.get(deck_id=public_deck.deck_id).delete()
    public_deck.delete()
    return HttpResponse(json.dump(ret))


# 查看自己公布的卡组
@csrf_exempt
def get_author_deck(request):
    user = User.objects.get(user_name=request.session['username'])
    author_decks = user.publicdecks_set.all()
    my_decks = []
    for author_deck in author_decks:
        deck = Deck.objects.get(deck_id=author_deck.deck_id)
        my_decks.append(
            {'public_deck_id': author_deck.public_id, 'star_num': author_deck.star_num,
             'comment_num': author_deck.comment_num, 'c_time': author_deck.c_time, 'deck_id': deck.deck_id,
             'deck_name': deck.name,
             'card_amount': deck.amount})
    ret = {'status': True, 'data': my_decks}
    return HttpResponse(json.dumps(ret))


# 查看公共卡组
@csrf_exempt
def get_public_deck(request):
    max_size = 400
    size = PublicDecks.objects.count()
    if size <= max_size:
        public_decks = PublicDecks.objects.order_by('star_num')
    else:
        public_decks = PublicDecks.objects.order_by('star_num')[:max_size]
    all_decks = []
    for public_deck in public_decks:
        deck = Deck.objects.get(deck_id=public_deck.deck_id)
        # deck = public_deck.deck
        user = public_deck.author
        if user.avatar:
            author_avatar = serializers.serialize("json", user.avatar)
            author_avatar = json.loads(author_avatar)
        else:
            author_avatar = "/static/images/avatar.jpg"
        all_decks.append(
            {'public_deck_id': public_deck.public_id, 'star_num': public_deck.star_num,
             'comment_num': public_deck.comment_num, 'c_time': public_deck.c_time.strftime('%Y-%m-%d'), 'deck_id': deck.deck_id,
             'deck_name': deck.name,
             'card_amount': deck.amount,
             'deck_author': user.user_name,
             'deck_author_avatar': author_avatar})
    ret = {'status': True, 'data': all_decks}
    return HttpResponse(json.dumps(ret))


@csrf_exempt
def show_public_deck(request):
    public_id = request.POST.get('public_id')
    request.session['public_id'] = public_id
    ret = {'status': True}
    comments = Comment.objects.filter(public_deck__public_id=public_id).order_by('c_time')
    if comments.exists():
        all_comments = []
        for comment in comments:
            user = comment.user
            all_comments.append(
                {'user_name': user.user_name, 'user_avatar': user.avatar, 'content': comment.content,
                 'c_time': comment.c_time}
            )
            ret['data'] = all_comments
    else:
        ret['status'] = False
        ret['data'] = 'No Comments'
    return HttpResponse(json.dumps(ret))


# 点赞
@csrf_exempt
def star_deck(request):
    user_name = request.session['username']
    public_id = request.POST.get('public_id')
    ret = {'status': True}
    if PublicDecks.objects.filter(public_id=public_id, star_users__user_name=user_name).count() != 0:
        ret['status'] = False
        ret['data'] = 'You Already Star This Deck'
    else:
        public_deck = PublicDecks.objects.get(public_id=public_id)
        user = User.objects.get(user_name=user_name)
        public_deck.star_num += 1
        public_deck.star_users.add(user)
        public_deck.save()
    return HttpResponse(json.dumps(ret))


# 评论
@csrf_exempt
def comment_deck(request):
    user = User.objects.get(user_name=request.session['username'])
    public_deck = PublicDecks.objects.get(public_id=request.session['public_id'])
    context = request.POST.get('context')
    new_comment = Comment(user=user, content=context, public_deck=public_deck)
    new_comment.save()
    public_deck.comment_num += 1
    public_deck.save()
    ret = {'status': True}
    return HttpResponse(json.dumps(ret))


# 是否具有creator权限
@csrf_exempt
def is_creator(request):
    user = User.objects.get(user_name=request.session['username'])
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    ret = {'status': True}
    if deck.creator != user:
        ret['status'] = False
        ret['data'] = 'Insufficient permissions'
    return HttpResponse(json.dumps(ret))

