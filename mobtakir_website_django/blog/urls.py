from django.urls import path
from . import views
APP_NAME = "blog"

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('<int:id>', views.post_detail, name='post_detail')
]
