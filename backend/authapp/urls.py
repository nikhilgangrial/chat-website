from django.urls import path, include
from . import views

urlpatterns = [
    path('users/list/', views.UserListView.as_view(), name='user-list'),
    path('', include('djoser.urls.base')),
    path('', include('djoser.urls.authtoken')),
]
