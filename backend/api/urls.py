"""
API urlconf
"""
from django.urls import (
    path,
    include
)

from . import views as api_views

urlpatterns = [
    path('', api_views.RoutesView.as_view(), name='routes'),
    path('auth/', include('authentication.urls')),
]
