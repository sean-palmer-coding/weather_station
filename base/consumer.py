from djangochannelsrestframework.observer import model_observer
from .models import Measurement
from .serializers import MeasurementSerializerGet
from datetime import datetime, timedelta
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer

TIME_DELTA = timedelta(days=2)


class WeatherConsumer(GenericAsyncAPIConsumer):

    async def accept(self, **kwargs):
        await super().accept(**kwargs)
        await self.model_change.subscribe()

    @model_observer(Measurement, serializer_class=MeasurementSerializerGet)
    async def model_change(self, message, action=None, **kwargs):
        await self.reply(data=message, action=action)

    @model_change.serializer
    def model_serialize(self, instance, action, **kwargs):
        measurements = Measurement.objects.filter(current_time__gt=datetime.now() - TIME_DELTA).order_by('-current_time')
        return MeasurementSerializerGet(measurements, many=True).data
