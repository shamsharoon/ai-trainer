from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Index page
    path('hello', views.helloWorld, name='hello'),  # Hello endpoint
]
