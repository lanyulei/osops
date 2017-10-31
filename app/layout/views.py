from django.shortcuts import render

# Create your views here.

def LayoutHandler(request):
    return render(request, 'Layout/index.html')