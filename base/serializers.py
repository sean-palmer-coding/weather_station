from rest_framework import serializers
from . import models


class MeasurementSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Measurement
        exclude = ('current_time',)


class MeasurementSerializerGet(serializers.ModelSerializer):

    class Meta:
        model = models.Measurement
        exclude = ('id', )
