from django.urls import path
from .views import home, login_view, logout_view, account_view, registration_view, reset_token, reset_password


urlpatterns = [
    path('register/', registration_view, name="register"),
    path('logout/', logout_view, name="logout"),
    path('login/', login_view, name="login"),
    path('home/', home, name="home"),
    path('profile/', account_view, name="account"),
    path('reset/', reset_token),
    path(r"user/resetpassword/^(?P<number>[a-z A-Z 0-9]{75})$", reset_password)
]
