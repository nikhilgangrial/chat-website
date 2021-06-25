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
from django.shortcuts import render, redirect
from .forms import AccountUpdateform
from django.http import HttpResponseRedirect, HttpResponse, Http404
from .topsecret import (_get_user, sendotp, checkotp, send_reset_token, check_reset_token, change_password, check_user,
                        get_token_from_code, store_token, _create_user)


def callback(request):
    # Get the state saved in session
    expected_state = request.session.pop('auth_state', '')
    # Make the token request
    token = get_token_from_code(request.get_full_path(), expected_state)

    # Save token and user
    store_token(token)

    return HttpResponse(status=200)


def home(request):
    """
      Home View Renders base.html
    """
    return render(request, "base.html", {})


def registration_view(request):
    """
      Renders Registration Form
    """
    if request.POST:
        if request.POST['otp'] and checkotp(request.POST['email'], int(request.POST['otp'])):
            user = _get_user(request.POST)
            f = open("debug.txt", "a")
            f.write(str(user) + "\n")
            f.close()
            _create_user(user)
            user = authenticate(email=user['email'], password=user['password'])
            login(request, user)
            messages.success(request, "You have been Registered as {}".format(request.user.username))
            return HttpResponseRedirect('/account/home/')
        elif request.POST['otp']:
            return HttpResponse("Invalid Otp", status=400)
        else:
            if request.POST['email'][-15:] == "@aitpune.edu.in":
                if not check_user(request.POST['email']):
                    sendotp(request.POST['email'])
                    return HttpResponse(f"{request.POST['email']}", status=200)
                return HttpResponse("An account already exixts with given email", status=400)
            return HttpResponse("Enter a Valid collage ID", status=400)
    return render(request, "account/signup.html")


def logout_view(request):
    logout(request)
    messages.success(request, "Logged Out")
    return HttpResponseRedirect("/account/login/")


def login_view(request):
    """
      Renders Login Form
    """
    if request.user.is_authenticated:
        return HttpResponseRedirect("/account/home/")
    if request.POST:
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
            try:
                return HttpResponseRedirect(request.GET['next'])
            except:
                return HttpResponseRedirect("/account/home")
        else:
            messages.error(request, "Incorrect Password/ Email")
    return render(request, "account/login.html")


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

    return render(request, "account/userprofile.html", context)


def reset_token(request):
    if request.user.is_authenticated:
        redirect("/account/home/")
    if request.method == "POST":
        if check_user(request.POST['email']):   # check if email exists in database
            if request.is_secure():
                scheme = 'https://'
            else:
                scheme = 'http://'

            host = scheme + request.get_host()
            send_reset_token(request.POST['email'], host)
            messages.success(request, f"Password Reset Instuction have been sent to {request.POST['email']}.")
            print("message")
            return render(request, "account/reset/gettoken.html")
        print("message")
        messages.error(request, "No account found associated to given email")
    return render(request, "account/reset/gettoken.html",)


def reset_password(request, token):
    if request.method == "POST":
        email = check_reset_token(token, change=True)
        if email:
            password = request.POST['password1']
            change_password(email, password)
            user = authenticate(email=email, password=password)
            login(request=request, user=user)
            return HttpResponseRedirect("/account/home/")
    else:
        if check_reset_token(token):
            return render(request, "account/reset/resetpassword.html")
    raise Http404("Not Found")
