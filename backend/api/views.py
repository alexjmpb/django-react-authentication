"""
Simple views for api
"""
from rest_framework.views import APIView
from rest_framework.response import Response

class RoutesView(APIView):
    """
    Simple view for API routes
    """
    def get(self, request, format=None):
        routes = {
            '/api/': {
                '/': 'API routes view',
            },
        }

        return Response(routes)
