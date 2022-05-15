from rest_framework.routers import DefaultRouter

from . import views as user_views

router = DefaultRouter()
router.register(r'users', user_views.UserViewSet, basename='user')

urlpatterns = router.urls