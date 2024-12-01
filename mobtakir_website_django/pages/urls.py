from django.urls import path
from . import views
APP_NAME = "pages"

urlpatterns = [
    path('', views.index, name='index'),
    path('', views.about, name='about'),
    path('', views.contact, name='contact'),
    path('', views.support, name='support'),
    path('', views.api_documentation, name='api_documentation'),
    path('', views.pricings, name='pricings'),
    path('', views.payment, name='payment'),

]
