import re

from django.conf import settings
from django.core import urlresolvers
from django.http import HttpResponse, HttpResponsePermanentRedirect

import logging

logger = logging.getLogger(__name__)

class SSLMiddleware(object):

    def process_request(self, request):
        logger.info("Hitting ssl middleware" + request.META.get("x-forwarded-proto", ""))
        if not any([settings.DEBUG, request.is_secure(), request.META.get("x-forwarded-proto", "") == 'https']):
            url = request.build_absolute_uri(request.get_full_path())
            secure_url = url.replace("http://", "https://")
            return HttpResponsePermanentRedirect(secure_url)
        
