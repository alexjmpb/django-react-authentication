from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)
from rest_framework import permissions
from django.contrib.auth import get_user_model
from templated_email import send_templated_mail
from django.conf import settings

from . serializers import (
    ConfirmEmailSerializer,
    CreateUserSerializer,
    ResetPasswordConfirmSerializer,
    ResetPasswordSerializer,
    SendConfirmEmailSerializer,
    SetPasswordSerializer,
    UpdateUserSerializer,
    UserSerializer
)
from .utils import (
    create_token_url,
    domain,
    site_name,
    send_confirm_email,
)

User = get_user_model()


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        return obj == request.user


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_permissions(self):
        if (
            self.action == 'create' or
            self.action == 'reset_password' or
            self.action == 'reset_password_confirm' or
            self.action == 'confirm_email'
        ):
            permission_classes = [AllowAny]
        elif (
            self.action == 'update' or
            self.action == 'partial_update' or
            self.action == 'detail'
        ):
            permission_classes = [IsOwner]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer
        if (
            self.action == 'partial_update' or 
            self.action == 'update'
        ):
            return UpdateUserSerializer
        return UserSerializer

    def create(self, request):
        serializer = CreateUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            confirm_url = create_token_url(user, path='confirm/{id}/{token}')

            send_templated_mail(
                template_name='welcome_email',
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'),
                recipient_list=[user.email],
                context={
                    'domain': domain,
                    'site_name': site_name,
                    'username': user.username,
                    'confirm_url': confirm_url
                }
            )

            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def set_password(self, request):
        user = request.user
        serializer = SetPasswordSerializer(data=request.data, instance=user)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_user
            url = create_token_url(user, path='reset/{id}/{token}')

            send_templated_mail(
                template_name='reset_email',
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'),
                recipient_list=[user.email],
                context={
                    'domain': domain,
                    'site_name': site_name,
                    'username': user.username,
                    'url': url
                }
            )

            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def reset_password_confirm(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def send_confirm_email(self, request):
        serializer = SendConfirmEmailSerializer(data=request.data)

        if serializer.is_valid():
            user = User.objects.get(email=request.data.get('email', None))
            send_confirm_email(user)

            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def confirm_email(self, request):
        serializer = ConfirmEmailSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_user
            user.email_confirmed = True
            user.save()

            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'patch', 'put'])
    def me(self, request):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        user = User.objects.get(pk=request.user.id)
        if request.method == 'PATCH' or request.method == 'PUT':
            serializer = UpdateUserSerializer(instance=user, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserSerializer(instance=user)
        return Response(serializer.data, status=status.HTTP_200_OK)
            


    