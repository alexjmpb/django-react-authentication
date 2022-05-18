from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from django.urls import path


from . import views as user_views

router = DefaultRouter()
router.register(r'users', user_views.UserViewSet, basename='user')

urlpatterns = router.urls

urlpatterns += [
    path('jwt/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('jwt/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist')
]