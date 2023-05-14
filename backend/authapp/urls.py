from django.urls import path, include
from . import views

urlpatterns = [
    path('', include('djoser.urls.base')),
    path('', include('djoser.urls.authtoken')),
]
