from django.urls import path
from . import views

app_name = 'StudyGroup'
urlpatterns = [
    # path('', views.go_home),
    path('forum', views.go_forum)
]
