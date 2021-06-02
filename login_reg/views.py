from django.shortcuts import render
from django.http import JsonResponse


k = 0


# Create your views here.
def login(req):
    if req.is_ajax and req.method == "POST":
        f = open("debug.txt", "w")
        f.write(str(req.POST))
        f.close()
        global k
        k += 1
        return JsonResponse({"instance": k}, status=200)
    else:
        return render(req, 'login.html')
