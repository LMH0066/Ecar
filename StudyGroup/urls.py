from django.urls import path
from . import views

app_name = 'StudyGroup'
urlpatterns = [
    # path('', views.go_home),
    path('forum', views.go_forum),
    path('GetStudyGroup', views.get_study_group),
    path('GetGroupMembers', views.get_group_members),
    path('GetChats', views.get_chats),
    path('ChatGroup', views.chat_group),
    path('UpdateChatMessage', views.update_chat_message)
]
