from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=200)
    description = models.TextField()
    creation_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title

class Entry(models.Model):
    date = models.DateField()
    task = models.ForeignKey(Task)

    def __unicode__(self):
        return "Entry: %s completed on %s" % (self.task.title, self.date) 
