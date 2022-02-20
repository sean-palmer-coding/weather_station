# Generated by Django 4.0.2 on 2022-02-14 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_measurement_pm10_measurement_pm100_measurement_pm25_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='measurement',
            name='wind_direction',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='measurement',
            name='wind_speed',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]