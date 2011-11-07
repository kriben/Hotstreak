from django.conf.urls.defaults import *
from django.views.generic import DetailView, ListView
from hotstreak.models import Task


urlpatterns = patterns('hotstreak.views',
    (r'^$', 'index'),
)
