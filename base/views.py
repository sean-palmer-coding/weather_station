from django.shortcuts import render
import json
from .models import Measurement
from django.views.generic import TemplateView
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime, timedelta
from . import serializers as s

# Create your views here.
TIME_DELTA = timedelta(days=2)

class IndexView(TemplateView):
    template_name = 'base/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['Data'] = Measurement.objects.latest('id')
        return context


@api_view(['GET', 'POST'])
def measurement_api(request):
    if request.method == 'POST':
        measurement_data = JSONParser().parse(request)
        measurement_serializer = s.MeasurementSerializer(data=measurement_data)
        if measurement_serializer.is_valid():
            measurement_serializer.save()
            return JsonResponse(measurement_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(measurement_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        measurements = Measurement.objects.filter(current_time__gt=datetime.now() - TIME_DELTA).order_by('-current_time')
        measurement_serializer = s.MeasurementSerializerGet(measurements, many=True)
        return Response(measurement_serializer.data)


