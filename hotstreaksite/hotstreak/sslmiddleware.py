import re

from django.conf import settings
from django.core import urlresolvers
from django.http import HttpResponse, HttpResponsePermanentRedirect


class SSLMiddleware(object):

    def process_request(self, request):
        if not any([settings.DEBUG, request.is_secure()]):
            url = request.build_absolute_uri(request.get_full_path())
            secure_url = url.replace("http://", "https://")
            return HttpResponsePermanentRedirect(secure_url)
        
