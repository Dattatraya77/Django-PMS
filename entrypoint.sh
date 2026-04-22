#!/bin/sh

echo "Waiting for PostgreSQL..."

while ! nc -z db 5432; do
  sleep 1
done

echo "PostgreSQL Started"

echo "Running Shared Migrations"
python manage.py migrate_schemas --shared

echo "Creating Tenant Automatically"

python manage.py shell << END

from customer.models import Client, Domain
from django.utils import timezone

schema_name = "pms"
tenant_name = "pms"
domain_url = "pms.3.88.69.141.nip.io"

# Create Tenant
if not Client.objects.filter(schema_name=schema_name).exists():

    tenant = Client(
        schema_name=schema_name,
        name=tenant_name,
        page_title="Welcome to Project Management System",
        client_tz="Asia/Kolkata",
        is_active=True
    )

    tenant.save()

    # Create Domain
    Domain.objects.create(
        domain=domain_url,
        tenant=tenant,
        is_primary=True
    )

    print("Tenant Created Successfully")

else:
    print("Tenant Already Exists")

END


echo "Running Tenant Migrations"
python manage.py migrate_schemas


echo "Creating Superuser Inside Tenant"

python manage.py shell << END

from django_tenants.utils import schema_context
from django.contrib.auth import get_user_model

User = get_user_model()

with schema_context('pms'):

    username = "Dattatraya77"
    email = "drwalunj.2010@gmail.com"
    password = "Mungale@77"

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print("Tenant Superuser Created")
    else:
        print("Tenant Superuser Already Exists")

END


echo "Running App Migrations"

python manage.py makemigrations customer
python manage.py migrate customer

python manage.py makemigrations users
python manage.py migrate users

python manage.py makemigrations project_management
python manage.py migrate project_management

python manage.py migrate


echo "Collect Static Files"
python manage.py collectstatic --noinput


echo "Starting Gunicorn"
gunicorn project_management_system.wsgi:application --bind 0.0.0.0:8000