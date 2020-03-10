import json

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from .models import User


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
        return render(request, 'Login/register.html', locals())


def message_edit_page(request):
    if not request.session.get('status'):
        return redirect("/auth/login")
    return render(request, 'Login/message_edit.html')


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
        return render(request, 'Login/login.html', {'status': True})
    return render(request, 'Login/login.html', locals())


@csrf_exempt
def register_post(request):
    if request.method == 'POST' and not request.session.get('status'):
        user_name = request.POST.get('username')
        user_email = request.POST.get('email')
        user_password = request.POST.get('password')
        user = User.objects.filter(user_name=user_name)
        if user.exists():
            return render(request, 'Login/login.html', locals())
        else:
            new_user = User.objects.create()
            new_user.user_name = user_name
            new_user.password = user_password
            new_user.email = user_email
            new_user.save()
            request.session['status'] = True
            request.session['username'] = user_name
            request.session['password'] = user_password
            return render(request, 'Home/home.html', locals())
    return render(request, 'Login/login.html', locals())


def sign_out(request):
    if request.session.get('status'):
        request.session.clear()
    return redirect("/auth/login")


@csrf_exempt
def get_information(request):
    if not request.session.get('status'):
        return redirect("/auth/login")
    user = User.objects.get(email=request.session['email'])
    ret = {'status': True,
           'data': {'firstName': user.firstName, 'lastName': user.lastName,
                    'email': user.email, 'avatar': user.avatar.name,
                    'bio': user.bio}}
    return HttpResponse(json.dumps(ret))
