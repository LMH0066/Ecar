from django.urls import path
from . import views

app_name = 'Card'
urlpatterns = [
    path('review_card', views.go_review),
    path('ShowCards', views.get_cards),
    path('addCard', views.add_card),
    path('ApplyPermission', views.apply_permission),
    path('ModifyCard', views.modify_card),
    path('RemoveCard', views.remove_card),
    path('GetMemoryCar', views.get_memory_card),
    path('RememberCard', views.remember_card),
    path('ForgetCard', views.forget_card)
]
