from django.urls import path
from . import views

app_name = 'Deck'
urlpatterns = [
    path('', views.go_deck),
    path('ShowDecks', views.get_decks),
    path('CreateDeck', views.create_deck),
    path('DeleteDeck', views.delete_deck),
    path('SetReviewNums', views.set_need_review_nums),
    path('SetShareCode', views.set_share_code),
    path('SetCopyCode', views.set_copy_code),
    path('DeleteShareCode', views.delete_share_code),
    path('DeleteCopyCode', views.delete_copy_code),
    path('GetShareCodes', views.get_share_codes),
    path('GetCopyCodes', views.get_copy_codes),
    path('ShareDeck', views.share_deck),
    path('CopyDeck', views.copy_deck),
]
