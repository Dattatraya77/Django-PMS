#!/bin/bash

echo "Creating virtual environment..."

cd /home/ubuntu/Django-PMS

echo "Collect static files..."

python manage.py collectstatic --noinput

echo "ENV Setup Completed.."