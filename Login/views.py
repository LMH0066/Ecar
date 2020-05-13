import datetime
import json

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from Login.models import User, PastInfo


# Create your views here.

def login_page(request):
    if request.session.get('status'):
        return redirect("/")
    else:
        return render(request, 'Login/login.html', locals())


def register_page(request):
    if request.session.get('status'):
        return redirect("/")
    else:
        return render(request, 'Login/login.html', locals())


def message_edit_page(request):
    if not request.session.get('status'):
        return redirect("/auth/login")
    return render(request, 'Login/message_edit.html')


def profile_page(request):
    if not request.session.get('status'):
        return redirect("/auth/login")
    return render(request, 'Login/profile.html')


@csrf_exempt
def login_post(request):
    if request.method == 'POST' and not request.session.get('status'):
        user_name = request.POST.get('username')
        user_password = request.POST.get('password')
        try:
            user = User.objects.get(user_name=user_name)
        except:
            return render(request, 'Login/login.html', {'status': False})
        if user.password == user_password:
            request.session['status'] = True
            request.session['username'] = user_name
            request.session['password'] = user_password
            return redirect("/")
        return render(request, 'Login/login.html', {'status': False})
    return render(request, 'Login/login.html', locals())


@csrf_exempt
def register_post(request):
    if request.method == 'POST' and not request.session.get('status'):
        user_name = request.POST.get('reUsername')
        user_email = request.POST.get('email')
        user_password = request.POST.get('rePassword')
        user = User.objects.filter(user_name=user_name)
        if user.exists():
            return render(request, 'Login/login.html', locals())
        else:
            new_user = User.objects.create(user_name=user_name, password=user_password,
                                           email=user_email)
            new_user.save()
            request.session['status'] = True
            request.session['username'] = user_name
            request.session['password'] = user_password
            return redirect("/")
    return redirect("/auth/login_page")


def sign_out(request):
    if request.session.get('status'):
        request.session.clear()
    return redirect("/auth/login_page")


@csrf_exempt
def get_information(request):
    if not request.session.get('status'):
        return redirect("/auth/login")
    user = User.objects.get(user_name=request.session['username'])
    ret = {'status': True,
           'data': {'userName': user.user_name, 'email': user.email,
                    'avatar': user.avatar.name}}
    return HttpResponse(json.dumps(ret))


# 记忆曲线
@csrf_exempt
def memory_curve(request):
    # 填入最近 15 天信息
    memory_count = []
    review_count = []
    time = []
    LIMIT_COUNT = 14
    user_name = request.session['username']
    limit_time = datetime.date.today() - datetime.timedelta(LIMIT_COUNT)
    past_infos = PastInfo.objects.filter(user__user_name=user_name,
                                         time__lte=datetime.date.today(),
                                         time__gte=limit_time)
    temp_time = datetime.date.today() - datetime.timedelta(LIMIT_COUNT)
    while temp_time.__lt__(datetime.date.today()) or temp_time.__eq__(datetime.date.today()):
        flag = False
        for info in past_infos:
            if temp_time.__eq__(info.time):
                memory_count.append(info.memory_count)
                review_count.append(info.review_count)
                time.append(info.time.strftime('%Y-%m-%d'))
                # memory_curve.append({'memory_count': info.memory_count, 'review_count': info.review_count,
                #                      'time': info.time.strftime('%Y-%m-%d')})
                flag = True
                break
        if flag is False:
            memory_count.append(0)
            review_count.append(0)
            time.append(temp_time.strftime('%Y-%m-%d'))
            # memory_curve.append({'memory_count': 0, 'review_count': 0, 'time': temp_time.strftime('%Y-%m-%d')})
        temp_time = temp_time + datetime.timedelta(1)
    return HttpResponse(json.dumps(
        {'memory_count': memory_count, 'review_count': review_count, 'time': time}))
