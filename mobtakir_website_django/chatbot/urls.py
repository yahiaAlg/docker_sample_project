from django.urls import path
from . import views
app_name = "chatbot"

urlpatterns = [

    path('chat-interface', views.chat_interface, name='chat_interface'),
    path('parameters', views.chat_settings, name='chat_settings'),

]
