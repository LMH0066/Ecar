from django.urls import path
from . import views

app_name = 'Login'
urlpatterns = [
    path('login_page', views.login_page),
    path('register_page', views.register_page),
    path('message_edit_page', views.message_edit_page),
    path('LoginPost', views.login_post),
    path('RegisterPost', views.register_post),
    path('SignOut', views.sign_out),
    path('AccessInformation', views.get_information)
]
