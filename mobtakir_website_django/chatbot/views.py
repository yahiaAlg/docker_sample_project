from django.shortcuts import render

# Create your views here.
def chat_interface(request):
    return render(request, 'chatbot/chat_interface.html')

def chat_settings(request):
    return render(request, 'chatbot/chat_settings.html')

