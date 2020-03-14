from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from Login.models import User


@csrf_exempt
def get_cards(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    deck_name = request.POST.get('deck_name')
    user = User.objects.get(user_name=request.session['username'])
    deck = user.deck_set.get(name=deck_name)


