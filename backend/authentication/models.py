import datetime

from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from .utils import send_confirm_email

def user_directory_path(instance, filename):
    return f'{instance.username}/{filename}'


def special_characters_validator(value):
    if ' ' in value:
        raise ValidationError(_('Your username cannot contain spaces'))


class AppUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **kwargs):
        if not email:
            raise ValueError(_('You must include an email address'))
        
        if not username:
            raise ValueError(_('You must include a username'))

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **kwargs):
        user = self.create_user(
            username,
            email,
            password,
            **kwargs
        )
        user.is_admin = True
        user.save(using=self._db)
        
        return user


class AppUser(AbstractBaseUser):
    username = models.CharField(
        max_length=25,
        unique=True,
        validators=[special_characters_validator]
    )
    email = models.EmailField(
        max_length=255,
        unique=True,

    )
    image = models.ImageField(
        upload_to=user_directory_path,
        default='users/default_user.jpg'
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    email_confirmed = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    last_email_update = models.DateTimeField(default=timezone.now)

    objects = AppUserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def get_by_natural_key(self):
        return self.username.lower()

    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


@receiver(pre_save, sender=AppUser)
def email_confirm_status_change(sender, instance, **kwargs):
    try:
        obj = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        pass
    else:
        if not obj.email == instance.email:
            obj.email_confirmed = False
            obj.last_email_update = timezone.make_aware(datetime.datetime.now())
            obj.save()
            send_confirm_email(obj)