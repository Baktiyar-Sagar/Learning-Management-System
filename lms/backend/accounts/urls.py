from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('users/', views.user_list, name='user-list'),
     # Password Reset
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('reset-password/<uidb64>/<token>/', views.reset_password, name='reset-password'),
    path('verify-reset-token/<uidb64>/<token>/', views.verify_reset_token, name='verify-reset-token'),
]
