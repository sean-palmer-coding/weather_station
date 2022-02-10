from django.urls import path
from .consumer import WeatherConsumer

ws_urlpatterns = [
    path('ws/weather/', WeatherConsumer.as_asgi())
]
