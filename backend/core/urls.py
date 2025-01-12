from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.get_csrf_token, name='csrf_token'),
    path('start', views.start_interview, name='start_interview'),
]
