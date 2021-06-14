# chat/views.py
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from chat.topsecret import get_messages


@login_required(login_url="/account/login/")
def index(request):
    return render(request, 'chat/index.html', {})


@login_required(login_url="/account/login/")
def room(request, room_name):
    if request.method == "POST":
        try:
            start = request.POST['from']
            messages, status = get_messages(request.user, room_name, start)

            if status == 400:     # user has no acess to chat
                return HttpResponse(status=400)

            return JsonResponse({"messages": messages, "status": status, "self": request.user.userid})
        except:
            return render(request, 'chat/room.html', {'room_name': room_name})
    return render(request, 'chat/room.html', {'room_name': room_name})
