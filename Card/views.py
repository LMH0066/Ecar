import json

from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from Card.models import Card
from Deck.models import Deck
from Login.models import User


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


@csrf_exempt
def add_card(request):
    front_text = request.POST.get('front_text')
    back_text = request.POST.get('back_text')
    deck = Deck.objects.get(deck_id=request.session['deck_id'])
    new_card = Card(q_text=front_text, ans_text=back_text, review_time=timezone.now(), deck=deck)
    new_card.save()
    deck.amount = deck.amount + 1
    deck.save()
    return HttpResponse(json.dumps({'status': True}))
