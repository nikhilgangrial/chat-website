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
from django.shortcuts import render,redirect
from .forms import RegistrationForm, AccountAuthenticationForm, AccountUpdateform
from django.http import HttpResponseRedirect, HttpResponse
from .topsecret import _get_user, sendotp, checkotp, send_reset_token


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
        if request.POST['otp'] and checkotp(request.POST['email'], request.POST['otp']):
            user = _get_user(request.POST)
            form = RegistrationForm(user)
            if form.is_valid():
                form.save()
                email = form.cleaned_data.get('email')
                raw_pass = form.cleaned_data.get('password1')
                user = authenticate(email=str(email), password=str(raw_pass))
                login(request, user)
                messages.success(request, "You have been Registered as {}".format(request.user.username))
                return HttpResponseRedirect('/account/home/')
            else:
                messages.error(request, "Please Correct Below Errors")
                context['registration_form'] = form
        else:
            if request.POST['email'][-15:] == "@aitpune.edu.in":
                form = RegistrationForm(request.POST)
                if form.is_valid():
                    sendotp(request.POST['email'])
                    return HttpResponse(f"OTP Sent on {request.POST['email']}")
            return HttpResponse("Enter a Valid collage ID")
    else:
        form = RegistrationForm()
        context['registration_form'] = form
    return render(request, "accounts/register.html", context)


def logout_view(request):
    logout(request)
    messages.success(request, "Logged Out")
    return HttpResponseRedirect("/account/login/")


def login_view(request):
    """
      Renders Login Form
    """
    context = {}
    if request.user.is_authenticated:
        return HttpResponseRedirect("/account/home/")
    if request.POST:
        form = AccountAuthenticationForm(request.POST)
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(email=email, password=password)
        if user:
            login(request, user)
            # If check box is not checked no response is received in POST request
            try:
                # noinspection PyStatementEffect
                request.POST['remember me']
                request.session.set_expiry(86400 * 30)
            except:
                request.session.set_expiry(0)
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


def reset_token(request):
    if request.user.is_authenticated:
        redirect("/account/home/")
    if request.method == "POST":
        if request.POST['email']:   # check if email exists in database
            if request.is_secure():
                scheme = 'https://'
            else:
                scheme = 'http://'

            host = scheme + request.get_host()
            send_reset_token(request.POST['email'], host)


def reset_password(request):
    request += 1
