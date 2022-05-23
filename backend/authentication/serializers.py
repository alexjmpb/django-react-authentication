import hashids

from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.tokens import default_token_generator

from .utils import validate_unique

User = get_user_model()

hashid = hashids.Hashids(salt=settings.SECRET_KEY)


def raise_email_not_found():
    raise ValidationError({'email': 'There is no user associated with this email'})


class AdminUserSerializer(serializers.ModelSerializer):
    """
    User serializer with all fields
    and no restrictions
    """
    class Meta:
        model = User
        exclude = []


class UserSerializer(AdminUserSerializer):
    """
    Public user serializer
    """
    class Meta(AdminUserSerializer.Meta):
        exclude = ['is_admin']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class PasswordMixin(serializers.Serializer):
    """
    Serializer with password fields and validation
    """
    password = serializers.CharField(max_length=255, write_only=True)
    re_password = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        password = data.get('password', None)
        re_password = data.get('re_password', None)

        super().validate(data)

        if password is not None and password != re_password:
            raise ValidationError({'re_password': _('The two passwords don\'t match')})

        return data

        
class SetPasswordSerializer(PasswordMixin, serializers.Serializer):
    """
    Serializer to update password
    """
    old_password = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        user = self.instance
        old_password = data.get('old_password', None)

        is_old_pass = user.check_password(old_password)

        if not is_old_pass:
            raise ValidationError({'old_password': _('Old password incorrect')})
        
        super().validate(data)

        return data

    def save(self):
        user = self.instance
        password = self.validated_data.get('password', None)

        user.set_password(password)

        user.save()


class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer to validate email and send
    password reset link
    """
    email = serializers.EmailField(max_length=255)

    def validate(self, data):
        email = data.get('email', None)

        try:
            self.validated_user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            raise_email_not_found()

        return data

        
class ResetPasswordConfirmSerializer(PasswordMixin, serializers.Serializer):
    """
    Serializer to reset the password
    """
    token = serializers.CharField(max_length=255)
    user_id = serializers.CharField(max_length=20)

    def validate(self, data):
        token = data.get('token', None)
        user_id = data.get('user_id', None)

        
        decoded_id = hashid.decode(user_id)
        user = User.objects.get(pk=decoded_id[0])
        self.validated_user = user

        is_token_valid = default_token_generator.check_token(user, token)

        super().validate(data)

        if not is_token_valid:
            raise ValidationError({'token': _('The token expired or is not valid')})
        return data

    def save(self):
        password = self.validated_data.get('password', None)

        self.validated_user.set_password(password)
        self.validated_user.save()


class CreateUserSerializer(PasswordMixin, serializers.Serializer):
    """
    Serializer to create user
    """
    username = serializers.CharField(max_length=25)
    email = serializers.EmailField(max_length=255)
    image = serializers.ImageField(required=False)

    def validate(self, data):
        email = data.get('email', None)
        username = data.get('username', None)

        validate_unique(email, 'email', User)
        validate_unique(username, 'username', User)

        super().validate(data)
        return data
    
    def save(self):
        password = self.validated_data.pop('password', None)
        self.validated_data.pop('re_password', None)
        
        user = User(**self.validated_data)

        user.set_password(password)

        user.save()

        return user


class UpdateUserSerializer(serializers.Serializer):
    """
    Serializer to update user
    """
    username = serializers.CharField(max_length=25)
    email = serializers.EmailField(max_length=255)
    image = serializers.ImageField(required=False)

    def validate(self, data):
        email = data.get('email', None)
        username = data.get('username', None)

        if email: validate_unique(email, 'email', User, update=True, instance=self.instance)
        if username: validate_unique(username, 'username', User, update=True, instance=self.instance)

        super().validate(data)
        return data

    def save(self):
        instance = self.instance

        for value in self.validated_data:
            setattr(instance, value, self.validated_data[value])

        instance.save(update_fields=self.validated_data.keys())


class SendConfirmEmailSerializer(serializers.Serializer):
    """
    Serializer to validate email and send confirm link
    """
    email = serializers.EmailField(max_length=255)

    def validate(self, data):
        email = data.get('email', None)
        
        try:
            User.objects.get(email=email)
        except ObjectDoesNotExist:
            raise_email_not_found()

        return data


class ConfirmEmailSerializer(serializers.Serializer):
    """
    Serializer to confirm email
    """
    token = serializers.CharField(max_length=255)
    user_id = serializers.CharField(max_length=25)

    def validate(self, data):
        user_id = data.get('user_id', None)
        token = data.get('token', None)
        decoded_id = hashid.decode(user_id)[0]
        try:
            user = User.objects.get(pk=decoded_id)
        except ObjectDoesNotExist:
            raise_email_not_found()

        is_token_valid = default_token_generator.check_token(user, token)

        if not is_token_valid:
            raise ValidationError({'token': _('The token expired or is not valid')})

        self.validated_user = user

        return data