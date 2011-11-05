from django.test import TestCase
import json
from django.contrib.auth.models import User
from hotstreak.models import Task, Entry
import datetime
from tastypie.models import ApiKey 

def get_auth_dict(user):
    api_key = ApiKey.objects.get(user = user)
    return { "username": api_key.user, "api_key": api_key.key }

class EmptyDbApiTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('kristian', 
                                             'kristian.bendiksen@gmail.com', 
                                             'secret_password')        
        self.user.save()

        self.task_url = "/api/v1/task/"
        self.entry_url = "/api/v1/entry/"

    def test_get_task_on_empty_db(self):
        """
        Tests that we get empty values.
        """
        response = self.client.get(self.task_url, get_auth_dict(self.user))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(data["meta"]["total_count"], 0)

    def test_get_one_task(self):
        task_title = "First task"
        task_description = "Description of first task"
        self.create_task_for_user(self.user, task_title, task_description)

        response = self.client.get(self.task_url, get_auth_dict(self.user))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["meta"]["total_count"], 1)
        self.assertEqual(data["objects"][0]["title"], task_title)
        self.assertEqual(data["objects"][0]["description"], task_description)

    def test_get_entry_in_empty_db(self):
        response = self.client.get(self.entry_url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["meta"]["total_count"], 0)

    def test_get_one_entry_from_db(self):    
        task = self.create_task_for_user(self.user, "My task", "My description")
        self.create_entry_for_task(task, datetime.datetime.now())
        
        response = self.client.get(self.entry_url)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["meta"]["total_count"], 1)

    def create_task_for_user(self, user, title, description):
        task = Task(user = user, title = title, description = description)
        task.save()
        return task

    def create_entry_for_task(self, task, date):
        entry = Entry(task = task, date = date)
        entry.save()
        return entry
        

class AuthenticationApiTest(TestCase):
    fixtures = [ "two_users_with_two_tasks.json" ]
    def setUp(self):
        self.task_url = "/api/v1/task/"

    def testUserSeesOnlyHisOwnTasks(self):
        self.assertEqual(len(User.objects.all()), 2)
        self.assertEqual(len(Task.objects.all()), 4)

        the_dude = User.objects.get(pk = 1)
        response = self.client.get(self.task_url, get_auth_dict(the_dude))
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.content)
        self.assertEqual(data["meta"]["total_count"], 2)

        self.assertEquals(data["objects"][0]["title"], "Have a white russian")
        self.assertEquals(data["objects"][1]["title"], "Go bowling")

