from django.shortcuts import render
from django.http import HttpResponse

def helloWorld(request):
    return HttpResponse("Hello, World!")

# Render the index.html template
def index(request):
    return render(request, 'core/index.html')
