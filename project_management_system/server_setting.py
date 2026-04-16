# Render server Postgres Database settings

import dj_database_url
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        "NAME": 'PMS_DB',
        'USER': 'postgres',
        'PASSWORD': 'root',
        'HOST': "localhost",
        'PORT': "5432",
    }
}

