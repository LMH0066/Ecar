from django.shortcuts import render, redirect


# Create your views here.
def go_home(request):
    if not request.session.get('status'):
        return redirect("/auth/login_page")
    return render(request, 'Home/home.html')
