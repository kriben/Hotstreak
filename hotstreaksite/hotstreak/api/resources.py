from django.contrib.auth.models import User
from tastypie.authorization import Authorization
from tastypie.authentication import ApiKeyAuthentication
from tastypie import fields
from tastypie.resources import ModelResource
from hotstreak.models import Task, Entry



class TaskResource(ModelResource):
    class Meta:
        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = Authorization()
        authentication = ApiKeyAuthentication()

    def obj_create(self, bundle, request=None, **kwargs):
        return super(TaskResource, self).obj_create(bundle, request, 
                                                    user=request.user)

    def apply_authorization_limits(self, request, object_list):
        if request:
            return object_list.filter(user=request.user)
        else:
            return object_list
        

class EntryResource(ModelResource):
    task = fields.ForeignKey(TaskResource, 'task')

    class Meta:
        queryset = Entry.objects.all()
        resource_name = 'entry'
        authorization = Authorization()
        authentication = ApiKeyAuthentication()
        filtering = {
            "task": ("exact",)
            } 

    def obj_create(self, bundle, request=None, **kwargs):
        return super(EntryResource, self).obj_create(bundle, request, 
                                                     user=request.user)

    def apply_authorization_limits(self, request, object_list):
        return object_list.filter(task__user=request.user)
