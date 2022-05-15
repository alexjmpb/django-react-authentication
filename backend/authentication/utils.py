"""
Utils for user auth app
"""
import hashids
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from templated_email import send_templated_mail

AUTHENTICATION_APP_CONFIG = getattr(settings, 'AUTHENTICATION_APP', {})
domain = AUTHENTICATION_APP_CONFIG.get('DOMAIN', '')
site_name = AUTHENTICATION_APP_CONFIG.get('SITE_NAME', '')

def send_confirm_email(user):
    """
    Function to send a confirm email
    to a specific user
    """
    url = create_token_url(user, path='confirm/{id}/{token}')

    send_templated_mail(
        template_name='confirm_email',
        from_email='from@email.com',
        recipient_list=[user.email],
        context={
            'domain': domain,
            'site_name': site_name,
            'url': url
        }
    )

def create_token_url(user, domain=None, path=None):
    """
    Function to return a formated url
    with an ecrypted user id and token
    """
    token = default_token_generator.make_token(user)
    hashid = hashids.Hashids(salt=settings.SECRET_KEY)
    hashed_id = hashid.encode(user.id)
    
    protocol = AUTHENTICATION_APP_CONFIG.get('PROTOCOL', None)
    if protocol != 'http':
        protocol = 'https'

    if domain is None:
        domain = AUTHENTICATION_APP_CONFIG.get('DOMAIN', '')

    if path is None:
        path = f'{hashed_id}/{token}/'
    else:
        path = path.format(id=hashed_id, token=token)

    url = f'{protocol}://{domain}/{path}'

    return url