# chat/views.py
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from chat.topsecret import get_messages, upload_image

from django.contrib.auth.decorators import login_required


def fileupload(request):
    if request.method == "POST":
        print(request.FILES.getlist('video'))
        for i in request.FILES.getlist('video'):
            temp: dict = upload_image(str(i), i, 'video')
            print("temp:", temp)
            print(type(temp))
            return JsonResponse(temp)

    return render(request, "chat/fileupload.html")


@login_required(login_url="/account/login/")
def index(request):
    return render(request, 'chat/index.html', {})


@login_required(login_url="/account/login/")
def room(request, room_name):
    if request.method == "POST":
        try:
            start = request.POST['from']
            messages, status = get_messages(request.user, room_name, start)

            if status == 400:  # user has no acess to chat
                return HttpResponse(status=400)
            return JsonResponse({"messages": messages,
                                 "status": status,
                                 "self": request.user.userid,
                                 "room": room_name
                                 })
        except:
            return render(request, 'chat/room.html', {'room_name': room_name})
    return render(request, '../templates/under development/chats/chat.html', {'room_name': room_name})
