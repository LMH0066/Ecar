from django.urls import path
from . import views

app_name = 'Login'
urlpatterns = [
    path('login_page', views.login_page),                   # 访问登录页面
    path('register_page', views.register_page),             # 访问注册页面，此处功能一样
    path('message_edit_page', views.message_edit_page),     # 访问信息修改页面
    path('profile_page', views.profile_page),               # 访问个人信息页面
    path('LoginPost', views.login_post),                    # 登录请求
    path('RegisterPost', views.register_post),              # 注册请求
    path('SignOut', views.sign_out),                        # 登出请求
    path('AccessInformation', views.get_information)        # 请求获取用户信息
]
