#!/bin/bash

echo "Running Django migrations..."

python manage.py migrate

echo "Collect static..."

python manage.py collectstatic --noinput

echo "Starting Gunicorn..."

gunicorn project_management_system.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3