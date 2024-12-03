from django.urls import path
from . import views
app_name = "pages"

urlpatterns = [
    path('', views.index, name='index'),
    path('about', views.about, name='about'),
    path('contact', views.contact, name='contact'),
    path('support', views.support, name='support'),
    path('api-documentation', views.api_documentation, name='api_documentation'),
    path('pricings', views.pricings, name='pricings'),
    path('payment', views.payment, name='payment'),

]
