from django.urls import path
from . import views

app_name = 'Deck'
urlpatterns = [
    path('', views.go_deck),
    path('ShowDecks', views.get_decks),
    path('CreateDeck', views.create_deck),
    path('DeleteDeck', views.delete_deck),
    path('SetReviewNums', views.set_need_review_nums)
]
