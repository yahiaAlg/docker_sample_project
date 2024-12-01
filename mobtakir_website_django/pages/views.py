from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "pages/index.html")
def about(request):
    return render(request, "pages/about.html")
def contact(request):
    return render(request, "pages/contact.html")
def support(request):
    return render(request, "pages/support.html")
def api_documentation(request):
    return render(request, "pages/api_documentation.html")
def pricings(request):
    return render(request, "pages/pricings.html")
def payment(request):
    return render(request, "pages/payment.html")