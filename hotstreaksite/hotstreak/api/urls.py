from django.conf.urls.defaults import *
from tastypie.api import Api
from hotstreak.api.resources import EntryResource, UserResource

v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(TaskResource())

urlpatterns = patterns('',
   (r'^api/', include(v1_api.urls)),
)
