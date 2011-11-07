from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from tastypie.models import ApiKey

@login_required
def index(request):
    user = request.user
    apikey = ApiKey.objects.get(user = user).key

    return render_to_response('hotstreak/index.html', 
                              { "username": user.username,
                                "api_key": apikey } )
