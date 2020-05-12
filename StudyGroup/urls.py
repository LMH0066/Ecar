from django.urls import path
from . import views

app_name = 'StudyGroup'
urlpatterns = [
    path('forum', views.go_forum),
    path('task_list', views.go_task_list),
    path('assign_task', views.go_assign_task),
    path('GetStudyGroup', views.get_study_group),
    path('GetGroupMembers', views.get_group_members),
    # path('GetChats', views.get_chats),
    # path('ChatGroup', views.chat_group),
    # path('UpdateChatMessage', views.update_chat_message),
    path('ChatWebsocket/<user_name>', views.chat_websocket),
    path('GetTaskLists', views.get_task_lists),
    path('CreateTask', views.create_task),
    path('DeleteTaskList', views.delete_task_list),
    path('UpdateTaskList', views.update_task_list),
    path('UpdateTask', views.update_task),
    path('GetTasks', views.get_tasks)
]
