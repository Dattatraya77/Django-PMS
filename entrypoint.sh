#!/bin/sh

echo "Waiting for PostgreSQL..."

while ! nc -z db 5432; do
  sleep 1
done

echo "PostgreSQL Started"

echo "Running Migrations"
python manage.py migrate_schemas --shared

python manage.py makemigrations customer
python manage.py migrate customer

python manage.py makemigrations users
python manage.py migrate users

python manage.py makemigrations project_management
python manage.py migrate project_management

python manage.py migrate

echo "Creating Superuser"

python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()

username = "Dattatraya77"
email = "admin@gmail.com"
password = "Mungale@77"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print("Superuser Created")
else:
    print("Superuser Already Exists")
END

echo "Collect Static Files"
python manage.py collectstatic --noinput

echo "Starting Gunicorn"
gunicorn project_management_system.wsgi:application --bind 0.0.0.0:8000