"""
API urlconf
"""
from django.urls import path

from . import views as api_views

urlpatterns = [
    path('', api_views.RoutesView.as_view(), name='routes'),
]
