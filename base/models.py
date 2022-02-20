from django.db import models
from django.utils import timezone

# Create your models here.


class Measurement(models.Model):
    current_time = models.DateTimeField(default=timezone.now)
    wind_speed = models.IntegerField()
    wind_direction = models.IntegerField()
    temperature = models.IntegerField()
    humidity = models.IntegerField()
    pressure = models.FloatField()
    uv_index = models.IntegerField()
    rain_index = models.IntegerField()
    visible_light = models.IntegerField()
    pm10 = models.IntegerField()
    pm25 = models.IntegerField()
    pm100 = models.IntegerField()
