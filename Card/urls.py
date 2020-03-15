from django.urls import path
from . import views

app_name = 'Card'
urlpatterns = [
    path('ShowCards', views.get_cards),
    path('addCard', views.add_card)
]
