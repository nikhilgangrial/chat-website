"""
from django.shortcuts import render, redirect
from django.http import JsonResponse


k = 0


# Create your views here.
def login_view(req):
    if req.is_ajax and req.method == "POST":
        f = open("debug.txt", "w")
        f.write(str(req.POST))
        f.close()
        global k
        k += 1
        return JsonResponse({"instance": k}, status=200)
    else:
        return render(req, 'login.html')


def logout_view(request):
    # logout
    return redirect("login")


def register_view(request):
    pass
"""

from django.contrib import messages
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import render
from .forms import RegistrationForm, AccountAuthenticationForm, AccountUpdateform
from django.http import HttpResponseRedirect


def home(request):
    """
      Home View Renders base.html
    """
    return render(request, "base.html", {})


def registration_view(request):
    """
      Renders Registration Form
    """
    context = {}
    if request.POST:
        form = RegistrationForm(request.POST)
        if form.is_valid():
            f = open("debug.txt", "w")
            f.write(str(form)+"\n")
            user = form.save()
            f.write(str(user) + "\n")
            email = form.cleaned_data.get('email')
            raw_pass = form.cleaned_data.get('password1')
            f.write(str(email) + " " + str(raw_pass) + "\n")
            account = authenticate(email=str(email), password=str(raw_pass))
            f.write(str(account) + "\n")
            login(request, user)
            messages.success(request, "You have been Registered as {}".format(request.user.username))
            f.write(str(user) + " " + str(user.is_authenticated)+"\n")
            f.close()
            return HttpResponseRedirect('/account/home/')
        else:
            messages.error(request, "Please Correct Below Errors")
            context['registration_form'] = form
    else:
        form = RegistrationForm()
        context['registration_form'] = form
        return render(request, "accounts/register.html", context)


def logout_view(request):
    logout(request)
    messages.success(request, "Logged Out")
    return HttpResponseRedirect("/account/home/")


def login_view(request):
    """
      Renders Login Form
    """
    context = {}
    user = request.user
    try:
        f = open("debug.txt", "a")
        f.write(str(user)+str(user.is_authenticated))
        f.close()
    except:
        pass
    if user.is_authenticated:
        return HttpResponseRedirect("/account/home/")
    if request.POST:
        form = AccountAuthenticationForm(request.POST)
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(email=email, password=password)
        f = open("debug.txt", "w")
        f.write(str(user)+str(user.is_authenticated))
        f.close()
        if user:
            login(request, user)
            messages.success(request, "Logged In")
            return HttpResponseRedirect("/account/home")
        else:
            messages.error(request, "please Correct Below Errors")
    else:
        form = AccountAuthenticationForm()
    context['login_form'] = form
    return render(request, "accounts/login.html", context)


def account_view(request):
    """
      Renders userprofile page "
    """
    user = request.user
    f = open("debug.txt", "a")
    f.write(str(user) + str(user.is_authenticated))
    f.close()
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/account/login")
    context = {}
    if request.POST:
        form = AccountUpdateform(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "profile Updated")
        else:
            messages.error(request, "Please Correct Below Errors")
    else:
        form = AccountUpdateform(
            initial={
                'email': request.user.email,
                'username': request.user.username,
            }
        )
    context['account_form'] = form

    return render(request, "accounts/userprofile.html", context)
