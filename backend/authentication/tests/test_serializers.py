import re

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core import mail

User = get_user_model()

class UserTests(APITestCase):
    def setUp(self):
        self.user = User(username='Test', email='test@test.com')
        self.user.set_password('Test1234')
        self.user.save()
        self.user2 = User.objects.create(username='Test2', email='test2@test.com', password='Test1234')


    def test_create_user(self):
        url = reverse('user-list')

        info = {
            'username': 'Test3',
            'email': 'test3@test.com',
            'password': 'Test1234',
            're_password': 'Test1234'
        }
        
        response = self.client.post(url, info)

        self.assertGreater(len(mail.outbox), 0)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_user(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('user-detail', kwargs={'pk': 1})
        info = {
            'username': 'TestUpdated',
            'email': 'testupdated@test.com',
        }
        
        response = self.client.patch(url, info)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(mail.outbox), 0)

    def test_is_owner_validation(self):
        self.client.force_authenticate(user=self.user2)

        url = reverse('user-detail', kwargs={'pk': 1})
        info = {
            'username': 'TestUpdated',
            'email': 'testupdated@test.com',
        }

        response = self.client.patch(url, info)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_user(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('user-detail', kwargs={'pk': 1})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_set_password(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('user-set-password', kwargs={'pk': 1})
        info = {
            'old_password': 'Test1234',
            'password': 'Test4321',
            're_password': 'Test4321' 
        }

        response = self.client.post(url, info)

        user = User.objects.get(pk=1)

        self.assertTrue(user.check_password('Test4321'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_reset_password(self):
        url = reverse('user-reset-password')
        info = {
            'email': 'test@test.com'
        }

        response = self.client.post(url, info)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        token_pattern = r'(?<=\/)[0-z]{6}-[0-z]{32}'
        user_id_pattern = r'(?<=\/)[0-z]{2}(?=\/)'
        email_body = str(mail.outbox[0].body)
        user_id = re.search(user_id_pattern, email_body).group(0)
        token = re.search(token_pattern, email_body).group(0)
        url_confirm = reverse('user-reset-password-confirm')
        info_confirm = {
            'token': token,
            'user_id': user_id,
            'password': 'Test4321',
            're_password': 'Test4321'
        }

        response_confirm = self.client.post(url_confirm, info_confirm)

        user = User.objects.get(pk=1)

        self.assertTrue(user.check_password('Test4321'))
        self.assertEqual(response_confirm.status_code, status.HTTP_204_NO_CONTENT)

    def test_email_confirm(self):
        self.client.force_authenticate(self.user)

        user = User.objects.get(pk=1)
        url = reverse('user-send-confirm-email')
        info = {
            'email': self.user.email
        }
        response = self.client.post(url, info)

        self.assertFalse(user.email_confirmed)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        token_pattern = r'(?<=\/)[0-z]{6}-[0-z]{32}'
        user_id_pattern = r'(?<=\/)[0-z]{2}(?=\/)'
        email_body = str(mail.outbox[0].body)
        url_confirm = reverse('user-confirm-email')
        user_id = re.search(user_id_pattern, email_body).group(0)
        token = re.search(token_pattern, email_body).group(0)
        info_confirm = {
            'token': token,
            'user_id': user_id,
        }

        response_confirm = self.client.post(url_confirm, info_confirm)

        user = User.objects.get(pk=1)

        self.assertTrue(user.email_confirmed)
        self.assertEqual(response_confirm.status_code, status.HTTP_204_NO_CONTENT)