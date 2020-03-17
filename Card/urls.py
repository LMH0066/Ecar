from django.urls import path
from . import views

app_name = 'Card'
urlpatterns = [
    path('ShowCards', views.get_cards),
    path('addCard', views.add_card),
    path('ModifyCard', views.modify_card),
    path('RemoveCard', views.remove_card),
    path('GetMemoryCar', views.get_memory_card),
    path('RememberCard', views.remember_card),
    path('ForgetCard', views.forget_card)
]
