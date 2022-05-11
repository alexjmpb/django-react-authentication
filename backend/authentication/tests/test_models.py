from django.test import TestCase
from django.core.files.storage import default_storage
from django.contrib.auth import get_user_model
User = get_user_model()


class CustomUserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='Test',
            email='test@test.com',
            password='Test1234'
        )

    def test_user_creation(self):
        User.objects.create(
            username='Test2',
            email='test2@test.com',
            password='Test1234'
        )
        
        user = User.objects.get(username='Test2')

        self.assertTrue(user.is_active)
        self.assertFalse(user.email_confirmed)

    def test_user_image_upload(self):
        image = default_storage.open('test_image.jpg')

        user = User.objects.create(
            username='Test2',
            email='test2@test.com',
            password='Test1234',
            image=image
        )

        self.assertEqual(image.open().read(), user.image.read())

        user.image.delete()