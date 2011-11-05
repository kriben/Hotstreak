from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin

from django.conf.urls.defaults import *
from tastypie.api import Api
from hotstreak.api.resources import TaskResource, EntryResource

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(TaskResource())
v1_api.register(EntryResource())

urlpatterns = patterns('',
                       url(r'^hotstreak/', include('hotstreak.urls')),
                       url(r'^api/', include(v1_api.urls)),
                       url(r'^admin/', include(admin.site.urls)),
)
