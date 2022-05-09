"""core URL Configuration
"""
from django.contrib import admin
from django.urls import (
    path, 
    include
)
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic.base import RedirectView
from django.urls import reverse_lazy

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', RedirectView.as_view(url=reverse_lazy('routes')))
]

if not settings.USE_S3:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
