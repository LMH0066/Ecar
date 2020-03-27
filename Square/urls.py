from django.urls import path
from . import views

app_name = 'Square'
urlpatterns = [
    path('PublishDeck', views.publish_deck),
    path('DeletePublicDeck', views.delete_public_deck),
    path('GetAuthorDeck', views.get_author_deck),
    path('GetPublicDeck', views.get_public_deck),
    path('StarDeck', views.star_deck),
    path('CommentDeck', views.comment_deck),
    path('IsCreator', views.is_creator),
]
