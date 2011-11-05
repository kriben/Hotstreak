from django.shortcuts import render_to_response, get_object_or_404
from hotstreak.models import Task, Entry

def index(request):
    tasks = Task.objects.all().order_by('-creation_date')
    return render_to_response('hotstreak/index.html', {'tasks': tasks})

def task_detail(request, id):
    task = get_object_or_404(Task, pk=id)
    entry_list = Entry.objects.filter(task = task).order_by("date")
    return render_to_response('hotstreak/task_detail.html', 
                              { 'task': task, 'entry_list': entry_list })
